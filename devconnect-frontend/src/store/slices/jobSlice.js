// src/store/slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';


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

            const response = await api.get(`/jobs?${params}`);
            return response.data;

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
            const response = await api.get(`/jobs/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.response?.data || error.message
            );
        }
    }
);


// ─── CREATE JOB ───
export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, thunkAPI) => {
        try {
            // Token is automatically attached by our api interceptor!
            const response = await api.post('/jobs', jobData);
            return response.data.data;

        } catch (error) {
            const data = error.response?.data;
            const message = data?.message || (data?.errors ? data.errors.join(', ') : 'Failed to create job');
            
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// ─── APPLY TO JOB ───
export const applyToJob = createAsyncThunk(
    'jobs/apply',
    async ({ jobId, resumeUrl, coverLetter }, { getState, rejectWithValue }) => {
        try {
            const response = await api.post(`/jobs/${jobId}/apply`, { resumeUrl, coverLetter });
            return response.data.data;

        } catch (error) {
            const data = error.response?.data;
            const message = data?.message || (data?.errors ? data.errors.join(', ') : 'Failed to apply to job');

            return rejectWithValue(message);
        }
    }
);


// ─── FETCH MY APPLICATIONS ───
export const fetchMyApplications = createAsyncThunk(
    'jobs/myApplications',
    async (_, { getState, rejectWithValue }) => {
        try {
            const response = await api.get('/jobs/my/applications');
            return response.data.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.response?.data || error.message
            );
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