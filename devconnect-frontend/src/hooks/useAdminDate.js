// src/hooks/useAdminData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks.js';
import { selectToken } from '../store/slices/authSlice.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export function useAdminStats() {
    const token = useAppSelector(selectToken);

    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data.data;
        },
        staleTime: 1000 * 60,
        // refresh every minute
    });
}

export function useGrowthData() {
    const token = useAppSelector(selectToken);

    return useQuery({
        queryKey: ['admin', 'growth'],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/admin/growth`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useAdminUsers(params = {}) {
    const token = useAppSelector(selectToken);

    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: async () => {
            const query = new URLSearchParams(params);
            const res = await fetch(`${BASE_URL}/admin/users?${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
    });
}

export function useAdminJobs(params = {}) {
    const token = useAppSelector(selectToken);

    return useQuery({
        queryKey: ['admin', 'jobs', params],
        queryFn: async () => {
            const query = new URLSearchParams(params);
            const res = await fetch(`${BASE_URL}/admin/jobs?${query}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
    });
}

export function useRecentActivity() {
    const token = useAppSelector(selectToken);

    return useQuery({
        queryKey: ['admin', 'activity'],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/admin/activity`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data.data;
        },
        refetchInterval: 30000,
        // auto refresh every 30 seconds
    });
}

export function useToggleUserStatus() {
    const token = useAppSelector(selectToken);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            const res = await fetch(`${BASE_URL}/admin/users/${userId}/toggle`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}

export function useToggleJobStatus() {
    const token = useAppSelector(selectToken);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId) => {
            const res = await fetch(`${BASE_URL}/admin/jobs/${jobId}/toggle`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}

export function useDeleteJob() {
    const token = useAppSelector(selectToken);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId) => {
            const res = await fetch(`${BASE_URL}/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}