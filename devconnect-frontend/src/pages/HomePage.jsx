// src/pages/HomePage.jsx
import { useState, useRef } from 'react';
import { useJobs, useJobStats } from '../hooks/useJobQueries.js';
import { useAppSelector } from '../store/hooks.js';
import { selectIsLoggedIn } from '../store/slices/authSlice.js';
import Navbar from '../components/Navbar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import JobList from '../components/JobList.jsx';
import Spinner from '../components/Spinner.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

function HomePage() {
    const [filters, setFilters] = useState({
        search: '', jobType: '', workMode: '', page: 1,
    });

    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const jobListRef = useRef(null);

    // React Query — automatic caching, refetching, error handling
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useJobs(filters);

    const { data: stats } = useJobStats();

    const jobs = data?.jobs ?? [];
    const total = data?.total ?? 0;
    const pages = data?.pages ?? 1;

    const handleSearch = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
        setTimeout(() => {
            jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                padding: '80px 24px',
                textAlign: 'center',
                color: 'white',
            }}>
                <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 48px)',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                }}>
                    Find Your Dream Dev Job 🚀
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px' }}>
                    {total} jobs available · Updated in real time
                </p>

                {/* Skill Tags */}
                <div style={{
                    display: 'flex', gap: '10px',
                    justifyContent: 'center', flexWrap: 'wrap',
                }}>
                    {['React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'TypeScript'].map(skill => (
                        <span
                            key={skill}
                            onClick={() => handleSearch({ search: skill })}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>

                {/* Stats from React Query */}
                {stats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}>
                        {[
                            { label: 'Total Jobs', value: stats.total, icon: '💼', color: '#2563eb' },
                            { label: 'Remote', value: stats.remote, icon: '🌐', color: '#059669' },
                            {
                                label: 'Full Time',
                                value: stats.byJobType?.find(s => s._id === 'full-time')?.total ?? 0,
                                icon: '⏰', color: '#7c3aed'
                            },
                            {
                                label: 'Internships',
                                value: stats.byJobType?.find(s => s._id === 'internship')?.total ?? 0,
                                icon: '🎓', color: '#ea580c'
                            },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                textAlign: 'center',
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
                )}

                {/* Search */}
                <SearchBar onSearch={handleSearch} />

                {/* Background refetch indicator */}
                {isFetching && !isLoading && (
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '8px',
                        fontSize: '12px',
                        color: '#6b7280',
                    }}>
                        🔄 Refreshing...
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '16px',
                        color: '#dc2626',
                    }}>
                        ⚠️ {error?.message}
                    </div>
                )}

                {/* Jobs */}
                <div ref={jobListRef}>
                    {isLoading
                        ? <Spinner />
                        : <JobList
                            jobs={jobs}
                            isLoading={isLoading}
                            onApply={(job) => {
                                if (!isLoggedIn) {
                                    alert('Please login to apply!');
                                    return;
                                }
                            }}
                        />
                    }
                </div>

                {/* Pagination */}
                {pages > 1 && !isLoading && (
                    <div style={{
                        display: 'flex', justifyContent: 'center',
                        gap: '8px', marginTop: '32px', flexWrap: 'wrap',
                    }}>
                        <PaginationBtn
                            label="← Prev"
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 1}
                        />
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <PaginationBtn
                                key={p}
                                label={p}
                                onClick={() => handlePageChange(p)}
                                active={p === filters.page}
                            />
                        ))}
                        <PaginationBtn
                            label="Next →"
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page === pages}
                        />
                    </div>
                )}

            </div>

            <ScrollToTop />
        </div>
    );
}

function PaginationBtn({ label, onClick, disabled, active }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '8px 14px',
                border: '1px solid',
                borderColor: active ? '#2563eb' : '#e5e7eb',
                borderRadius: '8px',
                background: active ? '#2563eb'
                    : disabled ? '#f3f4f6' : 'white',
                color: active ? 'white'
                    : disabled ? '#9ca3af' : '#374151',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: active ? 'bold' : 'normal',
            }}
        >
            {label}
        </button>
    );
}

export default HomePage;