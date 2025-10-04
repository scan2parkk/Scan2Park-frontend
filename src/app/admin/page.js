"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Analytics from "@/components/admin/Analytics";
import AddLocation from "@/components/admin/AddLocation";
import BookingsList from "@/components/admin/BookingsList";
import AddSlot from "@/components/admin/AddSlot";
import UsersList from "@/components/admin/UsersList";
import LocationsSlots from "@/components/admin/LocationsSlots";
// import Analytics from '../components/admin/Analytics';
// import AddLocation from '../components/admin/AddLocation';
// import AddSlot from '../components/admin/AddSlot';
// import UsersList from '../components/admin/UsersList';
// import LocationsSlots from '../components/admin/LocationsSlots';
// import BookingsList from '../components/admin/BookingsList';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState({});
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalLocations: 0,
    totalSlots: 0,
    totalBookings: 0,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        router.push("/login");
      }
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        // Fetch locations
        const locationsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/locations`);
        setLocations(locationsRes.data);

        // Fetch slots for each location
        const slotsData = {};
        for (const location of locationsRes.data) {
          const slotsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/slots/${location._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          slotsData[location._id] = slotsRes.data;
        }
        setSlots(slotsData);

        // Fetch bookings
        const bookingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingsRes.data);

        // Set analytics
        setAnalytics({
          totalUsers: usersRes.data.length,
          totalLocations: locationsRes.data.length,
          totalSlots: Object.values(slotsData).reduce(
            (sum, slots) => sum + slots.length,
            0
          ),
          totalBookings: bookingsRes.data.length,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Handlers for updating state
  const handleLocationAdded = (newLocation) => {
    setLocations([...locations, newLocation]);
    setAnalytics((prev) => ({
      ...prev,
      totalLocations: prev.totalLocations + 1,
    }));
  };

  const handleSlotAdded = (newSlot) => {
    setSlots((prev) => ({
      ...prev,
      [newSlot.locationId]: [...(prev[newSlot.locationId] || []), newSlot],
    }));
    setAnalytics((prev) => ({ ...prev, totalSlots: prev.totalSlots + 1 }));
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter((user) => user._id !== userId));
    setAnalytics((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
  };

  const handleBookingDeleted = (bookingId) => {
    setBookings(bookings.filter((booking) => booking._id !== bookingId));
    setAnalytics((prev) => ({
      ...prev,
      totalBookings: prev.totalBookings - 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Analytics analytics={analytics} />
        <AddLocation onLocationAdded={handleLocationAdded} />
        <AddSlot locations={locations} onSlotAdded={handleSlotAdded} />
        <UsersList users={users} onUserDeleted={handleUserDeleted} />
        <LocationsSlots locations={locations} slots={slots} />
        <BookingsList
          bookings={bookings}
          onBookingDeleted={handleBookingDeleted}
        />
      </div>
    </div>
  );
}
