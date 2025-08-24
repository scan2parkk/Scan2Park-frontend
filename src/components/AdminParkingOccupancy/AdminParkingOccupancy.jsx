"use client";

import { useState } from "react";
import BlueBus from "/public/images/blue-bus.svg";
import GrayBus from "/public/images/gray-bus.svg";

const AdminParkingOccupancy = () => {
  const [data, setData] = useState([
    {
      id: "a016a528-ef37-4b36-a855-5990f9ea6979",
      name: "Downtown Garage",
      location: "123 Main St, Cityville",
      slots: "60",
    },
    {
      id: "a016a528-ef37-4b36-a855-5990f9ea6939",
      name: "Riverside Parking",
      location: "45 River Rd, Cityville",
      slots: "85",
    },
    {
      id: "a016a528-ef37-4b36-a855-3990f9ea6979",
      name: "East Side Lot",
      location: "789 East Ave, Cityville",
      slots: "40",
    },
    {
      id: "a016a528-ef37-4b36-a855-6990f9ea6979",
      name: "West End Garage",
      location: "321 West Blvd, Cityville",
      slots: "75",
    },
    {
      id: "a016a528-ef37-4b36-a855-5990f9ea6679",
      name: "Downtown Garage",
      location: "123 Main St, Cityville",
      slots: "60",
    },
    {
      id: "a016a528-ef37-4b46-a855-5990f9ea6979",
      name: "Riverside Parking",
      location: "45 River Rd, Cityville",
      slots: "85",
    },
    {
      id: "a016a528-gf37-4b36-a855-5990f9ea6979",
      name: "East Side Lot",
      location: "789 East Ave, Cityville",
      slots: "40",
    },
    {
      id: "a016a558-ef37-4b36-a855-5990f9ea6979",
      name: "West End Garage",
      location: "321 West Blvd, Cityville",
      slots: "75",
    },
    {
      id: "a016a523-ef37-4b36-a855-5990f9ea6979",
      name: "Downtown Garage",
      location: "123 Main St, Cityville",
      slots: "60",
    },
    {
      id: "a0161528-ef37-4b36-a855-5990f9ea6979",
      name: "Riverside Parking",
      location: "45 River Rd, Cityville",
      slots: "85",
    },
    {
      id: "a0162528-ef37-4b36-a855-5990f9ea6979",
      name: "East Side Lot",
      location: "789 East Ave, Cityville",
      slots: "40",
    },
    {
      id: "a016a508-ef37-4b36-a855-5990f9ea6979",
      name: "West End Garage",
      location: "321 West Blvd, Cityville",
      slots: "75",
    },
    {
      id: "1016a528-ef37-4b36-a855-5990f9ea6979",
      name: "Downtown Garage",
      location: "123 Main St, Cityville",
      slots: "60",
    },
    {
      id: "a012a528-ef37-4b36-a855-5990f9ea6979",
      name: "Riverside Parking",
      location: "45 River Rd, Cityville",
      slots: "85",
    },
    {
      id: "a016a528-ef37-4b31-a855-5990f9ea6979",
      name: "East Side Lot",
      location: "789 East Ave, Cityville",
      slots: "40",
    },
    {
      id: "a016a528-ef37-4b32-a855-5990f9ea6979",
      name: "West End Garage",
      location: "321 West Blvd, Cityville",
      slots: "75",
    },
    {
      id: "a016a528-ef37-4b33-a855-5990f9ea6979",
      name: "Central Plaza Parking",
      location: "555 Central Plaza, Cityville",
      slots: "100",
    },
    {
      id: "a016a528-ef37-4b36-a800-5990f9ea6979",
      name: "Tech Park Lot",
      location: "101 Innovation Way, Cityville",
      slots: "50",
    },
    {
      id: "a016a528-ef37-4b36-a855-599021ea6979",
      name: "Greenwood Mall Parking",
      location: "200 Greenwood Dr, Cityville",
      slots: "120",
    },
    {
      id: "a016a528-ef37-4b36-a855-5990239ea6979",
      name: "Airport Parking Zone A",
      location: "1 Skyway Dr, Cityville",
      slots: "150",
    },
    {
      id: "a016a528-ef37-4b36-a855-599029ea6979",
      name: "Harborfront Parking",
      location: "88 Dockside Ln, Cityville",
      slots: "70",
    },
    {
      id: "a016a528-ef37-4b36-a855-5990f9ea6209",
      name: "City Stadium Lot",
      location: "90 Victory Rd, Cityville",
      slots: "95",
    },
  ]);
  const renderRow = (rowNumber, occupiedSlots, totalSlots) => {
    const slots = [];
    for (let i = 0; i < totalSlots; i++) {
      const isOccupied = i < occupiedSlots;
      slots.push(
        <div key={i} className="h-8 w-8">
          <img src={isOccupied ? BlueBus.src : GrayBus.src} alt="blue bus" />
        </div>
      );
    }
    return (
      <div key={rowNumber} className="flex items-center space-x-2 mb-2">
        <div className="text-gray-500 text-sm w-12 flex-shrink-0">
          Row {rowNumber}
        </div>
        <div className="flex space-x-2 overflow-x-auto">{slots}</div>
      </div>
    );
  };
  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 col-span-1">
        <h2 className="text-xl font-bold mb-4">Parking Locations</h2>
        pass
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 col-span-1">
        <h2 className="text-xl font-bold mb-4">Parking Occupancy</h2>
        {renderRow(1, 3, 5)}
        {renderRow(2, 2, 5)}
        {renderRow(3, 4, 5)}
        {renderRow(4, 1, 5)}
        {renderRow(5, 3, 5)}
      </div>
    </>
  );
};

export default AdminParkingOccupancy;
