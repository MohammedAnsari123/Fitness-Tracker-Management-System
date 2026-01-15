import React, { useState, useEffect } from 'react';
import { Calculator, Timer, Activity, RefreshCw, Play, Pause, Square } from 'lucide-react';

const Tools = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <Calculator className="text-primary-600" size={32} />
                <span>Fitness Tools</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BMICalculator />
                <Stopwatch />
                <div className="lg:col-span-2">
                    <CalorieCalculator />
                </div>
            </div>
        </div>
    );
};

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();
        if (height && weight) {
            const hM = height / 100;
            const val = (weight / (hM * hM)).toFixed(1);
            setBmi(val);

            if (val < 18.5) setCategory('Underweight');
            else if (val < 25) setCategory('Normal weight');
            else if (val < 30) setCategory('Overweight');
            else setCategory('Obese');
        }
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="text-blue-500" /> BMI Calculator
            </h3>
            <form onSubmit={calculateBMI} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Height (cm)</label>
                        <input
                            type="number" value={height} onChange={e => setHeight(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                        <input
                            type="number" value={weight} onChange={e => setWeight(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-all">
                    Calculate BMI
                </button>
            </form>

            {bmi && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-sm text-blue-600 mb-1">Your BMI</p>
                    <p className="text-4xl font-bold text-blue-800 mb-2">{bmi}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${category === 'Normal weight' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {category}
                    </span>
                </div>
            )}
        </div>
    );
};

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => setTime(prev => prev + 10), 10);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Timer className="text-purple-500" /> Stopwatch
            </h3>

            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center mb-6">
                <span className="text-5xl font-mono tracking-wider">{formatTime(time)}</span>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isRunning
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                >
                    {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
                </button>
                <button
                    onClick={() => { setIsRunning(false); setTime(0); }}
                    className="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                >
                    <RefreshCw size={20} />
                </button>
            </div>
        </div>
    );
};

const CalorieCalculator = () => {
    const [formData, setFormData] = useState({
        gender: 'male',
        age: '',
        height: '',
        weight: '',
        activity: '1.2'
    });
    const [tdee, setTdee] = useState(null);

    const calculateCalories = (e) => {
        e.preventDefault();
        const { gender, age, height, weight, activity } = formData;
        if (age && height && weight) {
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            bmr += gender === 'male' ? 5 : -161;

            const total = Math.round(bmr * parseFloat(activity));
            setTdee(total);
        }
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calculator className="text-orange-500" /> Calorie Calculator (TDEE)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={calculateCalories} className="space-y-4">
                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio" name="gender" value="male"
                                checked={formData.gender === 'male'}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                className="mr-2 accent-orange-500"
                            />
                            <span className="text-slate-700">Male</span>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio" name="gender" value="female"
                                checked={formData.gender === 'female'}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                className="mr-2 accent-orange-500"
                            />
                            <span className="text-slate-700">Female</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Age</label>
                            <input
                                type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Height (cm)</label>
                            <input
                                type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                            <input
                                type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Activity Level</label>
                        <select
                            value={formData.activity} onChange={e => setFormData({ ...formData, activity: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="1.2">Sedentary (Little or no exercise)</option>
                            <option value="1.375">Lightly active (1-3 days/week)</option>
                            <option value="1.55">Moderately active (3-5 days/week)</option>
                            <option value="1.725">Very active (6-7 days/week)</option>
                            <option value="1.9">Super active (Physical job)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium transition-all">
                        Calculate Calories
                    </button>
                </form>

                {tdee ? (
                    <div className="flex flex-col justify-center bg-orange-50 rounded-2xl p-6 border border-orange-100 text-center animate-in zoom-in">
                        <p className="text-orange-600 font-medium mb-2">Estimated Daily Maintenance</p>
                        <p className="text-5xl font-bold text-slate-800 mb-2">{tdee}</p>
                        <p className="text-slate-500 text-sm mb-6">Calories / Day</p>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <p className="text-slate-400 text-xs">Weight Loss</p>
                                <p className="font-bold text-slate-700">{tdee - 500}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <p className="text-slate-400 text-xs">Weight Gain</p>
                                <p className="font-bold text-slate-700">{tdee + 500}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm p-6">
                        Enter your details to calculate your daily energy expenditure.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
