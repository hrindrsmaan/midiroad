"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState("");
  const searchParams = useSearchParams();
  const isDiscounted = searchParams.get("discount") === "true";

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    console.log("🛒 Checkout initialized", { isDiscounted });
    
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
      borderRadius: '8px',
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
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Left Side: Branding & Order Summary */}
      <div className="space-y-8">
        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-neo">
          <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-black/10 pb-4">
            Order Summary
          </h3>
          
          <div className="flex justify-between items-start mb-6 border-b-2 border-black/10 pb-6">
            <div className="flex gap-4">
              <img 
                src="/logo-icon.png" 
                alt="Logo" 
                className="w-16 h-16 object-contain" 
              />
              <div>
                <p className="font-black uppercase text-sm tracking-tight">The Premium Bundle</p>
                <p className="text-[12px] font-bold text-black/40">300+ MIDI / 200+ DRUMS</p>
              </div>
            </div>
            <p className="font-black text-lg">${isDiscounted ? "13.49" : "14.99"}</p>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between text-sm font-bold">
                <span className="opacity-40 uppercase tracking-widest">Subtotal</span>
                <span>${isDiscounted ? "13.49" : "14.99"}</span>
             </div>
             <div className="flex justify-between text-sm font-bold">
                <span className="opacity-40 uppercase tracking-widest">Handling</span>
                <span className="text-green-600 font-black">FREE</span>
             </div>
             <div className="flex justify-between text-2xl font-black pt-5 border-t-2 border-black">
                <span className="tracking-tighter uppercase">Total Due</span>
                <span className="text-[#ff90e8] drop-shadow-[1px_1px_0_#000] tracking-tight">${isDiscounted ? "13.49" : "14.99"}</span>
             </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white border-2 border-dashed border-black/20 p-6 rounded-2xl flex flex-col gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <p className="text-[13px] font-black uppercase tracking-tight">Instant Email Delivery</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <p className="text-[13px] font-black uppercase tracking-tight">256-Bit SSL Encryption</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 opacity-40 grayscale contrast-150 pl-2">
           <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-[14px] w-auto" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 w-auto" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-7 w-auto" />
        </div>
      </div>

      {/* Right Side: Payment Form */}
      <div className="relative">
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="border-4 border-black bg-white rounded-2xl p-20 flex flex-col items-center justify-center shadow-neo">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff90e8] border-r-4 border-r-black mb-6"></div>
            <p className="font-black uppercase tracking-widest text-[10px]">Encrypting Connection...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f4f4f0] py-8 md:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors group">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000] group-hover:-translate-y-0.5 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </div>
                Back to Store
            </Link>
        </div>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden text-center mb-10">
          <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Secure Checkout
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Finalize Order
          </h1>
        </header>

        <header className="hidden md:block mb-12">
          <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Secure Checkout
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-4">
            Finish Your<br/>Track Tonight.
          </h1>
          <p className="text-black/60 font-bold text-lg">
            The Premium MIDI + Drum Bundle is one step away.
          </p>
        </header>

        <Suspense fallback={
          <div className="border-4 border-black bg-white rounded-2xl p-20 flex flex-col items-center justify-center shadow-neo">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff90e8] border-r-4 border-r-black mb-6"></div>
            <p className="font-black uppercase tracking-widest text-[10px]">Loading Secure Payment...</p>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </main>
  );
}
