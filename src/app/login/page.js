"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const { email, password } = formData;

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
      } catch (err) {
        router.push("/");
      }
    };

    checkIfLoggedIn();
  }, [router]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setSuccess("Login successful! Redirecting...");
      // Fetch user profile to check role
      const profileRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${res.data.token}` },
        }
      );
      const user = profileRes.data;
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkAuth = async () => {
        try {
          const profileRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/user/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const user = profileRes.data;
          setTimeout(() => {
            if (user.role === "admin") {
              router.push("/dashboard");
            } else {
              router.push("/");
            }
          }, 0); // Immediate redirect
        } catch (err) {
          localStorage.removeItem("token"); // Clear invalid token
          // No redirect on error, let user log in again
        }
      };
      checkAuth();
    }
  }, [router]);

  return (
    <div className="min-h-screen flex max-md:flex-col gap-50 items-center justify-center bg-gray-100">
      <div className="max-md:hidden">
        <img
          src="/undraw_access-account_aydp.svg"
          alt="Sign in image"
          className="object-contain max-h-[500px] max-w-md"
        />
      </div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-left">Login to our app</h2>
        <span className="text-gray-700">Enter email and password</span>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-[var(--secondary)] text-center mb-4">{success}</p>
        )}
        <form onSubmit={onSubmit} className="mt-3">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary)] text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
        <p className="flex flex-wrap justify-between gap-2 text-left mt-4">
          <span className="text-gray-700">Don&apos;t have an account/need verification?</span>
          <Link
            href="/register"
            className="text-[var(--primary)] hover:text-[var(--primary)] hover:underline"
          >
            Sign up here
          </Link>
          <Link
            href="/verify-otp"
            className="text-[var(--primary)] hover:text-[var(--primary)] hover:underline"
          >
            Verify-Otp
          </Link>
        </p>
      </div>
    </div>
  );
}
