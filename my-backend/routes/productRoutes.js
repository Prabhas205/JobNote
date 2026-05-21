import express from 'express';

import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
} from '../controllers/productController.js';

import protect from '../middleware/protect.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();
router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.get('/stats', protect, getProductStats);

router.post('/',
    protect,
    authorize('admin'),
    createProduct
);

router.put('/:id',
    protect,
    authorize('admin'),
    deleteProduct

);

export default router;


console.log('--- Routes Debug ---');
console.log('protect   :', typeof protect);
console.log('authorize :', typeof authorize);
console.log('getAllProducts :', typeof getAllProducts);
console.log('getProductStats:', typeof getProductStats);
