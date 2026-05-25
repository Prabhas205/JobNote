// routes/companyRoutes.js
import express from 'express';
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from '../controllers/companyController.js';
import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

// Protected
router.post('/',
    protect,
    authorize('admin', 'employer'),
    createCompany
);

router.put('/:id',
    protect,
    authorize('admin', 'employer'),
    updateCompany
);

router.delete('/:id',
    protect,
    authorize('admin', 'employer'),
    deleteCompany
);

export default router;