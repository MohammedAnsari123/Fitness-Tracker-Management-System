import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Dumbbell, Utensils, GlassWater, Moon, Weight, Filter, Trash2 } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/tracker/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (error) {
            console.error("Error fetching history", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (type, id) => {
        if (!window.confirm('Delete this item?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/tracker/history/${type}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHistory();
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Are you sure you want to clear ALL history? This cannot be undone.')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete('http://localhost:5000/api/tracker/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHistory();
        } catch (error) {
            console.error("Error clearing history", error);
        }
    };

    const filteredHistory = filter === 'all'
        ? history
        : history.filter(item => item.type === filter);

    const getIcon = (type) => {
        switch (type) {
            case 'workout': return <Dumbbell size={20} className="text-purple-400" />;
            case 'diet': return <Utensils size={20} className="text-orange-400" />;
            case 'water': return <GlassWater size={20} className="text-blue-400" />;
            case 'sleep': return <Moon size={20} className="text-indigo-400" />;
            case 'weight': return <Weight size={20} className="text-green-400" />;
            default: return <HistoryIcon size={20} className="text-gray-400" />;
        }
    };

    const getLabel = (type) => {
        switch (type) {
            case 'workout': return 'Workout';
            case 'diet': return 'Nutrition';
            case 'water': return 'Hydration';
            case 'sleep': return 'Sleep';
            case 'weight': return 'Body Metric';
            default: return 'Activity';
        }
    };

    const renderContent = (item) => {
        switch (item.type) {
            case 'workout':
                return (
                    <div>
                        <p className="text-white font-medium">{item.duration} minutes</p>
                        <p className="text-sm text-gray-400">{item.exercises?.length || 0} exercises performed</p>
                    </div>
                );
            case 'diet':
                const totalCals = item.meals?.reduce((acc, m) => acc + m.calories, 0) || 0;
                return (
                    <div>
                        <p className="text-white font-medium">{totalCals} kcal</p>
                        <p className="text-sm text-gray-400">{item.meals?.length || 0} meals logged</p>
                    </div>
                );
            case 'water':
                return <p className="text-white font-medium">{item.amount} ml</p>;
            case 'sleep':
                return <p className="text-white font-medium">{item.duration} hours <span className="text-gray-400 text-sm">({item.quality})</span></p>;
            case 'weight':
                return <p className="text-white font-medium">{item.weight} kg</p>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                        <HistoryIcon className="text-primary-600" size={32} />
                        <span>Activity History</span>
                    </h1>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="md:hidden text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
                        {['all', 'workout', 'diet', 'water', 'sleep', 'weight'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm capitalize whitespace-nowrap transition-colors font-medium ${filter === f
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:text-primary-600 hover:bg-slate-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl transition-colors font-medium border border-red-100"
                        >
                            <Trash2 size={18} /> Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {filteredHistory.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-primary-100 hover:shadow-md transition-all group shadow-sm">
                        <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100`}>
                            {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{getLabel(item.type)}</p>
                                    <div className="text-slate-800">
                                        {renderContent(item).props.children}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-medium">{new Date(item.date || item.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-slate-400">{new Date(item.date || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.type, item._id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredHistory.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                        <Filter className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-500 font-medium">No activity found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
