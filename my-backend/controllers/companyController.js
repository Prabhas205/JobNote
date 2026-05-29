// controllers/companyController.js
import Company from '../models/Company.js';

// ─── CREATE COMPANY ───
export const createCompany = async (req, res) => {
    try {
        req.body.createdBy = req.user._id;
        // attach logged in user as creator

        const company = await Company.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Company name already exists',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET ALL COMPANIES ───
export const getAllCompanies = async (req, res) => {
    try {
        const { industry, search, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (industry) filter.industry = industry;
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const [companies, total] = await Promise.all([
            Company.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Company.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: companies.length,
            total,
            pages: Math.ceil(total / limitNum),
            page: pageNum,
            data: companies,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── GET SINGLE COMPANY ───
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('activeJobCount');
        // populate virtual count

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        res.json({ success: true, data: company });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── UPDATE COMPANY ───
export const updateCompany = async (req, res) => {
    try {
        let company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        // Only creator or admin can update
        if (
            company.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this company',
            });
        }

        company = await Company.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { returnDocument: 'after', runValidators: true }
        );

        res.json({
            success: true,
            message: 'Company updated',
            data: company,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DELETE COMPANY ───
export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        // Only creator or admin can delete
        if (
            company.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this company',
            });
        }

        await Company.findOneAndDelete({ _id: req.params.id });
        // triggers pre-hook → deletes all company jobs too

        res.json({
            success: true,
            message: `Company "${company.name}" and all its jobs deleted`,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};