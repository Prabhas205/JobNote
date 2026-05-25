// src/components/NewJobAlert.jsx
// Banner that appears when new job is posted in real-time

import { useSocket } from '../context/SocketContext.jsx';
import { Link } from 'react-router-dom';

function NewJobAlert() {
    const { newJobAlert, setNewJobAlert } = useSocket();

    if (!newJobAlert) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e40af',
            color: 'white',
            padding: '14px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '420px',
            width: '90%',
            animation: 'slideUp 0.3s ease',
        }}>
            <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>

            {/* Icon */}
            <span style={{ fontSize: '24px', flexShrink: 0 }}>💼</span>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
                    New Job Posted!
                </p>
                <p style={{
                    fontSize: '13px',
                    opacity: 0.85,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {newJobAlert.job?.title} at {newJobAlert.job?.company}
                </p>
            </div>

            {/* View button */}
            <Link
                to={`/jobs/${newJobAlert.job?._id}`}
                onClick={() => setNewJobAlert(null)}
                style={{
                    background: 'white',
                    color: '#1e40af',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                }}
            >
                View →
            </Link>

            {/* Close */}
            <button
                onClick={() => setNewJobAlert(null)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0',
                    flexShrink: 0,
                }}
            >
                ×
            </button>
        </div>
    );
}

export default NewJobAlert;