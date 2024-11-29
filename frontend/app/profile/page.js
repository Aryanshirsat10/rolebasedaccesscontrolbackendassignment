"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, LogOut, Edit, Lock, Gift } from 'lucide-react';
import api, { setAuthToken } from '../utils/api';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            router.push('/login');
            return;
        }
        setAuthToken(token);
        console.log("Axios headers after setting token:", api.defaults.headers.common);

        const fetchUser = async () => {
            try {
                console.log("Making API call to /users/me...");
                const res = await api.get('/users/me');
                console.log("User fetched successfully:", res.data);
                setUser(res.data);
            } catch (error) {
                console.error("API call failed:", error.response?.data || error.message);
                router.push('/login');
            }
        };
    
        fetchUser();
    }, [router]);

    if (error) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        </div>
    );
    console.log(user);
    if (!user) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin mx-auto mb-4 w-16 h-16 border-4 border-t-4 border-t-indigo-600 border-gray-200 rounded-full"></div>
                <p className="text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-indigo-600 p-6 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                                <p className="text-indigo-100">{user.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="hover:bg-white/20 p-2 rounded-full transition"
                            title="Logout"
                        >
                            <LogOut className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                <div className="bg-indigo-100 p-3 rounded-full">
                                    <User className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-gray-900 text-sm">Username</p>
                                    <p className="font-semibold text-gray-700">{user.username}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-900 text-sm">Email</p>
                                    <p className="font-semibold text-gray-700">{user.email}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <Shield className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-gray-900 text-sm">Role</p>
                                    <p className="font-semibold text-gray-700 capitalize">{user.role}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <Gift className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-gray-700 text-sm">Member Since</p>
                                    <p className="font-semibold text-gray-700">
                                        {user.createdAt 
                                            ? new Date(user.createdAt).toLocaleDateString() 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <button 
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg 
                                           hover:bg-indigo-700 transition flex items-center 
                                           justify-center space-x-2"
                            >
                                <Edit className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </button>
                            <button 
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg 
                                           hover:bg-gray-200 transition flex items-center 
                                           justify-center space-x-2"
                            >
                                <Lock className="w-5 h-5" />
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}