import React, { useContext, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-surface-dim flex flex-col md:flex-row">
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-40 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                    FitTrack
                </h1>
                <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
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

            <main className="flex-1 md:ml-64 p-6 md:p-8 mt-16 md:mt-0 overflow-y-auto w-full h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
