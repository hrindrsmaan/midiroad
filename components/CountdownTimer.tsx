"use client";

import { useState, useEffect } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60 + 59 * 60 + 59); // Start at 3h 59m 59s
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple 1-second interval ticking down
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || timeLeft === 0) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-[#ff90e8] text-black border-b-2 border-black px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-6 text-[12px] sm:text-[14px] font-black uppercase tracking-widest z-[60] relative">
      <span>🚨 Ultra Flash Sale</span>
      <span className="bg-black text-[#ff90e8] px-3 py-1 rounded inline-block shadow-[2px_2px_0_0_#fff]">
        Ends in {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
