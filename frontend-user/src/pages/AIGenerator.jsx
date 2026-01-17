import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Save, RefreshCw, Check } from 'lucide-react';

const AIGenerator = () => {
    const [preferences, setPreferences] = useState({
        daysPerWeek: 3,
        goal: 'Weight Loss',
        intensity: 'Medium'
    });
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);
        try {
            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/ai/generate', preferences, config);
            setGeneratedPlan(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert('Failed to generate plan');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedPlan) return;
        setSaving(true);
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/ai/save', generatedPlan, config);
            setSaved(true);
            setSaving(false);
            alert('Plan saved to your profile!');
        } catch (error) {
            console.error(error);
            alert('Failed to save plan');
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="text-purple-600" fill="currentColor" /> AI Coach
                </h1>
                <p className="text-slate-500 mt-2 max-w-2xl">
                    Generate a personalized workout plan instantly based on your goals, schedule, and fitness level.
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                        <h2 className="font-bold text-slate-800 mb-4">Plan Settings</h2>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Days per Week</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={preferences.daysPerWeek}
                                    onChange={(e) => setPreferences({ ...preferences, daysPerWeek: Number(e.target.value) })}
                                >
                                    <option value={3}>3 Days (Full Body)</option>
                                    <option value={4}>4 Days (Upper/Lower)</option>
                                    <option value={5}>5 Days (Split)</option>
                                    <option value={6}>6 Days (Push/Pull/Legs)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Goal</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Weight Loss', 'Muscle Gain', 'Strength'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setPreferences({ ...preferences, goal: g })}
                                            className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${preferences.goal === g
                                                ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Intensity</label>
                                <div className="flex gap-2">
                                    {['Low', 'Medium', 'High'].map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setPreferences({ ...preferences, intensity: i })}
                                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${preferences.intensity === i
                                                ? 'bg-purple-50 border-purple-200 text-purple-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Generating...' : <><Sparkles size={18} /> Generate Plan</>}
                            </button>
                        </form>
                    </div>
                </div>

                \                <div className="md:col-span-2 space-y-6">
                    {!generatedPlan && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                            <Sparkles size={48} className="mb-4 opacity-50" />
                            <p>Configure your settings and click Generate to see your AI plan.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <RefreshCw className="animate-spin text-purple-600 mb-4" size={32} />
                            <p className="text-slate-500 font-medium animate-pulse">Consulting the Matrix...</p>
                        </div>
                    )}

                    {generatedPlan && !loading && (
                        <div className="animate-in slide-in-from-bottom duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{generatedPlan.name}</h2>
                                    <p className="text-slate-500">{generatedPlan.description}</p>
                                </div>
                                {!saved ? (
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg transition-all"
                                    >
                                        <Save size={18} /> {saving ? 'Saving...' : 'Save Plan'}
                                    </button>
                                ) : (
                                    <button disabled className="bg-green-100 text-green-700 px-5 py-2 rounded-xl font-bold flex items-center gap-2 border border-green-200">
                                        <Check size={18} /> Saved
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {generatedPlan.weeks[0].days.map((day, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                                {idx + 1}
                                            </span>
                                            {day.day}
                                        </h3>
                                        <div className="space-y-3">
                                            {day.exercises.map((exc, eIdx) => (
                                                <div key={eIdx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                    <span className="font-medium text-slate-700">{exc.name}</span>
                                                    <span className="text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                                                        {exc.sets} sets x {exc.reps} reps
                                                    </span>
                                                </div>
                                            ))}
                                            {day.exercises.length === 0 && (
                                                <p className="text-slate-400 italic text-sm">Rest Days are crucial for growth!</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIGenerator;
