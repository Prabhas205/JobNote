// routes/uploadRoutes.js
import express from 'express';
import {
    uploadProfilePicture,
    uploadResumePDF,
    uploadCompanyLogo,
    deleteFile,
} from '../controllers/uploadController.js';

import protect from '../middleware/protect.js';
import {
    uploadProfile,
    uploadLogo,
    uploadResume,
    handleUploadError,
} from '../middleware/upload.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// ─── Profile Picture ───
// handleUploadError wraps multer to catch upload errors
router.post(
    '/profile',
    handleUploadError(uploadProfile),
    uploadProfilePicture
);

// ─── Resume PDF ───
router.post(
    '/resume',
    handleUploadError(uploadResume),
    uploadResumePDF
);

// ─── Company Logo ───
router.post(
    '/logo/:companyId',
    handleUploadError(uploadLogo),
    uploadCompanyLogo
);

// ─── Delete File ───
router.delete('/:publicId', deleteFile);

export default router;