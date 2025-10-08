"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/locations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const foundLocation = locationsRes.data.find((loc) => loc._id === id);
        if (!foundLocation) throw new Error("Location not found");
        setLocation(foundLocation);

        const locationId = foundLocation._id;
        const slotsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/slots/${locationId}`,
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

  async function handleCheckout() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Test Item', amount: 5000, quantity: 1 }] // 5000 cents = $50
      })
    });
    const { id } = await res.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: id });
    if (error) console.error(error);
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const stripRes = await handleCheckout();
    console.log(stripRes);
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/book`,
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
    return <div className="text-center p-10 flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!location) {
    return <div className="text-center p-10">Invalid Location</div>;
  }

  return (
    <div className=" min-h-screen">
      <MaxWidthContainer>
        <main className="py-12">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-white hover:text-white mb-6"
          >
            <ArrowLeft className="mr-2" /> Back to Locations
          </button>
          <div className="flex flex-col items-start md:items-center mb-8 ">
            <h1 className="text-3xl text-white font-bold mb-2 capitalize">{location.name}</h1>
            <p className="flex items-center text-white mb-6">
              <MapPin className="h-5 w-5 mr-2 text-white" />
              {location.address || "Address not available"}
            </p>
          </div>

          {/* Parking Slots Grid */}
          <div className="bg-white/50 p-6 rounded-lg shadow mb-8">
            <div className="flex max-md:flex-col gap-4 items-center mb-4 md:gap-10">
              <h2 className="text-2xl font-semibold mb-4">Parking Slots</h2>
              <p className="mb-4 text-black">
                Click to book an available slot
              </p>
            </div>
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
                      className={`w-10 h-10 md:w-20 md:h-20 flex items-center justify-center text-xs font-bold mx-1 rounded-md cursor-pointer ${slot.isAvailable
                        ? "bg-[var(--secondary)] text-white hover:bg-[var(--primary)] cursor-pointer"
                        : "bg-red-600 text-white cursor-not-allowed opacity-50"
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

          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">About this Location</h2>
            <p className="text-gray-700">
              {location.description || "No description available"}
            </p>
          </div> */}

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
                      className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)] transition"
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
