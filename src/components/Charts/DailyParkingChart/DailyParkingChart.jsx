import React from "react";
// import carIcon from "../../assets/images/car.png"; // Placeholder for car icon
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const DailyParkingChart = ({ daysCount = 50 }) => {
  // Default total cars parked
  const data = [
    {
      name: "Total",
      count: daysCount,
      fill: "#A78BFA", // Light purple
    },
    {
      name: "Day 1 (Aug 18)",
      count: 5,
      fill: "#6B46C1", // Dark purple
    },
    {
      name: "Day 2 (Aug 19)",
      count: 7,
      fill: "#6B46C1",
    },
    {
      name: "Day 3 (Aug 20)",
      count: 8,
      fill: "#6B46C1",
    },
    {
      name: "Day 4 (Aug 21)",
      count: 10,
      fill: "#8E5CEB", // Medium purple
    },
    {
      name: "Day 5 (Aug 22)",
      count: 6,
      fill: "#8E5CEB",
    },
    {
      name: "Day 6 (Aug 23)",
      count: 9,
      fill: "#8E5CEB",
    },
    {
      name: "Day 7 (Aug 24)",
      count: 5,
      fill: "#8E5CEB",
    },
  ];

  return (
    <div className="w-full h-full bg-white p-4 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Daily Parking (Last 7 Days)</h1>
        {/* <img src={moreButton} alt="" className="cursor-pointer" /> */}
      </div>
      <div className="w-full h-[75%] relative">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute flex top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* <img src={carIcon} alt="Car" className="w-8" /> */}
        </div>
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          {/* <img src={carIcon} alt="Car" className="w-8" /> */}
          <h2 className="text-xs text-gray-700">Total Cars ({daysCount})</h2>
        </div>
        <div className="flex flex-col gap-1">
          {/* <img src={carIcon} alt="Car" className="w-8" /> */}
          <h2 className="text-xs text-gray-700">
            Avg/Day ({Math.round(daysCount / 7)})
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DailyParkingChart;
