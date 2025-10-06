"use client"; // This component uses client-side interactivity for the button.

import React from "react";
import { Play } from "lucide-react"; // Using lucide-react for the play icon
import MaxWidthContainer from "../MaxWidthContainer";
import Link from "next/link";

function PayForParkingSection() {
  return (
    <section className="relative bg-white py-5">
      <MaxWidthContainer>
        {/* <div className="container mx-auto"> */}
        <div className="relative rounded-lg overflow-hidden shadow-xl mx-auto">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{
              backgroundImage: `url('/WhatsApp Image 2025-10-05 at 13.56.57_c046bb0e.jpg')`, // Replace with your actual image URL
              backgroundBlendMode: "multiply",
              backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for text readability
            }}
          >
            {/* Optional: Additional overlay for more control */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:py-28 md:px-20 flex flex-col md:flex-row items-center justify-between">
            {/* Left Content - Text and Button */}
            <div className="text-white text-center md:text-left max-w-xl mb-8 md:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Park. Pay. Go.
              </h2>
              <p className="text-base md:text-lg mb-6">
                Whether you’re heading to
                class, work, or an event, our smart system makes parking
                effortless. Reserve in advance, pay on the go, and enjoy a
                smooth, eco-friendly experience every time.
              </p>
              <Link href="/about">
                <button className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-colors duration-200">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* </div> */}
      </MaxWidthContainer>
    </section>
  );
}

export default PayForParkingSection;
