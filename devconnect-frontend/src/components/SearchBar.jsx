// src/components/SearchBar.jsx
import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [jobType, setJobType] = useState('');
    const [workMode, setWorkMode] = useState('');

    const handleSearch = () => {
        onSearch({ query, jobType, workMode });
        // pass filters UP to parent
        // parent decides what to do with them
    };

    const handleReset = () => {
        setQuery('');
        setJobType('');
        setWorkMode('');
        onSearch({ query: '', jobType: '', workMode: '' });
    };

    return (
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px',
        }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>
                🔍 Find Your Dream Job
            </h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search jobs, skills, companies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    // ↑ controlled input — value tied to state
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    // search on Enter key press
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />

                {/* Job Type Filter */}
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <option value="">All Job Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>

                {/* Work Mode Filter */}
                <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <option value="">All Modes</option>
                    <option value="remote">🌐 Remote</option>
                    <option value="hybrid">🔀 Hybrid</option>
                    <option value="onsite">🏢 Onsite</option>
                </select>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }}
                >
                    Search
                </button>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default SearchBar;