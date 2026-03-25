"use client";

import { useCallback, useState } from "react";
import { SalesPopup } from "@/components/SalesPopup";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ExitPopup } from "@/components/ExitPopup";
import { AudioDemo } from "@/components/AudioDemo";
import { StickyCTA } from "@/components/StickyCTA";
import { playSFX } from "@/lib/audio-sfx";
import * as gtag from "@/lib/gtag";

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

  const handleBuy = useCallback(async (isDiscount: boolean = false) => {
    setLoading(true);
    
    // Track the click event
    gtag.event({
      action: "click_download",
      category: "engagement",
      label: isDiscount ? "Main Page Bundle Button (DISCOUNTED)" : "Main Page Bundle Button",
    });

    playSFX('click');

    // Redirect to our custom checkout page
    const checkoutUrl = isDiscount ? "/checkout?discount=true" : "/checkout";
    window.location.href = checkoutUrl;
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black overflow-x-hidden">
      <CountdownTimer />
      <nav className="flex items-center justify-between px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black sticky top-0 z-40">
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
          onClick={() => handleBuy(false)}
          disabled={loading}
          className="text-white font-bold uppercase text-[13px] tracking-wider hover:underline underline-offset-4 decoration-2"
        >
          {loading ? "Loading..." : "Get the Bundle"}
        </button>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-6 border-b-2 border-black">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">


          <h1 className="text-5xl font-black tracking-tighter text-black md:text-7xl leading-none max-w-3xl mx-auto">
            Stop overthinking beats.
          </h1>

          <style>{`
            .text-stroke {
              -webkit-text-stroke: 2px black;
              color: transparent;
            }
          `}</style>

          <p className="text-xl md:text-2xl text-black font-black max-w-2xl mx-auto leading-tight">
            Get 500+ pro-grade sounds for just <span className="bg-[#ff90e8] border-2 border-black px-2 py-0.5 rounded shadow-[2px_2px_0_0_#000]">$14.99</span> <span className="text-[14px] uppercase tracking-tighter opacity-70">(70% OFF)</span>. 
          </p>
          <p className="text-lg text-black/60 font-bold max-w-2xl mx-auto leading-snug">
            Drag and drop royalty-free MIDI sequences and drum hits directly into your DAW. Finish tracks tonight.
          </p>

          {/* Audio Demo Player */}
          <AudioDemo />

          <div className="pt-12 flex flex-col items-center gap-8 w-full sm:w-auto">
            {/* The Image + Overlapping Badge Group */}
            <div className="relative inline-block mt-4 mb-2">
              <div className="absolute -top-6 -right-6 md:-right-10 z-20 rotate-12 bg-black text-[#ff90e8] text-[13px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[2px_2px_0_0_#ff90e8] animate-bounce">
                💥 70% OFF
              </div>
              <img 
                src="/images/bundle-poster.png" 
                alt="Premium MIDI + Drum Kit Bundle Poster" 
                className="w-48 md:w-56 mx-auto object-contain pointer-events-none" 
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Avatar Stack Social Proof */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80"
                  ].map((url, i) => (
                    <img key={i} src={url} className="w-8 h-8 rounded-full border-2 border-black object-cover" alt="User avatar" />
                  ))}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#ff90e8" stroke="black" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-tight text-black">Downloaded by 500+ producers</span>
                </div>
              </div>

              {/* Dynamic Trending Pill */}
              <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0_0_#000] mb-1 animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                  🔥 Trending in Los Angeles
                </span>
              </div>

              <span className="bg-[#ff90e8] text-black border-2 border-black text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[2px_2px_0_0_#000]">
                Sale Ends Tonight
              </span>
              <button
                onClick={() => handleBuy(false)}
                onMouseEnter={() => playSFX('hover')}
                disabled={loading}
                className="btn-primary group relative overflow-hidden cursor-pointer w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 disabled:opacity-80 disabled:cursor-not-allowed text-center"
              >
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-transform duration-300 ${!loading ? "group-hover:-translate-y-20" : ""}`}>
                  {loading ? (
                    <span className="text-[15px] md:text-[17px] font-bold uppercase tracking-wide">Redirecting...</span>
                  ) : (
                    <span className="text-[15px] md:text-[17px] font-bold uppercase tracking-wide">Download the Premium Bundle</span>
                  )}
                  {!loading && (
                    <span className="flex items-center gap-2 mt-1 sm:mt-0 text-[15px] md:text-[17px] font-bold uppercase tracking-wide">
                      <span className="line-through opacity-60 text-sm font-bold">$49.99</span>
                      <span className="text-[#ff90e8] sm:text-inherit">$14.99</span>
                    </span>
                  )}
                </div>
                {!loading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 text-[16px] md:text-[18px] font-black uppercase tracking-wide bg-black text-[#ff90e8] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xl">🤑</span> You save $35 today!
                  </div>
                )}
              </button>
            </div>
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
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80 select-none grayscale contrast-125">
            {/* FL Studio Logo (Simplified SVG) */}
            <div className="flex flex-col items-center gap-2 group">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="black"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
              <span className="text-[14px] font-black uppercase tracking-tighter">FL Studio</span>
            </div>
            {/* Ableton Logo (Simplified Lines) */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex gap-1 h-10 items-center">
                {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-full bg-black"></div>)}
                <div className="flex flex-col gap-1 h-full mx-1">
                  {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-6 bg-black"></div>)}
                </div>
              </div>
              <span className="text-[14px] font-black uppercase tracking-tighter">Ableton Live</span>
            </div>
            {/* Logic Pro (Simplified SVG) */}
            <div className="flex flex-col items-center gap-2 group">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
              <span className="text-[14px] font-black uppercase tracking-tighter">Logic Pro</span>
            </div>
            {/* Pro Tools (Simplified SVG) */}
            <div className="flex flex-col items-center gap-2 group">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="black"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="text-[14px] font-black uppercase tracking-tighter">Pro Tools</span>
            </div>
          </div>
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
      <section className="py-24 px-0 border-b-2 border-black bg-[#ff90e8] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-black md:text-6xl tracking-tighter">
              Producers are leveling up.
            </h2>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="relative w-full flex overflow-hidden py-4">
          <div className="animate-marquee gap-6 md:gap-8 px-4">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
              <figure
                key={i}
                className="w-[300px] md:w-[400px] shrink-0 flex flex-col justify-between rounded-[2rem] border-4 border-black bg-white p-8 md:p-10 shadow-[4px_4px_0_0_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-1 mb-6 text-[#ff90e8]">
                  {/* Stars */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
                <blockquote className="text-[16px] md:text-[18px] font-medium text-black leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t-2 border-black">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name}`}
                    className="h-14 w-14 rounded-full object-cover border-2 border-black shadow-[2px_2px_0_0_#000]"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[16px] font-bold text-black tracking-tight">
                        {testimonial.name}
                      </p>
                      <span className="flex items-center gap-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-green-200">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Verified Purchase
                      </span>
                    </div>
                    <p className="text-[13px] md:text-[14px] font-bold text-black/60 uppercase tracking-widest mt-0.5">
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
            <p className="text-xl font-medium text-black mb-8 max-w-2xl mx-auto leading-relaxed">
              Get immediate lifetime access to the entire bundle. If it doesn't double your output, you get your money back.
            </p>

            {/* The Value Stack */}
            <div className="max-w-md mx-auto mb-12 text-left border-4 border-black bg-[#f4f4f0] p-6 md:p-10 rounded-3xl shadow-[4px_4px_0_0_#000]">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-black pb-4 text-center">Value Stack</h3>
              <div className="space-y-4 text-[17px] font-bold text-black">
                <div className="flex justify-between items-center">
                  <span>300+ Premium MIDI Progressions</span>
                  <span className="opacity-50 line-through">$49</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>200+ Mix-Ready Drum Hits</span>
                  <span className="opacity-50 line-through">$29</span>
                </div>
                <div className="flex justify-between items-center text-[#ff90e8] drop-shadow-[1px_1px_0_#000]">
                  <span>✨ BONUS: Trap Arrangement Kit</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-black/20">
                  <span>Total Value</span>
                  <span className="opacity-50 line-through">$107</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t-4 border-black text-2xl md:text-3xl text-black">
                  <span>Today's Price</span>
                  <span className="bg-[#ff90e8] text-black px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0_0_#000] -skew-x-6">$14.99</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ff90e8] border-2 border-black rounded-2xl p-6 md:p-8 mb-12 max-w-md mx-auto text-left shadow-[2px_2px_0_0_#000]">
              <h4 className="flex items-center gap-3 text-black font-black text-lg mb-3 uppercase tracking-wide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                100% Risk-Free Guarantee
              </h4>
              <p className="text-[15px] font-medium text-black leading-relaxed">
                Download the kit, test out the sounds in your DAW. If you don't feel like it instantly improved your workflow, simply email us within 30 days and you'll get a full refund. No questions asked.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Avatar Stack Social Proof */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80"
                  ].map((url, i) => (
                    <img key={i} src={url} className="w-8 h-8 rounded-full border-2 border-black object-cover" alt="User avatar" />
                  ))}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#ff90e8" stroke="black" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-tight text-black">Downloaded by 500+ producers</span>
                </div>
              </div>

              {/* Dynamic Trending Pill */}
              <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0_0_#000] mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                  🔥 Trending in New York City
                </span>
              </div>

              <span className="bg-black text-[#ff90e8] text-[13px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[2px_2px_0_0_#ff90e8] animate-bounce">
                💥 70% OFF — Sale Ends Tonight
              </span>
              <button
                onClick={() => handleBuy(false)}
                onMouseEnter={() => playSFX('hover')}
                disabled={loading}
                className="btn-primary group relative overflow-hidden cursor-pointer w-full sm:w-auto px-6 py-5 md:px-14 md:py-6 disabled:opacity-80 disabled:cursor-not-allowed text-center"
              >
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-transform duration-300 ${!loading ? "group-hover:-translate-y-24" : ""}`}>
                  {loading ? (
                    <span className="text-[16px] md:text-[18px] font-bold uppercase tracking-wider">Redirecting...</span>
                  ) : (
                    <span className="text-[16px] md:text-[18px] font-bold uppercase tracking-wider">Get Instant Access</span>
                  )}
                  {!loading && (
                    <span className="flex items-center gap-2 mt-1 sm:mt-0 text-[16px] md:text-[18px] font-bold uppercase tracking-wider">
                      <span className="line-through opacity-60 text-sm font-bold">$49.99</span>
                      <span className="text-[#ff90e8] sm:text-inherit">$14.99</span>
                    </span>
                  )}
                </div>
                {!loading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 text-[17px] md:text-[19px] font-black uppercase tracking-wide bg-black text-[#ff90e8] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xl">😏</span> Steal this bundle now
                  </div>
                )}
              </button>
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-black/40 mt-6 flex items-center justify-center gap-3">
              <span>Lifetime Access</span>
              <span className="w-1 h-1 bg-black/20 rounded-full"></span>
              <span>One-Time Payment</span>
              <span className="w-1 h-1 bg-black/20 rounded-full"></span>
              <span>No Subscription</span>
            </p>
            <p className="text-[14px] font-bold uppercase tracking-wider text-black mt-4 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              One-time payment. Secure checkout.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 px-6 md:py-32 border-b-2 border-black bg-[#f4f4f0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black md:text-6xl tracking-tighter">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6 text-left">
            <div className="border-4 border-black p-6 md:p-8 bg-white rounded-[2rem] shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
              <h3 className="text-xl md:text-2xl font-black text-black mb-3 tracking-tight uppercase">Are these 100% royalty-free?</h3>
              <p className="text-[17px] text-black font-medium leading-relaxed">Absolutely. Once you purchase the bundle, you own the right to use these melodies and drums in your commercial tracks, no credit required. You keep all your placements and royalties.</p>
            </div>
            <div className="border-4 border-black p-6 md:p-8 bg-white rounded-[2rem] shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
              <h3 className="text-xl md:text-2xl font-black text-black mb-3 tracking-tight uppercase">Do these files work in my DAW?</h3>
              <p className="text-[17px] text-black font-medium leading-relaxed">Yes. All MIDI files and WAV drum samples are universally compatible. FL Studio, Ableton Live, Logic Pro, Pro Tools, Studio One—if your software accepts MIDI/WAV, you're good-to-go.</p>
            </div>
            <div className="border-4 border-black p-6 md:p-8 bg-white rounded-[2rem] shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
              <h3 className="text-xl md:text-2xl font-black text-black mb-3 tracking-tight uppercase">How do I access the files?</h3>
              <p className="text-[17px] text-black font-medium leading-relaxed">Instantly. After completing the secure checkout, you'll immediately be redirected to a download page. We also automatically send you an email receipt with a secure backup download link that lasts for 30 days.</p>
            </div>
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

      {/* Exit Intent */}
      <ExitPopup />
      {/* Sticky CTA */}
      <StickyCTA onBuy={() => handleBuy(false)} loading={loading} />
    </main>
  );
}
