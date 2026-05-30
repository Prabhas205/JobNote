// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { logout, selectUser, selectIsLoggedIn } from '../store/slices/authSlice.js';
import NotificationBell from './NotificationBell.jsx';
import ConnectionStatus from './ConnectionStatus.jsx';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    const handleLogout = () => {
        dispatch(logout());
        setMenuOpen(false);
        navigate('/');
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`;

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">DC</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            DevConnect
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/" className={navLinkClass}>Jobs</NavLink>
                        <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
                        {isLoggedIn && user?.role === 'employer' && (
                            <NavLink to="/post-job" className={navLinkClass}>Post Job</NavLink>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <ConnectionStatus />
                                <NotificationBell />

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100
                               rounded-lg px-3 py-2 transition-colors duration-200"
                                    >
                                        {/* Avatar */}
                                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center
                                    justify-content-center text-white text-xs font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown */}
                                    {menuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 top-12 w-52 bg-white rounded-xl
                                      shadow-lg border border-gray-100 z-50 overflow-hidden
                                      animate-fade-in">
                                                {/* User info */}
                                                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {user?.role}
                                                    </p>
                                                </div>

                                                {/* Menu items */}
                                                {[
                                                    { label: '📊 Dashboard', to: '/dashboard' },
                                                    { label: '👤 Profile', to: '/profile' },
                                                    { label: '⚙️ Settings', to: '/settings' },
                                                ].map(item => (
                                                    <Link
                                                        key={item.to}
                                                        to={item.to}
                                                        onClick={() => setMenuOpen(false)}
                                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700
                                       hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}

                                                {user?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setMenuOpen(false)}
                                                        className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                    >
                                                        🛡️ Admin Dashboard
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600
                                     hover:bg-red-50 border-t border-gray-50
                                     transition-colors duration-150"
                                                >
                                                    🚪 Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary hidden sm:block">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started →
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;