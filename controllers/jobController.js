// controllers/jobController.js
import JobPost from '../models/JobPost.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

// ─── GET ALL JOBS ───
export const getAllJobs = async (req, res) => {
    try {
        const {
            search, jobType, workMode,
            experience, location,
            page = 1, limit = 10,
            sort = 'newest',
        } = req.query;

        const filter = { isActive: true };

        if (jobType) filter.jobType = jobType;
        if (workMode) filter.workMode = workMode;
        if (experience) filter.experience = experience;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (search) filter.$text = { $search: search };

        const sortObj = sort === 'newest' ? { createdAt: -1 }
            : sort === 'oldest' ? { createdAt: 1 }
                : sort === 'salary' ? { 'salary.max': -1 }
                    : { createdAt: -1 };

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const [jobs, total] = await Promise.all([
            JobPost.find(filter)
                .populate('company', 'name logo location industry')
                .populate('postedBy', 'name email')
                .sort(sortObj)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .select('-applicants'),

            JobPost.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: jobs.length,
            total,
            pages: Math.ceil(total / limitNum),
            page: pageNum,
            data: jobs,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET SINGLE JOB ───
export const getJobById = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id)
            .populate('company', 'name logo location website industry size')
            .populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Increment views
        job.views += 1;
        await job.save({ validateBeforeSave: false });

        res.json({ success: true, data: job });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CREATE JOB ───
export const createJob = async (req, res) => {
    try {
        req.body.postedBy = req.user._id;

        // Verify company exists
        const company = await Company.findById(req.body.company);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found — create company first',
            });
        }

        // Verify company belongs to this user
        if (
            company.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You can only post jobs for your own company',
            });
        }

        const job = await JobPost.create(req.body);

        await job.populate('company', 'name logo');
        await job.populate('postedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: job,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, errors });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── UPDATE JOB ───
export const updateJob = async (req, res) => {
    try {
        let job = await JobPost.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Only poster or admin can update
        if (
            job.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job',
            });
        }

        job = await JobPost.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('company', 'name logo')
            .populate('postedBy', 'name email');

        res.json({
            success: true,
            message: 'Job updated',
            data: job,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DELETE JOB ───
export const deleteJob = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (
            job.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job',
            });
        }

        await JobPost.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: `Job "${job.title}" deleted`,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── APPLY TO JOB ───
export const applyToJob = async (req, res) => {
    try {
        const { coverLetter, resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required',
            });
        }

        const job = await JobPost.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (!job.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications',
            });
        }

        if (job.deadline && job.deadline < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Application deadline has passed',
            });
        }

        // Check already applied
        const alreadyApplied = await Application.findOne({
            applicant: req.user._id,
            jobPost: job._id,
        });

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }

        // Create application
        const application = await Application.create({
            applicant: req.user._id,
            jobPost: job._id,
            company: job.company,
            coverLetter: coverLetter ?? '',
            resumeUrl,
        });

        // Add applicant to job
        job.applicants.push(req.user._id);
        await job.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully!',
            data: application,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET MY APPLICATIONS ───
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user._id,
        })
            .populate('jobPost', 'title location jobType salary isActive')
            .populate('company', 'name logo')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: applications,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET JOB STATS ───
export const getJobStats = async (req, res) => {
    try {
        const stats = await JobPost.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$jobType',
                    total: { $sum: 1 },
                    avgSalary: { $avg: '$salary.min' },
                    maxSalary: { $max: '$salary.max' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        const total = await JobPost.countDocuments({ isActive: true });
        const remote = await JobPost.countDocuments({
            isActive: true, workMode: 'remote'
        });

        res.json({
            success: true,
            data: { total, remote, byJobType: stats },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};