// src/components/JobCard.jsx
import { memo } from 'react';
import { Link } from 'react-router-dom';

const JobCard = memo(function JobCard({
    title = 'Untitled Job',
    company = 'Unknown Company',
    location = 'Not specified',
    jobType = 'full-time',
    workMode = 'onsite',
    experience = 'fresher',
    salary = { min: 0, max: 0, isPublic: false },
    skills = [],
    isActive = true,
    views = 0,
    jobId,
    onApply,
}) {

    const jobTypeBadge = {
        'full-time': 'badge-blue',
        'part-time': 'badge-green',
        'contract': 'badge-yellow',
        'internship': 'badge-purple',
    }[jobType] ?? 'badge-blue';

    const workModeIcon = {
        remote: '🌐',
        hybrid: '🔀',
        onsite: '🏢',
    }[workMode] ?? '🏢';

    return (
        <div className={`card mb-4 ${!isActive ? 'opacity-60' : ''}`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500">
                        🏢 <span className="font-medium text-gray-700">{company}</span>
                        <span className="mx-2">·</span>
                        📍 {location}
                    </p>
                </div>

                {/* Status Badge */}
                <span className={`badge flex-shrink-0 ${isActive ? 'badge-green' : 'badge-red'
                    }`}>
                    {isActive ? '● Hiring' : '● Closed'}
                </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge ${jobTypeBadge}`}>
                    {jobType}
                </span>
                <span className="badge badge-blue">
                    {workModeIcon} {workMode}
                </span>
                <span className="badge bg-gray-100 text-gray-600">
                    🎯 {experience}
                </span>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {skills.slice(0, 5).map((skill, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs
                         rounded-md border border-blue-100 font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 5 && (
                        <span className="px-2 py-1 text-gray-400 text-xs self-center">
                            +{skills.length - 5} more
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between
                      pt-4 border-t border-gray-50">

                {/* Salary */}
                <div>
                    {salary?.isPublic && salary?.max > 0 ? (
                        <p className="text-sm font-bold text-green-600">
                            💰 ₹{(salary.min / 100000).toFixed(1)}L
                            – ₹{(salary.max / 100000).toFixed(1)}L / yr
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">
                            💰 Salary not disclosed
                        </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                        👁 {views} views
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link
                        to={`/jobs/${jobId}`}
                        className="px-3 py-2 text-sm font-medium text-blue-600
                       bg-blue-50 rounded-lg hover:bg-blue-100
                       transition-colors duration-200"
                    >
                        Details
                    </Link>
                    <button
                        onClick={onApply}
                        disabled={!isActive}
                        className={`px-4 py-2 text-sm font-bold rounded-lg
                        transition-colors duration-200 ${isActive
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isActive ? 'Apply →' : 'Closed'}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default JobCard;