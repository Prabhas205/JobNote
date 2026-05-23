// src/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import { useMyApplications } from '../hooks/useJobQueries.js';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { logout, selectUser, selectIsLoggedIn } from '../store/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

function DashboardPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    // React Query — auto-fetches when logged in
    const {
        data: applications = [],
        isLoading,
    } = useMyApplications(isLoggedIn);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const statusColors = {
        pending: { bg: '#fef3c7', text: '#b45309' },
        reviewing: { bg: '#dbeafe', text: '#1d4ed8' },
        shortlisted: { bg: '#dcfce7', text: '#15803d' },
        rejected: { bg: '#fee2e2', text: '#dc2626' },
        hired: { bg: '#f3e8ff', text: '#7e22ce' },
    };

    const stats = [
        { label: 'Applied', value: applications.length, icon: '📋', color: '#2563eb' },
        { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: '⏳', color: '#b45309' },
        { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: '⭐', color: '#15803d' },
        { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, icon: '🎉', color: '#7e22ce' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '32px',
                    flexWrap: 'wrap', gap: '16px',
                }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                            👋 Welcome, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p style={{ color: '#6b7280' }}>
                            {user?.email} · {user?.role}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/" style={{
                            padding: '10px 20px', background: '#eff6ff',
                            color: '#2563eb', borderRadius: '8px',
                            textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                        }}>
                            Browse Jobs
                        </Link>
                        {user?.role === 'employer' && (
                            <Link to="/post-job" style={{
                                padding: '10px 20px', background: '#2563eb',
                                color: 'white', borderRadius: '8px',
                                textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                            }}>
                                Post Job
                            </Link>
                        )}
                        <button onClick={handleLogout} style={{
                            padding: '10px 20px', background: '#fee2e2',
                            color: '#dc2626', border: 'none',
                            borderRadius: '8px', cursor: 'pointer',
                            fontWeight: '600', fontSize: '14px',
                        }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '16px', marginBottom: '32px',
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '10px',
                            padding: '20px', textAlign: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            borderTop: `4px solid ${stat.color}`,
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Applications */}
                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                        📋 My Applications
                    </h2>

                    {isLoading ? (
                        <Spinner />
                    ) : applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
                            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                No applications yet
                            </p>
                            <Link to="/" style={{
                                background: '#2563eb', color: 'white',
                                padding: '10px 24px', borderRadius: '8px',
                                textDecoration: 'none', fontWeight: 'bold',
                            }}>
                                Browse Jobs →
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {applications.map((app, i) => {
                                const style = statusColors[app.status] ?? { bg: '#f3f4f6', text: '#374151' };
                                return (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', padding: '16px',
                                        background: '#f9fafb', borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        flexWrap: 'wrap', gap: '12px',
                                    }}>
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                {app.jobPost?.title ?? 'Job Title'}
                                            </h3>
                                            <p style={{ color: '#6b7280', fontSize: '13px' }}>
                                                🏢 {app.company?.name}
                                                &nbsp;·&nbsp;
                                                📅 {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span style={{
                                            background: style.bg, color: style.text,
                                            padding: '6px 14px', borderRadius: '20px',
                                            fontSize: '13px', fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default DashboardPage;