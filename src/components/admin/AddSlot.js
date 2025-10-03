"use client";

import { useState } from "react";
import axios from "axios";

export default function AddSlot({ locations, onSlotAdded }) {
  const [formData, setFormData] = useState({ locationId: "", slotNumber: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/admin/slots",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Slot added successfully");
      setFormData({ locationId: "", slotNumber: "" });
      onSlotAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add slot");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Add Parking Slot</h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && (
        <p className="text-[var(--secondary)] text-center mb-4">{success}</p>
      )}
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="locationId">
              Location
            </label>
            <select
              name="locationId"
              value={formData.locationId}
              onChange={onChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="slotNumber">
              Slot Number
            </label>
            <input
              type="text"
              name="slotNumber"
              value={formData.slotNumber}
              onChange={onChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-[var(--primary)] text-white p-2 rounded-md hover:bg-[var(--primary)]"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
}
