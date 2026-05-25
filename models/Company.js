// models/Company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [1000, 'Description too long'],
        },

        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}/,
                'Please enter a valid URL with http or https',
            ],
            default: '',
        },

        location: {
            city: { type: String, required: [true, 'City is required'] },
            state: { type: String, default: '' },
            country: { type: String, default: 'India' },
        },

        industry: {
            type: String,
            enum: ['Technology', 'Finance', 'Healthcare',
                'Education', 'E-commerce', 'Other'],
            default: 'Technology',
        },

        size: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
            default: '1-10',
        },

        logo: {
            type: String,
            default: 'default-logo.png',
        },

        // ─── Who created this company ───
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ─── Virtual: count active jobs ───
companySchema.virtual('activeJobCount', {
    ref: 'JobPost',
    localField: '_id',
    foreignField: 'company',
    count: true,
    match: { isActive: true },
});

// ─── Cascade delete jobs when company deleted ───
companySchema.pre('findOneAndDelete', async function (next) {
    const company = await this.model.findOne(this.getFilter());
    if (company) {
        await mongoose.model('JobPost').deleteMany({ company: company._id });
        console.log(`🗑️  Deleted all jobs for: ${company.name}`);
    }
    next();
});

const Company = mongoose.model('Company', companySchema);
export default Company;