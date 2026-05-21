// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoggedIn, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    // If already logged in → redirect home
    useEffect(() => {
        if (isLoggedIn) navigate('/', { replace: true });
    }, [isLoggedIn]);

    // Clear error on unmount
    useEffect(() => {
        return () => clearError();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                            🚀 DevConnect
                        </h1>
                    </Link>
                    <p style={{ color: '#6b7280', marginTop: '8px' }}>
                        Welcome back! Login to continue
                    </p>
                </div>

                {/* Error */}
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="alice@example.com"
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

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
                        {loading ? '⏳ Logging in...' : 'Login →'}
                    </button>
                </form>

                {/* Register Link */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    fontSize: '14px',
                    color: '#6b7280',
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                        Register here
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;