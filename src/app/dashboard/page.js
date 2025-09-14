"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
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
          "https://scan2park-backend.onrender.com/api/user/profile",
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

  redirect("/dashboard/liveoverview");
}
