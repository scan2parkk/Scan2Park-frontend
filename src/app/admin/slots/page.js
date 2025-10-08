"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2, Plus, Search } from "lucide-react";
import MaxWidthContainer from "@/components/MaxWidthContainer";

export default function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ locationId: "", slotNumber: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [slotsRes, locationsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/slots`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/parking/locations`, config),
        ]);
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);
        setLocations(locationsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load slots or locations");
        setLoading(false);
        if (err.response?.status === 401) router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  // Handle search
  useEffect(() => {
    const filtered = slots.filter((slot) => {
      const locationName = locations.find((loc) => loc._id === slot.locationId)?.name || "";
      return (
        slot.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredSlots(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, slots, locations]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/slots`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSlots([...slots, response.data]);
      setFilteredSlots([...filteredSlots, response.data]);
      setForm({ locationId: "", slotNumber: "" });
    } catch (err) {
      alert("Failed to add slot: " + (err.response?.data?.message || "Server error"));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/slots/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSlots(slots.filter((slot) => slot._id !== id));
      setFilteredSlots(filteredSlots.filter((slot) => slot._id !== id));
    } catch (err) {
      alert("Failed to delete slot: " + (err.response?.data?.message || "Server error"));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSlots.length / rowsPerPage);
  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MaxWidthContainer>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--primary)]">Manage Slots</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by slot number or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border-2 border-[var(--primary)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Add New Slot</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <select
                  value={form.locationId}
                  onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                  className="mt-1 p-2 block w-full rounded-md border-2 border-[var(--primary)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slot Number</label>
                <input
                  type="text"
                  value={form.slotNumber}
                  onChange={(e) => setForm({ ...form, slotNumber: e.target.value })}
                  className="mt-1 p-2 block w-full border-2 rounded-md border-[var(--primary)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-white hover:text-[var(--primary)] border-2 border-[var(--primary)] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Slot
              </button>
            </form>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSlots.map((slot) => {
                    // console.log(locations,"slot locationId:",slot.locationId);
                    console.log(locations.find((loc) => loc._id === slot.locationId._id).name );
                    
                    return(
                    <tr key={slot._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{slot.slotNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {locations.find((loc) => loc._id === slot.locationId._id)?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.isAvailable ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page
                    }}
                    className="rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md border border-gray-300 ${
                        currentPage === page
                          ? "bg-[var(--primary)] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
}