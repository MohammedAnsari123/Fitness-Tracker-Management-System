import React, { useContext, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
    const { trainer, loading, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return <div className="text-cyan-500 flex justify-center items-center h-screen bg-background">Loading Studio...</div>;

    if (!trainer) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-background text-slate-100 font-sans flex text-left">
            <div className="md:hidden fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 p-4 z-40 flex justify-between items-center">
                <h1 className="text-xl font-bold text-cyan-400">FitTrack Pro</h1>
                <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-cyan-400">
                    <Menu size={24} />
                </button>
            </div>

            <Sidebar logout={logout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 p-6 md:p-8 md:ml-64 mt-16 md:mt-0 transition-all duration-300 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
