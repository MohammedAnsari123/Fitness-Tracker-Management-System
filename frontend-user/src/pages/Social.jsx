import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Trophy, Activity, MessageSquare, Heart, Search, UserMinus, Dumbbell } from 'lucide-react';

const Social = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const [users, setUsers] = useState([]);
    const [feed, setFeed] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [interactionLoading, setInteractionLoading] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (activeTab === 'feed') {
                const res = await axios.get('http://localhost:5000/api/social/feed', { headers });
                setFeed(res.data);
            } else if (activeTab === 'friends') {
                const res = await axios.get('http://localhost:5000/api/social/users', { headers });
                setUsers(res.data);
            } else if (activeTab === 'leaderboard') {
                const res = await axios.get('http://localhost:5000/api/social/leaderboard', { headers });
                setLeaderboard(res.data);
            }
        } catch (error) {
            console.error("Error fetching social data", error);
        }
    };

    const handleFollow = async (userId, isFollowing) => {
        setInteractionLoading(userId);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (isFollowing) {
                await axios.post(`http://localhost:5000/api/social/unfollow/${userId}`, {}, { headers });
            } else {
                await axios.post(`http://localhost:5000/api/social/follow/${userId}`, {}, { headers });
            }
            fetchData();
        } catch (error) {
            console.error(error);
        } finally {
            setInteractionLoading(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <Users className="text-primary-600" size={32} />
                <span>Community Hub</span>
            </h1>

            <div className="flex space-x-2 bg-white p-1 rounded-xl w-fit border border-slate-100 shadow-sm">
                <button
                    onClick={() => setActiveTab('feed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'feed' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Activity size={16} /> <span>Activity Feed</span>
                </button>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'friends' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <UserPlus size={16} /> <span>Find Friends</span>
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'leaderboard' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Trophy size={16} /> <span>Leaderboard</span>
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm min-h-[400px] p-6">

                {activeTab === 'feed' && (
                    <div className="space-y-6">
                        {feed.length > 0 ? (
                            feed.map(item => (
                                <div key={item._id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner">
                                            {item.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{item.user?.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Dumbbell size={12} /> Workout
                                            </span>
                                            <h3 className="font-bold text-slate-800">{item.name || 'Strength Training Session'}</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Crushed a workout! Performed <span className="font-bold text-slate-900">{item.exercises?.length} exercises</span> with a total volume of <span className="font-bold text-slate-900">{item.exercises?.reduce((acc, ex) => acc + (ex.weight * ex.reps * ex.sets), 0)} kg</span>.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Workout Highlights</h4>
                                        <div className="space-y-2">
                                            {item.exercises?.slice(0, 3).map((ex, i) => (
                                                <div key={i} className="flex justify-between text-sm text-slate-700 border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                                    <span className="font-medium">{ex.exercise?.name || 'Exercise'}</span>
                                                    <span className="text-slate-500">{ex.sets} sets × {ex.reps} reps @ {ex.weight}kg</span>
                                                </div>
                                            ))}
                                            {item.exercises?.length > 3 && (
                                                <p className="text-xs text-center text-primary-600 font-medium pt-1">
                                                    + {item.exercises.length - 3} more exercises
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium">
                                            <Heart size={18} /> Like
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors text-sm font-medium">
                                            <MessageSquare size={18} /> Comment
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Activity size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No activity yet. Follow people to see their workouts!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredUsers.map(user => (
                                <div key={user._id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFollow(user._id, user.isFollowing)}
                                        disabled={interactionLoading === user._id}
                                        className={`p-2 rounded-lg transition-colors ${user.isFollowing
                                            ? 'text-red-500 hover:bg-red-50'
                                            : 'text-primary-600 hover:bg-primary-50'
                                            }`}
                                    >
                                        {user.isFollowing ? <UserMinus size={20} /> : <UserPlus size={20} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Top Performers</h2>
                            <p className="text-slate-500">Compete for the top spot!</p>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Points</th>
                                        <th className="px-6 py-4">Streak</th>
                                        <th className="px-6 py-4 text-right">Badges</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leaderboard.map((user, index) => (
                                        <tr key={user._id} className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''}`}>
                                            <td className="px-6 py-4 font-medium">
                                                {index === 0 && <span className="text-xl">🥇</span>}
                                                {index === 1 && <span className="text-xl">🥈</span>}
                                                {index === 2 && <span className="text-xl">🥉</span>}
                                                {index > 2 && <span className="text-slate-400 font-bold">#{index + 1}</span>}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {user.name[0]}
                                                </div>
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{user.gamification?.points || 0}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-orange-500">
                                                    <Activity size={16} />
                                                    <span className="font-bold">{user.gamification?.streak?.current || 0}</span>
                                                    <span className="text-xs text-slate-400 font-normal ml-1">days</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
                                                    {user.gamification?.badges?.length || 0} 🏆
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Social;
