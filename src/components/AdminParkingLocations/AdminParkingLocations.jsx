"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const AdminParkingLocations = ({
  isModalOpen,
  onCloseModal,
  form,
  setForm,
}) => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/parking/locations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);

        const fetchedData = res.data.map((loc) => ({
          id: loc._id || loc.id,
          name: loc.name,
          address: loc.address,
          slots: loc.slots || "N/A",
        }));
        setData((prev) => {
          const uniqueData = [...prev, ...fetchedData].filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );
          return uniqueData;
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch locations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.name} ${item.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to add a location");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/locations",
        {
          name: form.name,
          address: form.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add slots for the new location
      const totalSlots = parseInt(form.slots);
      for (let i = 1; i <= totalSlots; i++) {
        await axios.post(
          "http://localhost:5000/api/admin/slots",
          {
            locationId: res.data._id,
            slotNumber: `A${i}`, // Example slot numbering (e.g., A1, A2, ...)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const newSlots = Array.from({ length: totalSlots }, (_, i) => i + 1);
      const newLocation = {
        id: res.data._id || Date.now().toString(),
        name: form.name,
        address: form.address,
        slots: form.slots,
        slotIds: newSlots,
      };

      setData((prev) => [...prev, newLocation]);
      onCloseModal(); // Close modal and reset via parent
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add location");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slots
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.slots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border rounded-lg"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-2">Items per page</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Add Parking Location
              </h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                name="slots"
                placeholder="Slots"
                value={form.slots}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onCloseModal} // Close via parent callback
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLocation}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                  disabled={!form.name || !form.address || !form.slots}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminParkingLocations;
