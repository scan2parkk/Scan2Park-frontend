"use client"; // This component uses client-side interactivity for the button.

import React from "react";
import { Play } from "lucide-react"; // Using lucide-react for the play icon
import MaxWidthContainer from "../MaxWidthContainer";
import Link from "next/link";

function WhatIsScan2ParkSection() {
  return (
    <section className="bg-white">
      <MaxWidthContainer>
        {/* <div className="container mx-auto"> */}
        <div className="relative rounded-lg overflow-hidden shadow-xl mx-auto">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/WhatsApp Image 2025-10-05 at 14.04.53_cb4140bb.jpg')`, // Replace with your actual image URL
              //   backgroundBlendMode: "multiply",
              //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for text readability
            }}
          >
            {/* Optional: Additional overlay for more control */}
            {/* <div className="absolute"></div> */}
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16 flex flex-col items-start justify-center min-h-[300px] text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              What is Scan2Park?
            </h2>
            <p className="text-base md:text-lg max-w-2xl mb-8">
              Scan2Park helps millions of people easily find and pay for parking
              on their mobile devices. People can use Scan2Park solutions to
              quickly pay for street and garage parking without having to use a
              meter or kiosk. Additionally, Scan2Park offers parking
              reservations for concerts, sporting events, airports, campuses and
              more. Watch the video below to see how we’re giving people
              everywhere a smarter way to park.
            </p>
            <Link href={"/contact-us"} >
              <button className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-[var(--secondary)] focus:ring-opacity-50">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        {/* </div> */}
      </MaxWidthContainer>
    </section>
  );
}

export default WhatIsScan2ParkSection;
