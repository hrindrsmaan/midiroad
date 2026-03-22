"use client";

import Image from "next/image";

export default function Hero() {
  const handleBuy = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-purple-100 via-white to-yellow-100 px-6">
      {/* Content */}
      <div className="max-w-2xl backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Make Hard-Hitting Beats in Minutes 🔥
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          300+ MIDI + Drum Kits used by modern producers. Stop struggling and
          start finishing beats.
        </p>

        <button
          onClick={handleBuy}
          className="mt-6 px-8 py-4 bg-black text-white rounded-xl text-lg hover:scale-105 transition"
        >
          Get Instant Access
        </button>

        <p className="mt-3 text-sm text-gray-500">
          Instant download • Royalty free • Works in all DAWs
        </p>
      </div>
    </section>
  );
}
