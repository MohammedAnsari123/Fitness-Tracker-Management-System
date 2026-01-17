import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MoreVertical, FileText, Activity, UserMinus, Mail, X, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ExportButton from '../components/ExportButton';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClientEmail, setNewClientEmail] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('trainerToken');
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const token = localStorage.getItem('trainerToken');
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients', { email: newClientEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Client added successfully!');
            setShowAddModal(false);
            setNewClientEmail('');
            fetchClients();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add client');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleRemoveClient = async (id) => {
        if (!window.confirm('Are you sure you want to remove this client?')) return;
        try {
            const token = localStorage.getItem('trainerToken');
            await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(clients.filter(c => c._id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to remove client');
        }
    };

    const handleAssignPlan = (clientId) => {
        navigate(`/workouts/create?clientId=${clientId}`);
    };

    const exportColumns = [
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Joined', key: 'createdAt' },
        { header: 'Status', key: 'status' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Clients</h1>
                    <p className="text-slate-400 mt-1">Manage your athletes and assign programs.</p>
                </div>
                <div className="flex gap-3">
                    <ExportButton
                        data={clients}
                        columns={exportColumns}
                        title="My Client Roster"
                        filename="clients_list"
                    />
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <UserPlus size={18} />
                        <span>Add Client</span>
                    </button>
                </div>
            </header>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">{error}</div>}
            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl">{success}</div>}

            {loading ? (
                <div className="text-slate-500 text-center py-10">Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className="bg-surface border border-slate-800 rounded-2xl p-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-500">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Clients Yet</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">Start building your roster by adding clients via their email address.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                        Add your first client
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <div key={client._id} className="bg-surface border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center text-white font-bold text-lg">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{client.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Active
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => handleRemoveClient(client._id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                        title="Remove Client"
                                    >
                                        <UserMinus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Mail size={16} className="text-slate-600" />
                                    {client.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Activity size={16} className="text-slate-600" />
                                    Joined: {new Date(client.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedClient(client)}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-sm font-medium border border-slate-800 transition-colors"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={() => navigate(`/clients/${client._id}/progress`)}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-sm font-medium border border-slate-800 transition-colors"
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => handleAssignPlan(client._id)}
                                    className="flex-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 py-2 rounded-lg text-sm font-medium border border-cyan-900/30 transition-colors"
                                >
                                    Assign Plan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Client</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Enter the email address of the user you want to add. They must already be registered on the platform.
                        </p>

                        <form onSubmit={handleAddClient}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">User Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    placeholder="client@example.com"
                                    value={newClientEmail}
                                    onChange={(e) => setNewClientEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-medium transition-colors"
                                >
                                    Add Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedClient && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in-up relative">
                        <button
                            onClick={() => setSelectedClient(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center text-white font-bold text-2xl">
                                {selectedClient.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                                <p className="text-slate-400">{selectedClient.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Stats</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-white">{selectedClient.age || '-'}</div>
                                        <div className="text-xs text-slate-500">Age</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{selectedClient.weight || '-'} kg</div>
                                        <div className="text-xs text-slate-500">Weight</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{selectedClient.height || '-'} cm</div>
                                        <div className="text-xs text-slate-500">Height</div>
                                    </div>
                                </div>
                            </div>

                            {selectedClient.goals && (
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Current Goal</h3>
                                    <p className="text-white capitalize">{selectedClient.goals.primaryGoal?.replace('-', ' ') || 'None set'}</p>
                                    <div className="mt-2 text-sm text-slate-400">Target Weight: {selectedClient.goals.targetWeight || '-'} kg</div>
                                </div>
                            )}

                            {(selectedClient.healthConditions?.length > 0 || selectedClient.injuries?.length > 0) && (
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-red-900/30">
                                    <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Activity size={16} /> Health Profile
                                    </h3>

                                    {selectedClient.healthConditions?.length > 0 && (
                                        <div className="mb-3">
                                            <span className="text-xs text-slate-500 block mb-1">Conditions</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedClient.healthConditions.map((c, i) => (
                                                    <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-700">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedClient.injuries?.length > 0 && (
                                        <div>
                                            <span className="text-xs text-slate-500 block mb-1">Injuries (Caution)</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedClient.injuries.map((inj, i) => (
                                                    <span key={i} className="bg-red-900/20 text-red-400 text-xs px-2 py-1 rounded-md border border-red-900/50 flex items-center gap-1">
                                                        <Activity size={12} /> {inj}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => {
                                        handleAssignPlan(selectedClient._id);
                                        setSelectedClient(null);
                                    }}
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-medium transition-colors"
                                >
                                    Assign New Program
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
