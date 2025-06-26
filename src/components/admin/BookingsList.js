"use client";

import axios from 'axios';

export default function BookingsList({ bookings, onBookingDeleted }) {
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onBookingDeleted(bookingId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Bookings</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Slot</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-50">
              <td className="border p-2">{booking.userId?.name || 'N/A'}</td>
              <td className="border p-2">{booking.locationId?.name || 'N/A'}</td>
              <td className="border p-2">{booking.slotId?.slotNumber || 'N/A'}</td>
              <td className="border p-2">
                {new Date(booking.startTime).toLocaleString()}
              </td>
              <td className="border p-2">
                {new Date(booking.endTime).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}