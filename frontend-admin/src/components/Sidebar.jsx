import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Shield, FileText, Dumbbell, Utensils, Trophy, X } from 'lucide-react';

const Sidebar = ({ logout, isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/users', name: 'User Management', icon: Users },
        { path: '/templates', name: 'Plan Templates', icon: FileText },
        { path: '/exercises', name: 'Exercise Library', icon: Dumbbell },
        { path: '/foods', name: 'Food Database', icon: Utensils },
        { path: '/challenges', name: 'Challenges', icon: Trophy },
    ];

    return (
        <div className={`h-screen w-64 bg-slate-900 text-white fixed left-0 top-0 overflow-y-auto border-r border-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shield className="text-red-500" />
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-red-600 shadow-lg shadow-red-500/30 text-white'
                                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
