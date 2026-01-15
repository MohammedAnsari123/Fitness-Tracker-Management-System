import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { User, Save } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        password: ''
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',
                gender: user.gender || '',
                height: user.height || '',
                weight: user.weight || '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/users/profile',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Error updating profile.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <User className="text-primary-600" size={32} />
                <span>My Profile</span>
            </h1>

            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl">
                {msg && <div className={`p-4 mb-6 rounded-xl border ${msg.includes('Error') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Full Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Age</label>
                            <input
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Height (cm)</label>
                            <input
                                name="height"
                                type="number"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm mb-2 font-medium">Current Weight (kg)</label>
                            <input
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-600 text-sm mb-2 font-medium">New Password (Optional)</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center space-x-2 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5">
                        <Save size={20} />
                        <span>Update Profile</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
