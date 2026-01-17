import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Trash2, Ban, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExportButton from '../components/ExportButton';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const exportColumns = [
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Joined', key: 'createdAt' },
        { header: 'Role', key: 'role' },
        { header: 'Blocked', key: 'isBlocked' }
    ];

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleToggleBlock = async (user) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`https://fitness-tracker-management-system-xi0y.onrender.com/api/admin/users/${user._id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u =>
                u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
            ));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white p-8">Loading users...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <ExportButton
                    data={users}
                    columns={exportColumns}
                    title="All Registered Users"
                    filename="user_registry"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-gray-400 font-medium">Name</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Email</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Joined</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${user.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                        }`}>
                                        {user.isBlocked ? 'Suspended' : 'Active'}
                                    </span>
                                    {user.subscription?.upgradeRequested && (
                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-orange-500/10 text-orange-500">
                                            Requesting Upgrade
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/users/${user._id}`}
                                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                            title="View Data"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            className={`p-2 rounded-lg transition-colors ${user.isBlocked
                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                                                }`}
                                            title={user.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            {user.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
            </div>
        </div>
    );
};

export default UserList;
