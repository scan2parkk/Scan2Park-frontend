import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import "./calender.css";

const EventCalender = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default EventCalender;
