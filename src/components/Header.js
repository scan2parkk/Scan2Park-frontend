"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role);
      } catch (err) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Smart Parking</Link>
        </h1>
        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-gray-200">Home</Link>
          {!isLoggedIn && (
            <>
              <Link href="/register" className="hover:text-gray-200">Register</Link>
              <Link href="/login" className="hover:text-gray-200">Login</Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
              {userRole === 'admin' && (
                <Link href="/admin" className="hover:text-gray-200">Admin Panel</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}