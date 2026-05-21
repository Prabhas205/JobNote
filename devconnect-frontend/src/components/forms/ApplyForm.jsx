// src/components/forms/ApplyForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import {
    applyToJob,
    selectApplyLoading,
    selectApplyError,
    selectAppliedJobs,
    clearJobError,
} from '../../store/slices/jobSlice.js';

// ─── Zod Schema ───
const applySchema = z.object({
    resumeUrl: z
        .string()
        .min(1, 'Resume URL is required')
        .url('Please enter a valid URL (must start with http/https)'),

    coverLetter: z
        .string()
        .max(1000, 'Cover letter must be under 1000 characters')
        .optional(),
});

function ApplyForm({ jobId, onSuccess }) {
    const dispatch = useAppDispatch();
    const applyLoading = useAppSelector(selectApplyLoading);
    const applyError = useAppSelector(selectApplyError);
    const appliedJobs = useAppSelector(selectAppliedJobs);

    const hasApplied = appliedJobs.includes(jobId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(applySchema),
        defaultValues: { resumeUrl: '', coverLetter: '' },
    });

    const coverLetter = watch('coverLetter', '');
    // ↑ watch for character count

    useEffect(() => {
        return () => dispatch(clearJobError());
    }, []);

    const onSubmit = async (data) => {
        const result = await dispatch(applyToJob({
            jobId,
            resumeUrl: data.resumeUrl,
            coverLetter: data.coverLetter,
        }));

        if (applyToJob.fulfilled.match(result)) {
            // ↑ check if thunk succeeded
            reset();
            onSuccess?.(); // call success callback if provided
        }
    };

    if (hasApplied) {
        return (
            <div style={{
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>✅</p>
                <p style={{ fontWeight: 'bold', color: '#15803d', fontSize: '16px' }}>
                    Application Submitted!
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                    We'll notify you when there's an update.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Error */}
            {applyError && (
                <div style={{
                    background: '#fee2e2', border: '1px solid #fca5a5',
                    borderRadius: '8px', padding: '12px',
                    marginBottom: '16px', color: '#dc2626', fontSize: '14px',
                }}>
                    ⚠️ {applyError}
                </div>
            )}

            {/* Resume URL */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Resume URL *
            </label>
            <input
                {...register('resumeUrl')}
                type="url"
                placeholder="https://drive.google.com/your-resume.pdf"
                style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.resumeUrl ? '#fca5a5' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    marginBottom: errors.resumeUrl ? '4px' : '16px',
                }}
            />
            {errors.resumeUrl && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                    ⚠️ {errors.resumeUrl.message}
                </p>
            )}

            {/* Cover Letter */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Cover Letter
                <span style={{ fontWeight: 'normal', color: '#9ca3af', marginLeft: '6px' }}>
                    (optional)
                </span>
            </label>
            <textarea
                {...register('coverLetter')}
                placeholder="Tell us why you're a great fit for this role..."
                rows={5}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.coverLetter ? '#fca5a5' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    marginBottom: '4px',
                }}
            />
            {/* Character count */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
            }}>
                {errors.coverLetter
                    ? <p style={{ color: '#dc2626', fontSize: '12px' }}>
                        ⚠️ {errors.coverLetter.message}
                    </p>
                    : <span />
                }
                <span style={{
                    fontSize: '12px',
                    color: coverLetter?.length > 900 ? '#dc2626' : '#9ca3af',
                }}>
                    {coverLetter?.length ?? 0}/1000
                </span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={applyLoading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: applyLoading ? '#93c5fd' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: applyLoading ? 'not-allowed' : 'pointer',
                }}
            >
                {applyLoading ? '⏳ Submitting...' : '🚀 Submit Application'}
            </button>

        </form>
    );
}

export default ApplyForm;