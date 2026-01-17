import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, Dumbbell, Utensils, GlassWater, Moon, Weight, Target, History, LogOut, User, Calendar, Trophy, Camera, Calculator, X, MessageSquare, Bell, Sparkles, Watch } from 'lucide-react';

const Sidebar = ({ logout, isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/analytics', name: 'Analytics', icon: Activity },
        { path: '/social', name: 'Community', icon: Users },
        { path: '/workouts', name: 'Workouts', icon: Dumbbell },
        { path: '/diet', name: 'Nutrition', icon: Utensils },
        { path: '/water', name: 'Hydration', icon: GlassWater },
        { path: '/sleep', name: 'Sleep', icon: Moon },
        { path: '/weight', name: 'Body Metrics', icon: Weight },
        { path: '/goals', name: 'Goals', icon: Target },
        { path: '/plans', name: 'My Plans', icon: Calendar },
        { path: '/tools', name: 'Tools', icon: Calculator },
        { path: '/challenges', name: 'Challenges', icon: Trophy },
        { path: '/chat', name: 'Messages', icon: MessageSquare },
        { path: '/notifications', name: 'Notifications', icon: Bell },
        { path: '/ai-coach', name: 'AI Coach', icon: Sparkles },
        { path: '/wearables', name: 'Devices', icon: Watch },
        { path: '/gallery', name: 'Gallery', icon: Camera },
        { path: '/support', name: 'Support', icon: MessageSquare },
        { path: '/history', name: 'History', icon: History },
        { path: '/profile', name: 'Profile', icon: User },
    ];

    return (
        <div className={`h-screen w-64 bg-surface-light border-r border-slate-200 fixed left-0 top-0 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col pt-20 md:pt-0 pb-6 shadow-2xl md:shadow-none bg-white`}>
            <div className="p-6 hidden md:block">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                    FitTrack
                </h1>
            </div>

            <button onClick={onClose} className="md:hidden absolute top-4 right-4 text-slate-500 hover:text-slate-800">
                <X size={24} />
            </button>

            <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                                ${isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-secondary hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 mb-20 md:mb-0">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-slate-500 hover:text-accent hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
