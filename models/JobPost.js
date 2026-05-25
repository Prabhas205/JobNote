// models/JobPost.js
import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            maxlength: [100, 'Title too long'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [5000, 'Description too long'],
        },

        requirements: {
            type: String,
            maxlength: [2000, 'Requirements too long'],
            default: '',
        },

        skills: {
            type: [String],
            default: [],
            // ["React", "Node.js", "MongoDB"]
        },

        salary: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
            currency: { type: String, default: 'INR' },
            isPublic: { type: Boolean, default: true },
        },

        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship'],
            default: 'full-time',
        },

        workMode: {
            type: String,
            enum: ['onsite', 'remote', 'hybrid'],
            default: 'onsite',
        },

        experience: {
            type: String,
            enum: ['fresher', '1-2 years', '2-5 years', '5+ years'],
            default: 'fresher',
        },

        location: {
            type: String,
            default: 'Hyderabad',
            trim: true,
        },

        deadline: {
            type: Date,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        views: {
            type: Number,
            default: 0,
        },

        // ─── Reference: who posted ───
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // ─── Reference: which company ───
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },

        // ─── Array of applicant user IDs ───
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ─── Virtual: applicant count ───
jobPostSchema.virtual('applicantCount').get(function () {
    return this.applicants.length;
});

// ─── Indexes for fast search ───
jobPostSchema.index({ title: 'text', description: 'text' });
jobPostSchema.index({ company: 1, isActive: 1 });

const JobPost = mongoose.model('JobPost', jobPostSchema);
export default JobPost;