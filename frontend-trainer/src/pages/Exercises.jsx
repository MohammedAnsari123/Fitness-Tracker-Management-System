import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Dumbbell, Filter, Video, Plus } from 'lucide-react';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        muscleGroup: 'Chest',
        difficulty: 'Beginner',
        videoUrl: '',
        description: ''
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/exercises', formData, config);
            setExercises([...exercises, res.data]);
            setIsModalOpen(false);
            setFormData({
                name: '',
                muscleGroup: 'Chest',
                difficulty: 'Beginner',
                videoUrl: '',
                description: ''
            });
        } catch (error) {
            console.error(error);
            alert('Error creating exercise');
        }
    };

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/exercises', config);
            setExercises(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching exercises", err);
            setLoading(false);
        }
    };

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterGroup === 'All' || ex.muscleGroup === filterGroup;
        return matchesSearch && matchesFilter;
    });

    const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio', 'Full Body'];

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Exercise Library</h1>
                    <p className="text-slate-400 mt-1">Browse and search the database of exercises.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} /> Add Exercise
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search exercises by name or muscle..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:w-64">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
                            value={filterGroup}
                            onChange={(e) => setFilterGroup(e.target.value)}
                        >
                            {muscleGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-slate-500 text-center py-10">Loading library...</div>
            ) : filteredExercises.length === 0 ? (
                <div className="text-slate-500 text-center py-10">No exercises found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExercises.map(ex => (
                        <div key={ex._id} className="bg-surface border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-3 bg-cyan-950/30 text-cyan-400 rounded-lg">
                                    <Dumbbell size={24} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border ${ex.difficulty === 'Beginner' ? 'border-green-500/30 text-green-400 bg-green-900/10' :
                                    ex.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-900/10' :
                                        'border-red-500/30 text-red-400 bg-red-900/10'
                                    }`}>
                                    {ex.difficulty}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{ex.name}</h3>
                            <p className="text-sm text-cyan-500 font-medium mb-4">{ex.muscleGroup}</p>

                            {ex.description && (
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                    {ex.description}
                                </p>
                            )}

                            {ex.videoUrl && (
                                <a
                                    href={ex.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors mt-auto"
                                >
                                    <Video size={16} />
                                    Watch Demo
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Exercise</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Exercise Name"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                            <select
                                name="muscleGroup"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.muscleGroup}
                                onChange={handleFormChange}
                            >
                                <option value="Chest">Chest</option>
                                <option value="Back">Back</option>
                                <option value="Legs">Legs</option>
                                <option value="Shoulders">Shoulders</option>
                                <option value="Arms">Arms</option>
                                <option value="Abs">Abs</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Full Body">Full Body</option>
                            </select>
                            <select
                                name="difficulty"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.difficulty}
                                onChange={handleFormChange}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            <input
                                name="videoUrl"
                                placeholder="Video URL (Optional)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.videoUrl}
                                onChange={handleFormChange}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                rows="3"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                                value={formData.description}
                                onChange={handleFormChange}
                            />
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exercises;
