// middleware/upload.js
import multer from 'multer';
import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// ─── Profile Picture Storage ───
const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devconnect/profiles',
        // ↑ Cloudinary folder to store in
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
            // ↑ auto-resize to 400x400, focus on face
        ],
    },
});

// ─── Company Logo Storage ───
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devconnect/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [
            { width: 200, height: 200, crop: 'fit' }
        ],
    },
});

// ─── Resume Storage ───
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devconnect/resumes',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
        // ↑ raw = non-image files (PDF, DOC etc.)
    },
});


// ─── File Size Validator ───
const fileSizeFilter = (maxSizeMB) => (req, file, cb) => {
    const maxSize = maxSizeMB * 1024 * 1024; // convert MB to bytes

    if (parseInt(req.headers['content-length']) > maxSize) {
        cb(new Error(`File too large — max ${maxSizeMB}MB`), false);
    } else {
        cb(null, true);
    }
};


// ─── Upload Middleware Instances ───
export const uploadProfile = multer({
    storage: profileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
            // ↑ null = no error, true = accept file
        } else {
            cb(new Error('Only images allowed for profile picture'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
    // ↑ max 5MB
}).single('profilePicture');
// ↑ .single = one file, field name = 'profilePicture'


export const uploadLogo = multer({
    storage: logoStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') ||
            file.mimetype === 'image/svg+xml') {
            cb(null, true);
        } else {
            cb(new Error('Only images allowed for logo'), false);
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
    // ↑ max 2MB
}).single('logo');


export const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files allowed for resume'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 },
    // ↑ max 10MB
}).single('resume');


// ─── Upload Error Handler ───
// WHY: multer errors must be caught separately
export const handleUploadError = (uploadFn) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer specific errors
            return res.status(400).json({
                success: false,
                message: err.code === 'LIMIT_FILE_SIZE'
                    ? 'File too large'
                    : err.message,
            });
        } else if (err) {
            // Custom errors from fileFilter
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        next();
        // ↑ no error — continue to route handler
    });
};