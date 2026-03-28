"use client";

import { useState, useEffect } from "react";

interface StickyMobileCTAProps {
  onBuy: () => void;
  loading: boolean;
}

export function StickyCTA({ onBuy, loading }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past the initial hero stack)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto bg-black border-2 border-white/10 rounded-2xl p-3 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md bg-opacity-90">
        <button
          onClick={() => {
            onBuy();
          }}
          disabled={loading}
          className="w-full bg-[#ff90e8] text-black font-black uppercase py-4 rounded-xl shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-between px-4 sm:px-6 cursor-pointer group hover:scale-[1.01]"
        >
          {loading ? (
            <div className="w-full text-center italic opacity-80 animate-pulse">Processing...</div>
          ) : (
            <>
              {/* Left Side: Sales Tactic */}
              <div className="flex flex-col items-start text-left leading-none min-w-0">
                <span className="text-[9px] md:text-[10px] font-black tracking-widest opacity-60 mb-1 truncate">SALE ENDS TONIGHT</span>
                <span className="text-[13px] md:text-[16px] truncate">Get the Premium Bundle</span>
              </div>

              {/* Right Side: Price & Badge */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0 focus-within:">
                <div className="hidden md:flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-black">TRENDING</span>
                </div>
                
                <div className="flex flex-col items-end leading-none">
                   <span className="text-[9px] md:text-[10px] font-bold line-through opacity-40 mb-1">$49.99</span>
                   <span className="text-[16px] md:text-[20px] font-black tracking-tight">$14.99</span>
                </div>

                <div className="bg-black text-[#ff90e8] text-[9px] md:text-[11px] font-black px-1.5 py-1 rounded shadow-[1px_1px_0_0_#ff90e8] rotate-3 group-hover:rotate-0 transition-transform">
                  70% OFF
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
