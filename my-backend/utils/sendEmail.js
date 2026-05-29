import transporter from '../config/email.js';

const sendEmail = async (options) => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@yourdomain.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
