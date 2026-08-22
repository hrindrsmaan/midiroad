"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  useEffect(() => {
    // Redirect to Stripe Payment Link from environment variable
    const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      // Fallback - redirect to home if no payment link configured
      window.location.href = "/";
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4f0] py-8 md:py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000] group-hover:-translate-y-0.5 transition-transform">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
            Back to Store
          </Link>
        </div>

        <div className="border-4 border-black bg-white rounded-2xl p-20 flex flex-col items-center justify-center shadow-neo">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff90e8] border-r-4 border-r-black mb-6"></div>
          <p className="font-black uppercase tracking-widest text-[10px]">
            Redirecting to secure checkout...
          </p>
        </div>
      </div>
    </main>
  );
}
