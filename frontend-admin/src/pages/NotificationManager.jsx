import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, User, Users } from 'lucide-react';

const NotificationManager = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        userId: 'ALL',
        type: 'info',
        message: '',
        isPush: false // Mock toggle for future
    });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users', config);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/notifications/send', formData, config);
            alert(`Notification sent successfully to ${formData.userId === 'ALL' ? 'ALL users' : 'selected user'}!`);
            setFormData({ ...formData, message: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Bell className="text-emerald-500" /> Notification Manager
                </h1>
                <p className="text-slate-400 mt-1">Send alerts, announcements, and messages to users.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Compose Form */}
                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Send size={20} className="text-cyan-400" /> Compose Message
                    </h2>

                    <form onSubmit={handleSend} className="space-y-6">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Recipient</label>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userId: 'ALL' })}
                                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.userId === 'ALL'
                                            ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                >
                                    <Users size={20} /> All Users
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, userId: users[0]?._id })} // Default to first if switching
                                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.userId !== 'ALL'
                                            ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                >
                                    <User size={20} /> Specific User
                                </button>
                            </div>

                            {formData.userId !== 'ALL' && (
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none animate-in fade-in"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                >
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Notification Type</label>
                            <div className="flex gap-2">
                                {['info', 'success', 'warning', 'error'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all border ${formData.type === type
                                                ? type === 'error' ? 'bg-red-500 text-white border-red-500'
                                                    : type === 'warning' ? 'bg-yellow-500 text-black border-yellow-500'
                                                        : type === 'success' ? 'bg-green-500 text-white border-green-500'
                                                            : 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Message</label>
                            <textarea
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none"
                                placeholder="Write your message here..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <input
                                type="checkbox"
                                checked={formData.isPush}
                                onChange={(e) => setFormData({ ...formData, isPush: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                            />
                            <div>
                                <p className="text-white font-medium">Send as Mobile Push Notification</p>
                                <p className="text-slate-500 text-xs text-xs">Will only work if users have registered app tokens (Experimental).</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : <><Send size={20} /> Send Notification</>}
                        </button>
                    </form>
                </div>

                {/* Preview / History Placeholder */}
                <div className="space-y-6">
                    <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex gap-4 items-start">
                            <div className={`p-2 rounded-full mt-1 ${formData.type === 'error' ? 'bg-red-500/20 text-red-500'
                                    : formData.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500'
                                        : formData.type === 'success' ? 'bg-green-500/20 text-green-500'
                                            : 'bg-blue-500/20 text-blue-500'
                                }`}>
                                <Bell size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1">New Notification</h4>
                                <p className="text-slate-400 text-sm">
                                    {formData.message || 'Message preview will appear here...'}
                                </p>
                                <p className="text-xs text-slate-600 mt-2">Just now</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                        <h3 className="text-blue-400 font-bold mb-2">Pro Tip</h3>
                        <p className="text-blue-200/70 text-sm leading-relaxed">
                            Use "Broadcast" sparingly. Users are more likely to engage with personalized messages. For critical alerts (maintenance), ensure you verify the "Push" option is active.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationManager;
