"use client";

import AdminStatCard from "@/components/AdminStatCard/AdminStatCard";
import AdminParkingOccupancy from "@/components/AdminParkingOccupancy/AdminParkingOccupancy";
import AdminParkingLotAllotment from "@/components/AdminParkingLotAllotment/AdminParkingLotAllotment";

export default function liveOverview() {
  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">Live Overview</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard
            title="Parking Lots Occupied"
            value="13 / 50"
            color="text-red-500"
          />
          <AdminStatCard
            title="EV Charging Occupation"
            value="3 / 9"
            color="text-blue-500"
          />
          <AdminStatCard
            title="Today's Collection"
            value="₹12656"
            color="text-green-500"
          />
          <AdminStatCard
            title="Loyalty Card Customers"
            value="3"
            color="text-purple-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminParkingOccupancy />
        </div>

        <div className="mt-6">
          <AdminParkingLotAllotment />
        </div>
      </main>
    </>
  );
}
