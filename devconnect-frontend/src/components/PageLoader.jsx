// src/components/PageLoader.jsx
// Shows while lazy-loaded pages are downloading

function PageLoader() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            gap: '16px',
        }}>
            {/* Animated logo */}
            <div style={{
                fontSize: '48px',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}>
                🚀
            </div>

            {/* Spinner */}
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />

            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Loading DevConnect...
            </p>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
        </div>
    );
}

export default PageLoader;