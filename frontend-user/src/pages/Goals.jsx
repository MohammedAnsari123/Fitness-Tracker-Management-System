import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Target, Save } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Goals = () => {
    const { user } = useContext(AuthContext);
    const [goals, setGoals] = useState({ dailyCalories: '', weeklyWorkouts: '', targetWeight: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchGoals = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/goals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setGoals({
                        dailyCalories: res.data.dailyCalories || '',
                        weeklyWorkouts: res.data.weeklyWorkouts || '',
                        targetWeight: res.data.targetWeight || ''
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchGoals();
    }, []);

    const handleChange = (e) => {
        setGoals({ ...goals, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/goals',
                goals,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg('Goals updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Error updating goals.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <Target className="text-red-500" size={32} />
                <span>My Goals</span>
            </h1>

            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl">
                {msg && <div className={`p-4 mb-6 rounded-xl border ${msg.includes('Error') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-600 text-sm mb-2 font-medium">Daily Calories Target</label>
                        <input
                            name="dailyCalories"
                            type="number"
                            value={goals.dailyCalories}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-sm mb-2 font-medium">Weekly Workouts Target</label>
                        <input
                            name="weeklyWorkouts"
                            type="number"
                            value={goals.weeklyWorkouts}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-sm mb-2 font-medium">Target Weight (kg)</label>
                        <input
                            name="targetWeight"
                            type="number"
                            value={goals.targetWeight}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center space-x-2 hover:shadow-red-500/40 transition-all transform hover:-translate-y-0.5">
                        <Save size={20} />
                        <span>Save Goals</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Goals;
