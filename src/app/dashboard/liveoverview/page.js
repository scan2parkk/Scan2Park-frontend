"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminParkingOccupancy from "@/components/AdminParkingOccupancy/AdminParkingOccupancy";
import CoursesLearnersAndMentors from "@/components/Charts/MonthlyParkingChart/MonthlyParkingChart";
import MentorAndLearner from "@/components/Charts/DailyParkingChart/DailyParkingChart";
import EventCalender from "@/components/Charts/EventCalender/EventCalender";

export default function LiveOverview() {
  const [error, setError] = useState("");
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
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        router.push("/login"); // Redirect to login on error (e.g., invalid token)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">Live Overview</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <CoursesLearnersAndMentors />
          <MentorAndLearner />
          <EventCalender />
        </div>

        <div className="mt-6">
          <AdminParkingOccupancy />
        </div>

        {/* <div className="mt-6"><AdminParkingLotAllotment /></div> */}
      </main>
    </>
  );
}
