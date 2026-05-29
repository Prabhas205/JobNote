export const applicationStatusEmail = (applicant, jobPost, company, status) => {
    return {
        subject: `Application Status Update: ${jobPost.title} at ${company.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Application Update</h2>
                <p>Hello ${applicant.name},</p>
                <p>We are writing to inform you that the status of your application for <strong>${jobPost.title}</strong> at <strong>${company.name}</strong> has been updated.</p>
                <p>New Status: <strong style="text-transform: capitalize;">${status}</strong></p>
                <br>
                <p>Best regards,</p>
                <p>The JobNote Team</p>
            </div>
        `,
    };
};

export const welcomeEmail = (user) => {
    return {
        subject: `Welcome to JobNote, ${user.name}!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to JobNote!</h2>
                <p>Hello ${user.name},</p>
                <p>We are thrilled to have you on board. Your account has been successfully created.</p>
                <br>
                <p>Best regards,</p>
                <p>The JobNote Team</p>
            </div>
        `,
    };
};

export const applicationConfirmEmail = (user, job, company) => {
    return {
        subject: `Application Received: ${job.title} at ${company.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Application Submitted Successfully</h2>
                <p>Hello ${user.name},</p>
                <p>Your application for the position of <strong>${job.title}</strong> at <strong>${company.name}</strong> has been successfully received.</p>
                <p>You can track the status of your application from your dashboard.</p>
                <br>
                <p>Best regards,</p>
                <p>The JobNote Team</p>
            </div>
        `,
    };
};

export const newApplicationEmailToEmployer = (postedBy, applicant, job) => {
    return {
        subject: `New Application for ${job.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Application Received</h2>
                <p>Hello ${postedBy.name},</p>
                <p>You have received a new application for the position of <strong>${job.title}</strong> from <strong>${applicant.name}</strong>.</p>
                <p>Please log in to your employer dashboard to review their application.</p>
                <br>
                <p>Best regards,</p>
                <p>The JobNote Team</p>
            </div>
        `,
    };
};
