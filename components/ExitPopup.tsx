"use client";

import { useState, useEffect } from "react";

export function ExitPopup() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleDiscountBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: true }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor moves off the top of the browser viewport
      if (e.clientY <= 0 && !hasShown) {
        setShow(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#ff90e8] border-4 border-black p-8 md:p-14 rounded-[2rem] shadow-[8px_8px_0_0_#000] max-w-xl w-full relative text-center animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-5 right-5 w-10 h-10 border-2 border-black bg-white rounded-full flex items-center justify-center shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-4 uppercase">
          Wait!
        </h2>
        
        <p className="text-xl md:text-2xl font-bold text-black mb-8 leading-relaxed">
          Don't leave empty-handed. Take an extra <span className="bg-black text-[#ff90e8] px-2 py-0.5 rounded leading-none inline-block -skew-x-6">10% OFF</span> the entire bundle right now.
        </p>
        
        <button 
          onClick={handleDiscountBuy} 
          disabled={loading}
          className="btn-primary w-full text-[17px] md:text-[20px] py-6 uppercase font-black tracking-wider shadow-[4px_4px_0_0_#000] disabled:opacity-80"
        >
          {loading ? "Applying Discount..." : "Claim 10% Off & Checkout"}
        </button>
        
        <button 
          onClick={() => setShow(false)} 
          className="mt-6 text-[13px] font-bold uppercase tracking-widest text-black hover:underline underline-offset-4"
        >
          No thanks, I don't want better beats
        </button>
      </div>
    </div>
  );
}
