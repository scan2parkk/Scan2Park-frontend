"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2, Plus, Search } from "lucide-react";
import MaxWidthContainer from "@/components/MaxWidthContainer";

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", address: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/parking/locations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLocations(response.data);
        setFilteredLocations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load locations");
        setLoading(false);
        if (err.response?.status === 401) router.push("/login");
      }
    };

    fetchLocations();
  }, [router]);

  // Handle search
  useEffect(() => {
    const filtered = locations.filter(
      (loc) =>
        loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, locations]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/locations`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLocations([...locations, response.data]);
      setFilteredLocations([...filteredLocations, response.data]);
      setForm({ name: "", address: "" });
    } catch (err) {
      alert("Failed to add location: " + (err.response?.data?.message || "Server error"));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/admin/locations/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLocations(locations.filter((loc) => loc._id !== id));
      setFilteredLocations(filteredLocations.filter((loc) => loc._id !== id));
    } catch (err) {
      alert("Failed to delete location: " + (err.response?.data?.message || "Server error"));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLocations.length / rowsPerPage);
  const paginatedLocations = filteredLocations.slice(
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
          <div className="flex md:justify-between max-md:flex-col max-md:gap-4 md:items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--primary)]">Manage Locations</h1>
            <div className="relative max-md:w-full">
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-md:w-full pr-4 py-2 rounded-md border-2 border-[var(--primary)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Location</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-white hover:text-[var(--primary)] border border-[var(--primary)] transition duration-200"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Location
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
                    <th className="px-6 py-6 text-left text-xs font-bold text-[var(--primary)] capitalize tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-bold text-[var(--primary)] capitalize tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-bold text-[var(--primary)] capitalize tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLocations.map((loc) => (
                    <tr key={loc._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loc.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(loc._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700 max-md:hidden">Rows per page:</label>
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