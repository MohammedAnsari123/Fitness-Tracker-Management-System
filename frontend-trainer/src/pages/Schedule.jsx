import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Plus, X } from 'lucide-react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const Schedule = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        user: '',
        title: 'Training Session',
        startTime: '',
        endTime: '',
        type: 'Video',
        meetingLink: '',
        notes: ''
    });

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, clientsRes] = await Promise.all([
                    axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/sessions', config),
                    axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients', config)
                ]);
                setSessions(sessionsRes.data);
                setClients(clientsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const startDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${formData.startTime}`);
            const endDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${formData.endTime}`);

            const payload = {
                ...formData,
                startTime: startDateTime,
                endTime: endDateTime
            };

            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/sessions', payload, config);
            setSessions([...sessions, res.data]);
            setIsModalOpen(false);
            setFormData({
                user: '',
                title: 'Training Session',
                startTime: '',
                endTime: '',
                type: 'Video',
                meetingLink: '',
                notes: ''
            });
        } catch (error) {
            console.error(error);
            alert('Failed to schedule session');
        }
    };

    const dailySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getDate() === selectedDate.getDate() &&
            sessionDate.getMonth() === selectedDate.getMonth() &&
            sessionDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Schedule</h1>
                    <p className="text-slate-400 mt-1">Manage your appointments and training sessions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} /> New Session
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-surface border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="w-full bg-transparent text-slate-300 border-none rounded-lg"
                            tileClassName={({ date, view }) => {
                                if (view === 'month') {
                                    const hasSession = sessions.some(s => {
                                        const d = new Date(s.startTime);
                                        return d.getDate() === date.getDate() &&
                                            d.getMonth() === date.getMonth() &&
                                            d.getFullYear() === date.getFullYear();
                                    });
                                    return hasSession ? 'text-cyan-400 font-bold' : null;
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CalendarIcon size={20} className="text-cyan-400" />
                        Sessions for {format(selectedDate, 'MMMM do, yyyy')}
                    </h2>

                    {dailySessions.length === 0 ? (
                        <div className="bg-surface border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                            No sessions scheduled for this day.
                        </div>
                    ) : (
                        dailySessions.map(session => (
                            <div key={session._id} className="bg-surface border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${session.type === 'Video' ? 'bg-purple-900/20 text-purple-400' : 'bg-green-900/20 text-green-400'}`}>
                                        {session.type === 'Video' ? <Video size={20} /> : <MapPin size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{session.title}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <span className="text-cyan-400 font-medium">
                                                {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
                                            </span>
                                            <span>•</span>
                                            <span>with {session.user?.name || 'Unknown Client'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${session.status === 'Completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                        session.status === 'Cancelled' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                            'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                        }`}>
                                        {session.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">Schedule Session</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Client</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.user}
                                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                    required
                                >
                                    <option value="">Select a Client</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Type</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Video">Video Call</option>
                                        <option value="In-Person">In-Person</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Meeting Link / Location</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        placeholder="Zoom link or Address"
                                        value={formData.meetingLink}
                                        onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold mt-4 transition-colors"
                            >
                                Schedule Session
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
