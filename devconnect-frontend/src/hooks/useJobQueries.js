// src/hooks/useJobQueries.js
// React Query hooks for all job operations
// WHY: keeps query logic in one place — reuse across components

import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { jobService, companyService } from '../services/jobService.js';

// ─── Query Keys — centralized ───
export const jobKeys = {
    all: ['jobs'],
    list: (filters) => ['jobs', 'list', filters],
    detail: (id) => ['jobs', 'detail', id],
    stats: () => ['jobs', 'stats'],
    applications: () => ['jobs', 'my-applications'],
};
// WHY: change key structure once here → updates everywhere


// ════════════════════════════════════════
// QUERIES (Reading Data)
// ════════════════════════════════════════

// ─── Get All Jobs ───
export function useJobs(filters = {}) {
    return useQuery({
        queryKey: jobKeys.list(filters),
        queryFn: () => jobService.getAll(filters),
        staleTime: 1000 * 60 * 2,
        // 2 minutes — jobs list can be slightly stale
        select: (data) => ({
            jobs: data.data,
            total: data.total,
            pages: data.pages,
            page: data.page,
        }),
    });
}


// ─── Get Single Job ───
export function useJob(id) {
    return useQuery({
        queryKey: jobKeys.detail(id),
        queryFn: () => jobService.getById(id),
        enabled: !!id,
        // ↑ don't run if id is undefined/null
        staleTime: 1000 * 60 * 5,
    });
}


// ─── Get Job Stats ───
export function useJobStats() {
    return useQuery({
        queryKey: jobKeys.stats(),
        queryFn: jobService.getStats,
        staleTime: 1000 * 60 * 10,
        // stats can be 10 min stale — not critical
    });
}


// ─── Get My Applications ───
export function useMyApplications(isLoggedIn) {
    return useQuery({
        queryKey: jobKeys.applications(),
        queryFn: jobService.getMyApplications,
        enabled: isLoggedIn,
        // ↑ only fetch if user is logged in
    });
}


// ─── Infinite Scroll Jobs ───
export function useInfiniteJobs(filters = {}) {
    return useInfiniteQuery({
        queryKey: ['jobs', 'infinite', filters],
        queryFn: ({ pageParam = 1 }) =>
            jobService.getAll({ ...filters, page: pageParam, limit: 6 }),

        getNextPageParam: (lastPage) => {
            // ↑ tells React Query what to pass as pageParam next time
            const { page, pages } = lastPage;
            return page < pages ? page + 1 : undefined;
            // undefined = no more pages
        },

        staleTime: 1000 * 60 * 2,
    });
}


// ════════════════════════════════════════
// MUTATIONS (Writing Data)
// ════════════════════════════════════════

// ─── Apply to Job ───
export function useApplyToJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: jobService.apply,

        onSuccess: (data, variables) => {
            // variables = what was passed to mutate()
            // Invalidate job detail — applicant count changes
            queryClient.invalidateQueries({
                queryKey: jobKeys.detail(variables.jobId),
            });
            // Invalidate my applications — new one added
            queryClient.invalidateQueries({
                queryKey: jobKeys.applications(),
            });
        },
    });
}


// ─── Create Job ───
export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: jobService.create,

        onSuccess: () => {
            // Invalidate all job lists — new job should appear
            queryClient.invalidateQueries({
                queryKey: jobKeys.all,
            });
        },
    });
}


// ─── Delete Job ───
export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: jobService.delete,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: jobKeys.all,
            });
        },
    });
}