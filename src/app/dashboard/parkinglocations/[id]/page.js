"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState, use } from "react";
import { MapPin, ArrowLeft } from "lucide-react";

export default function ParkingLocationById({ params }) {
  const { id } = use(params);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([]);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = profileRes.data;
        if (user.role !== "admin") {
          router.push("/"); // Redirect non-admins to home
        } else {
          setIsAuthorized(true);
        }

        const locationsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/locations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const foundLocation = locationsRes.data.find((loc) => loc._id === id);
        if (!foundLocation) throw new Error("Location not found");
        setLocation(foundLocation);

        const slotsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/slots/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(slotsRes.data);

        setSlots(slotsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        router.push("/login"); // Redirect to login on error (e.g., invalid token)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Prevent content flash
  }

  if (error) {
    return <div>Error: {error}</div>; // Optional: Show error
  }

  if (!isAuthorized) {
    return null; // Redirect will handle it
  }

  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[var(--primary)] hover:text-[var(--primary)] mb-6"
        >
          <ArrowLeft className="mr-2" /> Back to Locations
        </button>
        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
          <p className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-2 text-[var(--primary)]" />
            {location.address || "Address not available"}
          </p>

          {/* Parking Slots Grid */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Parking Slots</h2>
            {slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {slots
                  .sort((a, b) => {
                    // Sort by slotNumber (e.g., A1, A2, A3) by extracting the number
                    const numA = parseInt(a.slotNumber.replace("A", ""));
                    const numB = parseInt(b.slotNumber.replace("A", ""));
                    return numA - numB;
                  })
                  .map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => slot.isAvailable && handleBookSlot(slot)}
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xs font-bold mx-1 rounded-md cursor-pointer ${
                        slot.isAvailable
                          ? "bg-[var(--secondary)] text-white hover:bg-[var(--primary)]"
                          : "bg-gray-300 text-gray-800"
                        }`}
                      style={{
                        pointerEvents: slot.isAvailable ? "auto" : "none",
                      }}
                    >
                      {slot.slotNumber}{" "}
                      {/* Use the actual slotNumber (e.g., A1, A2) */}
                    </div>
                  ))}
              </div>
            ) : (
              <p>No slots available</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">About this Location</h2>
            <p className="text-gray-700">
              {location.description || "No description available"}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
