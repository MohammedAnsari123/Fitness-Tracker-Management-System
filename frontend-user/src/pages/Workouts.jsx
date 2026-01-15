import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Dumbbell, Trash2 } from 'lucide-react';

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
    const [duration, setDuration] = useState('');

    const fetchWorkouts = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/workouts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setWorkouts(res.data);
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/workouts',
                { exercises, duration },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
            setDuration('');
            fetchWorkouts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Workouts</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Log Workout</span>
                </button>
            </div>

            <div className="grid gap-4">
                {workouts.map((workout) => (
                    <div key={workout._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                    <Dumbbell size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{new Date(workout.date).toLocaleDateString()}</h3>
                                    <span className="text-slate-500 text-sm">{new Date(workout.date).toLocaleTimeString()} • {workout.duration} mins</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {workout.exercises.map((ex, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-700 font-medium">{ex.name}</span>
                                    <div className="flex space-x-4 text-sm text-slate-500">
                                        <span>{ex.sets} sets</span>
                                        <span>{ex.reps} reps</span>
                                        <span>{ex.weight} kg</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-2xl border border-slate-100 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Log Workout</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-600 text-sm mb-1 font-medium">Duration (mins)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                {exercises.map((ex, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-sm font-medium">Exercise {idx + 1}</span>
                                            {idx > 0 && <button type="button" onClick={() => {
                                                const newEx = [...exercises];
                                                newEx.splice(idx, 1);
                                                setExercises(newEx);
                                            }} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>}
                                        </div>
                                        <input
                                            placeholder="Exercise Name"
                                            value={ex.name}
                                            onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                            required
                                        />
                                        <div className="grid grid-cols-3 gap-4">
                                            <input placeholder="Sets" type="number" value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none" required />
                                            <input placeholder="Reps" type="number" value={ex.reps} onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none" required />
                                            <input placeholder="Weight (kg)" type="number" value={ex.weight} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="button" onClick={handleAddExercise} className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                + Add Another Exercise
                            </button>

                            <div className="flex space-x-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-primary-500/20">Save Workout</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workouts;
