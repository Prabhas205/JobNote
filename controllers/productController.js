import Product from '../models/Product.js';

const handleError = (res, error) => {

    console.error('Error:', error.message);

    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ID format: ${error.value}`,
        });
    }

    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];

        return res.status(400).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            error: error.message
        }),
    });

}

export const getAllProducts = async (req, res) => {
    try {

        const {
            category,
            inStock,
            sort,
            page = 1,
            limit = 10,
            search,
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (inStock !== undefined) {
            filter.inStock = inStock === 'true';
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        let sortObj = { createdAt: -1 };

        if (sort === 'price_asc') sortObj = { price: 1 };
        if (sort === 'price_desc') sortObj = { price: -1 };
        if (sort === 'name_asc') sortObj = { name: 1 };
        if (sort === 'rating_desc') sortObj = { rating: -1 };

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const [product, total] = await Promise.all([
            Product.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum),

            Product.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: product.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: getAllProducts,
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product not found with id: ${req.params.id}`,
            });
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const createProduct = async (req, res) => {

    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const updateProduct = async (req, res) => {

    try {
        delete req.body._id;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },

            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: `Product not found with id:${req.params.id}`,
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product not found with id: ${req.params.id}`,

            });
        }

        res.json({
            success: true,
            message: `Priduct "${product.name}" delected successfully`,
        });
    } catch (error) {

        handleError(res, error);
    }
};

export const getProductStats = async (req, res) => {

    try {

        const [
            total,
            inStockCount,
            categoryStats,
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ inStock: true }),
            Product.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        avgPrice: { $avg: '$price' },
                        maxPrice: { $max: '$price' },
                        minPrice: { $min: '$price' },
                    },
                },
                {
                    $sort: { count: -1 }

                },

            ]),


        ]);

        const priceResult = await Product.aggregate([
            { $group: { _id: null, avgPrice: { $avg: '$price' } } }
            // _id: null = group ALL documents together
        ]);
        const avgPrice = priceResult[0]
            ? Math.round(priceResult[0].avgPrice)
            : 0;

        res.json({
            success: true,
            requestedBy: req.user.name,
            // req.user set by protect middleware
            data: {
                total,
                inStock: inStockCount,
                outOfStock: total - inStockCount,
                avgPrice,
                byCategory: categoryStats,
            },
        });

    } catch (error) {
        handleError(res, error);
    }
};

console.log('Exports check:');
console.log('getAllProducts  :', typeof getAllProducts);
console.log('getProductById  :', typeof getProductById);
console.log('createProduct   :', typeof createProduct);
console.log('updateProduct   :', typeof updateProduct);
console.log('deleteProduct   :', typeof deleteProduct);
console.log('getProductStats :', typeof getProductStats);
