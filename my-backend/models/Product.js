import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],

            maxlength: [100, 'Name cannot exceed 100 characters'],

        },

        price: {
            type: Number,
            required: [true, 'pPrice is required'],
            min: [0, 'Price cannot be negative'],
        },

        category: {
            type: String,
            enum: {
                values: ['Electronics', 'Clothing', 'Food', 'Books', 'General'],
                message: '{VALUE} is not a valid category'
            },
            default: 'General',
        },

        inStock: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: '',
            trim: true,
        },

        rating: {
            type: Number,
            min: [0, 'Rating minimum is 0'],
            max: [5, 'Rating maximum is 5'],
            default: 0,
        },
    },

    {
        timestamps: true,
    }


);

const Product = mongoose.model('Product', productSchema);

export default Product;