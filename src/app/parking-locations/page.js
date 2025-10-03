// src/app/parking-locations/page.js
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import Link from "next/link";
import axios from "axios";

function ParkingLocationsPage() {
  const [parkingLocationsData, setParkingLocationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "https://smart-parking-backend-asyg.onrender.com/api/parking/locations"
        );
        setParkingLocationsData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch locations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentLocations = parkingLocationsData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(currentLocations);

  const totalPages = Math.ceil(parkingLocationsData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <MaxWidthContainer>
        <main className="container mx-auto py-12">
          <h1 className="text-4xl font-bold text-center mb-12">
            Find Parking Locations
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentLocations.map((location) => (
              <Link
                href={`/parking-locations/${location._id}`}
                key={location._id}
              >
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition h-full flex flex-col cursor-pointer">
                  <img
                    src={
                      location.imageUrl ||
                      `https://placehold.co/400x250/000000/ffffff?text=Parking+Lot+${location.name}`
                    }
                    alt={location.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold mb-2">
                      {location.name}
                    </h2>
                    <p className="text-gray-600 flex items-center mb-4 flex-grow">
                      <MapPin className="h-5 w-5 text-[var(--primary)] mr-2" />
                      {location.address || "Address not available"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const token = localStorage.getItem("token");
                        if (!token) {
                          router.push("/login");
                        } else {
                          router.push(`/parking-locations/${location._id}`);
                        }
                      }}
                      className="mt-auto bg-[var(--primary)] hover:bg-[var(--primary)] text-white p-2 rounded-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-md font-medium ${
                  currentPage === i + 1
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </main>
      </MaxWidthContainer>
    </div>
  );
}

export default ParkingLocationsPage;
