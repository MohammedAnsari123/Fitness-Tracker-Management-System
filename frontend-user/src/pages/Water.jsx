import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, GlassWater, Droplets } from 'lucide-react';

const Water = () => {
    const [waterLogs, setWaterLogs] = useState([]);
    const [amount, setAmount] = useState('');

    const fetchWater = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tracker/water', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setWaterLogs(res.data);
    };

    useEffect(() => {
        fetchWater();
    }, []);

    const handleAddWater = async (customAmount) => {
        const val = customAmount || amount;
        if (!val) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/tracker/water',
                { amount: val },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAmount('');
            fetchWater();
        } catch (error) {
            console.error(error);
        }
    };

    const totalWaterToday = waterLogs
        .filter(log => new Date(log.date).toDateString() === new Date().toDateString())
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Hydration Tracker</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-center shadow-inner">
                        <Droplets size={48} className="mx-auto text-blue-500 mb-4" />
                        <h2 className="text-4xl font-bold text-slate-800 mb-2">{totalWaterToday} <span className="text-xl text-slate-500">ml</span></h2>
                        <p className="text-blue-600 font-medium">Consumed Today</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleAddWater(250)} className="bg-white hover:bg-blue-50 p-4 rounded-xl flex flex-col items-center border border-slate-200 transition-all shadow-sm">
                            <GlassWater className="text-blue-500 mb-2" />
                            <span className="text-slate-700 font-medium">+ 250ml</span>
                        </button>
                        <button onClick={() => handleAddWater(500)} className="bg-white hover:bg-blue-50 p-4 rounded-xl flex flex-col items-center border border-slate-200 transition-all shadow-sm">
                            <GlassWater className="text-blue-500 mb-2" size={28} />
                            <span className="text-slate-700 font-medium">+ 500ml</span>
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Custom Amount (ml)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button onClick={() => handleAddWater()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium shadow-sm">
                            Add
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Logs</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {waterLogs.map((log) => (
                            <div key={log._id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-slate-500 text-sm">{new Date(log.date).toLocaleString()}</span>
                                <span className="text-blue-600 font-bold">{log.amount} ml</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Water;
