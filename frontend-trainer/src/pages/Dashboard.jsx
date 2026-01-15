import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const [clients, setClients] = useState([]);

    const stats = {
        totalClients: clients.length,
        activePrograms: 12,
        pendingCheckins: 3
    };

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('trainerToken');
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/clients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClients(res.data);
            } catch (error) {
                console.error("Failed to fetch clients", error);
            }
        };
        fetchClients();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Trainer Dashboard</h1>
                    <p className="text-slate-400 mt-1">Welcome back, let's crush some goals.</p>
                </div>
                <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-cyan-900/50 transition-colors">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Total Clients</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.totalClients}</h2>
                    </div>
                    <div className="p-3 bg-cyan-950/30 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                </div>

                <div className="bg-surface border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-900/50 transition-colors">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Active Programs</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.activePrograms}</h2>
                    </div>
                    <div className="p-3 bg-blue-950/30 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText size={28} />
                    </div>
                </div>

                <div className="bg-surface border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-purple-900/50 transition-colors">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Pending Check-ins</p>
                        <h2 className="text-3xl font-bold text-white mt-1">{stats.pendingCheckins}</h2>
                    </div>
                    <div className="p-3 bg-purple-950/30 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Activity size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Clients</h3>
                        <Link to="/clients" className="text-sm text-cyan-400 hover:text-cyan-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {clients.length > 0 ? clients.slice(0, 5).map(client => (
                            <div key={client._id} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{client.name}</p>
                                        <p className="text-xs text-slate-500">{client.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Active</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No clients yet.</p>
                        )}
                    </div>
                </div>

                <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/clients" className="bg-slate-800 p-4 rounded-xl hover:bg-slate-700 hover:border-cyan-500/50 border border-transparent transition-all text-left block">
                            <Users className="text-cyan-400 mb-2" />
                            <p className="font-medium text-white">Add New Client</p>
                        </Link>
                        <Link to="/programs" className="bg-slate-800 p-4 rounded-xl hover:bg-slate-700 hover:border-blue-500/50 border border-transparent transition-all text-left block">
                            <FileText className="text-blue-400 mb-2" />
                            <p className="font-medium text-white">Create Program</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
