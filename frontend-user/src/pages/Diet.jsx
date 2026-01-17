import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Utensils, Trash2 } from 'lucide-react';

const Diet = () => {
    const [diets, setDiets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [meals, setMeals] = useState([{ name: '', calories: '', protein: '', carbs: '', fat: '' }]);

    const fetchDiet = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/diet', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setDiets(res.data);
    };

    useEffect(() => {
        fetchDiet();
    }, []);

    const handleAddMeal = () => {
        setMeals([...meals, { name: '', calories: '', protein: '', carbs: '', fat: '' }]);
    };

    const handleMealChange = (index, field, value) => {
        const newMeals = [...meals];
        newMeals[index][field] = value;
        setMeals(newMeals);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/tracker/diet',
                { meals },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setMeals([{ name: '', calories: '', protein: '', carbs: '', fat: '' }]);
            fetchDiet();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Nutrition Log</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Log Meal</span>
                </button>
            </div>

            <div className="grid gap-4">
                {diets.map((dietEntry) => (
                    <div key={dietEntry._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                    <Utensils size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{new Date(dietEntry.date).toLocaleDateString()}</h3>
                                    <span className="text-slate-500 text-sm">Total Calories: {dietEntry.meals.reduce((acc, m) => acc + m.calories, 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {dietEntry.meals.map((meal, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-700 font-medium">{meal.name}</span>
                                    <div className="flex space-x-4 text-sm text-slate-500">
                                        <span className="text-orange-600 font-medium">{meal.calories} kcal</span>
                                        <span>P: {meal.protein}g</span>
                                        <span>C: {meal.carbs}g</span>
                                        <span>F: {meal.fat}g</span>
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Log Meals</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                {meals.map((meal, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-sm font-medium">Meal {idx + 1}</span>
                                            {idx > 0 && <button type="button" onClick={() => {
                                                const newMeals = [...meals];
                                                newMeals.splice(idx, 1);
                                                setMeals(newMeals);
                                            }} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>}
                                        </div>
                                        <input
                                            placeholder="Meal Name (e.g., Oatmeal)"
                                            value={meal.name}
                                            onChange={(e) => handleMealChange(idx, 'name', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                            required
                                        />
                                        <div className="grid grid-cols-4 gap-4">
                                            <input placeholder="Cals" type="number" value={meal.calories} onChange={(e) => handleMealChange(idx, 'calories', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none" required />
                                            <input placeholder="Prot (g)" type="number" value={meal.protein} onChange={(e) => handleMealChange(idx, 'protein', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                            <input placeholder="Carb (g)" type="number" value={meal.carbs} onChange={(e) => handleMealChange(idx, 'carbs', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                            <input placeholder="Fat (g)" type="number" value={meal.fat} onChange={(e) => handleMealChange(idx, 'fat', e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="button" onClick={handleAddMeal} className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-orange-600 transition-colors">
                                + Add Another Meal
                            </button>

                            <div className="flex space-x-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-orange-500/20">Save Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Diet;
