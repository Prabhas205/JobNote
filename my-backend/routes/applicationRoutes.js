// routes/applicationRoutes.js
import express from 'express';
import Application from '../models/Application.js';
import JobPost from '../models/JobPost.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';
import sendEmail from '../utils/sendEmail.js';
import { applicationStatusEmail } from '../utils/emailTemplates.js';

const router = express.Router();

// ─── Update Application Status ───
// PUT /api/applications/:id/status
router.put('/:id/status',
    protect,
    authorize('admin', 'employer'),
    async (req, res) => {
        try {
            const { status } = req.body;

            const validStatuses = [
                'pending', 'reviewing', 'shortlisted', 'rejected', 'hired'
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be: ${validStatuses.join(', ')}`,
                });
            }

            const application = await Application.findById(req.params.id)
                .populate('applicant', 'name email')
                .populate('jobPost', 'title location jobType')
                .populate('company', 'name');

            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found',
                });
            }

            // Update status
            application.status = status;
            await application.save();

            // ─── Send status update email to applicant ───
            sendEmail({
                to: application.applicant.email,
                ...applicationStatusEmail(
                    application.applicant,
                    application.jobPost,
                    application.company,
                    status
                ),
            }).catch(err => console.error('Status email failed:', err));

            // ─── Real-time notification ───
            const io = req.app.get('io');
            if (io) {
                io.to(`user:${application.applicant._id}`).emit(
                    'applicationUpdate',
                    {
                        type: 'STATUS_UPDATE',
                        status,
                        jobTitle: application.jobPost.title,
                        message: `Your application status: ${status}`,
                        timestamp: new Date(),
                    }
                );
            }

            res.json({
                success: true,
                message: `Application status updated to ${status}`,
                data: application,
            });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

// ─── Get Applications for a Job ───
// GET /api/applications/job/:jobId
router.get('/job/:jobId',
    protect,
    authorize('admin', 'employer'),
    async (req, res) => {
        try {
            const applications = await Application.find({
                jobPost: req.params.jobId,
            })
                .populate('applicant', 'name email profilePicture skills resumeUrl')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                count: applications.length,
                data: applications,
            });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

export default router;