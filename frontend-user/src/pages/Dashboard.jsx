import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Activity, Droplets, Moon, Utensils, Zap, Calendar as CalendarIcon, Video, MapPin } from 'lucide-react';
import StreakCounter from '../components/Gamification/StreakCounter';
import BadgeShowcase from '../components/Gamification/BadgeShowcase';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [statsRes, sessionsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/tracker/dashboard', config),
                    axios.get('http://localhost:5000/api/sessions/my', config)
                ]);

                setStats(statsRes.data);
                setSessions(sessionsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <header>
                    <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name} 👋</h1>
                    <p className="text-slate-500">Here's your daily activity summary</p>
                </header>
                <div className="w-full md:w-auto">
                    <StreakCounter streak={stats?.gamification?.streak} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                            <Utensils size={24} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Calories</span>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-slate-800">{stats?.caloriesIntake || 0}</span>
                        <span className="text-slate-500 mb-1">kcal</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-400">Target: {user?.goals?.dailyCalories || 2000}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-primary-50 rounded-xl text-primary-500">
                            <Activity size={24} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Workouts</span>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-slate-800">{stats?.workoutCount || 0}</span>
                        <span className="text-slate-500 mb-1">sessions</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-400">Target: {user?.goals?.weeklyWorkouts || 3}/week</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                            <Droplets size={24} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Water</span>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-slate-800">{stats?.waterIntake || 0}</span>
                        <span className="text-slate-500 mb-1">ml</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                            <Moon size={24} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Sleep</span>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-slate-800">{stats?.sleepDuration || 0}</span>
                        <span className="text-slate-500 mb-1">hrs</span>
                    </div>
                </div>
            </div>

            {/* Badges & Upcoming Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BadgeShowcase badges={stats?.gamification?.badges} />

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CalendarIcon className="text-primary-500" size={20} />
                        Upcoming Sessions
                    </h2>
                    <div className="space-y-4">
                        {sessions.length > 0 ? (
                            sessions.filter(s => s.status === 'Scheduled').map(session => (
                                <div key={session._id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${session.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                            {session.type === 'Video' ? <Video size={18} /> : <MapPin size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{session.title}</h4>
                                            <p className="text-sm text-slate-500">
                                                {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    {session.type === 'Video' && session.meetingLink && (
                                        <a
                                            href={session.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-500 transition-colors"
                                        >
                                            Join
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm italic py-4 text-center">No upcoming sessions scheduled.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Today's Workouts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Workouts</h2>
                <div className="space-y-4">
                    {stats?.workouts?.length > 0 ? (
                        stats.workouts.map((workout) => (
                            <div key={workout._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Workout Session</h3>
                                        <p className="text-sm text-slate-500">{new Date(workout.date).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-700 font-medium">{workout.exercises.length} Exercises</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400 italic">No workouts logged today.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
