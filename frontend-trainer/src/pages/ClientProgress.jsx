import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, TrendingUp, Calendar, Dumbbell } from 'lucide-react';

const ClientProgress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('trainerToken');
            try {
                const res = await axios.get(`http://localhost:5000/api/trainer/clients/${id}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [id]);

    if (loading) return <div className="text-white text-center py-20">Loading analytics...</div>;
    if (!data) return <div className="text-red-400 text-center py-20">Client not found or authorized.</div>;

    const { clientName, workouts, weightLogs } = data;

    // Simple Sparkline Logic for Weight
    const weightTrend = weightLogs.map(w => w.weight);
    const maxWeight = Math.max(...weightTrend, 100);
    const minWeight = Math.min(...weightTrend, 0);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate('/clients')} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">{clientName}'s Progress</h1>
                    <p className="text-slate-400">Performance analytics and consistency tracking</p>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Weight Chart Card */}
                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">Weight Trend</h2>
                    </div>

                    {weightLogs.length > 1 ? (
                        <div className="h-40 flex items-end gap-2 px-2 border-b border-l border-slate-700 pb-2">
                            {weightLogs.map((log, i) => {
                                const heightPercent = ((log.weight - minWeight) / (maxWeight - minWeight)) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                                        <div
                                            className="w-full bg-cyan-600/50 hover:bg-cyan-400 transition-all rounded-t-sm min-h-[4px]"
                                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                        ></div>
                                        <span className="absolute -top-8 bg-slate-900 text-xs px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {log.weight}kg - {new Date(log.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 py-10 text-center">Not enough weight data recorded.</p>
                    )}
                </div>

                {/* Consistency / Stats */}
                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-purple-400" />
                        <h2 className="text-xl font-bold text-white">Recent consistency</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-white">{workouts.length}</div>
                            <div className="text-xs text-slate-500">Total Workouts (Last 30d)</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-white">{weightLogs.length}</div>
                            <div className="text-xs text-slate-500">Weight Check-ins</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Workouts List */}
            <div className="bg-surface border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Recent Workout Logs</h2>
                </div>
                {workouts.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="p-4 hover:bg-slate-900/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                                        <Dumbbell size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Session on {new Date(workout.date || workout.createdAt).toLocaleDateString()}</div>
                                        <div className="text-sm text-slate-500">{workout.exercises.length} Exercises Completed</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {workout.rating && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${workout.rating === 'Too Easy' ? 'bg-green-900/30 text-green-400' :
                                            workout.rating === 'Too Hard' ? 'bg-red-900/30 text-red-400' :
                                                'bg-blue-900/30 text-blue-400'
                                            }`}>
                                            Rated: {workout.rating}
                                        </span>
                                    )}
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white">{workout.duration || 60} min</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-slate-500">No workout logs found.</div>
                )}
            </div>
        </div>
    );
};

export default ClientProgress;
