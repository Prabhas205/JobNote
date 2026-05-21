// src/components/forms/RegisterForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import {
    registerUser,
    clearAuthError,
    selectAuthLoading,
    selectAuthError,
    selectIsLoggedIn,
} from '../../store/slices/authSlice.js';

// ─── Zod Schema ───
const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name too long'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password too long'),

    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),

    role: z.enum(['user', 'employer'], {
        errorMap: () => ({ message: 'Please select a role' }),
    }),
})
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
            // ↑ attach error to confirmPassword field
        }
    );

function RegisterForm({ onSuccess }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '', email: '', password: '',
            confirmPassword: '', role: 'user',
        },
    });

    const selectedRole = watch('role');
    // ↑ watch field in real time — updates UI when changed

    useEffect(() => {
        if (isLoggedIn) {
            onSuccess ? onSuccess() : navigate('/dashboard');
        }
    }, [isLoggedIn]);

    useEffect(() => {
        return () => dispatch(clearAuthError());
    }, []);

    const onSubmit = (data) => {
        const { confirmPassword, ...submitData } = data;
        // ↑ remove confirmPassword — backend doesn't need it
        dispatch(registerUser(submitData));
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '12px',
        border: `1px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        background: hasError ? '#fff5f5' : 'white',
        boxSizing: 'border-box',
        marginBottom: hasError ? '4px' : '14px',
    });

    const errorText = (message) => (
        <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px' }}>
            ⚠️ {message}
        </p>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* API Error */}
            {error && (
                <div style={{
                    background: '#fee2e2', border: '1px solid #fca5a5',
                    borderRadius: '8px', padding: '12px',
                    marginBottom: '16px', color: '#dc2626', fontSize: '14px',
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Name */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Full Name
            </label>
            <input
                {...register('name')}
                type="text"
                placeholder="Alice Johnson"
                style={inputStyle(!!errors.name)}
            />
            {errors.name && errorText(errors.name.message)}

            {/* Email */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Email
            </label>
            <input
                {...register('email')}
                type="email"
                placeholder="alice@example.com"
                style={inputStyle(!!errors.email)}
            />
            {errors.email && errorText(errors.email.message)}

            {/* Password */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Password
            </label>
            <input
                {...register('password')}
                type="password"
                placeholder="Min 6 characters"
                style={inputStyle(!!errors.password)}
            />
            {errors.password && errorText(errors.password.message)}

            {/* Confirm Password */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Confirm Password
            </label>
            <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                style={inputStyle(!!errors.confirmPassword)}
            />
            {errors.confirmPassword && errorText(errors.confirmPassword.message)}

            {/* Role Selection */}
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
                I am a...
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {[
                    { value: 'user', label: '👤 Developer', desc: 'Looking for jobs' },
                    { value: 'employer', label: '🏢 Employer', desc: 'Posting jobs' },
                ].map(option => (
                    <label
                        key={option.value}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '14px',
                            border: `2px solid ${selectedRole === option.value ? '#2563eb' : '#e5e7eb'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: selectedRole === option.value ? '#eff6ff' : 'white',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                        }}
                    >
                        <input
                            {...register('role')}
                            type="radio"
                            value={option.value}
                            style={{ display: 'none' }}
                        // hide radio — use label as clickable card
                        />
                        <span style={{ fontSize: '20px', marginBottom: '4px' }}>
                            {option.label}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>
                            {option.desc}
                        </span>
                    </label>
                ))}
            </div>
            {errors.role && errorText(errors.role.message)}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? '#93c5fd' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>

        </form>
    );
}

export default RegisterForm;