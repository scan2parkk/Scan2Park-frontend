"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
// import AdminHeader from "@/components/admin/AdminHeader";
import MaxWidthContainer from "@/components/MaxWidthContainer";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, locations: 0, slots: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [usersRes, bookingsRes, locationsRes, slotsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/users`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/users`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/locations`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/slots`, config),
        ]);

        // Mock location and slot counts (replace with actual API calls if available)
        setStats({
          users: usersRes.data.length,
          locations: locationsRes.data.length, // Update with actual API if available
          slots: slotsRes.data.length, // Update with actual API if available
          bookings: bookingsRes.data.length,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
        if (err.response?.status === 401) router.push("/login");
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <AdminHeader /> */}
      <MaxWidthContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
                <p className="text-3xl font-bold text-[var(--primary)]">{stats.users}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Total Locations</h2>
                <p className="text-3xl font-bold text-[var(--primary)]">{stats.locations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Total Slots</h2>
                <p className="text-3xl font-bold text-[var(--primary)]">{stats.slots}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Total Bookings</h2>
                <p className="text-3xl font-bold text-[var(--primary)]">{stats.bookings}</p>
              </div>
            </div>
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
}