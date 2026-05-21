// src/components/LoginModal.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function LoginModal({ isOpen, onClose, defaultTab = 'login' }) {

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { login, register, loading, error, clearError } = useAuth();
    const firstInputRef = useRef(null);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Clear error when switching tabs
    useEffect(() => {
        clearError();
        setFormData({ name: '', email: '', password: '', role: 'user' });
    }, [activeTab]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // [name] = computed key — updates whichever field changed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // prevent page refresh

        let result;

        if (activeTab === 'login') {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role,
            );
        }

        if (result.success) {
            onClose(); // close modal on success
        }
        // if failed — error shows automatically from context
    };

    // Input style — reused for all inputs
    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        marginBottom: '12px',
        boxSizing: 'border-box',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 100,
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '400px',
                zIndex: 101,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#6b7280',
                    }}
                >
                    ×
                </button>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>
                        🚀 DevConnect
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                        {activeTab === 'login'
                            ? 'Welcome back!'
                            : 'Create your account'}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    padding: '4px',
                    marginBottom: '24px',
                }}>
                    {['login', 'register'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab ? 'bold' : 'normal',
                                background: activeTab === tab ? 'white' : 'transparent',
                                color: activeTab === tab ? '#2563eb' : '#6b7280',
                                boxShadow: activeTab === tab
                                    ? '0 1px 3px rgba(0,0,0,0.1)'
                                    : 'none',
                                transition: 'all 0.2s',
                                fontSize: '14px',
                                textTransform: 'capitalize',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#dc2626',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name — only for register */}
                    {activeTab === 'register' && (
                        <input
                            ref={firstInputRef}
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    )}

                    {/* Email */}
                    <input
                        ref={activeTab === 'login' ? firstInputRef : null}
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={inputStyle}
                    />

                    {/* Role — only for register */}
                    {activeTab === 'register' && (
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="user">👤 Developer (looking for jobs)</option>
                            <option value="employer">🏢 Employer (posting jobs)</option>
                        </select>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: loading ? '#93c5fd' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '4px',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading
                            ? '⏳ Please wait...'
                            : activeTab === 'login'
                                ? 'Login →'
                                : 'Create Account →'
                        }
                    </button>
                </form>

                {/* Switch Tab Link */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#6b7280',
                }}>
                    {activeTab === 'login'
                        ? "Don't have an account? "
                        : 'Already have an account? '
                    }
                    <span
                        onClick={() => setActiveTab(
                            activeTab === 'login' ? 'register' : 'login'
                        )}
                        style={{
                            color: '#2563eb',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        {activeTab === 'login' ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </>
    );
}

export default LoginModal;