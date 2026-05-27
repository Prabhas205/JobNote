import { Link } from 'react-router-dom';

function JobCard({ 
    title, 
    company, 
    location, 
    jobType, 
    workMode, 
    experience, 
    salary, 
    skills = [], 
    isActive = true, 
    views, 
    jobId, 
    description, 
    onApply 
}) {
    // Format salary logic
    const formatSalary = (sal) => {
        if (!sal || !sal.isPublic) return 'Not disclosed';
        if (sal.min === sal.max) return `${(sal.min / 100000).toFixed(1)}L`;
        return `${(sal.min / 100000).toFixed(1)}L - ${(sal.max / 100000).toFixed(1)}L`;
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.2s',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                        {title}
                        {isActive && <span style={{ marginLeft: '8px', fontSize: '12px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '12px' }}>Hiring</span>}
                    </h3>
                    <p style={{ color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🏢 {company || 'Unknown Company'}</span>
                        <span>·</span>
                        <span>📍 {location || 'Remote'}</span>
                    </p>
                </div>
                <span style={{
                    background: isActive ? '#dcfce7' : '#fee2e2',
                    color: isActive ? '#15803d' : '#dc2626',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                }}>
                    {isActive ? 'Active' : 'Closed'}
                </span>
            </div>

            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {description}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {skills.map(skill => (
                    <span key={skill} style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', color: '#4b5563' }}>
                        {skill}
                    </span>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: '#fef3c7', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', color: '#92400e' }}>
                    💰 {formatSalary(salary)}
                </span>
                <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', color: '#4b5563' }}>
                    🕒 {jobType || 'Full-time'}
                </span>
                {workMode && (
                    <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', color: '#4b5563' }}>
                        💼 {workMode}
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <Link
                    to={`/jobs/${jobId}`}
                    style={{
                        padding: '10px 16px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        flex: 1,
                        textAlign: 'center'
                    }}
                >
                    View Details
                </Link>

                <button
                    onClick={onApply}
                    disabled={!isActive}
                    style={{
                        background: isActive ? '#2563eb' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: isActive ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flex: 1
                    }}
                >
                    {isActive ? 'Apply Now →' : 'Closed'}
                </button>
            </div>
        </div>
    );
}

export default JobCard;