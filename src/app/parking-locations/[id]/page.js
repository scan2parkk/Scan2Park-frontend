"use client";

import { use, useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function ParkingSlotDetailPage({ params }) {
  const { id:locationParamsId } = use( params);
  const [location, setLocation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
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

    // Check for successful payment redirect
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      handlePaymentConfirmation(sessionId);
    }

    const fetchData = async () => {
      try {
        const locationsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/locations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const foundLocation = locationsRes.data.find((loc) => loc._id === locationParamsId);
        if (!foundLocation) throw new Error("Location not found");
        setLocation(foundLocation);

        const slotsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/slots/${foundLocation._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
  }, [locationParamsId, router, searchParams]);

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingForm((prev) => ({
      ...prev,
      locationId: locationParamsId,
      slotId: slot._id,
    }));
    setIsModalOpen(true);
  };

  const handleCheckout = async () => {
    try {
      // Store booking details in localStorage to persist during redirect
      localStorage.setItem("pendingBooking", JSON.stringify(bookingForm));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [
              {
                name: `Parking Slot ${selectedSlot.slotNumber}`,
                amount: 5000, // Replace with dynamic pricing if needed
                quantity: 1,
              },
            ],
            locationId: locationParamsId,
          }),
        }
      );

      const { id } = await res.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error(error);
        setError("Failed to initiate payment");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment");
    }
  };

  const handlePaymentConfirmation = async (sessionId) => {
    try {
      // Verify payment status
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/checkout-session?session_id=${sessionId}`
      );
      const session = await res.json();

      if (session.payment_status === "paid") {
        // Retrieve booking details from localStorage
        const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));
        if (!bookingData) {
          setError("Booking data not found");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Proceed with booking
        const bookingRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/parking/book`,
          {
            locationId: bookingData.locationId,
            slotId: bookingData.slotId,
            startTime: bookingData.startTime + "Z",
            endTime: bookingData.endTime + "Z",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.removeItem("pendingBooking"); // Clear stored data
        setIsModalOpen(false);
        alert("Booking successful!");
        router.push("/parking-locations"); // Redirect to home or bookings page
      } else {
        setError("Payment not completed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.startTime || !bookingForm.endTime) {
      setError("Please provide start and end times");
      return;
    }
    await handleCheckout();
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
    <div className="min-h-screen">
      <MaxWidthContainer>
        <main className="py-12">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-white hover:text-white mb-6"
          >
            <ArrowLeft className="mr-2" /> Back to Locations
          </button>
          <div className="flex flex-col items-start md:items-center mb-8">
            <h1 className="text-3xl text-white font-bold mb-2 capitalize">{location.name}</h1>
            <p className="flex items-center text-white mb-6">
              <MapPin className="h-5 w-5 mr-2 text-white" />
              {location.address || "Address not available"}
            </p>
          </div>

          <div className="bg-white/50 p-6 rounded-lg shadow mb-8">
            <div className="flex max-md:flex-col gap-4 items-center mb-4 md:gap-10">
              <h2 className="text-2xl font-semibold mb-4">Parking Slots</h2>
              <p className="mb-4 text-black">Click to book an available slot</p>
            </div>
            {slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {slots
                  .sort((a, b) => {
                    const numA = parseInt(a.slotNumber.replace("A", ""));
                    const numB = parseInt(b.slotNumber.replace("A", ""));
                    return numA - numB;
                  })
                  .map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => slot.isAvailable && handleBookSlot(slot)}
                      className={`w-10 h-10 md:w-20 md:h-20 flex items-center justify-center text-xs font-bold mx-1 rounded-md cursor-pointer ${
                        slot.isAvailable
                          ? "bg-[var(--secondary)] text-white hover:bg-[var(--primary)]"
                          : "bg-red-600 text-white cursor-not-allowed opacity-50"
                      }`}
                      style={{
                        pointerEvents: slot.isAvailable ? "auto" : "none",
                      }}
                    >
                      {slot.slotNumber}
                    </div>
                  ))}
              </div>
            ) : (
              <p>No slots available</p>
            )}
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
                  <p className="mb-4">Slot: {selectedSlot?.slotNumber}</p>
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
                      Proceed to Payment
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