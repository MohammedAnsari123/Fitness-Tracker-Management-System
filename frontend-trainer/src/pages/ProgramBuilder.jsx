import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Save, Plus, Trash2, ArrowLeft, Coffee } from 'lucide-react';

const ProgramBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (id) {
            fetchProgram();
        } else {
            setProgram({
                name: 'New Workout Program',
                weeks: [
                    {
                        weekNumber: 1,
                        days: [
                            { day: 'Monday', isRestDay: false, exercises: [] },
                            { day: 'Tuesday', isRestDay: false, exercises: [] },
                            { day: 'Wednesday', isRestDay: false, exercises: [] },
                            { day: 'Thursday', isRestDay: false, exercises: [] },
                            { day: 'Friday', isRestDay: false, exercises: [] },
                            { day: 'Saturday', isRestDay: true, exercises: [] },
                            { day: 'Sunday', isRestDay: true, exercises: [] }
                        ]
                    }
                ]
            });
        }
    }, [id]);

    const fetchProgram = async () => {
        try {
            const res = await axios.get(`https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/program/${id}`, config);
            setProgram(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching program", err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id) {
                await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/program/${id}`, program, config);
                alert('Program updated successfully!');
            } else {
                if (!clientId) {
                    alert('Error: No client selected for this program.');
                    setSaving(false);
                    return;
                }
                await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/programs', {
                    ...program,
                    clientId: clientId
                }, config);
                alert('Program created and assigned successfully!');
                navigate('/clients');
            }
            setSaving(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save program');
            setSaving(false);
        }
    };

    const toggleRestDay = (weekIndex, dayIndex) => {
        const newProgram = { ...program };
        newProgram.weeks[weekIndex].days[dayIndex].isRestDay = !newProgram.weeks[weekIndex].days[dayIndex].isRestDay;
        setProgram(newProgram);
    };

    const addExercise = (weekIndex, dayIndex) => {
        const newProgram = { ...program };
        newProgram.weeks[weekIndex].days[dayIndex].exercises.push({
            name: '', sets: 3, reps: 10, weight: 0
        });
        setProgram(newProgram);
    };

    const updateExercise = (weekIndex, dayIndex, exerciseIndex, field, value) => {
        const newProgram = { ...program };
        newProgram.weeks[weekIndex].days[dayIndex].exercises[exerciseIndex][field] = value;
        setProgram(newProgram);
    };

    const removeExercise = (weekIndex, dayIndex, exerciseIndex) => {
        const newProgram = { ...program };
        newProgram.weeks[weekIndex].days[dayIndex].exercises.splice(exerciseIndex, 1);
        setProgram(newProgram);
    };

    const initializeDays = () => {
        if (!program || !program.weeks) return;
    };

    if (loading) return <div className="text-white p-10">Loading program...</div>;
    if (!program) return <div className="text-white p-10">Program not found</div>;

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            <header className="flex justify-between items-center sticky top-0 bg-slate-950/80 backdrop-blur-md p-4 -mx-4 z-10 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{program.name}</h1>
                        <p className="text-slate-400 text-sm">Editing {program.weeks.length} Week Plan</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </header>

            <div className="space-y-8">
                {program.weeks.map((week, wIndex) => (
                    <div key={wIndex} className="bg-surface border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="bg-slate-900/50 p-4 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white">Week {week.weekNumber}</h2>
                        </div>
                        <div className="p-4 grid gap-6">
                            {week.days.map((day, dIndex) => (
                                <div key={dIndex} className={`border rounded-xl p-4 transition-all ${day.isRestDay ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-200">{day.day}</h3>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={day.isRestDay}
                                                onChange={() => toggleRestDay(wIndex, dIndex)}
                                                className="w-5 h-5 rounded border-slate-600 text-cyan-600 focus:ring-cyan-500 bg-slate-800"
                                            />
                                            <span className={`text-sm font-medium ${day.isRestDay ? 'text-indigo-400' : 'text-slate-500'}`}>
                                                Rest Day
                                            </span>
                                        </label>
                                    </div>

                                    {day.isRestDay ? (
                                        <div className="flex flex-col items-center justify-center py-6 text-indigo-300 gap-2 opacity-70">
                                            <Coffee size={32} />
                                            <p className="font-medium">Recovery & Rest</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {day.exercises.map((exc, eIndex) => (
                                                <div key={eIndex} className="flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                                                    <input
                                                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-600"
                                                        placeholder="Exercise Name"
                                                        value={exc.name}
                                                        onChange={(e) => updateExercise(wIndex, dIndex, eIndex, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="number" className="w-16 bg-slate-800 text-white text-sm rounded px-2 py-1 outline-none text-center"
                                                        placeholder="Sets" value={exc.sets}
                                                        onChange={(e) => updateExercise(wIndex, dIndex, eIndex, 'sets', e.target.value)}
                                                    />
                                                    <span className="text-slate-600 text-xs">sets</span>
                                                    <input
                                                        type="number" className="w-16 bg-slate-800 text-white text-sm rounded px-2 py-1 outline-none text-center"
                                                        placeholder="Reps" value={exc.reps}
                                                        onChange={(e) => updateExercise(wIndex, dIndex, eIndex, 'reps', e.target.value)}
                                                    />
                                                    <span className="text-slate-600 text-xs">reps</span>
                                                    <button onClick={() => removeExercise(wIndex, dIndex, eIndex)} className="text-red-400 hover:text-red-300 p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addExercise(wIndex, dIndex)}
                                                className="w-full py-2 border border-dashed border-slate-700 text-slate-500 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> Add Exercise
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgramBuilder;
