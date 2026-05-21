// src/components/JobList.jsx
import JobCard from './JobCard.jsx';

function JobList({ jobs, isLoading, onApply }) {

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px' }}>
                <p style={{ fontSize: '18px', color: '#6b7280' }}>
                    ⏳ Loading jobs...
                </p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '48px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
            }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>😔</p>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                    No jobs found
                </h3>
                <p style={{ color: '#6b7280' }}>
                    Try changing your search filters
                </p>
            </div>
        );
    }

    return (
        <div>
            <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </p>

            {jobs.map(job => (
                <JobCard
                    key={job._id || job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    jobType={job.jobType}
                    workMode={job.workMode}
                    experience={job.experience}
                    salary={job.salary}
                    skills={job.skills}
                    isActive={job.isActive}
                    views={job.views}
                    onApply={() => onApply(job)}
                />
            ))}
        </div>
    );
}

export default JobList;