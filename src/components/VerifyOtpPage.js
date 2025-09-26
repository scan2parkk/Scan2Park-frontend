"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [manualEmail, setManualEmail] = useState(""); // for user input if not in query
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email"); // 🔹 email from query param

  // Prefer query email, else fallback to manual
  const finalEmail = queryEmail || manualEmail;

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!finalEmail) {
      setError("Please provide your email.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/auth/verify-otp`,
        { email: finalEmail, otp }
      );

      if (res.data.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendMsg("");
    setLoading(true);

    if (!finalEmail) {
      setError("Please provide your email first.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/auth/resend-otp`,
        { email: finalEmail }
      );

      if (res.data.success) {
        setResendMsg("A new OTP has been sent to your email.");
      } else {
        setError(res.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="">
        <img
          src="/images/Frame-427320611.svg"
          alt="Sign in image"
          className="object-contain"
        />
      </div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-left">Verify your Email</h2>
        <p className="text-gray-700 mb-4">
          {queryEmail ? (
            <>Enter the OTP sent to <b>{queryEmail}</b></>
          ) : (
            "Enter your registered email and OTP to verify"
          )}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {resendMsg && <p className="text-blue-600 text-center mb-4">{resendMsg}</p>}

        <form onSubmit={handleOtpSubmit}>
          {/* Email input only if queryEmail is missing */}
          {!queryEmail && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          {/* OTP input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="otp">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border-0 shadow-[0_0px_10px_rgba(0,0,0,0.15)] rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter OTP"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md"
          >
            Verify OTP
          </button>
        </form>

        {/* Resend OTP button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="text-sm text-green-600 hover:text-green-700 hover:underline disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <p className="flex justify-between text-left mt-4">
          <Link
            href="/register"
            className="text-green-600 hover:text-green-700 hover:underline"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="text-green-600 hover:text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
