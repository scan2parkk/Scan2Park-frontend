"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use } from "react";
import CheckoutButton from "@/components/CheckoutButton";

function ParkingSlotDetailPage({ params }) {
  const { id } = use(params);
  const [location, setLocation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    locationId: "",
    slotId: "",
    startTime: "",
    endTime: "",
  });
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const locationsRes = await axios.get(
          "https://scan2park-backend.onrender.com/api/parking/locations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const foundLocation = locationsRes.data.find((loc) => loc._id === id);
        if (!foundLocation) throw new Error("Location not found");
        setLocation(foundLocation);

        const locationId = foundLocation._id;
        const slotsRes = await axios.get(
          `https://scan2park-backend.onrender.com/api/parking/slots/${locationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(slotsRes.data);

        setSlots(slotsRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingForm((prev) => ({
      ...prev,
      locationId: id,
      slotId: slot._id, // Use _id as per Slot model
    }));
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await axios.post(
        "https://scan2park-backend.onrender.com/api/parking/book",
        {
          locationId: id,
          slotId: bookingForm.slotId,
          startTime: bookingForm.startTime + "Z", // Ensure UTC format
          endTime: bookingForm.endTime + "Z", // Ensure UTC format
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      alert("Booking successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!location) {
    return <div className="text-center p-10">Invalid Location</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <MaxWidthContainer>
        <main className="py-12">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-green-700 hover:text-green-900 mb-6"
          >
            <ArrowLeft className="mr-2" /> Back to Locations
          </button>

          <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
          <p className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            {location.address || "Address not available"}
          </p>

          {/* Parking Slots Grid */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Parking Slots</h2>
            <p className="mb-4 text-gray-500">
              Click to book an available slot
            </p>
            <p>
              <CheckoutButton/>
            </p>
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
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xs font-bold mx-1 rounded-md cursor-pointer ${slot.isAvailable
                        ? "bg-green-500 text-white hover:bg-green-600"
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

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
                <form onSubmit={handleBookingSubmit}>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={bookingForm.startTime}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full mb-3 px-4 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={bookingForm.endTime}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full mb-3 px-4 py-2 border rounded-lg"
                    required
                  />
                  <p className="mb-4">
                    Slot:{" "}
                    {selectedSlot?.slotNumber || selectedSlot?._slotNumber}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                      disabled={!bookingForm.startTime || !bookingForm.endTime}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </MaxWidthContainer>
    </div>
  );
}

export default ParkingSlotDetailPage;
