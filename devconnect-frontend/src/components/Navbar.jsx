import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { selectIsLoggedIn, selectUser, logout } from '../store/slices/authSlice.js';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        setMenuOpen(false);
        navigate('/');
    };

    return (
        <nav style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '0 32px',
            height: '64px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                    🚀 DevConnect
                </h1>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link
                    to="/"
                    style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}
                >
                    Jobs
                </Link>

                {isLoggedIn && user?.role === 'employer' && (
                    <Link
                        to="/post-job"
                        style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}
                    >
                        Post Job
                    </Link>
                )}
            </div>

            {/* Auth Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isLoggedIn ? (
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#2563eb',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                            }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '500' }}>
                                {user?.name?.split(' ')[0]}
                            </span>
                            <span style={{ color: '#9ca3af' }}>▾</span>
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '52px',
                                right: 0,
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                minWidth: '180px',
                                overflow: 'hidden',
                                zIndex: 100,
                            }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderBottom: '1px solid #f3f4f6',
                                    background: '#f9fafb',
                                }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.name}</p>
                                    <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'capitalize' }}>
                                        {user?.role}
                                    </p>
                                </div>

                                {[
                                    { label: '📊 Dashboard', to: '/dashboard' },
                                    { label: '👤 Profile', to: '/profile' },
                                ].map(item => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMenuOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '10px 16px',
                                            textDecoration: 'none',
                                            color: '#374151',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '10px 16px',
                                        background: 'none',
                                        border: 'none',
                                        borderTop: '1px solid #f3f4f6',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        color: '#dc2626',
                                        fontSize: '14px',
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #2563eb',
                                color: '#2563eb',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                padding: '8px 16px',
                                background: '#2563eb',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            Register →
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;