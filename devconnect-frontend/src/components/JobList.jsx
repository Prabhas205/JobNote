// src/components/JobList.jsx
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import JobCard from './JobCard.jsx';
import { JobCardSkeleton } from './Skeleton.jsx';

// memo — only re-renders if jobs or onApply changes
const JobList = memo(function JobList({ jobs = [], isLoading, onApply }) {

    // useCallback — stable reference for JobCard
    const handleApply = useCallback((job) => {
        onApply?.(job);
    }, [onApply]);

    // Show skeletons while loading
    if (isLoading) {
        return (
            <div>
                {[1, 2, 3].map(i => (
                    <JobCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
            }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>😔</p>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No jobs found</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Try changing your search filters
                </p>
                <Link
                    to="/"
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    Clear Filters
                </Link>
            </div>
        );
    }

    return (
        <div>
            <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '14px' }}>
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </p>
            {jobs.map(job => (
                <JobCard
                    key={job._id ?? job.id}
                    title={job.title}
                    company={job.company?.name ?? job.company}
                    location={job.location}
                    jobType={job.jobType}
                    workMode={job.workMode}
                    experience={job.experience}
                    salary={job.salary}
                    skills={job.skills}
                    isActive={job.isActive}
                    views={job.views}
                    jobId={job._id ?? job.id}
                    onApply={() => handleApply(job)}
                />
            ))}
        </div>
    );
});

export default JobList;