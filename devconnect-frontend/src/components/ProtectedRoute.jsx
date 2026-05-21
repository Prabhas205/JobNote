// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isLoggedIn, user, loading } = useAuth();

    // Still checking auth state — show spinner
    if (loading) return <Spinner />;

    // Not logged in → redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
        // replace: true → replaces current history entry
        // back button won't go back to protected page
    }

    // Role check — if allowedRoles specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
        // redirect home if wrong role
    }

    // All checks passed → render children
    return children;
}

export default ProtectedRoute;