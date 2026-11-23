import type { FaqItem } from "@/lib/faq";

/**
 * A short FAQ on native <details>, rendered on the server so the answers are
 * in the HTML. Pair it with faqJsonLd() from lib/site for the FAQPage markup.
 */
export function FaqList({ faqs, title = "FAQ", id = "faq" }: { faqs: FaqItem[]; title?: string; id?: string }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-14">
      <h2 id={`${id}-heading`} className="text-2xl md:text-[32px]">
        {title}
      </h2>
      <div className="mt-5 border-t border-line">
        {faqs.map((item) => (
          <details key={item.q} open className="group border-b border-line">
            <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <h3 className="font-sans text-base font-semibold">{item.q}</h3>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-brand"
              >
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </summary>
            <p className="text-pretty pb-5 pr-8 text-[15px] leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
