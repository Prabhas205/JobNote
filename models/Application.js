// models/Application.js
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        // ─── Who applied ───
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // ─── Which job ───
        jobPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPost',
            required: true,
        },

        // ─── Which company ───
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },

        // ─── Application status ───
        status: {
            type: String,
            enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
            default: 'pending',
        },

        coverLetter: {
            type: String,
            maxlength: [1000, 'Cover letter too long'],
            default: '',
        },

        resumeUrl: {
            type: String,
            required: [true, 'Resume URL is required'],
        },

        // ─── Employer notes — hidden from applicant ───
        notes: {
            type: String,
            default: '',
            select: false,
        },
    },
    { timestamps: true }
);

// ─── Prevent duplicate applications ───
applicationSchema.index(
    { applicant: 1, jobPost: 1 },
    { unique: true }
    // one user can apply to one job only once
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;