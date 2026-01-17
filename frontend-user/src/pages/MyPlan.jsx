import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Dumbbell, Utensils, Coffee } from 'lucide-react';

const MyPlan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [rating, setRating] = useState('Good');
    const [isLogging, setIsLogging] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/users/plans', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleLogClick = (day) => {
        setSelectedDay(day);
        setRating('Good');
    };

    const submitLog = async () => {
        if (!selectedDay) return;
        setIsLogging(true);
        const token = localStorage.getItem('token');
        try {
            const workoutData = {
                exercises: selectedDay.exercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight || 0
                })),
                duration: 60,
                rating: rating
            };

            const res = await axios.post('http://localhost:5000/api/tracker/workout', workoutData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data.message || 'Workout logged!');
            setSelectedDay(null);
        } catch (error) {
            console.error(error);
            alert('Failed to log workout');
        } finally {
            setIsLogging(false);
        }
    };

    if (loading) return <div className="text-white">Loading plans...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">My Assigned Plans</h1>
                <p className="text-slate-500">Custom plans assigned by your trainer</p>
            </header>

            <div className="grid gap-6">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <div key={plan._id} className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-primary-200 hover:shadow-md transition-all shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                        <span className="text-sm text-slate-500">Trainer: {plan.trainer?.name || 'Unknown'}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                                <p className="font-semibold mb-2">Program Goal:</p>
                                {plan.description}
                            </div>

                            <div className="mt-6 space-y-4">
                                <h4 className="font-bold text-slate-800">Weekly Schedule</h4>
                                {plan.weeks && plan.weeks.map((week, wIndex) => (
                                    <div key={wIndex} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700">
                                            Week {week.weekNumber}
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {week.days.map((day, dIndex) => (
                                                <div key={dIndex} className={`p-4 ${day.isRestDay ? 'bg-purple-50' : 'bg-white'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-800">{day.day}</span>
                                                        {day.isRestDay ? (
                                                            <span className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                                                                <Coffee size={16} /> Rest Day
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleLogClick(day)}
                                                                className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold hover:bg-emerald-200 transition-colors"
                                                            >
                                                                Log & Adapt
                                                            </button>
                                                        )}
                                                    </div>

                                                    {day.isRestDay ? (
                                                        <p className="text-sm text-slate-500 italic">Take a break and recover today.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {day.exercises && day.exercises.length > 0 ? (
                                                                day.exercises.map((exc, eIndex) => (
                                                                    <div key={eIndex} className="flex justify-between text-sm">
                                                                        <span className="text-slate-700 font-medium">{exc.name}</span>
                                                                        <span className="text-slate-500">{exc.sets} x {exc.reps} @ {exc.weight || 0}kg</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-slate-400">No exercises scheduled.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                        <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-900">No Plans Assigned Yet</h3>
                        <p className="text-slate-500">Your admin hasn't assigned any plans to you yet.</p>
                    </div>
                )}
            </div>

            {selectedDay && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Combine & Log Workout</h2>
                        <p className="text-slate-500 mb-4">How was the session for <span className="font-bold">{selectedDay.day}</span>?</p>

                        <div className="space-y-3 mb-6">
                            {['Too Easy', 'Good', 'Too Hard'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRating(r)}
                                    className={`w-full py-3 rounded-xl border text-sm font-bold transition-all ${rating === r
                                        ? r === 'Too Easy' ? 'bg-green-100 border-green-300 text-green-700 ring-2 ring-green-500'
                                            : r === 'Too Hard' ? 'bg-red-100 border-red-300 text-red-700 ring-2 ring-red-500'
                                                : 'bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-blue-500'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {rating === 'Too Easy' && <p className="text-green-600 text-xs text-center mb-4">We'll increase the weights for next time!</p>}
                        {rating === 'Too Hard' && <p className="text-red-600 text-xs text-center mb-4">We'll decrease the weights slightly.</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitLog}
                                disabled={isLogging}
                                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
                            >
                                {isLogging ? 'Logging...' : 'Complete Workout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPlan;
