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
          "https://scan2park-backend.onrender.com/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserProfile(profileRes.data);

        // Fetch active bookings
        const bookingsRes = await axios.get(
          "https://scan2park-backend.onrender.com/api/user/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserBookings(bookingsRes.data);

        // Fetch booking history
        const historyRes = await axios.get(
          "https://scan2park-backend.onrender.com/api/user/booking-history",
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
    <div className="bg-white flex flex-col p-6 rounded-lg shadow-lg max-w-[1440px] mx-auto mt-8 mb-8">
      <div className="flex justify-between">
        <div>
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
        </div>
        <div>
          <div className="rounded-2xl">
            <div className="w-50 h-50 flex items-center text-white">
              <img
                src={`https://placehold.co/40x40/5c6ac4/ffffff?text=${userProfile?.name?.charAt(0)?.toUpperCase() || "U"
                  }`}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      <div className="mt-10 space-y-10">
        {/* Active Bookings */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Active Bookings
          </h2>
          {userBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 max-h-[350px] overflow-y-scroll">
              {userBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 bg-white rounded-lg shadow border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {booking.locationId.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Slot:{" "}
                    <span className="font-medium">
                      {booking.slotId.slotNumber}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(booking.startTime).toLocaleString()} <br />
                    to <br />
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No active bookings</p>
          )}
        </section>

        {/* Booking History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking History
          </h2>
          {userBookingHistory.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 max-h-[350px] overflow-y-scroll">
              {userBookingHistory.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.locationId.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Slot:{" "}
                    <span className="font-medium">
                      {booking.slotId.slotNumber}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(booking.startTime).toLocaleString()} <br />
                    to <br />
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No booking history</p>
          )}
        </section>
      </div>
    </div>
  );
}
