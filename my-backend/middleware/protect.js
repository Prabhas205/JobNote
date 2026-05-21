// middleware/protect.js
// REAL JWT VERSION — replaces Day 2 simulation

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    try {

        // ─── Step 1: Get token from header ───
        const authHeader = req.headers.authorization;
        // Postman: Headers → Authorization: Bearer eyJhbGci...

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided — access denied',
                hint: 'Add header: Authorization: Bearer <your_token>',
            });
        }

        // ─── Step 2: Extract token ───
        const token = authHeader.split(' ')[1];
        // "Bearer eyJhbGci..." → ["Bearer", "eyJhbGci..."]
        // [1] = the actual token string

        // ─── Step 3: Verify token ───
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // throws JsonWebTokenError → if tampered/invalid
        // throws TokenExpiredError → if past expiry date
        // returns payload → { id, role, iat, exp }

        // ─── Step 4: Find user from decoded id ───
        const user = await User.findById(decoded.id);
        // WHY DB lookup: token could be valid but
        // user deleted or deactivated since token issued

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists',
            });
        }

        if (!user.active) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        // ─── Step 5: Attach user to request ───
        req.user = user;
        // All routes after protect can now access req.user
        // req.user._id, req.user.role, req.user.name etc.

        next(); // token valid — proceed to next middleware/route

    } catch (error) {

        // Invalid token (tampered/wrong format)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token — please login again',
            });
        }

        // Token expired
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired — please login again',
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default protect;