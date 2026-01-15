import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Activity, Trophy, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="text-white text-center py-10">Loading dashboard data...</div>;

    const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h2>
                        <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> {stats.newUsersThisMonth} new this month
                        </span>
                    </div>
                    <div className="p-4 bg-blue-500/20 text-blue-500 rounded-xl">
                        <Users size={32} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Total Workouts</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.totalWorkouts}</h2>
                    </div>
                    <div className="p-4 bg-purple-500/20 text-purple-500 rounded-xl">
                        <Activity size={32} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Active Challenges</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.totalChallenges}</h2>
                    </div>
                    <div className="p-4 bg-yellow-500/20 text-yellow-500 rounded-xl">
                        <Trophy size={32} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">User Growth Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.userGrowth}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Activity Distribution</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.activityStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.activityStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
