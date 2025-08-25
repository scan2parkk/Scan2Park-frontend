import React from "react";
// import carIcon from "../../assets/images/car.png"; // Placeholder for car icon
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Feb 2025",
    cars: 120,
  },
  {
    name: "Mar 2025",
    cars: 150,
  },
  {
    name: "Apr 2025",
    cars: 180,
  },
  {
    name: "May 2025",
    cars: 200,
  },
  {
    name: "Jun 2025",
    cars: 170,
  },
  {
    name: "Jul 2025",
    cars: 160,
  },
];

const MonthlyParkingChart = () => {
  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Monthly Parking</h1>
        {/* <img src={moreButton} alt="" className="cursor-pointer" /> */}
      </div>
      <ResponsiveContainer
        className={"chart-container"}
        width={"100%"}
        height={"90%"}
      >
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="cars"
            fill="#6B46C1" // Dark purple
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4">
        {/* <img src={carIcon} alt="Car" className="w-8" /> */}
      </div>
    </div>
  );
};

export default MonthlyParkingChart;
