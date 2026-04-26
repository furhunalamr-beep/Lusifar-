import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { SystemCard, SystemButton, LegendaryTitle } from './SystemUI';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const CheckoutForm = ({ amount, onGoldPurchased }: { amount: number, onGoldPurchased: (gold: number) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100, currency: 'usd' }),
    });
    const { clientSecret } = await res.json();

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        onGoldPurchased(amount * 100); // 1 USD = 100 Gold
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-system-black/50 border border-system-gold/20 rounded">
      <CardElement className="p-2 bg-neutral-900 border border-neutral-700 rounded mb-4 text-white" />
      <SystemButton type="submit" disabled={!stripe}>
        Purchase {amount * 100} Gold
      </SystemButton>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </form>
  );
};

export const StripeShop = () => {
    const handleGoldPurchased = async (gold: number) => {
        // Need to update gold in DB
        // Fetch current stats to get current gold
        const statsRes = await fetch('/api/stats');
        const stats = await statsRes.json();
        
        await fetch('/api/stats/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...stats, gold: stats.gold + gold })
        });
        alert(`Purchased ${gold} gold!`);
    }

  return (
    <div className="space-y-8">
      <LegendaryTitle>System Gold Shop</LegendaryTitle>
      {import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
        <Elements stripe={stripePromise}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SystemCard>Purchase 100 Gold ($1.00) <CheckoutForm amount={1} onGoldPurchased={handleGoldPurchased} /></SystemCard>
                <SystemCard>Purchase 500 Gold ($5.00) <CheckoutForm amount={5} onGoldPurchased={handleGoldPurchased} /></SystemCard>
            </div>
        </Elements>
      ) : (
        <SystemCard className="text-center">Stripe not configured. Please set VITE_STRIPE_PUBLIC_KEY.</SystemCard>
      )}
    </div>
  );
};
