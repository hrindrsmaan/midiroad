"use client";

import { FAQS } from "@/lib/faq";

/**
 * FAQSection — accordion built on the native <details>/<summary> elements.
 *
 * Why not shadcn Accordion? The native elements already provide keyboard
 * navigation, screen-reader semantics, and zero-JS behavior out of the
 * box. We just add CSS for the chevron rotate and a clean reveal.
 */
export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 px-6 bg-[#f4f4f0]"
    >
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-black bg-[#ff90e8] border-2 border-black rounded-full px-3 py-1 shadow-[3px_3px_0_0_#000] -rotate-2">
            Got Questions?
          </span>
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-black mt-4 mb-3 tracking-tight"
          >
            Everything you need to know
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Honest answers to the questions producers ask before hitting
            checkout. Still stuck? Email{" "}
            <a
              href="mailto:support@midiroad.com"
              className="underline underline-offset-2 hover:text-black font-semibold"
            >
              support@midiroad.com
            </a>
            .
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              // Open the first two by default — the ones that match the
              // highest-traffic objections (compatibility + skill level).
              open={i < 2}
              className="group rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_0_#000] overflow-hidden transition-shadow hover:shadow-[5px_5px_0_0_#000]"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 select-none">
                <span className="font-bold text-base sm:text-lg leading-snug pr-2">
                  {item.q}
                </span>
                {/* Chevron — rotates 180° when <details> is open */}
                <span
                  aria-hidden
                  className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#ff90e8] border-2 border-black text-black text-sm font-black transition-transform duration-300 group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                  {item.a}
                </p>
                {item.bullets && (
                  <ul className="mt-3 space-y-1.5">
                    {item.bullets.map((b, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 inline-block w-1.5 h-1.5 bg-black rounded-full shrink-0"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA rail */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600 mb-3">Ready to make your next beat?</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Scroll back to the main product CTA.
              document
                .getElementById("main-cta")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="inline-flex items-center gap-2 font-bold text-black underline underline-offset-4 hover:no-underline"
          >
            Get Instant Access — $24.99 <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
