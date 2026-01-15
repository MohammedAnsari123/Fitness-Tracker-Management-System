import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';

const Challenges = () => {
    const [available, setAvailable] = useState([]);
    const [myChallenges, setMyChallenges] = useState([]);
    const [tab, setTab] = useState('active');

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [allRes, myRes] = await Promise.all([
                axios.get('http://localhost:5000/api/challenges', { headers }),
                axios.get('http://localhost:5000/api/challenges/my', { headers })
            ]);
            setAvailable(allRes.data);
            setMyChallenges(myRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleJoin = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/challenges/join', { challengeId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
            setTab('active');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join');
        }
    };

    const handleProgress = async (id, currentProgress) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/challenges/${id}/progress`,
                { progress: currentProgress + 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Challenge Arena
            </h2>

            <div className="flex space-x-4 border-b border-slate-200 pb-2">
                <button
                    onClick={() => setTab('active')}
                    className={`pb-2 font-medium transition-colors ${tab === 'active' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    My Active Challenges
                </button>
                <button
                    onClick={() => setTab('all')}
                    className={`pb-2 font-medium transition-colors ${tab === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Explore Challenges
                </button>
            </div>

            {tab === 'active' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myChallenges.map(mc => (
                        <div key={mc._id} className="bg-white border border-slate-100 p-6 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Trophy size={64} className="text-slate-900" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{mc.challenge.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{mc.challenge.description}</p>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                                    <span>Progress</span>
                                    <span>{mc.progress} / {mc.challenge.durationDays} Days</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(mc.progress / mc.challenge.durationDays) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleProgress(mc._id, mc.progress)}
                                disabled={mc.progress >= mc.challenge.durationDays}
                                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2 rounded-xl flex justify-center items-center gap-2 transition-colors font-medium"
                            >
                                <CheckCircle size={18} /> {mc.progress >= mc.challenge.durationDays ? 'Completed!' : 'Mark Today Complete'}
                            </button>
                        </div>
                    ))}
                    {myChallenges.length === 0 && (
                        <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Trophy className="mx-auto text-slate-300 mb-3" size={48} />
                            <p className="text-slate-500 font-medium">You haven't joined any challenges yet.</p>
                            <button onClick={() => setTab('all')} className="text-primary-600 font-bold mt-2 hover:underline">Browse Challenges</button>
                        </div>
                    )}
                </div>
            )}

            {tab === 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {available.map(c => {
                        const isJoined = myChallenges.some(mc => mc.challenge._id === c._id);
                        return (
                            <div key={c._id} className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{c.difficulty}</span>
                                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{c.durationDays} Days</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-6">{c.description}</p>
                                </div>
                                <button
                                    onClick={() => handleJoin(c._id)}
                                    disabled={isJoined}
                                    className={`w-full py-2 rounded-xl transition-colors font-medium ${isJoined ? 'bg-green-50 text-green-600 cursor-default border border-green-100' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                                >
                                    {isJoined ? 'Joined' : 'Join Challenge'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Challenges;
