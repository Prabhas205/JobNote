// routes/jobRoutes.js
import express from 'express';
import {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    getMyApplications,
    getJobStats,
} from '../controllers/jobController.js';
import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// ⚠️ specific routes BEFORE param routes
router.get('/stats', getJobStats);
router.get('/my/applications', protect, getMyApplications);

// Public
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected
router.post('/',
    protect,
    authorize('admin', 'employer'),
    createJob
);

router.put('/:id',
    protect,
    authorize('admin', 'employer'),
    updateJob
);

router.delete('/:id',
    protect,
    authorize('admin', 'employer'),
    deleteJob
);

router.post('/:id/apply',
    protect,
    applyToJob
);

export default router;