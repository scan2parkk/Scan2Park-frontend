"use client";

export default async function SuccessPage({searchParams}) {
   const sessionId = searchParams.session_id;

  const res = await fetch(
    `http://localhost:5000/api/checkout-session?session_id=${sessionId}`,
    { cache: "no-store" }
  );
  const session = await res.json();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-green-400">Payment Successful 🎉</h1>
      {/* <p className="mt-4">Your session ID: {sessionId}</p> */}

      {session && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p>Amount Paid: {session.amount_total / 100} {session.currency.toUpperCase()}</p>
          <p>Status: {session.payment_status}</p>
        </div>
      )}
    </div>
  );
}
