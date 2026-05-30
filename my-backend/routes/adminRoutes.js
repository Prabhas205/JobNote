// routes/adminRoutes.js
import express from 'express';
import {
    getDashboardStats,
    getGrowthData,
    getAllUsers,
    toggleUserStatus,
    getAllJobsAdmin,
    toggleJobStatus,
    deleteJobAdmin,
    getAllApplicationsAdmin,
    getRecentActivity,
} from '../controllers/adminController.js';
import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// All admin routes — must be admin role
router.use(protect);
router.use(authorize('admin'));
// ↑ applies to ALL routes below

// ─── Dashboard ───
router.get('/stats', getDashboardStats);
router.get('/growth', getGrowthData);
router.get('/activity', getRecentActivity);

// ─── Users ───
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

// ─── Jobs ───
router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id/toggle', toggleJobStatus);
router.delete('/jobs/:id', deleteJobAdmin);

// ─── Applications ───
router.get('/applications', getAllApplicationsAdmin);

export default router;