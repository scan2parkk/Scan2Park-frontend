"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect back to the parking slot page with session_id
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      router.push(`/parking-locations/${new URLSearchParams(window.location.search).get("locationId")}?session_id=${sessionId}`);
    } else {
      router.push("/");
    }
  }, [router]);

  return <div className="text-center p-10">Processing payment...</div>;
}