import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Dumbbell, Youtube } from 'lucide-react';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        muscleGroup: 'Chest',
        difficulty: 'Beginner',
        description: '',
        videoUrl: ''
    });

    const fetchExercises = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('http://localhost:5000/api/admin/content/exercises', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExercises(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.post('http://localhost:5000/api/admin/content/exercises', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ name: '', muscleGroup: 'Chest', difficulty: 'Beginner', description: '', videoUrl: '' });
            fetchExercises();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this exercise?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`http://localhost:5000/api/admin/content/exercises/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExercises();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Dumbbell className="text-purple-500" /> Exercise Library
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> Add Exercise
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Exercise Name"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                            <select
                                name="muscleGroup"
                                value={formData.muscleGroup}
                                onChange={handleChange}
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                            >
                                {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio', 'Full Body'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
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
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                placeholder="Video URL (Optional)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                            />
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description..."
                            className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full h-20"
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl">Save Exercise</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Muscle Group</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4">Video</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-gray-300">
                        {exercises.map(ex => (
                            <tr key={ex._id} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-white">{ex.name}</td>
                                <td className="px-6 py-4">{ex.muscleGroup}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${ex.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                            ex.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                        }`}>{ex.difficulty}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {ex.videoUrl && <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300"><Youtube size={16} /></a>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(ex._id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExerciseLibrary;
