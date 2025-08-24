"use client";

import AdminParkingLocations from "@/components/AdminParkingLocations/AdminParkingLocations";
import { useState } from "react";

export default function ParkingLocations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", slots: "" });

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
            onClick={handleOpenModal} // Safe within Client Component
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
