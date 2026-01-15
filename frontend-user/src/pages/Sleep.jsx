import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Moon, Star } from 'lucide-react';

const Sleep = () => {
    const [sleepLogs, setSleepLogs] = useState([]);
    const [duration, setDuration] = useState('');
    const [quality, setQuality] = useState('Good');

    const fetchSleep = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/sleep', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSleepLogs(res.data);
    };

    useEffect(() => {
        fetchSleep();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/sleep',
                { duration, quality },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDuration('');
            fetchSleep();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Sleep Tracker</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-2xl h-fit shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Log Sleep</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Duration (Hours)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Quality</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Good', 'Average', 'Poor'].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => setQuality(q)}
                                        className={`py-2 rounded-lg text-sm transition-colors border ${quality === q ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all">
                            Save Log
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {sleepLogs.map((log) => (
                        <div key={log._id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Moon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{log.duration} Hours</h3>
                                    <p className="text-slate-500 text-sm">{new Date(log.date).toDateString()}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1 rounded-full text-sm font-medium 
                                ${log.quality === 'Good' ? 'bg-green-100 text-green-700' :
                                    log.quality === 'Average' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {log.quality}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sleep;
