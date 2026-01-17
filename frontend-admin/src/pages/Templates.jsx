import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, FileText, Activity } from 'lucide-react';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'workout',
        description: '',
        content: '',
        difficulty: 'Beginner',
        durationWeeks: 4
    });

    const fetchTemplates = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/templates', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTemplates(res.data);
        } catch (error) {
            console.error("Error fetching templates", error);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/templates', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ title: '', type: 'workout', description: '', content: '', difficulty: 'Beginner', durationWeeks: 4 });
            fetchTemplates();
        } catch (error) {
            console.error("Error creating template", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/templates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTemplates();
        } catch (error) {
            console.error("Error deleting template", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-blue-500" /> Plan Templates
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> New Template
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
                                placeholder="Template Name (e.g. Weight Loss 101)"
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
                                name="durationWeeks"
                                value={formData.durationWeeks}
                                onChange={handleChange}
                                placeholder="Duration (Weeks)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                        </div>
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short Description"
                            className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                            required
                        />
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Detailed Plan Content..."
                            className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full h-32"
                            required
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">Save Template</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${t.type === 'workout' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'}`}>
                                <Activity size={20} />
                            </div>
                            <button onClick={() => handleDelete(t._id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{t.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="bg-slate-800 px-2 py-1 rounded">{t.difficulty}</span>
                            <span className="bg-slate-800 px-2 py-1 rounded">{t.durationWeeks} Weeks</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
