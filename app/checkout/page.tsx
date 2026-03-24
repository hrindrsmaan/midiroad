"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useSearchParams } from "next/navigation";

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const searchParams = useSearchParams();
  const isDiscounted = searchParams.get("discount") === "true";

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount: isDiscounted }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [isDiscounted]);

  const appearance = {
    theme: 'flat' as const,
    variables: {
      colorPrimary: '#ff90e8',
      colorBackground: '#f4f4f0',
      colorText: '#000000',
      colorDanger: '#df1b41',
      fontFamily: 'var(--font-space-grotesk), sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '2px solid #000000',
        boxShadow: '2px 2px 0px 0px #000000',
      },
      '.Input:focus': {
        border: '2px solid #ff90e8',
        boxShadow: '2px 2px 0px 0px #000000',
      },
      '.Label': {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontSize: '12px',
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <main className="min-h-screen bg-[#f4f4f0] py-12 px-6">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Secure Checkout
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Finalize Your Order
          </h1>
          <p className="text-black/60 font-bold mt-2">
            Instant delivery to your email after payment.
          </p>
        </header>

        {/* Order Summary */}
        <div className="bg-white border-4 border-black p-8 rounded-[2rem] shadow-neo mb-8">
          <div className="flex justify-between items-start mb-6 border-b-2 border-black/10 pb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-[#ff90e8] border-2 border-black rounded-xl flex items-center justify-center font-black text-xl shadow-[2px_2px_0_0_#000]">
                M
              </div>
              <div>
                <p className="font-black uppercase text-sm tracking-tight">The Premium Bundle</p>
                <p className="text-[12px] font-bold text-black/40">300+ MIDI / 200+ DRUMS</p>
              </div>
            </div>
            <p className="font-black text-lg">${isDiscounted ? "13.49" : "14.99"}</p>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between text-sm font-bold">
                <span className="opacity-40">SUBTOTAL</span>
                <span>${isDiscounted ? "13.49" : "14.99"}</span>
             </div>
             <div className="flex justify-between text-sm font-bold">
                <span className="opacity-40">TAX</span>
                <span>$0.00</span>
             </div>
             <div className="flex justify-between text-xl font-black pt-4 border-t-2 border-black">
                <span>TOTAL DUE</span>
                <span className="text-[#ff90e8] drop-shadow-[1px_1px_0_#000]">${isDiscounted ? "13.49" : "14.99"}</span>
             </div>
          </div>
        </div>

        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 scale-150 grayscale">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
            <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Encrypting Connection...</p>
          </div>
        )}

        <div className="mt-12 text-center">
            <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.2em] leading-relaxed">
                MidiRoad Studio Equipment Inc.<br/>
                All Rights Reserved 2026
            </p>
        </div>
      </div>
    </main>
  );
}
