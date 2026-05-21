// src/components/JobStats.jsx
import { useState, useEffect } from 'react';

function JobStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/jobs/stats');
                const data = await res.json();

                if (data.success) {
                    setStats(data.data);
                }
            } catch {
                // fallback fake stats
                setStats({
                    total: 24,
                    remote: 8,
                    byJobType: [
                        { _id: 'full-time', total: 15 },
                        { _id: 'internship', total: 6 },
                        { _id: 'contract', total: 3 },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // fetch once on mount

    if (loading) return null;
    if (!stats) return null;

    const statCards = [
        { label: 'Total Jobs', value: stats.total, icon: '💼', color: '#2563eb' },
        { label: 'Remote Jobs', value: stats.remote, icon: '🌐', color: '#059669' },
        {
            label: 'Full Time',
            value: stats.byJobType?.find(s => s._id === 'full-time')?.total ?? 0,
            icon: '⏰', color: '#7c3aed'
        },
        {
            label: 'Internships',
            value: stats.byJobType?.find(s => s._id === 'internship')?.total ?? 0,
            icon: '🎓', color: '#ea580c'
        },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
        }}>
            {statCards.map((stat, index) => (
                <div key={index} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderTop: `4px solid ${stat.color}`,
                }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                        {stat.icon}
                    </div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: stat.color,
                    }}>
                        {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default JobStats;