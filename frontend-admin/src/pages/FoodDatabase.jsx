import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Utensils } from 'lucide-react';

const FoodDatabase = () => {
    const [foods, setFoods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        servingSize: ''
    });

    const fetchFoods = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/foods', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFoods(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/foods', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({ name: '', calories: '', protein: '', carbs: '', fats: '', servingSize: '' });
            fetchFoods();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this food?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/content/foods/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFoods();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Utensils className="text-orange-500" /> Food Database
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> Add Food
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Food Name (e.g. Chicken Breast)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                            <input
                                name="servingSize"
                                value={formData.servingSize}
                                onChange={handleChange}
                                placeholder="Serving Size (e.g. 100g)"
                                className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <input type="number" name="calories" value={formData.calories} onChange={handleChange} placeholder="Calories" className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full" required />
                            <input type="number" name="protein" value={formData.protein} onChange={handleChange} placeholder="Protein (g)" className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full" required />
                            <input type="number" name="carbs" value={formData.carbs} onChange={handleChange} placeholder="Carbs (g)" className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full" required />
                            <input type="number" name="fats" value={formData.fats} onChange={handleChange} placeholder="Fats (g)" className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-3 w-full" required />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl">Save Food</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Serving</th>
                            <th className="px-6 py-4">Calories</th>
                            <th className="px-6 py-4">Macros (P/C/F)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-gray-300">
                        {foods.map(f => (
                            <tr key={f._id} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-white">{f.name}</td>
                                <td className="px-6 py-4">{f.servingSize}</td>
                                <td className="px-6 py-4">{f.calories}</td>
                                <td className="px-6 py-4 text-xs font-mono">
                                    <span className="text-red-400">{f.protein}p</span> / <span className="text-green-400">{f.carbs}c</span> / <span className="text-yellow-400">{f.fats}f</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(f._id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodDatabase;
