// app/verify-otp/page.tsx
import VerifyOtpPage from "@/components/VerifyOtpPage";
import { Suspense } from "react";

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
