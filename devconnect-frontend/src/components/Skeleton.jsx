// src/components/Skeleton.jsx
// Loading skeleton — better UX than spinners for content

function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) {
    return (
        <div style={{
            width,
            height,
            borderRadius,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            ...style,
        }}>
            <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
        </div>
    );
}

// ─── Job Card Skeleton ───
export function JobCardSkeleton() {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
            {/* Title */}
            <Skeleton height="24px" width="60%" style={{ marginBottom: '12px' }} />

            {/* Company */}
            <Skeleton height="16px" width="40%" style={{ marginBottom: '16px' }} />

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Skeleton height="28px" width="80px" borderRadius="6px" />
                <Skeleton height="28px" width="70px" borderRadius="6px" />
                <Skeleton height="28px" width="90px" borderRadius="6px" />
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                {[80, 70, 90, 75].map((w, i) => (
                    <Skeleton key={i} height="24px" width={`${w}px`} borderRadius="4px" />
                ))}
            </div>

            {/* Footer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '12px',
            }}>
                <Skeleton height="20px" width="150px" />
                <Skeleton height="40px" width="120px" borderRadius="8px" />
            </div>
        </div>
    );
}

// ─── Stats Card Skeleton ───
export function StatCardSkeleton() {
    return (
        <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
            <Skeleton height="32px" width="32px" style={{ margin: '0 auto 8px', borderRadius: '50%' }} />
            <Skeleton height="28px" width="60px" style={{ margin: '0 auto 8px' }} />
            <Skeleton height="14px" width="80px" style={{ margin: '0 auto' }} />
        </div>
    );
}

export default Skeleton;