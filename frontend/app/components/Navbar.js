"use client"
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const logout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
        </nav>
    );
}
