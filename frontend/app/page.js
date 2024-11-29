"use client"
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { Lock, UserPlus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import api from './utils/api';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get('token'); // Retrieve the token from cookies

        if (token) {
            // Verify the token by making an API request
            const checkToken = async () => {
                try {
                    const response = await api.get('/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Check the role returned from the API response
                    const userRole = response.data.role;

                    // Route based on the user's role
                    if (userRole === 'Admin') {
                        router.push('/admin'); // Redirect to the Admin Dashboard
                    } else {
                        router.push('/profile'); // Redirect to the User Profile page
                    }
                } catch (error) {
                    // If token is invalid or expired, redirect to login page
                    console.error('Error validating token or fetching user data:', error);
                    router.push('/login');
                }
            };

            checkToken();
        }
    }, [router]);

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
            <Navbar />
            <div className="container mx-auto px-4 py-16 lg:py-24 flex flex-col items-center justify-center text-center">
                <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 md:p-12 space-y-6 border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <Lock className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        RBAC Demo Platform
                    </h1>
                    
                    <p className="text-gray-600 text-lg mb-8">
                        Discover a powerful Role-Based Access Control system designed to streamline user management and enhance security across your application.
                    </p>
                    
                    <div className="flex justify-center">
                        <Link 
                            href="/login" 
                            className="group flex items-center space-x-3 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="font-semibold">Get Started</span>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-4">
                        Secure, efficient, and intuitive user access management
                    </div>
                </div>
            </div>
        </div>
    );
}