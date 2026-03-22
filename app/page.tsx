"use client";

import { useCallback, useState } from "react";

const testimonials = [
  {
    quote:
      "These kits cut my beat-making time in half. The melodies are crisp and inspire new ideas every session.",
    name: "J. Alvarez",
    role: "Grammy-nominated producer",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "Plugged straight into Ableton—no tweaking, just instant energy. Every drop hits now.",
    name: "Nova Orion",
    role: "Hybrid trap artist",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "Immediate vibe. The drum fills and MIDI phrasing pushed my EP forward in a single night.",
    name: "Rae Lumen",
    role: "Beat coach",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
];

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleBuy = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
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
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black">

      <nav className="flex items-center justify-between px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black sticky top-0 z-50">
        <a
          href="/"
          className="font-bold text-xl tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="MidiRoad Home"
        >
          <div className="w-8 h-8 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
            <span className="text-black font-black text-[16px] leading-none pt-[1px] -ml-[1px]">M</span>
          </div>
          MidiRoad
        </a>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="text-white font-bold uppercase text-[13px] tracking-wider hover:underline underline-offset-4 decoration-2"
        >
          {loading ? "Loading..." : "Get the Bundle"}
        </button>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 px-6 border-b-2 border-black">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">


          <h1 className="text-6xl font-bold tracking-tighter text-black md:text-8xl lg:leading-[1.1]">
            Stop overthinking beats.
          </h1>

          <style>{`
            .text-stroke {
              -webkit-text-stroke: 2px black;
              color: transparent;
            }
          `}</style>

          <p className="text-xl text-black font-medium max-w-2xl mx-auto leading-relaxed">
            Drag and drop 300+ royalty-free MIDI sequences and 200+ pro-grade
            drum hits directly into your DAW. Finish tracks tonight.
          </p>

          <div className="pt-8 flex flex-col items-center gap-6 w-full sm:w-auto">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="btn-primary cursor-pointer w-full sm:w-auto flex items-center justify-center px-10 py-5 text-[17px] font-bold uppercase tracking-wide disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting..." : "Download the Premium Bundle — $9"}
            </button>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[14px] text-black font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Instant Access
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Royalty Free
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Secure Payment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Bar */}
      <section className="border-b-2 border-black bg-white py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[13px] uppercase tracking-widest text-black font-bold mb-8">
            Tested & proven to work inside your favorite DAW
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-80 select-none">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter">FL Studio</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter">Ableton Live</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter">Logic Pro</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter">Pro Tools</span>
          </div>
        </div>
      </section>

      {/* 3. The Agitation (Problem) */}
      <section className="py-24 px-6 md:py-32 bg-[#ff90e8] border-b-2 border-black">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-white border-2 border-black p-10 md:p-16 rounded-[2rem] shadow-neo-lg">
          <h2 className="text-4xl font-bold text-black md:text-6xl tracking-tighter leading-[1.1]">
            Are your tracks sounding thin and repetitive?
          </h2>
          <p className="text-black font-medium text-lg md:text-xl leading-relaxed mx-auto pt-2">
            You know exactly how the beat should sound in your head, but spending hours clicking in MIDI notes and digging through weak drum samples kills your momentum. By the time you find the right snare, the initial spark is completely gone.
          </p>
        </div>
      </section>

      {/* 4. The Solution (What's Inside) */}
      <section className="py-24 md:py-32 px-6 border-b-2 border-black bg-[#f4f4f0]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-black md:text-6xl tracking-tighter mb-6">
              Skip the blank project screen.
            </h2>
            <p className="text-black font-medium text-xl">
              We did the heavy lifting so you don't have to. No filler, just mix-ready files you can use immediately to craft your next hit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <article className="border-2 border-black bg-white rounded-3xl p-8 md:p-12 shadow-neo">
              <div className="w-14 h-14 mb-8 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center font-black text-black text-xl shadow-[2px_2px_0_0_#000]">01</div>
              <h3 className="text-3xl font-bold text-black mb-8 tracking-tighter">
                300+ MIDI Progressions
              </h3>
              <ul className="space-y-5 text-black font-semibold text-[17px]">
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Complex chord voicings ready to drop
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Industry-standard hi-hat bounce patterns
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Dark trap melodies & R&B chords
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Key and BPM labeled for quick searching
                </li>
              </ul>
            </article>

            <article className="border-2 border-black bg-white rounded-3xl p-8 md:p-12 shadow-neo">
              <div className="w-14 h-14 mb-8 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center font-black text-black text-xl shadow-[2px_2px_0_0_#000]">02</div>
              <h3 className="text-3xl font-bold text-black mb-8 tracking-tighter">
                200+ Premium Drum Hits
              </h3>
              <ul className="space-y-5 text-black font-semibold text-[17px]">
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Unique 808s that punch through phone speakers
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Crisp, modern snares and claps
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Interesting percussion and foley textures
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 text-[#ff90e8] font-black pointer-events-none drop-shadow-[1px_1px_0_#000]">✓</div>
                  Mixed loud and ready to clip in your master
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 px-6 border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-black md:text-6xl tracking-tighter">
              Producers are leveling up.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.quote}
                className="flex flex-col justify-between rounded-3xl border-2 border-black bg-[#f4f4f0] p-8 md:p-10 shadow-neo hover:-translate-y-1 transition-transform"
              >
                <div className="flex gap-1 mb-6 text-[#ff90e8]">
                  {/* Stars */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
                <blockquote className="text-[17px] font-medium text-black leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t-2 border-black">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name}`}
                    className="h-14 w-14 rounded-full object-cover border-2 border-black shadow-[2px_2px_0_0_#000]"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-[16px] font-bold text-black tracking-tight">
                      {testimonial.name}
                    </p>
                    <p className="text-[14px] font-bold text-black/60 uppercase tracking-widest mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The Guarantee & Final Offer */}
      <section className="py-24 md:py-32 px-6 border-b-2 border-black bg-[#f4f4f0]">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-black bg-white rounded-[3rem] p-8 md:p-20 text-center shadow-neo-lg">
            <h2 className="text-5xl font-black text-black md:text-7xl tracking-tighter mb-6 leading-none">
              Start finishing tracks tonight.
            </h2>
            <p className="text-xl font-medium text-black mb-12 max-w-2xl mx-auto leading-relaxed">
              Get immediate lifetime access to the entire bundle. It's just $9, and if it doesn't double your output, you get your money back.
            </p>

            <div className="bg-[#ff90e8] border-2 border-black rounded-2xl p-6 md:p-8 mb-12 max-w-md mx-auto text-left shadow-[2px_2px_0_0_#000]">
              <h4 className="flex items-center gap-3 text-black font-black text-lg mb-3 uppercase tracking-wide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                100% Risk-Free Guarantee
              </h4>
              <p className="text-[15px] font-medium text-black leading-relaxed">
                Download the kit, test out the sounds in your DAW. If you don't feel like it instantly improved your workflow, simply email us within 30 days and you'll get a full refund. No questions asked.
              </p>
            </div>

            <button
              onClick={handleBuy}
              disabled={loading}
              className="btn-primary cursor-pointer w-full sm:w-auto flex items-center justify-center px-14 py-6 text-[18px] font-bold uppercase tracking-wider mx-auto disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting..." : "Get Instant Access — $9"}
            </button>
            <p className="text-[14px] font-bold uppercase tracking-wider text-black mt-8 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              One-time payment. Secure checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-14 text-center text-black flex flex-col items-center">
        <a
          href="/"
          className="flex items-center justify-center gap-3 mb-8 hover:-translate-y-1 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
            <span className="text-black font-black text-xl leading-none pt-[2px] -ml-[1px]">M</span>
          </div>
          <span className="font-bold text-2xl tracking-tighter">MidiRoad</span>
        </a>
        <p className="mb-6 font-medium text-black max-w-sm mx-auto text-[15px] px-6 leading-relaxed">
          Premium drag-and-drop MIDI loops, chord progressions, and pro-grade
          drum kits to speed up your workflow.
        </p>
        <p className="text-[14px] font-bold uppercase tracking-widest text-black/60">
          © {new Date().getFullYear()} MidiRoad
        </p>
      </footer>
    </main>
  );
}
