import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Clock, Search, Filter, MessageSquare } from 'lucide-react';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchTickets = async () => {
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/support', config);
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

    const handleResolve = async (id) => {
        if (!window.confirm('Mark this ticket as resolved?')) return;
        try {
            await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/support/${id}`, { status: 'Resolved' }, config);
            setTickets(tickets.map(t => t._id === id ? { ...t, status: 'Resolved' } : t));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
                    <p className="text-gray-400 mt-1">Manage user issues and support requests</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Open', 'Resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-800 text-gray-400 border border-slate-700 hover:bg-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 border-b border-slate-700 text-gray-400 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-5">Status</th>
                            <th className="p-5">Subject</th>
                            <th className="p-5">User</th>
                            <th className="p-5">Date</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-500">Loading tickets...</td></tr>
                        ) : filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <MessageSquare size={40} className="opacity-20" />
                                        <p>No tickets found matching this filter.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500' :
                                            ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                            {ticket.status === 'Open' ? <Clock size={14} /> : <CheckCircle size={14} />}
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-semibold text-white text-base mb-1">{ticket.subject}</div>
                                        <div className="text-gray-400 truncate max-w-sm">{ticket.description}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-medium text-white">{ticket.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{ticket.user?.email}</div>
                                    </td>
                                    <td className="p-5 text-gray-400">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-5 text-right">
                                        {ticket.status === 'Open' && (
                                            <button
                                                onClick={() => handleResolve(ticket._id)}
                                                className="text-green-500 hover:text-green-400 font-bold text-xs bg-green-500/10 px-3 py-2 rounded-lg hover:bg-green-500/20 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportTickets;
