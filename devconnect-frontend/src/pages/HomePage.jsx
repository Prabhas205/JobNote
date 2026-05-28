// src/pages/HomePage.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useJobs, useJobStats } from '../hooks/useJobQueries.js';
import { useAppSelector } from '../store/hooks.js';
import { selectIsLoggedIn } from '../store/slices/authSlice.js';
import JobList from '../components/JobList.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import { JobCardSkeleton } from '../components/Skeleton.jsx';

const SKILLS = ['React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'TypeScript', 'Docker', 'GraphQL'];
const FILTERS = [
    {
        label: 'Job Type', key: 'jobType', options: [
            { value: 'full-time', label: 'Full Time' },
            { value: 'part-time', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Internship' },
        ]
    },
    {
        label: 'Work Mode', key: 'workMode', options: [
            { value: 'remote', label: '🌐 Remote' },
            { value: 'hybrid', label: '🔀 Hybrid' },
            { value: 'onsite', label: '🏢 Onsite' },
        ]
    },
    {
        label: 'Experience', key: 'experience', options: [
            { value: 'fresher', label: 'Fresher' },
            { value: '1-2 years', label: '1-2 Years' },
            { value: '2-5 years', label: '2-5 Years' },
            { value: '5+ years', label: '5+ Years' },
        ]
    },
];

function HomePage() {
    const [filters, setFilters] = useState({
        search: '', jobType: '', workMode: '', experience: '', page: 1,
    });
    const [searchInput, setSearchInput] = useState('');
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const jobListRef = useRef(null);

    const { data, isLoading, isFetching, isError, error } = useJobs(filters);
    const { data: stats } = useJobStats();

    const jobs = data?.jobs ?? [];
    const total = data?.total ?? 0;
    const pages = data?.pages ?? 1;

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ search: '', jobType: '', workMode: '', experience: '', page: 1 });
        setSearchInput('');
    };

    const hasFilters = filters.search || filters.jobType ||
        filters.workMode || filters.experience;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ─── Hero Section ─── */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500
                      text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border
                          border-white/20 rounded-full px-4 py-1.5 text-sm
                          font-medium mb-6 animate-fade-in">
                        🚀 {total} jobs available · Updated daily
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight
                         animate-fade-in">
                        Find Your Dream<br />
                        <span className="text-blue-200">Developer Job</span>
                    </h1>
                    <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
                        Connect with top tech companies hiring React, Node.js,
                        Python developers and more.
                    </p>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 max-w-2xl mx-auto mb-8"
                    >
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search jobs, skills, companies..."
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900
                           text-sm font-medium outline-none shadow-lg
                           focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400
                         text-white font-bold rounded-xl shadow-lg
                         transition-colors duration-200 whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>

                    {/* Quick Skill Tags */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {SKILLS.map(skill => (
                            <button
                                key={skill}
                                onClick={() => {
                                    setSearchInput(skill);
                                    setFilters(prev => ({ ...prev, search: skill, page: 1 }));
                                    jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20
                           border border-white/20 rounded-full text-sm
                           font-medium transition-colors duration-200 cursor-pointer"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Stats Bar ─── */}
            {stats && (
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-5xl mx-auto px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Jobs', value: stats.total, icon: '💼', color: 'text-blue-600' },
                                { label: 'Remote', value: stats.remote, icon: '🌐', color: 'text-green-600' },
                                {
                                    label: 'Full Time',
                                    value: stats.byJobType?.find(s => s._id === 'full-time')?.total ?? 0,
                                    icon: '⏰', color: 'text-purple-600'
                                },
                                {
                                    label: 'Internships',
                                    value: stats.byJobType?.find(s => s._id === 'internship')?.total ?? 0,
                                    icon: '🎓', color: 'text-orange-600'
                                },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 p-3
                                        rounded-lg hover:bg-gray-50
                                        transition-colors duration-200">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <div>
                                        <p className={`text-xl font-bold ${stat.color}`}>
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Main Content ─── */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex gap-6">

                    {/* ─── Sidebar Filters ─── */}
                    <div className="hidden lg:block w-56 flex-shrink-0">
                        <div className="card sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">Filters</h3>
                                {hasFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-red-500 hover:text-red-700
                               font-medium transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {FILTERS.map(filter => (
                                <div key={filter.key} className="mb-5">
                                    <p className="text-xs font-semibold text-gray-500
                                uppercase tracking-wider mb-2">
                                        {filter.label}
                                    </p>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => handleFilter(filter.key, '')}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg
                                  text-sm transition-colors duration-150 ${!filters[filter.key]
                                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            All
                                        </button>
                                        {filter.options.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleFilter(filter.key, opt.value)}
                                                className={`w-full text-left px-3 py-1.5 rounded-lg
                                    text-sm transition-colors duration-150 ${filters[filter.key] === opt.value
                                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Job List ─── */}
                    <div className="flex-1 min-w-0" ref={jobListRef}>

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-bold text-gray-900">
                                    {hasFilters ? 'Search Results' : 'Latest Jobs'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {total} job{total !== 1 ? 's' : ''} found
                                    {isFetching && !isLoading && (
                                        <span className="ml-2 text-blue-500">· Refreshing...</span>
                                    )}
                                </p>
                            </div>

                            {/* Active filter tags */}
                            {hasFilters && (
                                <div className="flex flex-wrap gap-1.5">
                                    {filters.search && (
                                        <FilterChip
                                            label={`"${filters.search}"`}
                                            onRemove={() => {
                                                setFilters(p => ({ ...p, search: '', page: 1 }));
                                                setSearchInput('');
                                            }}
                                        />
                                    )}
                                    {filters.jobType && (
                                        <FilterChip
                                            label={filters.jobType}
                                            onRemove={() => handleFilter('jobType', '')}
                                        />
                                    )}
                                    {filters.workMode && (
                                        <FilterChip
                                            label={filters.workMode}
                                            onRemove={() => handleFilter('workMode', '')}
                                        />
                                    )}
                                    {filters.experience && (
                                        <FilterChip
                                            label={filters.experience}
                                            onRemove={() => handleFilter('experience', '')}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {isError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl
                              p-4 mb-4 text-red-700 text-sm">
                                ⚠️ {error?.message}
                            </div>
                        )}

                        {/* Jobs */}
                        {isLoading ? (
                            <div>
                                {[1, 2, 3].map(i => <JobCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <JobList
                                jobs={jobs}
                                isLoading={false}
                                onApply={(job) => {
                                    if (!isLoggedIn) {
                                        alert('Please login to apply!');
                                    }
                                }}
                            />
                        )}

                        {/* Pagination */}
                        {pages > 1 && !isLoading && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm
                             font-medium disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-50 transition-colors"
                                >
                                    ← Prev
                                </button>
                                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium
                                transition-colors ${p === filters.page
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={filters.page === pages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm
                             font-medium disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-50 transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
}

// ─── Filter Chip ───
function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1
                     bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {label}
            <button
                onClick={onRemove}
                className="hover:text-blue-900 font-bold leading-none"
            >
                ×
            </button>
        </span>
    );
}

export default HomePage;