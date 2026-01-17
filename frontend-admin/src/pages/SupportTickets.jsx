import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Clock, Search, Filter } from 'lucide-react';

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
                    <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
                    <p className="text-slate-500">Manage user issues and support requests</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Open', 'Resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                            <th className="p-4">Status</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading tickets...</td></tr>
                        ) : filteredTickets.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">No tickets found.</td></tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                                ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {ticket.status === 'Open' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{ticket.subject}</div>
                                        <div className="text-sm text-slate-500 truncate max-w-xs">{ticket.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{ticket.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">{ticket.user?.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {ticket.status === 'Open' && (
                                            <button
                                                onClick={() => handleResolve(ticket._id)}
                                                className="text-green-600 hover:text-green-700 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
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
