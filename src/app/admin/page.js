"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MaxWidthContainer from "@/components/MaxWidthContainer";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, locations: 0, slots: 0, bookings: 0 });
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
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
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/users`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/bookings`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/parking/locations`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/slots`, config),
        ]);

        setStats({
          users: usersRes.data.length,
          locations: locationsRes.data.length,
          slots: slotsRes.data.length,
          bookings: bookingsRes.data.length,
        });
        setLocations(locationsRes.data);
        setSlots(slotsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
        if (err.response?.status === 401) router.push("/login");
      }
    };

    fetchStats();
  }, [router]);

  // Bar Chart Data (Overall Stats)
  const barData = {
    labels: ["Users", "Locations", "Slots", "Bookings"],
    datasets: [
      {
        label: "Count",
        data: [stats.users, stats.locations, stats.slots, stats.bookings],
        backgroundColor: "rgba(41, 128, 185, 0.6)", // Matches --primary
        borderColor: "rgba(41, 128, 185, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Items" },
      },
    },
  };

  // Pie Chart Data (Overall Stats)
  const pieData = {
    labels: ["Users", "Locations", "Slots", "Bookings"],
    datasets: [
      {
        data: [stats.users, stats.locations, stats.slots, stats.bookings],
        backgroundColor: [
          "rgba(41, 128, 185, 0.6)",   // Users
          "rgba(46, 204, 113, 0.6)",   // Locations
          "rgba(241, 196, 15, 0.6)",   // Slots
          "rgba(231, 76, 60, 0.6)",    // Bookings
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Slots per Location Chart Data (Stacked Bar)
  const slotsPerLocation = locations.map((loc) => {
    const locationSlots = slots.filter((slot) => slot.locationId._id === loc._id);
    return {
      name: loc.name,
      available: locationSlots.filter((slot) => slot.isAvailable).length,
      booked: locationSlots.filter((slot) => !slot.isAvailable).length,
    };
  });

  const slotsPerLocationData = {
    labels: slotsPerLocation.map((loc) => loc.name),
    datasets: [
      {
        label: "Available Slots",
        data: slotsPerLocation.map((loc) => loc.available),
        backgroundColor: "rgba(41, 128, 185, .6)", // Green for available
        borderColor: "rgba(41, 128, 185, 1)",
        borderWidth: 1,
      },
      {
        label: "Booked Slots",
        data: slotsPerLocation.map((loc) => loc.booked),
        backgroundColor: "rgba(231, 76, 60, 0.6)", // Red for booked
        borderColor: "rgba(231, 76, 60, 1)",
        borderWidth: 1,
      },
    ],
  };

  const slotsPerLocationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: {
        beginAtZero: true,
        stacked: true,
        title: { display: true, text: "Number of Slots" },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Slots per Location (Available vs. Booked)" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MaxWidthContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Data Distribution (Bar Chart)</h2>
                  <div style={{ height: "256px" }}>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Data Proportion (Pie Chart)</h2>
                  <div style={{ height: "256px" }}>
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Slots per Location (Available vs. Booked)</h2>
                <div style={{ height: "256px" }}>
                  <Bar data={slotsPerLocationData} options={slotsPerLocationOptions} />
                </div>
              </div>
            </>
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
}