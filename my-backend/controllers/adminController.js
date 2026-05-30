// controllers/adminController.js
import User from '../models/User.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';


// ════════════════════════════════════════
// GET DASHBOARD OVERVIEW STATS
// GET /api/admin/stats
// ════════════════════════════════════════
export const getDashboardStats = async (req, res) => {
    try {

        // Run all count queries simultaneously
        const [
            totalUsers,
            totalJobs,
            totalApplications,
            totalCompanies,
            activeJobs,
            newUsersToday,
            newJobsToday,
            newApplicationsToday,
        ] = await Promise.all([
            User.countDocuments(),
            JobPost.countDocuments(),
            Application.countDocuments(),
            Company.countDocuments(),
            JobPost.countDocuments({ isActive: true }),

            // Today's counts
            User.countDocuments({
                createdAt: { $gte: startOfDay() }
            }),
            JobPost.countDocuments({
                createdAt: { $gte: startOfDay() }
            }),
            Application.countDocuments({
                createdAt: { $gte: startOfDay() }
            }),
        ]);

        // ─── User breakdown by role ───
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // ─── Jobs by type ───
        const jobsByType = await JobPost.aggregate([
            {
                $group: {
                    _id: '$jobType',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // ─── Applications by status ───
        const applicationsByStatus = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalJobs,
                    totalApplications,
                    totalCompanies,
                    activeJobs,
                },
                today: {
                    newUsers: newUsersToday,
                    newJobs: newJobsToday,
                    newApplications: newApplicationsToday,
                },
                breakdown: {
                    usersByRole,
                    jobsByType,
                    applicationsByStatus,
                },
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// GET GROWTH CHART DATA (Last 7 days)
// GET /api/admin/growth
// ════════════════════════════════════════
export const getGrowthData = async (req, res) => {
    try {
        const days = 7;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const [users, jobs, applications] = await Promise.all([
                User.countDocuments({
                    createdAt: { $gte: dayStart, $lte: dayEnd }
                }),
                JobPost.countDocuments({
                    createdAt: { $gte: dayStart, $lte: dayEnd }
                }),
                Application.countDocuments({
                    createdAt: { $gte: dayStart, $lte: dayEnd }
                }),
            ]);

            data.push({
                date: dayStart.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                }),
                users,
                jobs,
                applications,
            });
        }

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// GET ALL USERS (with pagination)
// GET /api/admin/users
// ════════════════════════════════════════
export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            role,
            search,
            sort = 'newest',
        } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (search) filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];

        const sortObj = sort === 'newest'
            ? { createdAt: -1 }
            : { createdAt: 1 };

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort(sortObj)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .select('-password'),
            User.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limitNum),
            page: pageNum,
            data: users,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// TOGGLE USER ACTIVE STATUS
// PUT /api/admin/users/:id/toggle
// ════════════════════════════════════════
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from deactivating themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account',
            });
        }

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: user.isActive,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// GET ALL JOBS (admin view)
// GET /api/admin/jobs
// ════════════════════════════════════════
export const getAllJobsAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            isActive,
        } = req.query;

        const filter = {};
        if (search) filter.title = { $regex: search, $options: 'i' };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const [jobs, total] = await Promise.all([
            JobPost.find(filter)
                .populate('company', 'name logo')
                .populate('postedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            JobPost.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: jobs.length,
            total,
            pages: Math.ceil(total / limitNum),
            data: jobs,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// TOGGLE JOB ACTIVE STATUS
// PUT /api/admin/jobs/:id/toggle
// ════════════════════════════════════════
export const toggleJobStatus = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        job.isActive = !job.isActive;
        await job.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: `Job ${job.isActive ? 'activated' : 'deactivated'}`,
            isActive: job.isActive,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// DELETE JOB (admin)
// DELETE /api/admin/jobs/:id
// ════════════════════════════════════════
export const deleteJobAdmin = async (req, res) => {
    try {
        const job = await JobPost.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Also delete related applications
        await Application.deleteMany({ jobPost: req.params.id });

        res.json({
            success: true,
            message: `Job "${job.title}" and its applications deleted`,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// GET ALL APPLICATIONS (admin)
// GET /api/admin/applications
// ════════════════════════════════════════
export const getAllApplicationsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const [applications, total] = await Promise.all([
            Application.find(filter)
                .populate('applicant', 'name email profilePicture')
                .populate('jobPost', 'title location jobType')
                .populate('company', 'name logo')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Application.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: applications.length,
            total,
            pages: Math.ceil(total / limitNum),
            data: applications,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ════════════════════════════════════════
// GET RECENT ACTIVITY
// GET /api/admin/activity
// ════════════════════════════════════════
export const getRecentActivity = async (req, res) => {
    try {
        const limit = 10;

        const [recentUsers, recentJobs, recentApplications] = await Promise.all([
            User.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('name email role createdAt'),

            JobPost.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('company', 'name')
                .select('title company createdAt isActive'),

            Application.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('applicant', 'name')
                .populate('jobPost', 'title')
                .select('applicant jobPost status createdAt'),
        ]);

        // Combine and sort by date
        const activity = [
            ...recentUsers.map(u => ({
                type: 'user_registered',
                icon: '👤',
                message: `${u.name} registered as ${u.role}`,
                timestamp: u.createdAt,
                color: 'blue',
            })),
            ...recentJobs.map(j => ({
                type: 'job_posted',
                icon: '💼',
                message: `${j.title} posted by ${j.company?.name}`,
                timestamp: j.createdAt,
                color: 'green',
            })),
            ...recentApplications.map(a => ({
                type: 'application_submitted',
                icon: '📋',
                message: `${a.applicant?.name} applied to ${a.jobPost?.title}`,
                timestamp: a.createdAt,
                color: 'purple',
            })),
        ]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 15);

        res.json({ success: true, data: activity });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ─── Helper ───
function startOfDay() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}