// controllers/jobController.js
// Add socket events to applyToJob and createJob

import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await JobPost.find({ isActive: true }).populate('company', 'name logo location');
        res.status(200).json({ success: true, count: jobs.length, total: jobs.length, pages: 1, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id)
            .populate('company', 'name logo location')
            .populate('postedBy', 'name email');
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        let job = await JobPost.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
        }
        
        job = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
        }
        
        await job.deleteOne();
        res.status(200).json({ success: true, message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id }).populate({
            path: 'jobPost',
            populate: { path: 'company', select: 'name logo' }
        });
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const stats = await JobPost.aggregate([
            { $group: { _id: '$jobType', count: { $sum: 1 } } }
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── APPLY TO JOB — emit real-time notification ───
export const applyToJob = async (req, res) => {
    try {
        const { coverLetter, resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required',
            });
        }

        const job = await JobPost.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (!job.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Job is no longer active',
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

        // ─── EMIT REAL-TIME NOTIFICATION ───
        const io = req.app.get('io');
        // ↑ get io instance we set in server.js

        if (io) {
            // Notify the employer who posted the job
            io.to(`user:${job.postedBy._id}`).emit('newApplication', {
                type: 'NEW_APPLICATION',
                jobTitle: job.title,
                applicant: req.user.name,
                applicationId: application._id,
                jobId: job._id,
                message: `${req.user.name} applied to ${job.title}`,
                timestamp: new Date(),
            });
            // ↑ only employer receives this notification

            // Notify all users watching this job
            io.to(`job:${job._id}`).emit('jobUpdate', {
                type: 'NEW_APPLICANT',
                jobId: job._id,
                applicantCount: job.applicants.length,
                message: 'New applicant just applied!',
                timestamp: new Date(),
            });
        }

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


// ─── CREATE JOB — emit to all connected users ───
export const createJob = async (req, res) => {
    try {
        req.body.postedBy = req.user._id;

        if (!req.body.company) {
            return res.status(400).json({
                success: false,
                message: 'Company ID is required to post a job',
            });
        }

        const company = await Company.findById(req.body.company);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

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

        // ─── EMIT NEW JOB TO ALL CONNECTED USERS ───
        const io = req.app.get('io');

        if (io) {
            io.emit('newJob', {
                // ↑ io.emit = broadcast to ALL connected users
                type: 'NEW_JOB',
                job: {
                    _id: job._id,
                    title: job.title,
                    company: job.company?.name,
                    location: job.location,
                    jobType: job.jobType,
                    workMode: job.workMode,
                },
                message: `New job posted: ${job.title} at ${job.company?.name}`,
                timestamp: new Date(),
            });
        }

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
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid ID format provided' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};