import React, { useContext, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
    const { admin, loading, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;

    if (!admin) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col md:flex-row">
            <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 p-4 z-40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold text-xl">🛡️ Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="text-white">
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

            <main className="flex-1 md:ml-64 p-6 md:p-8 mt-16 md:mt-0 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
