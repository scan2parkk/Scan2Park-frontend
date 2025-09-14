"use client";

export default function Analytics({ analytics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Total Users</h3>
        <p className="text-2xl">{analytics.totalUsers}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Total Locations</h3>
        <p className="text-2xl">{analytics.totalLocations}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Total Slots</h3>
        <p className="text-2xl">{analytics.totalSlots}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Total Bookings</h3>
        <p className="text-2xl">{analytics.totalBookings}</p>
      </div>
    </div>
  );
}