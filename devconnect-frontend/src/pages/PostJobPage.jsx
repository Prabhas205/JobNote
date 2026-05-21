// src/pages/PostJobPage.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import {
    createJob,
    resetCreateStatus,
    selectCreateLoading,
    selectCreateError,
    selectCreateSuccess,
} from '../store/slices/jobSlice.js';

// ─── Zod Schema ───
const postJobSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long'),

    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000, 'Description too long'),

    requirements: z
        .string()
        .max(2000, 'Requirements too long')
        .optional(),

    skills: z
        .string()
        .min(1, 'At least one skill is required'),
    // ↑ comma-separated string → split in onSubmit

    salaryMin: z
        .number({ invalid_type_error: 'Salary must be a number' })
        .min(0, 'Salary cannot be negative'),

    salaryMax: z
        .number({ invalid_type_error: 'Salary must be a number' })
        .min(0, 'Salary cannot be negative'),

    jobType: z.enum(
        ['full-time', 'part-time', 'contract', 'internship'],
        { errorMap: () => ({ message: 'Select a job type' }) }
    ),

    workMode: z.enum(
        ['onsite', 'remote', 'hybrid'],
        { errorMap: () => ({ message: 'Select work mode' }) }
    ),

    experience: z.enum(
        ['fresher', '1-2 years', '2-5 years', '5+ years'],
        { errorMap: () => ({ message: 'Select experience level' }) }
    ),

    location: z
        .string()
        .min(2, 'Location is required'),

    company: z
        .string()
        .min(1, 'Company ID is required'),
});

function PostJobPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const createLoading = useAppSelector(selectCreateLoading);
    const createError = useAppSelector(selectCreateError);
    const createSuccess = useAppSelector(selectCreateSuccess);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(postJobSchema),
        defaultValues: {
            title: '', description: '', requirements: '',
            skills: '', salaryMin: 0, salaryMax: 0,
            jobType: 'full-time', workMode: 'onsite',
            experience: 'fresher', location: '', company: '',
        },
    });

    const description = watch('description', '');

    // Redirect after success
    useEffect(() => {
        if (createSuccess) {
            setTimeout(() => {
                dispatch(resetCreateStatus());
                navigate('/');
            }, 2000);
        }
    }, [createSuccess]);

    const onSubmit = (data) => {
        const jobData = {
            ...data,
            skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
            // "React, Node.js, MongoDB" → ["React", "Node.js", "MongoDB"]
            salary: {
                min: data.salaryMin,
                max: data.salaryMax,
                isPublic: true,
            },
        };
        delete jobData.salaryMin;
        delete jobData.salaryMax;
        dispatch(createJob(jobData));
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '12px',
        border: `1px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: hasError ? '4px' : '16px',
        background: hasError ? '#fff5f5' : 'white',
    });

    const fieldError = (error) => error && (
        <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
            ⚠️ {error.message}
        </p>
    );

    const labelStyle = {
        display: 'block', marginBottom: '6px',
        fontWeight: '600', fontSize: '14px',
    };

    if (createSuccess) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f9fafb',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</p>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Job Posted Successfully!
                    </h2>
                    <p style={{ color: '#6b7280' }}>Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>

                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                    📢 Post a Job
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                    Fill in the details below to post your job listing
                </p>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>

                    {/* API Error */}
                    {createError && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid #fca5a5',
                            borderRadius: '8px', padding: '12px',
                            marginBottom: '24px', color: '#dc2626', fontSize: '14px',
                        }}>
                            ⚠️ {createError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Company ID */}
                        <label style={labelStyle}>Company ID</label>
                        <input
                            {...register('company')}
                            placeholder="Paste your company MongoDB _id here"
                            style={inputStyle(!!errors.company)}
                        />
                        {fieldError(errors.company)}

                        {/* Title */}
                        <label style={labelStyle}>Job Title</label>
                        <input
                            {...register('title')}
                            placeholder="e.g. Senior React Developer"
                            style={inputStyle(!!errors.title)}
                        />
                        {fieldError(errors.title)}

                        {/* Description */}
                        <label style={labelStyle}>
                            Job Description
                            <span style={{ fontWeight: 'normal', color: '#9ca3af', marginLeft: '6px', fontSize: '12px' }}>
                                {description.length}/5000
                            </span>
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Describe the role, responsibilities, team..."
                            rows={6}
                            style={{ ...inputStyle(!!errors.description), resize: 'vertical' }}
                        />
                        {fieldError(errors.description)}

                        {/* Requirements */}
                        <label style={labelStyle}>
                            Requirements
                            <span style={{ fontWeight: 'normal', color: '#9ca3af', marginLeft: '6px' }}>
                                (optional)
                            </span>
                        </label>
                        <textarea
                            {...register('requirements')}
                            placeholder="Required qualifications, experience..."
                            rows={4}
                            style={{ ...inputStyle(!!errors.requirements), resize: 'vertical' }}
                        />
                        {fieldError(errors.requirements)}

                        {/* Skills */}
                        <label style={labelStyle}>Skills Required</label>
                        <input
                            {...register('skills')}
                            placeholder="React, Node.js, MongoDB (comma separated)"
                            style={inputStyle(!!errors.skills)}
                        />
                        {fieldError(errors.skills)}

                        {/* Salary Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Min Salary (₹/year)</label>
                                <input
                                    {...register('salaryMin', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="600000"
                                    style={inputStyle(!!errors.salaryMin)}
                                />
                                {fieldError(errors.salaryMin)}
                            </div>
                            <div>
                                <label style={labelStyle}>Max Salary (₹/year)</label>
                                <input
                                    {...register('salaryMax', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="1200000"
                                    style={inputStyle(!!errors.salaryMax)}
                                />
                                {fieldError(errors.salaryMax)}
                            </div>
                        </div>

                        {/* Job Type + Work Mode + Experience */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Job Type</label>
                                <select {...register('jobType')} style={{ ...inputStyle(false), cursor: 'pointer' }}>
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Work Mode</label>
                                <select {...register('workMode')} style={{ ...inputStyle(false), cursor: 'pointer' }}>
                                    <option value="onsite">Onsite</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Experience</label>
                                <select {...register('experience')} style={{ ...inputStyle(false), cursor: 'pointer' }}>
                                    <option value="fresher">Fresher</option>
                                    <option value="1-2 years">1-2 years</option>
                                    <option value="2-5 years">2-5 years</option>
                                    <option value="5+ years">5+ years</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <label style={labelStyle}>Location</label>
                        <input
                            {...register('location')}
                            placeholder="Hyderabad / Remote / Bangalore"
                            style={inputStyle(!!errors.location)}
                        />
                        {fieldError(errors.location)}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={createLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: createLoading ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: createLoading ? 'not-allowed' : 'pointer',
                                marginTop: '8px',
                            }}
                        >
                            {createLoading ? '⏳ Posting...' : '📢 Post Job'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default PostJobPage;