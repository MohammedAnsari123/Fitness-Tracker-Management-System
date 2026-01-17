import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Plus, Calendar, Search, FileText } from 'lucide-react';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        amount: '',
        method: 'Cash',
        status: 'Completed',
        transactionId: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchPayments();
        fetchUsers();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/payments', config);
            setPayments(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/payments', formData, config);
            setPayments([res.data, ...payments]);
            setShowModal(false);
            setFormData({
                userId: '',
                amount: '',
                method: 'Cash',
                status: 'Completed',
                transactionId: '',
                notes: '',
                date: new Date().toISOString().split('T')[0]
            });
            alert('Payment logged successfully');
            fetchPayments();
        } catch (error) {
            console.error(error);
            alert('Failed to log payment');
        }
    };

    const filteredPayments = payments.filter(p =>
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Payment History</h1>
                    <p className="text-slate-400 mt-1">Track manual payments and transactions.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} /> Log Payment
                </button>
            </header>

            <div className="bg-surface border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user or transaction ID..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/30">
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Method</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading history...</td></tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No payments found.</td></tr>
                            ) : (
                                filteredPayments.map(payment => (
                                    <tr key={payment._id} className="hover:bg-slate-800/30 transition-colors text-sm">
                                        <td className="p-4 text-slate-300 whitespace-nowrap">
                                            {new Date(payment.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white">{payment.user?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-500">{payment.user?.email}</div>
                                        </td>
                                        <td className="p-4 font-bold text-emerald-400">
                                            ${payment.amount}
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {payment.method}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400' :
                                                payment.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' :
                                                    'bg-red-900/30 text-red-400'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 font-mono text-xs">
                                            {payment.transactionId || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-white mb-6">Log Manual Payment</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Select User</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select User --</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Method</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                    >
                                        <option>Cash</option>
                                        <option>Bank Transfer</option>
                                        <option>Card</option>
                                        <option>UPI</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Status</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Completed</option>
                                        <option>Pending</option>
                                        <option>Failed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Transaction Ref (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. TXN123456"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
