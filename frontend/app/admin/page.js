"use client"

import { useEffect, useState } from 'react';
import { AlertCircle, Check, X, UserCog, Users, ShieldCheck, ShieldOff, User } from 'lucide-react';
import api, { setAuthToken } from '../utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ROLE_COLORS = {
  Admin: 'bg-red-100 text-red-800',
  Moderator: 'bg-green-100 text-green-800',
  User: 'bg-blue-100 text-blue-800'
};

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState(['Admin', 'Moderator', 'User']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const router = useRouter();

    // Toast-like notification function (simplified)
    const showNotification = (message, type = 'success') => {
        const notificationContainer = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    };

    // Fetch users from the backend
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setAuthToken(token);

        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                if (res.data.role !== 'Admin') {
                    router.push('/not-authorized');
                } else {
                    setAdminUser(res.data);
                    const usersRes = await api.get('/protected/users');
                    setUsers(usersRes.data);
                }
            } catch (error) {
                console.log('Error fetching user or users:', error);
                setError('Failed to fetch users');
                showNotification('Unable to fetch user data', 'error');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Handle role update for a user
    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/protected/${userId}/role`, { role: newRole });
            setUsers((prevUsers) => 
                prevUsers.map((user) => 
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            showNotification('User role updated successfully');
        } catch (error) {
            console.log('Failed to update role:', error);
            showNotification('Failed to update user role', 'error');
        }
    };

    // Handle permission updates
    const handlePermissionChange = async (userId, permission, value) => {
        try {
            await api.put(`/protected/${userId}/permissions`, { permission, value });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? {
                              ...user,
                              permissions: {
                                  ...user.permissions,
                                  [permission]: value,
                              },
                          }
                        : user
                )
            );
            showNotification(`${permission} permission updated`);
        } catch (error) {
            console.log('Failed to update permissions:', error);
            showNotification('Failed to update permissions', 'error');
        }
    };

    // Logout handler
    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin">
                    <UserCog className="h-12 w-12 text-blue-500" />
                </div>
                <p className="ml-4 text-xl">Loading Users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <div className="w-96 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center text-red-600 mb-4">
                        <AlertCircle className="mr-2" /> 
                        <h2 className="text-xl font-bold">Error</h2>
                    </div>
                    <p className="text-red-800 mb-4">{error}</p>
                    <button 
                        onClick={() => router.push('/login')} 
                        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-white h-screen">
            {/* Notification Container */}
            <div id="notification-container" className="fixed top-4 right-4 z-50"></div>

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold flex items-center text-black mr-4">
                        <Users className="mr-3 text-blue-600" /> Admin Dashboard
                    </h1>
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                        Total Users: {users.length}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link 
                        href="/profile" 
                        className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                    >
                        <User className="mr-2 h-5 w-5" />
                        My Profile
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center">
                    <ShieldCheck className="mr-2 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">View Permission</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`w-full px-3 py-2 rounded-md ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {roles.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={user.permissions?.view || false}
                                                    onChange={(e) => 
                                                        handlePermissionChange(user.id, 'view', e.target.checked)
                                                    }
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
                                            {user.permissions?.view ? (
                                                <Check className="text-green-500" />
                                            ) : (
                                                <X className="text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                                            onClick={() => {/* Additional user actions */}}
                                        >
                                            More Actions
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;