// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            textAlign: 'center',
            padding: '24px',
        }}>
            <p style={{ fontSize: '80px', marginBottom: '16px' }}>🔍</p>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                404
            </h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#374151' }}>
                Page not found
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px', maxWidth: '400px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                }}
            >
                ← Back to Home
            </Link>
        </div>
    );
}

export default NotFoundPage;