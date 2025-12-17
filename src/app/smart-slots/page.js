"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const BACKEND_URL = "http://localhost:5000";

export default function SmartParkingPage() {
  const [slots, setSlots] = useState([]); // [{id, state}]
  const [statusMsg, setStatusMsg] = useState("Connecting to Smart Slots...");

  useEffect(() => {
    // const socket = io(BACKEND_URL, { transports: ['websocket'] });
    const socket = io(BACKEND_URL);


    socket.on("connect", () => {
      setStatusMsg("Connected to Smart Slots");
    });

    socket.on("parking:update", (payload) => {
      // payload.slots expected array like [{id:1, state:0}, ...]
      console.log(payload, "paylod");

      setSlots(payload.slots || []);
      setStatusMsg("Updated: " + new Date(payload.timestamp).toLocaleTimeString());
    });

    socket.on("parking:error", (err) => {
      setStatusMsg("Error: " + (err.message || "device unreachable"));
    });

    socket.on("disconnect", () => {
      setStatusMsg("Disconnected");
    });

    // cleanup
    return () => socket.disconnect();
  }, []);

  // UI order: Slot 3, Slot 2, Slot 4, Slot 1
  const displayOrder = [3, 2, 4, 1];

  const normalized = displayOrder.map(id => {
    return slots.find(slot => slot.id === id) || { id, state: null };
  });

  // // helpful: ensure we show exactly 4 slots even if device returns different order
  // const normalized = [1,2,3,4].map(n => {
  //   const s = slots.find(x => x.id === n) || { id: n, state: null };
  //   return s;
  // });

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Smart Parking Area</h1>
      <p className="mb-4 text-sm text-white text-center">{statusMsg}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
        {normalized.map((slot,index) => (
          <div key={slot.id} className="p-4 rounded-lg shadow-sm bg-white flex flex-col items-center">
            <div className="text-lg font-medium mb-2">Slot {index +1}</div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                backgroundColor: slot.state === 0 ? '#10B981' : slot.state === 1 ? '#EF4444' : '#9CA3AF'
              }}>
              {slot.state === 0 ? 'Free' : slot.state === 1 ? 'Busy' : 'N/A'}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {slot.state === 0 ? 'Available' : slot.state === 1 ? 'Occupied' : 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
