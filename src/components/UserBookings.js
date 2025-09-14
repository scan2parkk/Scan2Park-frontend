export default function UserBookings({ bookings }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Location</th>
              <th className="border p-2">Slot</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="border p-2">{booking.locationId?.name || 'N/A'}</td>
                <td className="border p-2">{booking.slotId?.slotNumber || 'N/A'}</td>
                <td className="border p-2">{new Date(booking.startTime).toLocaleString()}</td>
                <td className="border p-2">{new Date(booking.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}