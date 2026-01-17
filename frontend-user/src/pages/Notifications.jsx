import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Check, Info, AlertTriangle, XCircle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markRead = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put('https://fitness-tracker-management-system-xi0y.onrender.com/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check className="text-green-400" size={20} />;
            case 'warning': return <AlertTriangle className="text-orange-400" size={20} />;
            case 'error': return <XCircle className="text-red-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    if (loading) return <div className="text-white text-center py-10">Loading notifications...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-3 rounded-xl text-cyan-400">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Notifications</h1>
                        <p className="text-slate-400 text-sm">Stay updated with your progress</p>
                    </div>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllRead}
                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                        Mark all read
                    </button>
                )}
            </header>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center text-slate-500 py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n._id}
                            onClick={() => !n.read && markRead(n._id)}
                            className={`p-4 rounded-xl border flex gap-4 transition-all cursor-pointer ${n.read
                                    ? 'bg-slate-900/30 border-slate-800 opacity-70'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                                }`}
                        >
                            <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.read ? 'bg-slate-800' : 'bg-slate-700'
                                }`}>
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-white font-medium'}`}>
                                    {n.message}
                                </p>
                                <span className="text-xs text-slate-500 mt-1 block">
                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {!n.read && (
                                <div className="w-2 h-2 rounded-full bg-cyan-500 self-center"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
