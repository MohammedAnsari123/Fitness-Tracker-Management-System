import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Trophy } from 'lucide-react';

const ChallengeManager = () => {
    const [challenges, setChallenges] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        durationDays: 30,
        type: 'workout',
        difficulty: 'Beginner'
    });

    const fetchChallenges = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/challenges', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChallenges(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/challenges', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ title: '', description: '', durationDays: 30, type: 'workout', difficulty: 'Beginner' });
            fetchChallenges();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Challenge Manager
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> New Challenge
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Challenge Title (e.g. 30 Day Abs)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                            >
                                <option value="workout">Workout</option>
                                <option value="diet">Diet</option>
                                <option value="habit">Habit</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            <input
                                type="number"
                                name="durationDays"
                                value={formData.durationDays}
                                onChange={handleChange}
                                placeholder="Duration (Days)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description..."
                            className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full h-24"
                            required
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                            <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-xl">Create Challenge</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(c => (
                    <div key={c._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Trophy size={80} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{c.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="bg-slate-800 px-2 py-1 rounded">{c.difficulty}</span>
                            <span className="bg-slate-800 px-2 py-1 rounded">{c.durationDays} Days</span>
                            <span className="bg-slate-800 px-2 py-1 rounded uppercase">{c.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengeManager;
