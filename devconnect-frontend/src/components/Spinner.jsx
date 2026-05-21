// src/components/Spinner.jsx
function Spinner({ size = 40, color = '#2563eb' }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px',
        }}>
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                border: `4px solid #e5e7eb`,
                borderTop: `4px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default Spinner;