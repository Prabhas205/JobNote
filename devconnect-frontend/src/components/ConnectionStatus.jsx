// src/components/ConnectionStatus.jsx
// Small indicator showing real-time connection status

import { useSocket } from '../context/SocketContext.jsx';

function ConnectionStatus() {
    const { isConnected } = useSocket();

    return (
        <div
            title={isConnected ? 'Real-time connected' : 'Real-time disconnected'}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                color: isConnected ? '#15803d' : '#9ca3af',
            }}
        >
            <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isConnected ? '#22c55e' : '#d1d5db',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
            }} />
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
            {isConnected ? 'Live' : 'Offline'}
        </div>
    );
}

export default ConnectionStatus;