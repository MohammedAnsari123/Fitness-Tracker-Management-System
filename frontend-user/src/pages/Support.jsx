import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/support/my', config);
            setTickets(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/support', { subject, description }, config);
            setSubject('');
            setDescription('');
            setShowForm(false);
            fetchTickets();
            alert('Ticket submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit ticket');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700';
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <Clock size={16} />;
            case 'Resolved': return <CheckCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Support & Help</h1>
                    <p className="text-slate-500">Track issues and get assistance from admins</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    <Plus size={20} /> New Ticket
                </button>
            </header>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Submit a New Request</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                                placeholder="Brief summary of the issue"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 min-h-[120px]"
                                placeholder="Describe your issue in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                <Send size={18} /> Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">My Tickets</h2>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading tickets...</div>
                ) : tickets.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {tickets.map((ticket) => (
                            <div key={ticket._id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-lg">{ticket.subject}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                                        {getStatusIcon(ticket.status)} {ticket.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 mb-3 leading-relaxed">{ticket.description}</p>
                                <div className="text-xs text-slate-400">
                                    Submitted on {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No Tickets Found</h3>
                        <p className="text-slate-500">You haven't submitted any support requests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Support;
