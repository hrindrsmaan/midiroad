import { Section, SectionHeader, type Tone } from "@/components/Section";
import { FAQS } from "@/lib/faq";

/**
 * FAQ accordion on native <details>/<summary>: keyboard and screen-reader
 * support with no JavaScript.
 */
export function FAQSection({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section id="faq" tone={tone} labelledBy="faq-heading">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <SectionHeader
          id="faq-heading"
          align="left"
          eyebrow="FAQ"
          title="Questions, answered"
          intro={
            <>
              Anything else? Email{" "}
              <a href="mailto:support@midiroad.com" className="text-ink underline underline-offset-4 hover:text-brand">
                support@midiroad.com
              </a>
              .
            </>
          }
        />

        <div className="border-t border-line">
          {FAQS.map((item, i) => (
            <details key={item.q} open={i === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold">{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-brand"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </summary>
              <p className="pb-5 pr-8 text-[15px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default FAQSection;
