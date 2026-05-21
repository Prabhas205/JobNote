// src/context/JobContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const JobContext = createContext();

// ─── Initial State ───
const initialState = {
    jobs: [],
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    page: 1,
    filters: {
        search: '',
        jobType: '',
        workMode: '',
        experience: '',
        sort: 'newest',
    },
};

// ─── Reducer ───
const jobReducer = (state, action) => {
    switch (action.type) {

        case 'FETCH_START':
            return { ...state, loading: true, error: null };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                jobs: action.payload.jobs,
                total: action.payload.total,
                pages: action.payload.pages,
                page: action.payload.page,
            };

        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
                jobs: [],
            };

        case 'SET_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.payload.key]: action.payload.value,
                },
                page: 1,
                // reset to page 1 when filter changes
            };

        case 'SET_PAGE':
            return { ...state, page: action.payload };

        case 'CLEAR_FILTERS':
            return { ...state, filters: initialState.filters, page: 1 };

        default:
            return state;
    }
};


// ─── Provider ───
export function JobProvider({ children }) {

    const [state, dispatch] = useReducer(jobReducer, initialState);

    // Fetch jobs whenever filters or page changes
    useEffect(() => {
        fetchJobs();
    }, [state.filters, state.page]);


    // ─── FETCH JOBS ───
    const fetchJobs = async () => {
        dispatch({ type: 'FETCH_START' });

        try {
            // Build query params
            const params = new URLSearchParams();
            Object.entries(state.filters).forEach(([key, val]) => {
                if (val) params.append(key, val);
            });
            params.append('page', state.page);
            params.append('limit', 6);

            const res = await fetch(
                `http://localhost:3000/api/jobs?${params}`
            );
            const data = await res.json();

            if (data.success) {
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: {
                        jobs: data.data,
                        total: data.total,
                        pages: data.pages,
                        page: data.page,
                    },
                });
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            // Fallback fake data if API not running
            console.warn('API offline — using fake data');
            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    jobs: getFakeJobs(state.filters),
                    total: 4,
                    pages: 1,
                    page: 1,
                },
            });
        }
    };


    // ─── SET FILTER ───
    const setFilter = (key, value) => {
        dispatch({ type: 'SET_FILTER', payload: { key, value } });
    };


    // ─── CLEAR FILTERS ───
    const clearFilters = () => {
        dispatch({ type: 'CLEAR_FILTERS' });
    };


    // ─── SET PAGE ───
    const setPage = (page) => {
        dispatch({ type: 'SET_PAGE', payload: page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const value = {
        // State
        jobs: state.jobs,
        loading: state.loading,
        error: state.error,
        total: state.total,
        pages: state.pages,
        page: state.page,
        filters: state.filters,
        // Actions
        setFilter,
        clearFilters,
        setPage,
        fetchJobs,
    };

    return (
        <JobContext.Provider value={value}>
            {children}
        </JobContext.Provider>
    );
}


// ─── Custom Hook ───
export function useJobs() {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobs must be used inside JobProvider');
    }
    return context;
}


// ─── Fake data helper ───
function getFakeJobs(filters) {
    const allJobs = [
        {
            _id: '1', title: 'React Developer',
            company: { name: 'TechCorp', logo: '' },
            location: 'Hyderabad', jobType: 'full-time',
            workMode: 'hybrid', experience: '2-5 years',
            salary: { min: 600000, max: 1200000, isPublic: true },
            skills: ['React', 'JavaScript', 'Redux'],
            isActive: true, views: 142,
        },
        {
            _id: '2', title: 'Node.js Engineer',
            company: { name: 'StartupXYZ', logo: '' },
            location: 'Remote', jobType: 'full-time',
            workMode: 'remote', experience: '1-2 years',
            salary: { min: 400000, max: 800000, isPublic: true },
            skills: ['Node.js', 'Express', 'MongoDB'],
            isActive: true, views: 89,
        },
        {
            _id: '3', title: 'Frontend Intern',
            company: { name: 'DesignHub', logo: '' },
            location: 'Mumbai', jobType: 'internship',
            workMode: 'onsite', experience: 'fresher',
            salary: { min: 0, max: 0, isPublic: false },
            skills: ['HTML', 'CSS', 'JavaScript'],
            isActive: true, views: 234,
        },
        {
            _id: '4', title: 'Full Stack Developer',
            company: { name: 'Enterprise Corp', logo: '' },
            location: 'Chennai', jobType: 'contract',
            workMode: 'hybrid', experience: '5+ years',
            salary: { min: 1500000, max: 2500000, isPublic: true },
            skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
            isActive: false, views: 567,
        },
    ];

    let filtered = allJobs;
    if (filters.jobType)
        filtered = filtered.filter(j => j.jobType === filters.jobType);
    if (filters.workMode)
        filtered = filtered.filter(j => j.workMode === filters.workMode);
    if (filters.search)
        filtered = filtered.filter(j =>
            j.title.toLowerCase().includes(filters.search.toLowerCase())
        );
    return filtered;
}

export default JobContext;