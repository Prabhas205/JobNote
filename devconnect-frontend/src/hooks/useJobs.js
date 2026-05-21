// src/hooks/useJobs.js
// Custom hook — extracts fetch logic from component
// WHY: keeps components clean, logic reusable

import { useState, useEffect, useCallback } from 'react';

function useJobs(filters = {}) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query string from filters object
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
                // only add if value is not empty string
            });

            // Try real API — fall back to fake data if fails
            try {
                const res = await fetch(
                    `http://localhost:3000/api/jobs?${params}`
                );
                const data = await res.json();

                if (data.success) {
                    setJobs(data.data);
                    setTotal(data.total);
                    return;
                }
            } catch {
                // API not running — use fake data for now
                console.warn('API not available — using fake data');
            }

            // Fake data fallback
            const fakeJobs = [
                {
                    _id: '1',
                    title: 'React Developer',
                    company: { name: 'TechCorp India', logo: '' },
                    location: 'Hyderabad',
                    jobType: 'full-time',
                    workMode: 'hybrid',
                    experience: '2-5 years',
                    salary: { min: 600000, max: 1200000, isPublic: true },
                    skills: ['React', 'JavaScript', 'Redux', 'CSS'],
                    isActive: true,
                    views: 142,
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: '2',
                    title: 'Node.js Engineer',
                    company: { name: 'StartupXYZ', logo: '' },
                    location: 'Remote',
                    jobType: 'full-time',
                    workMode: 'remote',
                    experience: '1-2 years',
                    salary: { min: 400000, max: 800000, isPublic: true },
                    skills: ['Node.js', 'Express', 'MongoDB'],
                    isActive: true,
                    views: 89,
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: '3',
                    title: 'Frontend Intern',
                    company: { name: 'DesignHub', logo: '' },
                    location: 'Mumbai',
                    jobType: 'internship',
                    workMode: 'onsite',
                    experience: 'fresher',
                    salary: { min: 0, max: 0, isPublic: false },
                    skills: ['HTML', 'CSS', 'JavaScript'],
                    isActive: true,
                    views: 234,
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: '4',
                    title: 'Full Stack Developer',
                    company: { name: 'Enterprise Corp', logo: '' },
                    location: 'Chennai',
                    jobType: 'contract',
                    workMode: 'hybrid',
                    experience: '5+ years',
                    salary: { min: 1500000, max: 2500000, isPublic: true },
                    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
                    isActive: false,
                    views: 567,
                    createdAt: new Date().toISOString(),
                },
            ];

            // Apply filters to fake data
            let filtered = fakeJobs;

            if (filters.jobType) {
                filtered = filtered.filter(j => j.jobType === filters.jobType);
            }
            if (filters.workMode) {
                filtered = filtered.filter(j => j.workMode === filters.workMode);
            }
            if (filters.search) {
                filtered = filtered.filter(j =>
                    j.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                    j.skills.some(s =>
                        s.toLowerCase().includes(filters.search.toLowerCase())
                    )
                );
            }

            setJobs(filtered);
            setTotal(filtered.length);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [
        filters.jobType,
        filters.workMode,
        filters.search,
    ]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return { jobs, loading, error, total, refetch: fetchJobs };
}

export default useJobs;