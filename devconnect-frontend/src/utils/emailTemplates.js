// utils/emailTemplates.js
// HTML email templates for each notification type

const BRAND_COLOR = '#2563eb';
const BRAND_NAME = 'DevConnect';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// ─── Base template wrapper ───
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
           sans-serif; background: #f9fafb; color: #111827; }
    .container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
    .card { background: white; border-radius: 12px; overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: ${BRAND_COLOR}; padding: 32px; text-align: center; }
    .header h1 { color: white; font-size: 24px; font-weight: 800; }
    .header p  { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 4px; }
    .body { padding: 32px; }
    .body h2 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
    .body p  { color: #4b5563; line-height: 1.6; margin-bottom: 12px; }
    .btn { display: inline-block; background: ${BRAND_COLOR}; color: white;
           padding: 12px 28px; border-radius: 8px; text-decoration: none;
           font-weight: 700; font-size: 15px; margin: 16px 0; }
    .info-box { background: #f0f9ff; border: 1px solid #bae6fd;
                border-radius: 8px; padding: 16px; margin: 16px 0; }
    .info-box p { color: #0c4a6e; margin: 0; }
    .divider { height: 1px; background: #f3f4f6; margin: 20px 0; }
    .footer { padding: 20px 32px; text-align: center;
              color: #9ca3af; font-size: 12px; }
    .status-badge { display: inline-block; padding: 4px 12px;
                    border-radius: 20px; font-size: 13px; font-weight: 600; }
    .status-pending     { background: #fef3c7; color: #b45309; }
    .status-shortlisted { background: #dcfce7; color: #15803d; }
    .status-rejected    { background: #fee2e2; color: #dc2626; }
    .status-hired       { background: #f3e8ff; color: #7e22ce; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>🚀 ${BRAND_NAME}</h1>
        <p>Developer Job Board</p>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
      <p style="margin-top:4px">You're receiving this because you have an account on DevConnect.</p>
    </div>
  </div>
</body>
</html>
`;


// ════════════════════════════════════════
// TEMPLATE 1 — Welcome Email
// ════════════════════════════════════════
export const welcomeEmail = (user) => ({
    subject: `Welcome to DevConnect, ${user.name}! 🚀`,
    html: baseTemplate(`
    <div class="body">
      <h2>Welcome aboard, ${user.name}! 👋</h2>
      <p>
        We're thrilled to have you on <strong>DevConnect</strong> —
        the platform connecting talented developers with amazing companies.
      </p>
      <div class="info-box">
        <p>📧 <strong>Email:</strong> ${user.email}</p>
        <p style="margin-top:6px">
          🎭 <strong>Role:</strong> ${user.role === 'employer'
            ? 'Employer — you can post job listings'
            : 'Developer — you can browse and apply to jobs'}
        </p>
      </div>
      <p>Here's what you can do next:</p>
      <p>
        ${user.role === 'employer'
            ? '✅ Create your company profile<br>✅ Post your first job listing<br>✅ Review applications from developers'
            : '✅ Complete your developer profile<br>✅ Upload your resume<br>✅ Browse and apply to jobs'}
      </p>
      <a href="${FRONTEND_URL}" class="btn">
        ${user.role === 'employer'
            ? '🏢 Post Your First Job →'
            : '💼 Browse Jobs Now →'}
      </a>
    </div>
    <div class="footer" style="border-top: 1px solid #f3f4f6;">
      <p>Questions? Reply to this email anytime.</p>
    </div>
  `),
});


// ════════════════════════════════════════
// TEMPLATE 2 — Application Confirmation
// ════════════════════════════════════════
export const applicationConfirmEmail = (user, job, company) => ({
    subject: `Application Submitted — ${job.title} at ${company.name}`,
    html: baseTemplate(`
    <div class="body">
      <h2>Application Submitted! ✅</h2>
      <p>Great news, <strong>${user.name}</strong>! Your application has been
         successfully submitted.</p>
      <div class="info-box">
        <p>💼 <strong>Position:</strong> ${job.title}</p>
        <p style="margin-top:6px">🏢 <strong>Company:</strong> ${company.name}</p>
        <p style="margin-top:6px">📍 <strong>Location:</strong> ${job.location}</p>
        <p style="margin-top:6px">⏰ <strong>Job Type:</strong> ${job.jobType}</p>
        <p style="margin-top:6px">
          📅 <strong>Applied:</strong> ${new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    })}
        </p>
      </div>
      <p>
        The employer will review your application and get back to you.
        You can track your application status in your dashboard.
      </p>
      <a href="${FRONTEND_URL}/dashboard" class="btn">
        📊 Track Application →
      </a>
      <div class="divider"></div>
      <p style="font-size:13px; color:#6b7280">
        💡 <strong>Tip:</strong> Keep your profile updated to improve your
        chances of getting noticed by employers.
      </p>
    </div>
  `),
});


// ════════════════════════════════════════
// TEMPLATE 3 — Application Status Update
// ════════════════════════════════════════
export const applicationStatusEmail = (user, job, company, status) => {
    const statusConfig = {
        reviewing: {
            emoji: '👀',
            title: 'Your Application is Being Reviewed',
            message: 'The employer is currently reviewing your application. This is a great sign!',
            color: 'status-pending',
        },
        shortlisted: {
            emoji: '⭐',
            title: 'You\'ve Been Shortlisted!',
            message: 'Congratulations! You have been shortlisted for this position. The employer will contact you soon.',
            color: 'status-shortlisted',
        },
        rejected: {
            emoji: '😔',
            title: 'Application Update',
            message: 'Thank you for your interest. Unfortunately, the employer has decided to move forward with other candidates. Don\'t give up — keep applying!',
            color: 'status-rejected',
        },
        hired: {
            emoji: '🎉',
            title: 'Congratulations — You\'re Hired!',
            message: 'Amazing news! You have been selected for this position. The employer will reach out with next steps.',
            color: 'status-hired',
        },
    };

    const config = statusConfig[status] ?? statusConfig.reviewing;

    return {
        subject: `${config.emoji} Application Update — ${job.title} at ${company.name}`,
        html: baseTemplate(`
      <div class="body">
        <h2>${config.emoji} ${config.title}</h2>
        <div class="info-box">
          <p>💼 <strong>Position:</strong> ${job.title}</p>
          <p style="margin-top:6px">🏢 <strong>Company:</strong> ${company.name}</p>
          <p style="margin-top:6px">
            📋 <strong>Status:</strong>
            <span class="status-badge ${config.color}">
              ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>
        </div>
        <p>${config.message}</p>
        <a href="${FRONTEND_URL}/dashboard" class="btn">
          📊 View Dashboard →
        </a>
        ${status === 'rejected' ? `
          <div class="divider"></div>
          <p style="font-size:13px; color:#6b7280">
            💪 Don't be discouraged! Browse more jobs and keep applying.
            Every rejection is one step closer to the right opportunity.
          </p>
          <a href="${FRONTEND_URL}" style="color:${BRAND_COLOR};font-size:13px">
            Browse More Jobs →
          </a>
        ` : ''}
      </div>
    `),
    };
};


// ════════════════════════════════════════
// TEMPLATE 4 — New Job Alert
// ════════════════════════════════════════
export const newJobAlertEmail = (user, job, company) => ({
    subject: `🆕 New Job Alert — ${job.title} at ${company.name}`,
    html: baseTemplate(`
    <div class="body">
      <h2>New Job Matching Your Profile! 💼</h2>
      <p>Hi <strong>${user.name}</strong>, a new job has been posted that
         matches your skills.</p>
      <div class="info-box">
        <p style="font-size:18px; font-weight:700; color:#111827">
          ${job.title}
        </p>
        <p style="margin-top:6px">🏢 ${company.name}</p>
        <p style="margin-top:4px">📍 ${job.location} · ${job.workMode}</p>
        <p style="margin-top:4px">⏰ ${job.jobType} · ${job.experience}</p>
        ${job.salary?.isPublic && job.salary?.max > 0 ? `
          <p style="margin-top:4px; color:#15803d; font-weight:600">
            💰 ₹${(job.salary.min / 100000).toFixed(1)}L –
               ₹${(job.salary.max / 100000).toFixed(1)}L per year
          </p>
        ` : ''}
        ${job.skills?.length > 0 ? `
          <p style="margin-top:8px; font-size:13px; color:#6b7280">
            🛠️ ${job.skills.slice(0, 5).join(' · ')}
          </p>
        ` : ''}
      </div>
      <a href="${FRONTEND_URL}/jobs/${job._id}" class="btn">
        View & Apply Now →
      </a>
    </div>
  `),
});


// ════════════════════════════════════════
// TEMPLATE 5 — New Application (Employer)
// ════════════════════════════════════════
export const newApplicationEmailToEmployer = (employer, applicant, job) => ({
    subject: `📋 New Application — ${job.title} from ${applicant.name}`,
    html: baseTemplate(`
    <div class="body">
      <h2>New Application Received! 📋</h2>
      <p>Hi <strong>${employer.name}</strong>, someone has applied to your job posting.</p>
      <div class="info-box">
        <p>👤 <strong>Applicant:</strong> ${applicant.name}</p>
        <p style="margin-top:6px">📧 <strong>Email:</strong> ${applicant.email}</p>
        <p style="margin-top:6px">💼 <strong>Position:</strong> ${job.title}</p>
        <p style="margin-top:6px">
          📅 <strong>Applied:</strong> ${new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })}
        </p>
      </div>
      <p>Review their application and resume in your dashboard.</p>
      <a href="${FRONTEND_URL}/dashboard" class="btn">
        📊 Review Application →
      </a>
    </div>
  `),
});