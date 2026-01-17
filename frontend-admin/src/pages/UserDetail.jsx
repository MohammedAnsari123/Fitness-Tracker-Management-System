import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import { ArrowLeft, Activity, Utensils, Droplets, Moon, Weight, Trash2, Edit } from 'lucide-react';

const UserDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [showSubModal, setShowSubModal] = useState(false);
    const [subForm, setSubForm] = useState({ plan: 'Free', status: 'Active', endDate: '' });

    const fetchData = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
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
            await axios.delete(`http://localhost:5000/api/admin/plans/${planId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Failed to delete plan", error);
            alert("Failed to delete plan");
        }
    };

    const handleSubUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/subscription`,
                subForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowSubModal(false);
            fetchData();
        } catch (error) {
            console.error("Failed to update subscription", error);
            alert("Failed to update subscription");
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                    {/* Health Profile */}
                    <div>
                        <h4 className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-3">Health Profile</h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-slate-400 text-sm">Conditions: </span>
                                {user.healthConditions && user.healthConditions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.healthConditions.map((c, i) => (
                                            <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">{c}</span>
                                        ))}
                                    </div>
                                ) : <span className="text-slate-600 text-sm">None listed</span>}
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Injuries: </span>
                                {user.injuries && user.injuries.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.injuries.map((inj, i) => (
                                            <span key={i} className="bg-red-900/20 text-red-400 text-xs px-2 py-1 rounded border border-red-900/50">{inj}</span>
                                        ))}
                                    </div>
                                ) : <span className="text-slate-600 text-sm">None listed</span>}
                            </div>
                        </div>
                    </div>

                    {/* Subscription Status */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Subscription</h4>
                            <button
                                onClick={() => {
                                    setSubForm({
                                        plan: user.subscription?.plan || 'Free',
                                        status: user.subscription?.status || 'Active',
                                        endDate: user.subscription?.endDate ? user.subscription.endDate.split('T')[0] : ''
                                    });
                                    setShowSubModal(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                            >
                                <Edit size={12} /> Edit
                            </button>
                        </div>
                        {user.subscription ? (
                            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium">{user.subscription.plan} Plan</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.subscription.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {user.subscription.status}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                    {user.subscription.autoRenew ? 'Auto-renews' : 'Expires'} on {new Date(user.subscription.endDate || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-600 text-sm">No subscription data</span>
                        )}
                    </div>
                </div>
            </header>

            {showSubModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Subscription</h3>
                        <form onSubmit={handleSubUpdate} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Plan</label>
                                <select
                                    value={subForm.plan}
                                    onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Free">Free</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Status</label>
                                <select
                                    value={subForm.status}
                                    onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={subForm.endDate}
                                    onChange={(e) => setSubForm({ ...subForm, endDate: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowSubModal(false)} className="flex-1 text-slate-400 hover:text-white py-2">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-medium">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                const res = await axios.get('http://localhost:5000/api/admin/content/templates', {
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
            await axios.post(`http://localhost:5000/api/admin/users/${userId}/plan`,
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
