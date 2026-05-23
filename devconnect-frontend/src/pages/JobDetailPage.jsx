// src/pages/JobDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJob, useApplyToJob } from '../hooks/useJobQueries.js';
import { useAppSelector } from '../store/hooks.js';
import { selectIsLoggedIn, selectToken } from '../store/slices/authSlice.js';
import ApplyForm from '../components/forms/ApplyForm.jsx';
import Spinner from '../components/Spinner.jsx';

function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const [showForm, setShowForm] = useState(false);

    // React Query — cached, no loading flash on revisit
    const { data: job, isLoading, isError, error } = useJob(id);

    // Apply mutation
    const applyMutation = useApplyToJob();

    if (isLoading) return <Spinner />;

    if (isError) return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontSize: '48px' }}>😔</p>
            <h2 style={{ marginBottom: '8px' }}>Job not found</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error?.message}</p>
            <Link to="/" style={{ color: '#2563eb' }}>← Back to Jobs</Link>
        </div>
    );

    if (!job) return null;

    const hasApplied = applyMutation.isSuccess;

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>

                <Link to="/" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#6b7280', textDecoration: 'none',
                    marginBottom: '24px', fontSize: '14px',
                }}>
                    ← Back to Jobs
                </Link>

                {/* Job Header Card */}
                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '32px', marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '20px',
                        flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                                {job.title}
                            </h1>
                            <p style={{ color: '#6b7280' }}>
                                🏢 {job.company?.name} &nbsp;·&nbsp; 📍 {job.location}
                            </p>
                        </div>
                        <span style={{
                            background: job.isActive ? '#dcfce7' : '#fee2e2',
                            color: job.isActive ? '#15803d' : '#dc2626',
                            padding: '6px 14px', borderRadius: '20px',
                            fontSize: '13px', fontWeight: 'bold',
                        }}>
                            {job.isActive ? '🟢 Hiring' : '🔴 Closed'}
                        </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {[
                            { label: job.jobType, bg: '#dbeafe', color: '#1d4ed8' },
                            { label: job.workMode, bg: '#dcfce7', color: '#15803d' },
                            { label: job.experience, bg: '#f3e8ff', color: '#7e22ce' },
                        ].map((tag, i) => (
                            <span key={i} style={{
                                background: tag.bg, color: tag.color,
                                padding: '6px 12px', borderRadius: '6px',
                                fontSize: '13px', fontWeight: '600',
                            }}>
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    {/* Salary */}
                    {job.salary?.isPublic && job.salary?.max > 0 && (
                        <div style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                        }}>
                            <p style={{ color: '#15803d', fontWeight: 'bold', fontSize: '18px' }}>
                                💰 ₹{(job.salary.min / 100000).toFixed(1)}L
                                — ₹{(job.salary.max / 100000).toFixed(1)}L / year
                            </p>
                        </div>
                    )}

                    {/* Apply Section */}
                    {job.isActive && (
                        <div>
                            {hasApplied ? (
                                <div style={{
                                    background: '#dcfce7', border: '1px solid #bbf7d0',
                                    borderRadius: '8px', padding: '14px', textAlign: 'center',
                                    color: '#15803d', fontWeight: 'bold',
                                }}>
                                    ✅ Application Submitted Successfully!
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            if (!isLoggedIn) { navigate('/login'); return; }
                                            setShowForm(!showForm);
                                        }}
                                        style={{
                                            width: '100%', padding: '14px',
                                            background: '#2563eb', color: 'white',
                                            border: 'none', borderRadius: '8px',
                                            fontSize: '16px', fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showForm ? 'Cancel' : '🚀 Apply Now'}
                                    </button>

                                    {showForm && (
                                        <div style={{ marginTop: '20px' }}>
                                            <ApplyForm
                                                jobId={id}
                                                onSuccess={() => setShowForm(false)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <p style={{
                        marginTop: '12px', fontSize: '12px',
                        color: '#9ca3af', textAlign: 'right',
                    }}>
                        👁️ {job.views} views
                    </p>
                </div>

                {/* Description */}
                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '32px', marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                        📝 Job Description
                    </h2>
                    <p style={{ color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                        {job.description}
                    </p>
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                    <div style={{
                        background: 'white', borderRadius: '12px',
                        padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            🛠️ Required Skills
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {job.skills.map((skill, i) => (
                                <span key={i} style={{
                                    background: '#eff6ff', color: '#2563eb',
                                    padding: '6px 14px', borderRadius: '6px',
                                    fontSize: '14px', border: '1px solid #bfdbfe',
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default JobDetailPage;