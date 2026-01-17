import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { User, Save, Star, MessageSquare, CreditCard, Activity } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('Sedentary');
    const [goals, setGoals] = useState('Weight Loss');
    const [injuries, setInjuries] = useState('');
    const [equipment, setEquipment] = useState('Gym');
    const [msg, setMsg] = useState('');
    const [notification, setNotification] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [reviewMsg, setReviewMsg] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/profile', config);

                const p = res.data;
                setAge(p.age || '');
                setGender(p.gender || 'Male');
                setHeight(p.height || '');
                setWeight(p.weight || '');
                setActivityLevel(p.activityLevel || 'Sedentary');
                setGoals(p.goals || 'Weight Loss');
                setInjuries(p.injuries || '');
                setEquipment(p.equipment || 'Gym');
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/profile', {
                age, gender, height, weight, activityLevel, goals, injuries, equipment
            }, config);

            setMsg('Profile Updated Successfully');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            setMsg('Error updating profile');
        }
    };

    const handleUpgradeRequest = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/users/request-upgrade', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification('Upgrade request sent successfully! An admin will review it shortly.');
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            setNotification(error.response?.data?.message || 'Error sending request.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/reviews', reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviewMsg('Review submitted successfully!');
            setTimeout(() => {
                setReviewMsg('');
                setShowReviewModal(false);
            }, 2000);
        } catch (error) {
            setReviewMsg(error.response?.data?.message || 'Error submitting review');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                    <User className="text-primary-600" size={32} />
                    <span>My Profile</span>
                </h1>

                <div className="flex gap-2">
                    {user?.trainer && (
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            <Star size={18} />
                            Rate Trainer
                        </button>
                    )}

                    {user?.subscription?.plan === 'Free' && !user?.subscription?.upgradeRequested && (
                        <button
                            onClick={handleUpgradeRequest}
                            className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-purple-200"
                        >
                            <CreditCard size={18} />
                            Request Upgrade
                        </button>
                    )}

                    {user?.subscription?.upgradeRequested && (
                        <span className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                            <Activity size={18} />
                            Upgrade Pending
                        </span>
                    )}
                </div>
            </div>

            {notification && <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-medium text-center">{notification}</div>}
            {msg && <div className={`p-4 rounded-xl border ${msg.includes('Error') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>{msg}</div>}

            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Age</label>
                            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Gender</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Height (cm)</label>
                            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Activity Level</label>
                            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all">
                                <option>Sedentary</option>
                                <option>Lightly Active</option>
                                <option>Moderately Active</option>
                                <option>Very Active</option>
                                <option>Extra Active</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Main Goal</label>
                            <select value={goals} onChange={(e) => setGoals(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all">
                                <option>Weight Loss</option>
                                <option>Muscle Gain</option>
                                <option>Maintenance</option>
                                <option>Endurance</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Injuries</label>
                        <input type="text" placeholder="e.g. Lower back pain, left knee..." value={injuries} onChange={(e) => setInjuries(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Equipment Access</label>
                        <select value={equipment} onChange={(e) => setEquipment(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all">
                            <option>Gym</option>
                            <option>Home Dumbbells</option>
                            <option>Bodyweight Only</option>
                            <option>Resistance Bands</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-primary-500/30">
                        <Save size={20} />
                        <span>Save Profile</span>
                    </button>
                </form>
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-scale-in">
                        <h2 className="text-xl font-bold text-slate-900">Rate Your Trainer</h2>
                        {reviewMsg && <div className={`text-sm p-2 rounded ${reviewMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{reviewMsg}</div>}

                        <div className="flex justify-center space-x-2 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                    className={`transition-all hover:scale-110 ${star <= reviewData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                >
                                    <Star size={32} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Share your experience..."
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none"
                        ></textarea>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReviewSubmit}
                                className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
