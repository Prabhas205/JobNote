// src/components/forms/LoginForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { loginUser, clearAuthError } from '../../store/slices/authSlice.js';
import {
    selectAuthLoading,
    selectAuthError,
    selectIsLoggedIn,
} from '../../store/slices/authSlice.js';

// ─── Zod Schema ───
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),

    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

function LoginForm({ onSuccess }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    // ─── Form Setup ───
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            onSuccess ? onSuccess() : navigate('/dashboard');
        }
    }, [isLoggedIn]);

    // Clear error on unmount
    useEffect(() => {
        return () => dispatch(clearAuthError());
    }, []);

    // ─── Submit ───
    const onSubmit = async (data) => {
        dispatch(loginUser(data));
        // dispatch thunk → async API call →
        // pending/fulfilled/rejected → state updates →
        // isLoggedIn changes → useEffect above redirects
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
        marginBottom: hasError ? '4px' : '16px',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* API Error */}
            {error && (
                <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    color: '#dc2626',
                    fontSize: '14px',
                }}>
                    ⚠️ {error}
                </div>
            )}

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
            {errors.email && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                    ⚠️ {errors.email.message}
                </p>
            )}

            {/* Password */}
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Password
            </label>
            <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                style={inputStyle(!!errors.password)}
            />
            {errors.password && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                    ⚠️ {errors.password.message}
                </p>
            )}

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
                    marginTop: '8px',
                }}
            >
                {loading ? '⏳ Logging in...' : 'Login →'}
            </button>

        </form>
    );
}

export default LoginForm;