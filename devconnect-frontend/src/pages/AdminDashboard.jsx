// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
    LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../store/hooks.js';
import { selectUser } from '../store/slices/authSlice.js';
import {
    useAdminStats,
    useGrowthData,
    useAdminUsers,
    useAdminJobs,
    useRecentActivity,
    useToggleUserStatus,
    useToggleJobStatus,
    useDeleteJob,
} from '../hooks/useAdminData.js';
import Spinner from '../components/Spinner.jsx';

// Chart colors
const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

function AdminDashboard() {
    const user = useAppSelector(selectUser);
    const [activeTab, setActiveTab] = useState('overview');
    const [userSearch, setUserSearch] = useState('');
    const [jobSearch, setJobSearch] = useState('');

    // Redirect non-admins
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const { data: stats, isLoading: statsLoading } = useAdminStats();
    const { data: growth, isLoading: growthLoading } = useGrowthData();
    const { data: usersData, isLoading: usersLoading } = useAdminUsers({ search: userSearch });
    const { data: jobsData, isLoading: jobsLoading } = useAdminJobs({ search: jobSearch });
    const { data: activity, isLoading: activityLoading } = useRecentActivity();

    const toggleUser = useToggleUserStatus();
    const toggleJob = useToggleJobStatus();
    const deleteJob = useDeleteJob();

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'users', label: '👥 Users' },
        { id: 'jobs', label: '💼 Jobs' },
        { id: 'activity', label: '📋 Activity' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ─── Header ─── */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Welcome back, {user?.name}
                        </p>
                    </div>
                    <span className="badge badge-red text-sm px-3 py-1.5">
                        🛡️ Admin
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* ─── Tabs ─── */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl
                        w-fit overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ════════════════════════════════════════ */}
                {/* OVERVIEW TAB */}
                {/* ════════════════════════════════════════ */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">

                        {/* Stats Grid */}
                        {statsLoading ? <Spinner /> : stats && (
                            <>
                                {/* Overview Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Users', value: stats.overview.totalUsers, icon: '👥', color: 'blue', today: stats.today.newUsers },
                                        { label: 'Total Jobs', value: stats.overview.totalJobs, icon: '💼', color: 'green', today: stats.today.newJobs },
                                        { label: 'Applications', value: stats.overview.totalApplications, icon: '📋', color: 'purple', today: stats.today.newApplications },
                                        { label: 'Companies', value: stats.overview.totalCompanies, icon: '🏢', color: 'orange', today: null },
                                    ].map((stat, i) => (
                                        <div key={i} className="card">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-2xl">{stat.icon}</span>
                                                {stat.today !== null && stat.today > 0 && (
                                                    <span className="badge badge-green text-xs">
                                                        +{stat.today} today
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-3xl font-bold text-${stat.color}-600`}>
                                                {stat.value.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Charts Row */}
                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* Users by Role Pie Chart */}
                                    <div className="card">
                                        <h3 className="font-bold text-gray-900 mb-4">
                                            Users by Role
                                        </h3>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <PieChart>
                                                <Pie
                                                    data={stats.breakdown.usersByRole}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    dataKey="count"
                                                    nameKey="_id"
                                                    label={({ _id, count }) => `${_id}: ${count}`}
                                                >
                                                    {stats.breakdown.usersByRole.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Applications by Status Bar Chart */}
                                    <div className="card">
                                        <h3 className="font-bold text-gray-900 mb-4">
                                            Applications by Status
                                        </h3>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={stats.breakdown.applicationsByStatus}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                    {stats.breakdown.applicationsByStatus.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Growth Chart */}
                        {growthLoading ? <Spinner /> : growth && (
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-4">
                                    📈 7-Day Growth
                                </h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={growth}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="New Users"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="jobs"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="New Jobs"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="Applications"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════════════════════════════ */}
                {/* USERS TAB */}
                {/* ════════════════════════════════════════ */}
                {activeTab === 'users' && (
                    <div className="space-y-4">

                        {/* Search */}
                        <div className="card">
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="input"
                            />
                        </div>

                        {/* Users Table */}
                        <div className="card overflow-hidden p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-xs
                                               font-semibold text-gray-500
                                               uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {usersLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        ) : usersData?.data?.map(u => (
                                            <tr key={u._id} className="hover:bg-gray-50
                                                  transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100
                                            flex items-center justify-center
                                            text-blue-600 font-bold text-sm">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {u.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge ${u.role === 'admin' ? 'badge-red' :
                                                            u.role === 'employer' ? 'badge-yellow' :
                                                                'badge-blue'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'
                                                        }`}>
                                                        {u.isActive ? '● Active' : '● Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(
                                                                `${u.isActive ? 'Deactivate' : 'Activate'} ${u.name}?`
                                                            )) {
                                                                toggleUser.mutate(u._id);
                                                            }
                                                        }}
                                                        disabled={toggleUser.isPending}
                                                        className={`text-xs font-semibold px-3 py-1.5
                                        rounded-lg transition-colors ${u.isActive
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {u.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table footer */}
                            {usersData && (
                                <div className="px-4 py-3 border-t border-gray-50
                                bg-gray-50 text-sm text-gray-500">
                                    Showing {usersData.count} of {usersData.total} users
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════ */}
                {/* JOBS TAB */}
                {/* ════════════════════════════════════════ */}
                {activeTab === 'jobs' && (
                    <div className="space-y-4">

                        {/* Search */}
                        <div className="card">
                            <input
                                type="text"
                                placeholder="Search jobs by title..."
                                value={jobSearch}
                                onChange={e => setJobSearch(e.target.value)}
                                className="input"
                            />
                        </div>

                        {/* Jobs Table */}
                        <div className="card overflow-hidden p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            {['Job', 'Company', 'Status', 'Posted', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-xs
                                               font-semibold text-gray-500
                                               uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {jobsLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        ) : jobsData?.data?.map(job => (
                                            <tr key={job._id} className="hover:bg-gray-50
                                                    transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {job.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {job.jobType} · {job.workMode}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {job.company?.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'
                                                        }`}>
                                                        {job.isActive ? '● Active' : '● Closed'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleJob.mutate(job._id)}
                                                            disabled={toggleJob.isPending}
                                                            className={`text-xs font-semibold px-3 py-1.5
                                          rounded-lg transition-colors ${job.isActive
                                                                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                                }`}
                                                        >
                                                            {job.isActive ? 'Close' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(
                                                                    `Delete "${job.title}"? This also deletes all applications.`
                                                                )) {
                                                                    deleteJob.mutate(job._id);
                                                                }
                                                            }}
                                                            disabled={deleteJob.isPending}
                                                            className="text-xs font-semibold px-3 py-1.5
                                         bg-red-50 text-red-600 hover:bg-red-100
                                         rounded-lg transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {jobsData && (
                                <div className="px-4 py-3 border-t border-gray-50
                                bg-gray-50 text-sm text-gray-500">
                                    Showing {jobsData.count} of {jobsData.total} jobs
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════ */}
                {/* ACTIVITY TAB */}
                {/* ════════════════════════════════════════ */}
                {activeTab === 'activity' && (
                    <div className="card">
                        <h3 className="font-bold text-gray-900 mb-4">
                            📋 Recent Activity
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                                Auto-refreshes every 30s
                            </span>
                        </h3>

                        {activityLoading ? (
                            <Spinner />
                        ) : activity?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No activity yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {activity?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-3 rounded-lg
                               hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-full flex items-center
                                    justify-content-center text-lg flex-shrink-0
                                    ${item.color === 'blue' ? 'bg-blue-100' :
                                                item.color === 'green' ? 'bg-green-100' :
                                                    item.color === 'purple' ? 'bg-purple-100' :
                                                        'bg-gray-100'
                                            }`}>
                                            {item.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{item.message}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(item.timestamp).toLocaleString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminDashboard;