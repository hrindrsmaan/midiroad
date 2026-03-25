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
      <div className="border-4 border-black p-6 bg-[#f4f4f0] rounded-2xl shadow-[4px_4px_0_0_#000]">
        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-black pb-4">
          Secure Payment
        </h3>
        
        {/* Email Field - CRITICAL FOR CONVERSION */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-[12px] font-black uppercase tracking-widest mb-2 text-black/60">
            Email Address (For Download Link)
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="producer@example.com"
            className="w-full bg-white border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0_0_#000] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none font-bold text-lg"
          />
        </div>

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

    </form>
  );
}
