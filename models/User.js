import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,

            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email address'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'employer', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre('save', async function () {

    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

userSchema.methods.comparePassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

export default User;
