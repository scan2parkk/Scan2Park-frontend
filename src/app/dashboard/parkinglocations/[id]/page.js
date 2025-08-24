"use client"

import AdminParkingLocations from "@/components/AdminParkingLocations/AdminParkingLocations";

export default function ParkingLocationById() {
  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mt-6">
          <AdminParkingLocations />
        </div>
      </main>
    </>
  );
}
