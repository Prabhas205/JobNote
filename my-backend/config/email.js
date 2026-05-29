// config/email.js
import nodemailer from 'nodemailer';

// ─── Create Transporter ───
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    // ↑ false for port 587 (STARTTLS)
    // true for port 465 (SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── Verify connection ───
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email service ready');
    } catch (error) {
        console.error('❌ Email service failed:', error.message);
        // Don't crash server — email is optional feature
    }
};

export default transporter;