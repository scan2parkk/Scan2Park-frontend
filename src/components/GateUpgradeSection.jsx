"use client";

import Link from "next/link";
import MaxWidthContainer from "./MaxWidthContainer";

export default function GateUpgradeSection() {
  return (
    <MaxWidthContainer>
      <section className="flex flex-col border rounded-lg border-gray-300 md:flex-row items-center justify-between gap-10 bg-[#f8fbff] py-16 px-6 md:px-16">
        {/* Left: Video */}
        <div className="w-full md:w-1/2 flex justify-center">
          <video
            className="rounded-2xl  w-full h-auto max-w-[600px]"
            src="/digital-makeover.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Right: Text content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          {/* <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
          Retrofit to Upgrade
        </p> */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Give Your Parking a Smart Touch
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
            Scan2Park makes your existing gates intelligent. Enable quick QR
            scans, secure entry, and hassle-free payments without expensive new
            infrastructure. Save more while parking smarter.
          </p>
          <Link
            href="/about"
            className="inline-block bg-[var(--primary)] hover:bg-[var(--primary)] text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Know More
          </Link>
        </div>
      </section>
    </MaxWidthContainer>
  );
}
