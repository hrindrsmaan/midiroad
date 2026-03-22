"use client";

export default function Pricing() {
  const handleBuy = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-bold">Limited Time Offer</h2>

      <p className="mt-4 text-gray-600 line-through">$29</p>
      <p className="text-5xl font-bold">$9</p>

      <button
        onClick={handleBuy}
        className="mt-6 px-8 py-4 bg-black text-white rounded-xl text-lg"
      >
        Download Now
      </button>
    </section>
  );
}
