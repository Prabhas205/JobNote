import express from 'express';

import {
    register,
    login,
    getMe,
    updatePassword,
    getAllUsers,
} from '../controllers/authController.js';

import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);

// ─── PROTECTED ROUTES ───
// Token required
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);


router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;