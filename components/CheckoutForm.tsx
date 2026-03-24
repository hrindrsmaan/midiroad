"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { playSFX } from "@/lib/audio-sfx";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    playSFX('click');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="border-4 border-black p-6 bg-[#f4f4f0] rounded-[2rem] shadow-[4px_4px_0_0_#000]">
        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-black pb-4">
          Secure Payment
        </h3>
        <PaymentElement 
          id="payment-element" 
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {message && (
        <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl font-bold text-sm animate-pulse">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        onMouseEnter={() => playSFX('hover')}
        className="w-full bg-[#ff90e8] text-black font-black uppercase py-5 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl tracking-tight"
      >
        <span id="button-text">
          {isLoading ? "Processing..." : "Complete Order — $14.99"}
        </span>
      </button>

      <p className="text-[12px] font-bold text-black/40 text-center uppercase tracking-widest flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Bank-level encrypted connection
      </p>
    </form>
  );
}
