import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, Users, CreditCard, Download, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Finance = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/finance/stats', config);
            setStats(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handlePayoutRequest = async () => {
        if (!stats || stats.pendingPayout <= 0) return alert("No funds to withdraw.");
        if (!window.confirm(`Request payout of $${stats.pendingPayout}?`)) return;

        setRequesting(true);
        try {
            await axios.post('http://localhost:5000/api/finance/payout', { amount: stats.pendingPayout }, config);
            alert('Payout requested successfully!');
            fetchStats();
        } catch (error) {
            console.error(error);
            alert('Failed to request payout');
        } finally {
            setRequesting(false);
        }
    };

    const chartData = [
        { name: 'Jan', income: 1200 },
        { name: 'Feb', income: 1900 },
        { name: 'Mar', income: 1500 },
        { name: 'Apr', income: 2100 },
        { name: 'May', income: 2800 },
        { name: 'Jun', income: stats?.totalEarnings || 3200 },
    ];

    if (loading) return <div>Loading finances...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Earnings & Payouts</h1>
                    <p className="text-slate-400 mt-1">Manage your revenue stream.</p>
                </div>
                <button
                    onClick={handlePayoutRequest}
                    disabled={stats?.pendingPayout <= 0 || requesting}
                    className="bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-500 transition-colors shadow-lg shadow-green-500/20"
                >
                    <CreditCard size={20} />
                    {requesting ? 'Processing...' : 'Withdraw Funds'}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} className="text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-900/30 text-green-400 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-slate-400 font-medium">Total Earnings</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">${stats?.totalEarnings}</h3>
                    <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                        <ArrowUpRight size={14} /> +12% from last month
                    </p>
                </div>

                <div className="bg-surface border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={100} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-slate-400 font-medium">Pending Payout</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">${stats?.pendingPayout}</h3>
                    <p className="text-sm text-slate-500 mt-2">Available for withdrawal</p>
                </div>

                <div className="bg-surface border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={100} className="text-purple-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-900/30 text-purple-400 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-slate-400 font-medium">Active Subscribers</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{stats?.activeSubscribers}</h3>
                    <p className="text-sm text-purple-400 mt-2">Paying clients</p>
                </div>
            </div>

            <div className="bg-surface border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" size={20} />
                    Revenue Overview
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                itemStyle={{ color: '#22d3ee' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Client Payments</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-sm border-b border-slate-800">
                                    <th className="pb-3 pl-2">Client</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {stats?.recentTransactions?.length > 0 ? (
                                    stats.recentTransactions.map(tx => (
                                        <tr key={tx._id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3 pl-2 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                                                    {tx.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                {tx.user?.name || 'Unknown'}
                                            </td>
                                            <td className="py-3 text-sm text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="py-3 font-medium text-white">${tx.amount}</td>
                                            <td className="py-3">
                                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Paid
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-slate-500 italic">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-surface border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Payout History</h3>
                    <div className="space-y-4">
                        {stats?.payoutHistory?.length > 0 ? (
                            stats.payoutHistory.map(payout => (
                                <div key={payout._id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <div>
                                        <p className="font-bold text-white">${payout.amount}</p>
                                        <p className="text-xs text-slate-500">{new Date(payout.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${payout.status === 'Processed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            payout.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {payout.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic text-center py-4">No payouts request yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;
