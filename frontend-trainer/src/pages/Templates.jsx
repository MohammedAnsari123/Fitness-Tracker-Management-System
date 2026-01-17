import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Activity, Clock, BarChart, Plus } from 'lucide-react';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        difficulty: 'Beginner',
        type: 'workout',
        durationWeeks: '',
        description: ''
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/trainer/templates', formData, config);
            setTemplates([res.data, ...templates]);
            setIsModalOpen(false);
            setFormData({
                title: '',
                difficulty: 'Beginner',
                type: 'workout',
                durationWeeks: '',
                description: ''
            });
        } catch (error) {
            console.error(error);
            alert('Error creating template');
        }
    };

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/trainer/templates', config);
                setTemplates(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching templates", err);
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Plan Templates</h1>
                    <p className="text-slate-400 mt-1">Reusable blueprints for Client Programs.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} /> New Template
                </button>
            </header>

            {loading ? (
                <div className="text-slate-500 text-center py-10">Loading templates...</div>
            ) : templates.length === 0 ? (
                <div className="text-slate-500 text-center py-10">No templates available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t._id} className="bg-surface border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${t.type === 'workout' ? 'bg-purple-900/20 text-purple-400' : 'bg-green-900/20 text-green-400'}`}>
                                    <Activity size={24} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border ${t.difficulty === 'Beginner' ? 'border-green-500/30 text-green-400' :
                                    t.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400' :
                                        'border-red-500/30 text-red-400'
                                    }`}>
                                    {t.difficulty}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{t.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{t.description}</p>

                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {t.durationWeeks} Weeks
                                </div>
                                <div className="flex items-center gap-1 capitalize">
                                    <FileText size={16} />
                                    {t.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-white mb-4">Create Template</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                name="title"
                                placeholder="Template Title"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.title}
                                onChange={handleFormChange}
                            />
                            <div className="grid grid-cols-2 gap-4">
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
                                <select
                                    name="type"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.type}
                                    onChange={handleFormChange}
                                >
                                    <option value="workout">Workout</option>
                                    <option value="diet">Diet</option>
                                </select>
                            </div>
                            <input
                                name="durationWeeks"
                                type="number"
                                placeholder="Duration (Weeks)"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.durationWeeks}
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

export default Templates;
