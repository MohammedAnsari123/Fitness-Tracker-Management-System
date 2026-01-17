import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Utensils, Flame, Plus } from 'lucide-react';

const Nutrition = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        servingSize: '100g'
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/foods', formData, config);
            setFoods([...foods, res.data]);
            setIsModalOpen(false);
            setFormData({
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: '',
                servingSize: '100g'
            });
        } catch (error) {
            console.error(error);
            alert('Error creating food');
        }
    };

    const token = localStorage.getItem('trainerToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/trainer/foods', config);
                setFoods(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching foods", err);
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    const filteredFoods = foods.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Nutrition Database</h1>
                    <p className="text-slate-400 mt-1">Reference for food macros and calories.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} /> Add Food
                </button>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search foods (e.g. Chicken, Rice, Avocado)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-slate-500 text-center py-10">Loading database...</div>
            ) : filteredFoods.length === 0 ? (
                <div className="text-slate-500 text-center py-10">No foods found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoods.map(food => (
                        <div key={food._id} className="bg-surface border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-3 bg-orange-900/20 text-orange-500 rounded-lg">
                                    <Utensils size={24} />
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                                    {food.servingSize}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{food.name}</h3>

                            <div className="flex items-center gap-2 mb-4">
                                <Flame size={18} className="text-red-500" />
                                <span className="text-lg font-bold text-white">{food.calories}</span>
                                <span className="text-sm text-slate-500">kcal</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-slate-900/50 rounded-lg p-2">
                                    <div className="text-blue-400 font-bold">{food.protein}g</div>
                                    <div className="text-slate-500">Protein</div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-2">
                                    <div className="text-green-400 font-bold">{food.carbs}g</div>
                                    <div className="text-slate-500">Carbs</div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-2">
                                    <div className="text-yellow-400 font-bold">{food.fats}g</div>
                                    <div className="text-slate-500">Fats</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Food</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Food Name"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="calories"
                                    type="number"
                                    placeholder="Calories"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.calories}
                                    onChange={handleFormChange}
                                />
                                <input
                                    name="servingSize"
                                    placeholder="Serving (e.g. 100g)"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.servingSize}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    name="protein"
                                    type="number"
                                    placeholder="Protein(g)"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.protein}
                                    onChange={handleFormChange}
                                />
                                <input
                                    name="carbs"
                                    type="number"
                                    placeholder="Carbs(g)"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.carbs}
                                    onChange={handleFormChange}
                                />
                                <input
                                    name="fats"
                                    type="number"
                                    placeholder="Fats(g)"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                    value={formData.fats}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nutrition;
