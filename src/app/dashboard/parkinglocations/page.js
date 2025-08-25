"use client";

import AdminParkingLocations from "@/components/AdminParkingLocations/AdminParkingLocations";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ParkingLocations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", slots: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = profileRes.data;
        if (user.role !== "admin") {
          router.push("/"); // Redirect non-admins to home
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        router.push("/login"); // Redirect to login on error (e.g., invalid token)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>; // Prevent content flash
  }

  if (error) {
    return <div>Error: {error}</div>; // Optional: Show error
  }

  if (!isAuthorized) {
    return null; // Redirect will handle it
  }

  const handleOpenModal = () => {
    setIsModalOpen(true); // Managed by parent state
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({ name: "", address: "", slots: "" }); // Reset form on close
  };

  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">Parking Locations</h1>
          <button
            onClick={handleOpenModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Add Parking Location
          </button>
        </div>
        <div className="mt-6">
          <AdminParkingLocations
            isModalOpen={isModalOpen}
            onCloseModal={handleCloseModal}
            form={form}
            setForm={setForm}
          />
        </div>
      </main>
    </>
  );
}
