"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("https://smart-parking-backend-asyg.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen gap-4 flex items-center justify-center bg-gray-100">
      <div className="">
        <img
          src="/images/Frame-427320611.svg"
          alt="Sign in image"
          className="object-contain"
        />
      </div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-left">Sign up now</h2>
        <span className="text-gray-700">
          Fill in the form below to get instant access
        </span>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-[var(--secondary)] text-center mb-4">{success}</p>
        )}
        <form onSubmit={onSubmit} className="mt-3">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary)] text-white p-2 rounded-md"
          >
            Sign up
          </button>
        </form>
        <p className="flex gap-2 text-left mt-4">
          <span className="text-gray-700">Already have an account?</span>
          <Link
            href="/login"
            className="text-[var(--primary)] hover:text-[var(--primary)] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
