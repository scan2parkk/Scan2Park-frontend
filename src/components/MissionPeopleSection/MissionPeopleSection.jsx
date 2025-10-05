"use client"; // This component uses client-side interactivity for state management.

import React, { useState } from "react";
import MaxWidthContainer from "../MaxWidthContainer";

function MissionPeopleSection() {
  const [activeTab, setActiveTab] = useState("mission"); // State to manage which tab is active

  const tabContent = {
    mission: {
      title: "To ease parking",
      description:
        "Parking is one of the most forgotten, yet most impactful domains of city policy that affect traffic flow and accessibility in our cities today.",
    },
    vision: {
      title: "Future of urban mobility",
      description:
        "Our vision is to revolutionize urban mobility by providing seamless, smart, and sustainable parking solutions for everyone.",
    },
    leadership: {
      title: "Our dedicated leaders",
      description:
        "Meet the team driving Scan2Park forward, committed to innovation and excellence in the parking industry.",
    },
  
  };

  return (
    <section className="bg-white">
      <MaxWidthContainer>
        <div className="container mx-auto">
          {/* Top Section - Heading and Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our mission & people
            </h2>
            <p className="text-lg text-gray-600">
              For decades, parking was a hassle. Then in 2025, Scan2Park
              launched with a simple goal: make parking easier. Today, our team
              is committed to creating tech-based solutions that power smart
              mobility and make parking hassles of the past obsolete.
            </p>
          </div>

          {/* Mid Section - Tabs and Blue Box */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 mb-12">
            {/* Left Side - Mission/Vision/Leadership/Culture Tabs */}
            <div className="flex flex-col md:flex-row  items-start gap-6 w-full justify-between">
              <div className="flex flex-row md:flex-col lg:flex-col gap-4 md:gap-0 lg:gap-4 w-full md:w-auto lg:w-full">
                {Object.keys(tabContent).map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`
                    text-lg font-semibold py-2 px-4 rounded-md transition-all duration-300
                    ${
                      activeTab === tabKey
                        ? "text-[var(--primary)] border-l-4 border-[var(--primary)] bg-green-50"
                        : "text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50 border-l-4 border-transparent"
                    }
                    text-left w-full
                  `}
                  >
                    {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                  </button>
                ))}
              </div>
              <div className="md:border-l-2 md:border-gray-300 md:pl-6 w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {tabContent[activeTab].title}
                </h3>
                <p className="text-lg text-gray-600">
                  {tabContent[activeTab].description}
                </p>
              </div>
            </div>

            {/* Right Side - Blue Box */}
            {/* <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-lg shadow-xl flex items-center justify-center text-center w-full lg:w-1/2 max-w-md lg:max-w-none min-h-[250px]">
              <p className="text-3xl md:text-4xl font-bold leading-tight">
                Striving for
                <br />
                Better Mobility,
                <br />
                Everywhere.
              </p>
            </div> */}
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
}

export default MissionPeopleSection;
