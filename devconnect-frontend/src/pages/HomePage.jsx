// src/pages/HomePage.jsx
import { useRef } from 'react';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import JobList from '../components/JobList.jsx';
import JobStats from '../components/JobStats.jsx';
import Spinner from '../components/Spinner.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

function HomePage() {
    const {
        jobs, loading, error,
        total, filters,
        setFilter, clearFilters,
        pages, page, setPage,
    } = useJobs();

    const { isLoggedIn } = useAuth();
    const jobListRef = useRef(null);

    const handleSearch = (newFilters) => {
        Object.entries(newFilters).forEach(([key, val]) => {
            setFilter(key, val);
        });
        // Smooth scroll to job list
        setTimeout(() => {
            jobListRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
    };

    const handleApply = (job) => {
        if (!isLoggedIn) {
            alert('Please login to apply!');
            return;
        }
        alert(`Applying to: ${job.title}\nFull flow in Day 5!`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

            {/* ─── Hero Section ─── */}
            <div style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                padding: '80px 24px',
                textAlign: 'center',
                color: 'white',
            }}>
                <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 48px)',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    lineHeight: 1.2,
                }}>
                    Find Your Dream<br />Developer Job 🚀
                </h1>
                <p style={{
                    fontSize: '18px',
                    opacity: 0.9,
                    marginBottom: '32px',
                }}>
                    {total} jobs available · Updated daily
                </p>

                {/* Skill Quick Search Tags */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                }}>
                    {['React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'TypeScript'].map(skill => (
                        <span
                            key={skill}
                            onClick={() => {
                                setFilter('search', skill);
                                jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background 0.2s',
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '32px 16px',
            }}>

                {/* Stats */}
                <JobStats />

                {/* Search */}
                <SearchBar onSearch={handleSearch} />

                {/* Active Filters */}
                {(filters.search || filters.jobType || filters.workMode) && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        marginBottom: '16px',
                    }}>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                            Filters:
                        </span>
                        {filters.search && (
                            <FilterTag
                                label={`"${filters.search}"`}
                                onRemove={() => setFilter('search', '')}
                            />
                        )}
                        {filters.jobType && (
                            <FilterTag
                                label={filters.jobType}
                                onRemove={() => setFilter('jobType', '')}
                            />
                        )}
                        {filters.workMode && (
                            <FilterTag
                                label={filters.workMode}
                                onRemove={() => setFilter('workMode', '')}
                            />
                        )}
                        <button
                            onClick={clearFilters}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#dc2626',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 'bold',
                            }}
                        >
                            Clear all ×
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '16px',
                        color: '#dc2626',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Job List */}
                <div ref={jobListRef}>
                    {loading
                        ? <Spinner />
                        : <JobList
                            jobs={jobs}
                            isLoading={loading}
                            onApply={handleApply}
                        />
                    }
                </div>

                {/* Pagination */}
                {pages > 1 && !loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '32px',
                        flexWrap: 'wrap',
                    }}>
                        <PaginationBtn
                            label="← Prev"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        />
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <PaginationBtn
                                key={p}
                                label={p}
                                onClick={() => setPage(p)}
                                active={p === page}
                            />
                        ))}
                        <PaginationBtn
                            label="Next →"
                            onClick={() => setPage(page + 1)}
                            disabled={page === pages}
                        />
                    </div>
                )}

            </div>

            <ScrollToTop />
        </div>
    );
}

// ─── Helper Components ───
function FilterTag({ label, onRemove }) {
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#dbeafe',
            color: '#1d4ed8',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '13px',
        }}>
            {label}
            <button
                onClick={onRemove}
                style={{
                    background: 'none', border: 'none',
                    color: '#1d4ed8', cursor: 'pointer',
                    fontWeight: 'bold', fontSize: '16px', padding: '0',
                }}
            >×</button>
        </span>
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
                    : disabled ? '#f3f4f6'
                        : 'white',
                color: active ? 'white'
                    : disabled ? '#9ca3af'
                        : '#374151',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: active ? 'bold' : 'normal',
                fontSize: '14px',
            }}
        >
            {label}
        </button>
    );
}

export default HomePage;