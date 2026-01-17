import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Ban, Hourglass, Trash2 } from 'lucide-react';

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);

    const fetchTrainers = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/trainers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this trainer?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/trainers/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrainers();
        } catch (error) {
            alert('Failed to approve trainer');
        }
    };

    const handleSuspend = async (trainer) => {
        const action = trainer.isSuspended ? 'unsuspend' : 'suspend';
        if (!window.confirm(`Are you sure you want to ${action} this trainer?`)) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/trainers/${trainer._id}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrainers();
        } catch (error) {
            alert(`Failed to ${action} trainer`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">Trainer Management</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-gray-400 font-medium">Name</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Email</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Specialization</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {trainers.map((trainer) => (
                            <tr key={trainer._id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{trainer.name}</td>
                                <td className="px-6 py-4 text-gray-300">{trainer.email}</td>
                                <td className="px-6 py-4 text-gray-400">{trainer.specialization}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${trainer.isSuspended ? 'bg-red-500/10 text-red-500' :
                                            !trainer.isApproved ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-green-500/10 text-green-500'
                                        }`}>
                                        {trainer.isSuspended ? 'Suspended' : !trainer.isApproved ? 'Pending' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-3">
                                        {!trainer.isApproved && !trainer.isSuspended && (
                                            <button
                                                onClick={() => handleApprove(trainer._id)}
                                                className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleSuspend(trainer)}
                                            className={`p-2 rounded-lg transition-colors ${trainer.isSuspended
                                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                }`}
                                            title={trainer.isSuspended ? "Unsuspend" : "Suspend"}
                                        >
                                            <Ban size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {trainers.length === 0 && <div className="p-8 text-center text-gray-500">No trainers found.</div>}
            </div>
        </div>
    );
};

export default Trainers;
