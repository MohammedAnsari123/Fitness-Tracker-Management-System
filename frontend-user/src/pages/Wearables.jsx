import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Watch, RefreshCw, Check, X, Heart, Activity, Moon, Zap } from 'lucide-react';

const Wearables = () => {
    const [connectedDevices, setConnectedDevices] = useState([]);
    const [mockData, setMockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const providers = [
        { name: 'Apple Health', color: 'bg-black', icon: '/apple-logo.png' },
        { name: 'Google Fit', color: 'bg-blue-600' },
        { name: 'Fitbit', color: 'bg-teal-600' },
        { name: 'Garmin', color: 'bg-blue-900' }
    ];

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/profile', config);
                if (res.data.connectedDevices) setConnectedDevices(res.data.connectedDevices);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    const handleConnect = async (provider) => {
        setLoading(true);
        try {
            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/wearables/connect', { provider }, config);
            setConnectedDevices(res.data.connectedDevices);
            alert(`Connected to ${provider}`);
        } catch (error) {
            console.error(error);
            alert('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (provider) => {
        if (!window.confirm(`Disconnect ${provider}?`)) return;
        setLoading(true);
        try {
            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/wearables/disconnect', { provider }, config);
            setConnectedDevices(res.data.connectedDevices);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/wearables/sync', config);
            setMockData(res.data.data);
            alert('Synced successfully!');
        } catch (error) {
            console.error(error);
            alert('Sync failed. Ensure a device is connected.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        <Watch size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Device Integration</h1>
                        <p className="text-slate-500">Connect your wearables to sync health data</p>
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Available Providers</h2>
                    <div className="space-y-4">
                        {providers.map((prov) => {
                            const isConnected = connectedDevices.includes(prov.name);
                            return (
                                <div key={prov.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${prov.color}`}>
                                            <Activity size={20} />
                                        </div>
                                        <span className="font-bold text-slate-700">{prov.name}</span>
                                    </div>
                                    {isConnected ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                                <Check size={14} /> Active
                                            </span>
                                            <button
                                                onClick={() => handleDisconnect(prov.name)}
                                                className="text-slate-400 hover:text-red-500 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(prov.name)}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Sync Status</h3>
                                <p className="text-slate-400 text-sm">Last synced: {mockData ? new Date(mockData.syncedAt).toLocaleTimeString() : 'Never'}</p>
                            </div>
                            <button
                                onClick={handleSync}
                                disabled={syncing || connectedDevices.length === 0}
                                className={`p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all ${syncing ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw size={24} />
                            </button>
                        </div>

                        {connectedDevices.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <p>Connect a device to start syncing.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-orange-300 mb-1">
                                        <Activity size={16} /> <span className="text-xs uppercase font-bold tracking-wider">Steps</span>
                                    </div>
                                    <span className="text-2xl font-bold">{mockData ? mockData.steps.toLocaleString() : '---'}</span>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-red-300 mb-1">
                                        <Heart size={16} /> <span className="text-xs uppercase font-bold tracking-wider">Heart Rate</span>
                                    </div>
                                    <span className="text-2xl font-bold">{mockData ? mockData.heartRate + ' bpm' : '---'}</span>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-purple-300 mb-1">
                                        <Moon size={16} /> <span className="text-xs uppercase font-bold tracking-wider">Sleep</span>
                                    </div>
                                    <span className="text-2xl font-bold">{mockData ? mockData.sleep + ' hrs' : '---'}</span>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-yellow-300 mb-1">
                                        <Zap size={16} /> <span className="text-xs uppercase font-bold tracking-wider">Active Cals</span>
                                    </div>
                                    <span className="text-2xl font-bold">{mockData ? mockData.calories : '---'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Integration Notes</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            This is a simulation environment. connecting a provider here mimics the OAuth handshake and API data retrieval processes. In a production environment, this would redirect to the provider's login page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wearables;
