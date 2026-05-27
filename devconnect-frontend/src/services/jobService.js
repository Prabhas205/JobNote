// src/services/jobService.js
// All API calls in one place — used by React Query

// src/services/jobService.js — use environment variable
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
// ↑ Vite env variables must start with VITE_

// Helper to get token
const getToken = () => {
    try {
        return JSON.parse(localStorage.getItem('devconnect_token'));
    } catch {
        return null;
    }
};



// Helper for authenticated requests
const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});


// ─── JOB SERVICES ───
export const jobService = {

    // Get all jobs with filters
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val) params.append(key, val);
        });
        const res = await fetch(`${BASE_URL}/jobs?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    // Get single job
    getById: async (id) => {
        const res = await fetch(`${BASE_URL}/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    // Get job stats
    getStats: async () => {
        const res = await fetch(`${BASE_URL}/jobs/stats`, {
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    // Create job
    create: async (jobData) => {
        const res = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(jobData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? data.errors?.join(', '));
        return data.data;
    },

    // Apply to job
    apply: async ({ jobId, resumeUrl, coverLetter }) => {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ resumeUrl, coverLetter }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    // Get my applications
    getMyApplications: async () => {
        const res = await fetch(`${BASE_URL}/jobs/my/applications`, {
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    // Delete job
    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};


// ─── AUTH SERVICES ───
export const authService = {

    register: async (userData) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? data.errors?.join(', '));
        return data;
    },

    login: async ({ email, password }) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    getMe: async () => {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },
};


// ─── COMPANY SERVICES ───
export const companyService = {

    getAll: async () => {
        const res = await fetch(`${BASE_URL}/companies`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    getById: async (id) => {
        const res = await fetch(`${BASE_URL}/companies/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },

    create: async (companyData) => {
        const res = await fetch(`${BASE_URL}/companies`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(companyData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.data;
    },
};