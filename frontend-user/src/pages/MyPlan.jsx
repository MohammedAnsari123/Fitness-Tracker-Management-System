import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Dumbbell, Utensils } from 'lucide-react';

const MyPlan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/plans', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <div className="text-white">Loading plans...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">My Assigned Plans</h1>
                <p className="text-slate-500">Custom plans assigned by your trainer</p>
            </header>

            <div className="grid gap-6">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <div key={plan._id} className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-primary-200 hover:shadow-md transition-all shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                        <span className="text-sm text-slate-500">Trainer: {plan.trainer?.name || 'Unknown'}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                                <p className="font-semibold mb-2">Program Goal:</p>
                                {plan.description}
                            </div>
                            {plan.weeks && plan.weeks.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-slate-500">Duration: {plan.weeks.length} Weeks</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                        <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-900">No Plans Assigned Yet</h3>
                        <p className="text-slate-500">Your admin hasn't assigned any plans to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPlan;
