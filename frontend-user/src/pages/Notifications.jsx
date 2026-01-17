import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

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
            case 'success': return <div className="p-2 bg-green-100 text-green-600 rounded-full"><Check size={20} /></div>;
            case 'warning': return <div className="p-2 bg-amber-100 text-amber-600 rounded-full"><AlertTriangle size={20} /></div>;
            case 'error': return <div className="p-2 bg-red-100 text-red-600 rounded-full"><XCircle size={20} /></div>;
            default: return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Info size={20} /></div>;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-slate-500 gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            Loading notifications...
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        Notifications
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="text-xs font-bold px-2 py-1 bg-red-500 text-white rounded-full">
                                {notifications.filter(n => !n.read).length} New
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 mt-2">Stay updated with your progress and alerts.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllRead}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Check size={16} />
                        Mark all read
                    </button>
                )}
            </header>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <Bell size={48} className="opacity-20 text-slate-900" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No notifications yet</p>
                        <p className="text-sm">We'll let you know when something important happens.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n._id}
                            onClick={() => !n.read && markRead(n._id)}
                            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md ${n.read
                                ? 'bg-white border-slate-100 opacity-75'
                                : 'bg-white border-primary-100 shadow-sm ring-1 ring-primary-50'
                                }`}
                        >
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 mt-1">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-base ${n.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </p>
                                </div>
                                {!n.read && (
                                    <div className="flex-shrink-0 self-center">
                                        <div className="w-3 h-3 bg-primary-500 rounded-full shadow-sm shadow-primary-200 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
