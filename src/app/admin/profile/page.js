"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
// import AdminHeader from "@/components/AdminHeader";
import MaxWidthContainer from "@/components/MaxWidthContainer";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        router.push("/login");
        return;
      }
      setUser({ name: decoded.name, email: decoded.email, role: decoded.role });
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <AdminHeader /> */}
      <MaxWidthContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h1>
          {user ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Details</h2>
              <div className="space-y-4">
                <p><strong>Name:</strong> <span className="capitalize"> {user.name}</span></p>
                <p><strong>Email:</strong> <span className="">{user.email}</span></p>
                <p><strong>Role:</strong> <span className="">{user.role}</span></p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
}