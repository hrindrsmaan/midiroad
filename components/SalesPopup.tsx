"use client";

import { useEffect, useState } from "react";

const US_CITIES = [
  "Los Angeles, CA", "New York, NY", "Chicago, IL", "Houston, TX",
  "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
  "Dallas, TX", "Austin, TX", "San Jose, CA", "Miami, FL", "Atlanta, GA",
  "Seattle, WA", "Denver, CO", "Nashville, TN", "Las Vegas, NV",
  "Portland, OR", "Detroit, MI", "Charlotte, NC"
];

const CUSTOMER_NAMES = [
  "Alex M.", "Jordan T.", "Chris L.", "Taylor R.", "Casey B.", 
  "Morgan S.", "Jamie K.", "Riley P.", "Avery D.", "Drew H.",
  "Sam W.", "Cameron G.", "Jesse F.", "Quinn N.", "Skyler V."
];

export function SalesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [purchaseData, setPurchaseData] = useState({ name: "", city: "", time: 1 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerPopup = () => {
      // Pick random data
      const randomCity = US_CITIES[Math.floor(Math.random() * US_CITIES.length)];
      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      const randomTime = Math.floor(Math.random() * 14) + 1; // 1 to 15 mins ago

      setPurchaseData({ name: randomName, city: randomCity, time: randomTime });
      setIsVisible(true);

      // Hide after 4 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Start the cycle: Initial delay of 2 seconds
    const initialDelay = setTimeout(() => {
      triggerPopup();
      
      // Then trigger continually every 7 seconds (4s visible + 3s gap)
      const intervalId = setInterval(triggerPopup, 7000);
      
      return () => clearInterval(intervalId);
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0_0_#000] flex items-center gap-4 w-72 md:w-80">
        <div className="w-10 h-10 min-w-[40px] rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center shadow-[1px_1px_0_0_#000]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-black leading-tight">
            {purchaseData.name} in {purchaseData.city}
          </p>
          <p className="text-[12px] font-bold text-black/60 mt-0.5">
            Purchased the Premium Bundle
          </p>
          <p className="text-[10px] font-black uppercase tracking-wider text-[#ff90e8] mt-1 line-clamp-1 truncate" style={{ WebkitTextStroke: "0.2px black" }}>
            {purchaseData.time} min ago
          </p>
        </div>
      </div>
    </div>
  );
}
