import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user and ALL their data?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error(error);
                alert('Failed to delete user');
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">User Management</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-gray-400 font-medium">Name</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Email</th>
                            <th className="px-6 py-4 text-gray-400 font-medium">Joined</th>
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
                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/users/${user._id}`}
                                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                            title="View Data"
                                        >
                                            <Eye size={18} />
                                        </Link>
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
