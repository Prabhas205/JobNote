// utils/sendEmail.js
import transporter from '../config/email.js';

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error(`❌ Email failed to ${to}:`, error.message);
        // Return failure but don't throw
        // Email failure shouldn't break the main flow
        return { success: false, error: error.message };
    }
};

export default sendEmail;