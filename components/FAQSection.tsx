import { FAQS } from "@/lib/faq";

/**
 * FAQSection — accordion built on the native <details>/<summary> elements.
 *
 * Why not shadcn Accordion? The native elements already provide keyboard
 * navigation, screen-reader semantics, and zero-JS behavior out of the
 * box. We just add CSS for the icon rotate.
 */
export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 md:py-24 px-6 bg-[#0e1014] border-t border-white/10 text-white"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16">
        <div>
          <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
            FAQ
          </p>
          <h2 id="faq-heading" className="text-2xl md:text-3xl leading-tight">
            Questions, answered
          </h2>
          <p className="mt-4 text-sm font-light tracking-wide text-gray-400 max-w-xs">
            Anything else? Email{" "}
            <a
              href="mailto:support@midiroad.com"
              className="text-gray-200 underline underline-offset-4 hover:text-white"
            >
              support@midiroad.com
            </a>
            .
          </p>
        </div>

        <div className="border-t border-white/10">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              // Open the first one so the format is obvious at a glance.
              open={i === 0}
              className="group border-b border-white/10"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 select-none [&::-webkit-details-marker]:hidden">
                <span className="text-base text-gray-100 group-hover:text-white">
                  {item.q}
                </span>
                {/* Plus that turns into a cross when open */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-45 group-open:text-[#2bd96b]"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="pb-5 pr-8 text-sm font-light leading-relaxed tracking-wide text-gray-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
