import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Activity, Utensils, Droplets, Moon, Weight, Trash2 } from 'lucide-react';

const UserDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    const fetchData = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeletePlan = async (planId) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/plans/${planId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Failed to delete plan", error);
            alert("Failed to delete plan");
        }
    };

    if (!data) return <div className="text-white">Loading data...</div>;

    const { user, workouts, diets, water, sleep, weights, plans } = data;

    return (
        <div className="space-y-8">
            <Link to="/users" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Users</span>
            </Link>

            <header className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex space-x-6 mt-4">
                    <div className="text-sm">
                        <span className="text-gray-500">Age: </span>
                        <span className="text-white">{user.age || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Height: </span>
                        <span className="text-white">{user.height ? `${user.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Weight: </span>
                        <span className="text-white">{user.weight ? `${user.weight} kg` : 'N/A'}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-h-[400px] overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <Activity className="text-purple-500" /> <span>Recent Workouts</span>
                    </h3>
                    <div className="space-y-3">
                        {workouts.map(w => (
                            <div key={w._id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">{new Date(w.date).toLocaleDateString()}</span>
                                    <span className="text-purple-400">{w.duration} mins</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    {w.exercises.length} Exercises ({w.exercises.map(e => e.name).join(', ')})
                                </div>
                            </div>
                        ))}
                        {workouts.length === 0 && <p className="text-gray-500">No workouts recorded.</p>}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-h-[400px] overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <Utensils className="text-orange-500" /> <span>Recent Meals</span>
                    </h3>
                    <div className="space-y-3">
                        {diets.map(d => (
                            <div key={d._id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                                <span className="text-gray-300 text-sm block mb-1">{new Date(d.date).toLocaleDateString()}</span>
                                {d.meals.map((m, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-400">
                                        <span>{m.name}</span>
                                        <span className="text-orange-400">{m.calories} kcal</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {diets.length === 0 && <p className="text-gray-500">No consumption recorded.</p>}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-h-[300px] overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <Droplets className="text-blue-500" /> <span>Hydration Logs</span>
                    </h3>
                    <div className="space-y-2">
                        {water.map(w => (
                            <div key={w._id} className="flex justify-between text-sm text-gray-400 border-b border-slate-800 pb-2 last:border-0">
                                <span>{new Date(w.date).toLocaleString()}</span>
                                <span className="text-blue-400">{w.amount} ml</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-h-[200px] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                            <Moon className="text-indigo-500" /> <span>Sleep Logs</span>
                        </h3>
                        <div className="space-y-2">
                            {sleep.map(s => (
                                <div key={s._id} className="flex justify-between text-sm text-gray-400 border-b border-slate-800 pb-2 last:border-0">
                                    <span>{new Date(s.date).toLocaleDateString()}</span>
                                    <span>{s.duration} hrs ({s.quality})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-h-[200px] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                            <Weight className="text-emerald-500" /> <span>Weight Logs</span>
                        </h3>
                        <div className="space-y-2">
                            {weights.map(w => (
                                <div key={w._id} className="flex justify-between text-sm text-gray-400 border-b border-slate-800 pb-2 last:border-0">
                                    <span>{new Date(w.date).toLocaleDateString()}</span>
                                    <span className="text-emerald-400">{w.weight} kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <Activity className="text-blue-500" /> <span>Assigned Plans History</span>
                    </h3>
                    <div className="space-y-4 mb-8">
                        {plans && plans.length > 0 ? (
                            plans.map(plan => (
                                <div key={plan._id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-start group">
                                    <div>
                                        <h4 className="font-bold text-white">{plan.title} <span className="text-xs font-normal text-gray-400">({plan.type})</span></h4>
                                        <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap">{plan.content}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className="text-xs text-slate-500">{new Date(plan.createdAt).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => handleDeletePlan(plan._id)}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                                            title="Delete Plan"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No plans assigned yet.</p>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <Activity className="text-green-500" /> <span>Assign New Diet/Workout Plan</span>
                    </h3>
                    <PlanForm userId={id} onSuccess={fetchData} />
                </div>
            </div>
        </div>
    );
};

const PlanForm = ({ userId, onSuccess }) => {
    const [type, setType] = useState('workout');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [msg, setMsg] = useState('');
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
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
        fetchTemplates();
    }, []);

    const handleTemplateSelect = (e) => {
        const templateId = e.target.value;
        if (!templateId) return;
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setType(template.type);
            setTitle(template.title);
            setContent(template.content);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.post(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users/${userId}/plan`,
                { type, title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg('Plan assigned successfully!');
            setTitle('');
            setContent('');
            if (onSuccess) onSuccess();
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Failed to assign plan.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {msg && <div className={`p-3 rounded-xl text-sm ${msg.includes('Failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>{msg}</div>}

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4">
                <label className="block text-blue-400 text-sm mb-2 font-bold">Load from Template</label>
                <select
                    onChange={handleTemplateSelect}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">-- Select a Template --</option>
                    {templates.map(t => (
                        <option key={t._id} value={t._id}>{t.title} ({t.type})</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Selecting a template will auto-fill the fields below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Plan Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="workout">Workout Plan</option>
                        <option value="diet">Diet Plan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Plan Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Weight Loss Week 1"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Plan Details</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter detailed plan here..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                Assign Plan
            </button>
        </form>
    );
};

export default UserDetail;
