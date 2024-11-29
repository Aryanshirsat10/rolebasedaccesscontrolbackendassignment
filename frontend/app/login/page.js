"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, LogIn } from 'lucide-react';
import api, { setAuthToken } from '../utils/api';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!form.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset previous messages
        setMessage('');
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prevent multiple submissions
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const res = await api.post('/auth/login', form);
            console.log(res);
            const token = res.data.token;
            console.log(token);
            localStorage.setItem('token', token);
            setAuthToken(token);
            
            // Optional: Show success message before redirecting
            setMessage('Login successful! Redirecting...');
            
            // Short delay to show success message
            setTimeout(() => {
                router.push('/profile');
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear the specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <LogIn className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600 mb-6">Sign in to access your account</p>
                </div>

                {message && (
                    <div className={`
                        flex items-center p-4 rounded-lg 
                        ${message.includes('successful') 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }
                    `}>
                        {message.includes('successful') 
                            ? <CheckCircle className="mr-2 w-5 h-5" /> 
                            : <AlertTriangle className="mr-2 w-5 h-5" />
                        }
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            value={form.email}
                            onChange={handleInputChange}
                            className={`
                                w-full pl-10 pr-3 py-2 rounded-lg border 
                                text-black peer placeholder-transparent
                                ${errors.email 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-indigo-500'
                                } 
                                focus:outline-none focus:ring-2 focus:ring-opacity-50
                            `}
                        />
                        <label 
                            htmlFor="email"
                            className={`
                                absolute left-10 -top-3.5 text-gray-600 
                                text-sm transition-all 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:top-2 
                                peer-placeholder-shown:left-10
                                peer-focus:-top-3.5 
                                peer-focus:text-sm 
                                peer-focus:text-indigo-600
                                bg-white px-1
                                ${form.email ? '-top-3.5 text-sm text-indigo-600' : ''}
                                ${errors.email ? 'text-red-500' : ''}
                            `}
                        >
                            Email
                        </label>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder=" "
                            value={form.password}
                            onChange={handleInputChange}
                            className={`
                                w-full pl-10 pr-10 py-2 rounded-lg border 
                                text-black peer placeholder-transparent
                                ${errors.password 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-indigo-500'
                                } 
                                focus:outline-none focus:ring-2 focus:ring-opacity-50
                            `}
                        />
                        <label 
                            htmlFor="password"
                            className={`
                                absolute left-10 -top-3.5 text-gray-600 
                                text-sm transition-all 
                                peer-placeholder-shown:text-base 
                                peer-placeholder-shown:top-2 
                                peer-placeholder-shown:left-10
                                peer-focus:-top-3.5 
                                peer-focus:text-sm 
                                peer-focus:text-indigo-600
                                bg-white px-1
                                ${form.password ? '-top-3.5 text-sm text-indigo-600' : ''}
                                ${errors.password ? 'text-red-500' : ''}
                            `}
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link 
                            href="/forgot-password" 
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="
                            w-full py-3 rounded-lg bg-indigo-600 text-white 
                            font-semibold hover:bg-indigo-700 transition duration-300
                            flex items-center justify-center
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {isSubmitting ? (
                            <svg 
                                className="animate-spin h-5 w-5 text-white" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                            >
                                <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                ></circle>
                                <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}