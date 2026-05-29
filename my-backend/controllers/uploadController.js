// controllers/uploadController.js
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import Company from '../models/Company.js';


// ════════════════════════════════════════
// UPLOAD PROFILE PICTURE
// POST /api/upload/profile
// ════════════════════════════════════════
export const uploadProfilePicture = async (req, res) => {
    try {

        // req.file is set by multer after successful upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // req.file.path = Cloudinary URL (set by multer-storage-cloudinary)
        const imageUrl = req.file.path;

        // Get old profile picture public_id to delete from Cloudinary
        const user = await User.findById(req.user._id);

        if (user.profilePicture) {
            // Extract public_id from old URL to delete it
            const publicId = extractPublicId(user.profilePicture);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                // ↑ delete old image from Cloudinary
            }
        }

        // Save new URL to database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: imageUrl },
            { returnDocument: 'after' }
        ).select('-password');

        console.log(`✅ Profile picture uploaded: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: imageUrl,
            data: updatedUser,
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ════════════════════════════════════════
// UPLOAD RESUME
// POST /api/upload/resume
// ════════════════════════════════════════
export const uploadResumePDF = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const resumeUrl = req.file.path;
        // Cloudinary URL for the PDF

        // Delete old resume if exists
        const user = await User.findById(req.user._id);
        if (user.resumeUrl) {
            const publicId = extractPublicId(user.resumeUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, {
                    resource_type: 'raw',
                    // ↑ must specify raw for non-image files
                });
            }
        }

        // Save resume URL to database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { resumeUrl },
            { returnDocument: 'after' }
        ).select('-password');

        console.log(`✅ Resume uploaded: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl,
            data: updatedUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ════════════════════════════════════════
// UPLOAD COMPANY LOGO
// POST /api/upload/logo/:companyId
// ════════════════════════════════════════
export const uploadCompanyLogo = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const logoUrl = req.file.path;
        const companyId = req.params.companyId;

        // Verify company belongs to this user
        const company = await Company.findById(companyId);

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
                message: 'Not authorized to update this company',
            });
        }

        // Delete old logo
        if (company.logo && company.logo !== 'default-logo.png') {
            const publicId = extractPublicId(company.logo);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Save new logo URL
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { logo: logoUrl },
            { returnDocument: 'after' }
        );

        console.log(`✅ Company logo uploaded: ${company.name}`);

        res.json({
            success: true,
            message: 'Company logo uploaded successfully',
            logo: logoUrl,
            data: updatedCompany,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ════════════════════════════════════════
// DELETE FILE FROM CLOUDINARY
// DELETE /api/upload/:publicId
// ════════════════════════════════════════
export const deleteFile = async (req, res) => {
    try {
        const { publicId } = req.params;
        const { resourceType = 'image' } = req.query;

        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        res.json({
            success: true,
            message: 'File deleted from Cloudinary',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ─── Helper — extract public_id from Cloudinary URL ───
function extractPublicId(url) {
    try {
        if (!url) return null;

        // Cloudinary URL format:
        // https://res.cloudinary.com/cloudname/image/upload/v123/folder/filename.jpg
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const name = filename.split('.')[0];
        // remove extension

        return `${folder}/${name}`;
        // returns: "devconnect/profiles/abc123"
    } catch {
        return null;
    }
}