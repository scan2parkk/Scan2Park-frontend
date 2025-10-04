"use client"; // This component uses client-side interactivity for the button hover effect.

import React, { useState } from "react";
import MaxWidthContainer from "../MaxWidthContainer";

function ParkingStartingPointSection() {
  const [isVideoButtonHovered, setIsVideoButtonHovered] = useState(false);

  return (
    <section className="bg-white">
      <MaxWidthContainer>
        {/* <div className="container mx-auto"> */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mx-auto">
            {/* Left Section - Text Content and Buttons */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="text-[var(--primary)] text-lg font-semibold mb-3">
                About Scan2Park
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Because parking is just a starting point
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                At the start, we just wanted to make parking easier. Today,
                we’re the leading provider of parking solutions in the India and
                it’s our mission to make cities more livable.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                {/* See our recent news button */}
                <button className="bg-white border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-green-50 hover:text-[var(--primary)] font-semibold py-3 px-6 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-opacity-50">
                  See our recent news
                </button>

                {/* VIDEO: Smart mobility button with hover animation */}
               
              </div>
            </div>

            {/* Right Section - Image of Phone with Car */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <img
                src="/images/About-Scan2Park-Parking-App.jpg" // Placeholder for phone and car image
                alt="Phone displaying Scan2Park app with a car"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        {/* </div> */}
      </MaxWidthContainer>
    </section>
  );
}

export default ParkingStartingPointSection;
