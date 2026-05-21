// src/store/slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:3000/api';


// ════════════════════════════════════════
// ASYNC THUNKS
// ════════════════════════════════════════

// ─── FETCH ALL JOBS ───
export const fetchJobs = createAsyncThunk(
    'jobs/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, val]) => {
                if (val) params.append(key, val);
            });

            const res = await fetch(`${BASE_URL}/jobs?${params}`);
            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message);
            return data;

        } catch (error) {
            // Fallback fake data if API not running
            return {
                success: true,
                data: [
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
                ],
                total: 3, pages: 1, page: 1,
            };
        }
    }
);


// ─── FETCH SINGLE JOB ───
export const fetchJobById = createAsyncThunk(
    'jobs/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/jobs/${id}`);
            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.message);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ─── CREATE JOB ───
export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const res = await fetch(`${BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(
                    data.message ?? data.errors?.join(', ') ?? 'Failed to create job'
                );
            }
            return data.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ─── APPLY TO JOB ───
export const applyToJob = createAsyncThunk(
    'jobs/apply',
    async ({ jobId, resumeUrl, coverLetter }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ resumeUrl, coverLetter }),
            });
            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message);
            return data.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ─── FETCH MY APPLICATIONS ───
export const fetchMyApplications = createAsyncThunk(
    'jobs/myApplications',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const res = await fetch(`${BASE_URL}/jobs/my/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message);
            return data.data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ════════════════════════════════════════
// SLICE
// ════════════════════════════════════════
const jobSlice = createSlice({
    name: 'jobs',

    initialState: {
        // Job list
        jobs: [],
        total: 0,
        pages: 1,
        page: 1,
        loading: false,
        error: null,

        // Single job
        selectedJob: null,
        jobLoading: false,
        jobError: null,

        // Filters
        filters: {
            search: '',
            jobType: '',
            workMode: '',
            experience: '',
            sort: 'newest',
        },

        // Applications
        applications: [],
        applicationsLoading: false,

        // Create job
        createLoading: false,
        createError: null,
        createSuccess: false,

        // Apply
        applyLoading: false,
        applyError: null,
        appliedJobs: [],
        // track which job IDs user has applied to
    },

    reducers: {
        // ─── Set Filter ───
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
            state.page = 1;
            // reset to page 1 on filter change
        },

        // ─── Clear Filters ───
        clearFilters: (state) => {
            state.filters = {
                search: '', jobType: '', workMode: '',
                experience: '', sort: 'newest',
            };
            state.page = 1;
        },

        // ─── Set Page ───
        setPage: (state, action) => {
            state.page = action.payload;
        },

        // ─── Clear Job Error ───
        clearJobError: (state) => {
            state.error = null;
            state.createError = null;
            state.applyError = null;
        },

        // ─── Reset Create Status ───
        resetCreateStatus: (state) => {
            state.createSuccess = false;
            state.createError = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ─── Fetch All Jobs ───
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.data;
                state.total = action.payload.total;
                state.pages = action.payload.pages ?? 1;
                state.page = action.payload.page ?? 1;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ─── Fetch Single Job ───
            .addCase(fetchJobById.pending, (state) => {
                state.jobLoading = true;
                state.jobError = null;
                state.selectedJob = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.jobLoading = false;
                state.selectedJob = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.jobLoading = false;
                state.jobError = action.payload;
            })

            // ─── Create Job ───
            .addCase(createJob.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.createSuccess = false;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createSuccess = true;
                state.jobs.unshift(action.payload);
                // ↑ add new job to start of list
            })
            .addCase(createJob.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            // ─── Apply to Job ───
            .addCase(applyToJob.pending, (state) => {
                state.applyLoading = true;
                state.applyError = null;
            })
            .addCase(applyToJob.fulfilled, (state, action) => {
                state.applyLoading = false;
                state.appliedJobs.push(action.payload.jobPost);
                // track applied job ID
            })
            .addCase(applyToJob.rejected, (state, action) => {
                state.applyLoading = false;
                state.applyError = action.payload;
            })

            // ─── My Applications ───
            .addCase(fetchMyApplications.pending, (state) => {
                state.applicationsLoading = true;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.applicationsLoading = false;
                state.applications = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state) => {
                state.applicationsLoading = false;
            });
    },
});

export const {
    setFilter,
    clearFilters,
    setPage,
    clearJobError,
    resetCreateStatus,
} = jobSlice.actions;

// ─── Selectors ───
export const selectJobs = (state) => state.jobs.jobs;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;
export const selectTotal = (state) => state.jobs.total;
export const selectPages = (state) => state.jobs.pages;
export const selectPage = (state) => state.jobs.page;
export const selectFilters = (state) => state.jobs.filters;
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectJobLoading = (state) => state.jobs.jobLoading;
export const selectApplications = (state) => state.jobs.applications;
export const selectAppliedJobs = (state) => state.jobs.appliedJobs;
export const selectCreateLoading = (state) => state.jobs.createLoading;
export const selectCreateSuccess = (state) => state.jobs.createSuccess;
export const selectCreateError = (state) => state.jobs.createError;
export const selectApplyLoading = (state) => state.jobs.applyLoading;
export const selectApplyError = (state) => state.jobs.applyError;

export default jobSlice.reducer;