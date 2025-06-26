"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import BookSlotModal from '@/components/BookSlotModal';
import ParkingLocationsSlots from '@/components/ParkingLocationsSlots';
import UserBookings from '@/components/UserBookings';
// import BookSlotModal from '../components/BookSlotModal';
// import UserBookings from '../components/UserBookings';
// import ParkingLocationsSlots from '../components/ParkingLocationsSlots';

export default function Dashboard() {
  const [userBookings, setUserBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ locationId: '', slotId: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      jwtDecode(token); // Verify token validity
    } catch (err) {
      router.push('/login');
    }
  }, [router]);

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        // Fetch user bookings
        const bookingsRes = await axios.get('http://localhost:5000/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBookings(bookingsRes.data.filter((booking) => booking.userId?._id === jwtDecode(token)._id));

        // Fetch locations
        const locationsRes = await axios.get('http://localhost:5000/api/parking/locations');
        setLocations(locationsRes.data);

        // Fetch slots for each location
        const slotsData = {};
        for (const location of locationsRes.data) {
          const slotsRes = await axios.get(
            `http://localhost:5000/api/parking/slots/${location._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          slotsData[location._id] = slotsRes.data;
        }
        setSlots(slotsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  // Handle slot click to open modal
  const handleSlotClick = (locationId, slotId) => {
    setSelectedSlot({ locationId, slotId });
    setIsModalOpen(true);
  };

  // Handle booking success
  const handleBookingSuccess = () => {
    // Refresh bookings
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserBookings(res.data.filter((booking) => booking.userId?._id === jwtDecode(token)._id));
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">User Dashboard</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <UserBookings bookings={userBookings} />
        <ParkingLocationsSlots
          locations={locations}
          slots={slots}
          onSlotClick={handleSlotClick}
        />
        <BookSlotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          locationId={selectedSlot.locationId}
          slotId={selectedSlot.slotId}
          onBookingSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
}