import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FileText, Plus, Calendar, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const Programs = () => {
    const location = useLocation();
    const [clients, setClients] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedClient, setSelectedClient] = useState('');
    const [programName, setProgramName] = useState('');
    const [description, setDescription] = useState('');
    const [weeksDuration, setWeeksDuration] = useState(4);
    const [weeksData, setWeeksData] = useState([]);

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchClients();
        if (location.state?.clientId) {
            setSelectedClient(location.state.clientId);
            setShowCreateModal(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (selectedClient) {
            fetchPrograms(selectedClient);
        } else {
            setPrograms([]);
        }
    }, [selectedClient]);

    const fetchPrograms = async (clientId) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/programs/${clientId}`, config);
            setPrograms(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients', config);
            setClients(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching clients", err);
            setLoading(false);
        }
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        try {

            const payload = {
                clientId: selectedClient,
                name: programName,
                description,
                weeks: [],
                endDate: new Date(Date.now() + weeksDuration * 7 * 24 * 60 * 60 * 1000)
            };

            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/programs', payload, config);
            alert('Program Created Successfully!');
            setShowCreateModal(false);
            setProgramName('');
            setDescription('');
            setSelectedClient('');
        } catch (err) {
            console.error(err);
            alert('Failed to create program');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Program Builder</h1>
                    <p className="text-slate-400 mt-1">Design and assign workout plans.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    <span>Create New Program</span>
                </button>
            </header>

            {/* Client Selector & Program List */}
            <div className="space-y-6">
                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Select Client to View Programs</label>
                    <select
                        className="w-full md:w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>{client.name} ({client.email})</option>
                        ))}
                    </select>
                </div>

                {selectedClient && (
                    <div className="grid gap-4">
                        {loading && <p className="text-slate-400">Loading programs...</p>}
                        {!loading && programs.length === 0 && (
                            <div className="text-center p-10 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                                No programs found for this client. Create one above.
                            </div>
                        )}
                        {programs.map(program => (
                            <div key={program._id} className="bg-surface border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-cyan-500/50 transition-colors">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{program.name}</h3>
                                    <p className="text-slate-400 text-sm">{program.weeks.length} Weeks • {new Date(program.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <a href={`/programs/${program._id}`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                                        Edit / Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold text-white mb-6">Create New Program</h2>

                        <form onSubmit={handleCreateProgram} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Program Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        placeholder="e.g., Summer Shred"
                                        value={programName}
                                        onChange={(e) => setProgramName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Assign To Client</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a client...</option>
                                        {clients.map(client => (
                                            <option key={client._id} value={client._id}>{client.name} ({client.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none"
                                    placeholder="Program goals and notes..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (Weeks)</label>
                                <input
                                    type="number"
                                    min="1" max="12"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={weeksDuration}
                                    onChange={(e) => setWeeksDuration(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-medium transition-colors"
                                >
                                    Create Program
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;
