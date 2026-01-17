import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Dumbbell, Award, Calculator, Activity } from 'lucide-react';

const Analytics = () => {
    const [volumeData, setVolumeData] = useState([]);
    const [prs, setPrs] = useState([]);

    const [oneRepInput, setOneRepInput] = useState({ weight: '', reps: '' });
    const [estimatedMax, setEstimatedMax] = useState(null);

    const [exercisesList, setExercisesList] = useState(['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row', 'Pull Up']);
    const [selectedExercise, setSelectedExercise] = useState('Bench Press');
    const [customExercise, setCustomExercise] = useState('');
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [newLog, setNewLog] = useState({ weight: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [analyticsRes, prsRes, customRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/tracker/analytics', { headers }),
                    axios.get('http://localhost:5000/api/tracker/prs', { headers }),
                    axios.get('http://localhost:5000/api/tracker/exercises/custom', { headers })
                ]);

                const formattedVolume = analyticsRes.data.volumeData.map(d => ({
                    ...d,
                    date: new Date(d.date).toLocaleDateString()
                }));
                setVolumeData(formattedVolume);
                setPrs(prsRes.data);

                if (customRes.data && customRes.data.length > 0) {
                    setExercisesList(prev => [...prev, ...customRes.data]);
                }
            } catch (error) {
                console.error("Error fetching analytics", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`http://localhost:5000/api/tracker/exercise-history?exercise=${selectedExercise}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formattedHistory = res.data.map(h => ({
                    ...h,
                    date: new Date(h.date).toLocaleDateString()
                }));
                setExerciseHistory(formattedHistory);
            } catch (error) {
                console.error("Error fetching exercise history", error);
            }
        };
        if (selectedExercise) fetchHistory();
    }, [selectedExercise]);

    const calculate1RM = (e) => {
        e.preventDefault();
        const w = parseFloat(oneRepInput.weight);
        const r = parseFloat(oneRepInput.reps);
        if (w && r) {
            const max = w * (1 + r / 30);
            setEstimatedMax(max.toFixed(1));
        }
    };

    const handleAddCustomExercise = async () => {
        if (customExercise && !exercisesList.includes(customExercise)) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/tracker/exercises/custom',
                    { exercise: customExercise },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setExercisesList([...exercisesList, customExercise]);
                setSelectedExercise(customExercise);
                setCustomExercise('');
            } catch (error) {
                console.error("Error saving custom exercise", error);
            }
        }
    };

    const handleLogPR = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/tracker/workouts', {
                date: newLog.date,
                exercises: [{
                    name: selectedExercise,
                    sets: 1,
                    reps: 1,
                    weight: parseFloat(newLog.weight)
                }]
            }, { headers: { Authorization: `Bearer ${token}` } });

            await axios.post('http://localhost:5000/api/tracker/prs', {
                exercise: selectedExercise,
                weight: parseFloat(newLog.weight)
            }, { headers: { Authorization: `Bearer ${token}` } });

            const res = await axios.get(`http://localhost:5000/api/tracker/exercise-history?exercise=${selectedExercise}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formattedHistory = res.data.map(h => ({
                ...h,
                date: new Date(h.date).toLocaleDateString()
            }));
            setExerciseHistory(formattedHistory);
            setNewLog({ ...newLog, weight: '' });
            alert('PR Logged!');

            const prsRes = await axios.get('http://localhost:5000/api/tracker/prs', { headers: { Authorization: `Bearer ${token}` } });
            setPrs(prsRes.data);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <Activity className="text-primary-600" size={32} />
                <span>Analytics Dashboard</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Volume (30 Days)</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {volumeData.reduce((acc, curr) => acc + curr.volume, 0).toLocaleString()} kg
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Personal Records</p>
                            <h3 className="text-2xl font-bold text-slate-800">{prs.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Dumbbell size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Workouts Logged</p>
                            <h3 className="text-2xl font-bold text-slate-800">{volumeData.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                        <Award className="text-green-500" />
                        <span>Exercise Progress Tracker</span>
                    </h3>

                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <select
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 min-w-[200px]"
                        >
                            {exercisesList.map((ex, idx) => <option key={`${ex}-${idx}`} value={ex}>{ex}</option>)}
                        </select>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add Custom..."
                                value={customExercise}
                                onChange={(e) => setCustomExercise(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-primary-500 block w-full p-2.5"
                            />
                            <button
                                onClick={handleAddCustomExercise}
                                className="px-3 py-2 text-xs font-medium text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[300px]">
                        {exerciseHistory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={exerciseHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" name="Max Weight (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400">No data for {selectedExercise} yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-fit">
                        <h4 className="font-bold text-slate-700 mb-3">Log New Record</h4>
                        <form onSubmit={handleLogPR} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={newLog.weight}
                                    onChange={(e) => setNewLog({ ...newLog, weight: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newLog.date}
                                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                <div className="flex items-center justify-center gap-2">
                                    <TrendingUp size={16} /> Update Progress
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Volume Progression</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center space-x-2">
                        <Calculator size={20} />
                        <span>1RM Calculator</span>
                    </h2>
                    <form onSubmit={calculate1RM} className="space-y-4">
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Weight (kg)</label>
                            <input
                                type="number"
                                value={oneRepInput.weight}
                                onChange={(e) => setOneRepInput({ ...oneRepInput, weight: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Reps</label>
                            <input
                                type="number"
                                value={oneRepInput.reps}
                                onChange={(e) => setOneRepInput({ ...oneRepInput, reps: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium shadow-md shadow-primary-500/20 transition-all">
                            Calculate Max
                        </button>
                    </form>

                    {estimatedMax && (
                        <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-center animate-in zoom-in duration-300">
                            <p className="text-primary-600 text-sm font-medium mb-1">Estimated 1RM</p>
                            <p className="text-3xl font-bold text-primary-700">{estimatedMax} kg</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                    <Award className="text-yellow-500" />
                    <span>Personal Records Hall of Fame</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {prs.length > 0 ? (
                        prs.map((pr, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center hover:shadow-md transition-all">
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">{pr.exercise}</p>
                                <p className="text-2xl font-bold text-slate-900">{pr.weight} kg</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(pr.date).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 col-span-full text-center py-4">No personal records set yet. Go lift something heavy!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
