"use client";

import React from "react";
import MaxWidthContainer from "../MaxWidthContainer";

const Scan2ParkBusinessSection = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  reverse = false,
}) => {
  return (
    <section className="bg-white py-5 ">
      <MaxWidthContainer>
        {/* <div className="container mx-auto"> */}
          <div
            className={`flex flex-col ${
              reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center justify-center md:p-12 gap-8 md:gap-16 mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden p-6  md:max-h-[400px]`}
          >
            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-1/2">
              <img
                src={imageUrl}
                alt={title}
                className="w-full max-w-[450px] h-auto rounded-lg md:rounded-none md:rounded-l-lg object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center text-center md:text-left p-4 md:p-8 w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {title}
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8">
                {description}
              </p>
              <a
                href={buttonLink}
                className="bg-[var(--primary)] hover:bg-[var(--primary)] text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-colors duration-200 w-full md:w-auto mx-auto md:mx-0"
              >
                {buttonText}
              </a>
            </div>
          </div>
        {/* </div> */}
      </MaxWidthContainer>
    </section>
  );
};

export default Scan2ParkBusinessSection;
