import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { welcomeEmail } from '../utils/emailTemplates.js';

const sendTokenResponse = (user, statusCode, res) => {

    const token = user.generateToken();

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };

    res.status(statusCode).json({
        success: true,
        token,

        user: userResponse,
    });
};

export const register = async (req, res, next) => {
    try {

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required',

            });
        }


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered — please login instead',
            });
        }

        const user = await User.create({
            name,
            email,
            password,  // plain text here → hook hashes it before save
            role,      // optional — defaults to 'user' if not sent
        });

        // ─── Send welcome email (async — don't await) ───
        sendEmail({
            to: user.email,
            ...welcomeEmail(user),
        }).catch(err => console.error('Welcome email failed:', err.message));
        // ↑ fire and forget — don't wait for email
        //   don't let email failure block registration

        console.log(`✅ Registered: ${user.email} (${user.role})`);

        // ─── Send token ───
        sendTokenResponse(user, 201, res);
        // 201 = Created

    } catch (error) {

        // Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }

        // Duplicate email (unique constraint)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        // ─── Check fields provided ───
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // ─── Find user + include password ───
        const user = await User.findOne({ email }).select('+password');
        // .select('+password') overrides select:false
        // ONLY this query includes password
        // needed so we can compare it below

        // ─── User not found ───
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                // WHY vague: don't reveal which part is wrong
                // "email not found" = confirms email exists to attacker
            });
        }

        // ─── Check account active ───
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account deactivated — contact support',
            });
        }

        // ─── Compare passwords ───
        const isMatch = await user.comparePassword(password);
        // bcrypt.compare(entered, hashed) → true/false

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                // same vague message — security best practice
            });
        }

        // ─── Update lastLogin ───
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });
        // validateBeforeSave: false — skip full validation
        // we only updated lastLogin — no need to re-validate all fields

        console.log(`✅ Login: ${user.email} at ${user.lastLogin}`);

        // ─── Send token ───
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};


export const getMe = async (req, res, next) => {
    try {

        // req.user._id set by protect middleware
        // Fresh DB fetch — always up to date
        const user = await User.findById(req.user._id);
        // no .select('+password') → password excluded ✅

        res.json({
            success: true,
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        // Create an object with only the allowed fields
        const allowedFields = ['name', 'bio', 'skills', 'profilePicture', 'location', 'github', 'linkedin', 'portfolio', 'resumeUrl'];
        const updateData = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // Find user and update
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, errors });
        }
        next(error);
    }
};


export const updatePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body;

        // ─── Check fields ───
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
            });
        }

        // ─── New password length ───
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters',
            });
        }

        // ─── Get user WITH password ───
        const user = await User.findById(req.user._id).select('+password');

        // ─── Verify current password ───
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // ─── Set new password ───
        user.password = newPassword;
        // plain text here → pre-save hook hashes it automatically
        await user.save();

        console.log(`✅ Password updated: ${user.email}`);

        // Send fresh token
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {

        const users = await User.find();
        // no password (select:false) ✅

        res.json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {
        next(error);
    }
};