import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Weight = () => {
    const [weightLogs, setWeightLogs] = useState([]);
    const [weight, setWeight] = useState('');

    const fetchWeights = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tracker/weight', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setWeightLogs(res.data);
    };

    useEffect(() => {
        fetchWeights();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/tracker/weight',
                { weight },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWeight('');
            fetchWeights();
        } catch (error) {
            console.error(error);
        }
    };

    const chartData = weightLogs.map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        weight: log.weight
    }));

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Body Metrics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Weight Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl h-fit shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Log Weight</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none pr-12"
                                placeholder="0.0"
                                required
                            />
                            <span className="absolute right-4 top-3 text-slate-400">kg</span>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all">
                            Update Weight
                        </button>
                    </form>

                    <div className="mt-8">
                        <h4 className="text-slate-500 text-sm mb-3 font-medium">Recent Logs</h4>
                        <div className="space-y-2">
                            {weightLogs.slice(-5).reverse().map((log) => (
                                <div key={log._id} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                    <span className="text-slate-500">{new Date(log.date).toLocaleDateString()}</span>
                                    <span className="text-slate-800 font-bold">{log.weight} kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weight;
