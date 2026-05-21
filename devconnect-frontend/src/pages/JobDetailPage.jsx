// src/pages/JobDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
//import api from '../utils/api.js';
import axios from 'axios';

function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, user, token } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverLetter, setCoverLetter] = useState('');

    // Fetch job on mount
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const data = await axios.get(`http://localhost:5000/api/jobs/${id}`); //chnaged
                setJob(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    // Handle apply
    const handleApply = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!resumeUrl) {
            alert('Please enter your resume URL');
            return;
        }

        try {
            setApplying(true);
            await axios.post(
                `http://localhost:5000/api/jobs/${id}/apply`,
                { resumeUrl, coverLetter },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setApplied(true);
            setShowForm(false);
            alert('✅ Application submitted successfully!');
        } catch (err) {
            alert(`❌ ${err.message}`);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Spinner />;

    if (error) return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>😔</p>
            <h2 style={{ marginBottom: '8px' }}>Job not found</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
            <Link to="/" style={{ color: '#2563eb' }}>← Back to Jobs</Link>
        </div>
    );

    if (!job) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>

                {/* Back Button */}
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#6b7280',
                        textDecoration: 'none',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}
                >
                    ← Back to Jobs
                </Link>

                {/* Job Header */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '8px',
                            }}>
                                {job.title}
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '16px' }}>
                                🏢 {job.company?.name ?? 'Company'}
                                &nbsp;·&nbsp;
                                📍 {job.location}
                            </p>
                        </div>

                        <span style={{
                            background: job.isActive ? '#dcfce7' : '#fee2e2',
                            color: job.isActive ? '#15803d' : '#dc2626',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }}>
                            {job.isActive ? '🟢 Actively Hiring' : '🔴 Closed'}
                        </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {[
                            { label: job.jobType, color: '#dbeafe', text: '#1d4ed8' },
                            { label: job.workMode, color: '#dcfce7', text: '#15803d' },
                            { label: job.experience, color: '#f3e8ff', text: '#7e22ce' },
                        ].map((tag, i) => (
                            <span key={i} style={{
                                background: tag.color,
                                color: tag.text,
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}>
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    {/* Salary */}
                    {job.salary?.isPublic && job.salary?.max > 0 && (
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                        }}>
                            <p style={{ color: '#15803d', fontWeight: 'bold', fontSize: '18px' }}>
                                💰 ₹{(job.salary.min / 100000).toFixed(1)}L
                                — ₹{(job.salary.max / 100000).toFixed(1)}L per year
                            </p>
                        </div>
                    )}

                    {/* Apply Button */}
                    {job.isActive && (
                        <div>
                            {applied ? (
                                <div style={{
                                    background: '#dcfce7',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '8px',
                                    padding: '14px',
                                    textAlign: 'center',
                                    color: '#15803d',
                                    fontWeight: 'bold',
                                }}>
                                    ✅ Application Submitted!
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) { navigate('/login'); return; }
                                        setShowForm(!showForm);
                                    }}
                                    style={{
                                        background: '#2563eb',
                                        color: 'white',
                                        border: 'none',
                                        padding: '14px 32px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                >
                                    {showForm ? 'Cancel' : '🚀 Apply Now'}
                                </button>
                            )}

                            {/* Apply Form */}
                            {showForm && !applied && (
                                <form
                                    onSubmit={handleApply}
                                    style={{
                                        marginTop: '16px',
                                        padding: '20px',
                                        background: '#f9fafb',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                    }}
                                >
                                    <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>
                                        📋 Submit Application
                                    </h3>

                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                                        Resume URL *
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://drive.google.com/your-resume.pdf"
                                        value={resumeUrl}
                                        onChange={e => setResumeUrl(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            marginBottom: '12px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                        }}
                                    />

                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                                        Cover Letter (optional)
                                    </label>
                                    <textarea
                                        placeholder="Tell us why you're a great fit..."
                                        value={coverLetter}
                                        onChange={e => setCoverLetter(e.target.value)}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            marginBottom: '16px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            boxSizing: 'border-box',
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={applying}
                                        style={{
                                            background: applying ? '#93c5fd' : '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '6px',
                                            cursor: applying ? 'not-allowed' : 'pointer',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {applying ? '⏳ Submitting...' : '✅ Submit Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Views */}
                    <p style={{
                        marginTop: '16px',
                        fontSize: '12px',
                        color: '#9ca3af',
                        textAlign: 'right',
                    }}>
                        👁️ {job.views} views
                    </p>
                </div>

                {/* Job Description */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                        📝 Job Description
                    </h2>
                    <p style={{ color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                        {job.description}
                    </p>
                </div>

                {/* Requirements */}
                {job.requirements && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        marginBottom: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            ✅ Requirements
                        </h2>
                        <p style={{ color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                            {job.requirements}
                        </p>
                    </div>
                )}

                {/* Skills */}
                {job.skills?.length > 0 && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        marginBottom: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            🛠️ Required Skills
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {job.skills.map((skill, i) => (
                                <span key={i} style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    border: '1px solid #bfdbfe',
                                    fontWeight: '500',
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Company Info */}
                {job.company && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            🏢 About the Company
                        </h2>
                        <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                            {job.company.name}
                        </h3>
                        {job.company.location && (
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                                📍 {job.company.location?.city}, {job.company.location?.country}
                            </p>
                        )}
                        {job.company.industry && (
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                                🏭 {job.company.industry}
                            </p>
                        )}
                        {job.company.size && (
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                👥 {job.company.size} employees
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default JobDetailPage;