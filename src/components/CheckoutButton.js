// components/CheckoutButton.jsx
'use client';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton() {
  async function handleCheckout() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Test Item', amount: 5000, quantity: 1 }] // 5000 cents = $50
      })
    });
    const { id } = await res.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: id });
    if (error) console.error(error);
  }

  return <button onClick={handleCheckout}>Pay $50</button>;
}
