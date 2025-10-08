import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p>Your payment was cancelled. Please try again.</p>
      <Link href="/" className="text-blue-500 underline">
        Return to Home
      </Link>
    </div>
  );
}