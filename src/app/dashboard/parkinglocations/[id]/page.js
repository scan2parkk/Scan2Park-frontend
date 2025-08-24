"use client";

import AdminParkingLocations from "@/components/AdminParkingLocations/AdminParkingLocations";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ParkingLocationById() {
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
          "http://localhost:5000/api/user/profile",
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
        <div className="mt-6">
          <AdminParkingLocations />
        </div>
      </main>
    </>
  );
}
