// src/components/SearchBar.jsx
import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce.js';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [jobType, setJobType] = useState('');
    const [workMode, setWorkMode] = useState('');

    // Debounce search query — wait 500ms after typing stops
    const debouncedQuery = useDebounce(query, 500);

    // Auto-search when debounced query changes
    useEffect(() => {
        onSearch({ search: debouncedQuery, jobType, workMode });
    }, [debouncedQuery, jobType, workMode]);
    // ↑ no manual Search button needed anymore!

    const handleReset = () => {
        setQuery('');
        setJobType('');
        setWorkMode('');
        // useEffect fires automatically → clears search
    };

    return (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px',
        }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

                {/* Search Input */}
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        fontSize: '16px',
                    }}>
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search jobs, skills..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 38px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                fontSize: '18px',
                                padding: '0',
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Job Type */}
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    style={{
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                        minWidth: '130px',
                    }}
                >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>

                {/* Work Mode */}
                <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    style={{
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer',
                        minWidth: '130px',
                    }}
                >
                    <option value="">All Modes</option>
                    <option value="remote">🌐 Remote</option>
                    <option value="hybrid">🔀 Hybrid</option>
                    <option value="onsite">🏢 Onsite</option>
                </select>

                {/* Reset */}
                {(query || jobType || workMode) && (
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '10px 16px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Clear ×
                    </button>
                )}
            </div>

            {/* Debounce indicator */}
            {query !== debouncedQuery && (
                <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    marginTop: '6px',
                }}>
                    ⏳ Searching...
                </p>
            )}
        </div>
    );
}

export default SearchBar;