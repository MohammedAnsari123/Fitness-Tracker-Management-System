import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, Mail, Award, FileText, Save, Camera } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { logout } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        specialization: '',
        bio: ''
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('trainerToken');
        try {
            const res = await axios.get('http://localhost:5000/api/trainer/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) {
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    specialization: res.data.specialization || '',
                    bio: res.data.bio || ''
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('trainerToken');
        try {
            await axios.put('http://localhost:5000/api/trainer/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Error updating profile.');
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <User className="text-cyan-400" size={32} />
                Trainer Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
                        {profile.name[0]}
                    </div>
                    <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                    <p className="text-cyan-400 text-sm font-medium mb-4">{profile.specialization}</p>

                    <div className="w-full pt-6 border-t border-slate-800 mt-auto">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Account Status</p>
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">Active Trainer</span>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                    {msg && (
                        <div className={`p-4 mb-6 rounded-xl border ${msg.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2 font-medium">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-600" size={18} />
                                    <input
                                        name="name"
                                        type="text"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2 font-medium">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-slate-600" size={18} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-2 font-medium">Specialization</label>
                            <div className="relative">
                                <Award className="absolute left-3 top-3.5 text-slate-600" size={18} />
                                <input
                                    name="specialization"
                                    type="text"
                                    placeholder="e.g. HIIT, Strength, Yoga"
                                    value={profile.specialization}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-2 font-medium">Professional Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 text-slate-600" size={18} />
                                <textarea
                                    name="bio"
                                    rows="4"
                                    placeholder="Tell clients about your experience..."
                                    value={profile.bio}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
