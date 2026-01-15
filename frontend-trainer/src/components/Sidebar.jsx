import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, User, LogOut, Dumbbell, Utensils, Copy, X } from 'lucide-react';

const Sidebar = ({ logout, isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/clients', name: 'My Clients', icon: Users },
        { path: '/programs', name: 'Program Builder', icon: FileText },
        { path: '/exercises', name: 'Exercise Library', icon: Dumbbell },
        { path: '/nutrition', name: 'Nutrition Db', icon: Utensils },
        { path: '/templates', name: 'Plan Templates', icon: Copy },
        { path: '/chat', name: 'Messages', icon: MessageSquare },
        { path: '/profile', name: 'Profile', icon: User },
    ];

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <div className="p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        FitTrack Pro
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Trainer Portal</p>
                </div>
                <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                                ${isActive
                                    ? 'bg-primary-900/20 text-cyan-400 border border-cyan-900/30'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-900">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
