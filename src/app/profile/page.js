"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserProfile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userBookingHistory, setUserBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserProfile(profileRes.data);

        // Fetch active bookings
        const bookingsRes = await axios.get(
          "http://localhost:5000/api/user/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserBookings(bookingsRes.data);

        // Fetch booking history
        const historyRes = await axios.get(
          "http://localhost:5000/api/user/booking-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserBookingHistory(historyRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen">
      <div className="bg-white flex flex-col p-6 rounded-lg shadow-lg max-w-[1440px] mx-auto mt-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          User Profile
        </h1>

        <div className="flex flex-col space-y-4">
          {/* User Name */}
          <div className="flex items-center gap-10">
            <p className="text-lg font-medium text-gray-700">Name:</p>
            <p className="text-lg text-gray-500">
              {userProfile?.name || "N/A"}
            </p>
          </div>

          {/* User Email */}
          <div className="flex items-center gap-11">
            <p className="text-lg font-medium text-gray-700">Email:</p>
            <p className="text-lg text-gray-500">
              {userProfile?.email || "N/A"}
            </p>
          </div>

          {/* Admin Features */}
          {userProfile?.role === "admin" && (
            <div className="flex items-center gap-12">
              <p className="text-lg font-medium text-gray-700">Role:</p>
              <p className="text-lg text-gray-500">Admin</p>
            </div>
          )}
        </div>

        {/* Active Bookings */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Active Bookings
          </h2>
          {userBookings.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {userBookings.map((booking) => (
                <li key={booking._id} className="text-gray-600">
                  {booking.locationId.name} - Slot {booking.slotId.slotNumber}(
                  {new Date(booking.startTime).toLocaleString()} to{" "}
                  {new Date(booking.endTime).toLocaleString()})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No active bookings</p>
          )}
        </div>

        {/* Booking History */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Booking History
          </h2>
          {userBookingHistory.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {userBookingHistory.map((booking) => (
                <li key={booking._id} className="text-gray-600">
                  {booking.locationId.name} - Slot {booking.slotId.slotNumber}(
                  {new Date(booking.startTime).toLocaleString()} to{" "}
                  {new Date(booking.endTime).toLocaleString()})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No booking history</p>
          )}
        </div>
      </div>
    </div>
  );
}
