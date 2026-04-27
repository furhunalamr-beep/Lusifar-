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
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

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
        setSelectedAmount(null);
    }

  return (
    <div className="space-y-8">
      <LegendaryTitle>System Gold Shop</LegendaryTitle>
      {import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
        <Elements stripe={stripePromise}>
            {selectedAmount !== null ? (
                <div className="max-w-md mx-auto">
                    <SystemCard>
                        <h2 className="text-xl font-bold mb-4">Complete Purchase</h2>
                        <CheckoutForm amount={selectedAmount} onGoldPurchased={handleGoldPurchased} />
                        <SystemButton onClick={() => setSelectedAmount(null)} className="mt-4 w-full bg-neutral-800">
                            Cancel
                        </SystemButton>
                    </SystemCard>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SystemCard className="flex flex-col items-center gap-4">
                        <div className="text-2xl text-system-gold font-bold">100 Gold</div>
                        <div className="text-sm text-neutral-400">$1.00 USD</div>
                        <SystemButton onClick={() => setSelectedAmount(1)} className="w-full">
                            Select
                        </SystemButton>
                    </SystemCard>
                    <SystemCard className="flex flex-col items-center gap-4">
                        <div className="text-2xl text-system-gold font-bold">500 Gold</div>
                        <div className="text-sm text-neutral-400">$5.00 USD</div>
                        <SystemButton onClick={() => setSelectedAmount(5)} className="w-full bg-system-blue/20 text-system-blue border-system-blue/50">
                            Select
                        </SystemButton>
                    </SystemCard>
                    <SystemCard className="flex flex-col items-center gap-4 border-system-purple/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-system-purple text-white text-[8px] font-black uppercase px-2 py-1 rounded-bl-sm">Popular</div>
                        <div className="text-2xl text-system-gold font-bold">1,200 Gold</div>
                        <div className="text-sm text-neutral-400">$10.00 USD</div>
                        <SystemButton onClick={() => setSelectedAmount(10)} className="w-full bg-system-purple/20 text-system-purple border-system-purple/50">
                            Select
                        </SystemButton>
                    </SystemCard>
                    <SystemCard className="flex flex-col items-center gap-4 border-system-gold/50 relative overflow-hidden">
                         <div className="absolute top-0 right-0 bg-system-gold text-black text-[8px] font-black uppercase px-2 py-1 rounded-bl-sm">Best Value</div>
                        <div className="text-2xl text-system-gold font-bold text-shadow-glow">6,500 Gold</div>
                        <div className="text-sm text-neutral-400">$50.00 USD</div>
                        <SystemButton onClick={() => setSelectedAmount(50)} className="w-full bg-system-gold/20 text-system-gold border-system-gold/50">
                            Select
                        </SystemButton>
                    </SystemCard>
                </div>
            )}
        </Elements>
      ) : (
        <SystemCard className="text-center">Stripe not configured. Please set VITE_STRIPE_PUBLIC_KEY.</SystemCard>
      )}
    </div>
  );
};
