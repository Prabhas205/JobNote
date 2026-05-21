// src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { register, isLoggedIn, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate('/', { replace: true });
    }, [isLoggedIn]);

    useEffect(() => {
        return () => clearError();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = formData;
        const result = await register(name, email, password, role);
        if (result.success) navigate('/dashboard');
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '16px',
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
                        Create your account today
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

                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Alice Johnson"
                        required
                        autoFocus
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alice@example.com"
                        required
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                        I am a...
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="user">👤 Developer — looking for jobs</option>
                        <option value="employer">🏢 Employer — posting jobs</option>
                    </select>

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
                        {loading ? '⏳ Creating account...' : 'Create Account →'}
                    </button>

                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default RegisterPage;