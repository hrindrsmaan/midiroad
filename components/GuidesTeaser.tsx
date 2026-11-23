import Link from "next/link";
import { Section, SectionHeader, type Tone } from "@/components/Section";
import { GUIDES, guidePath } from "@/lib/guides";

/** Home page band linking every guide, so they are one click from the homepage. */
export function GuidesTeaser({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section id="guides" tone={tone} labelledBy="guides-heading">
      <SectionHeader
        id="guides-heading"
        eyebrow="Guides"
        title="Learn to use MIDI drums"
        intro={
          <>
            Step-by-step help for FL Studio, Ableton and trap programming.{" "}
            <Link href="/guides" className="text-ink underline underline-offset-4 hover:text-brand">
              All guides
            </Link>
          </>
        }
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={guidePath(guide)}
              className="block h-full rounded-md border border-line bg-card p-5 transition-colors hover:border-strong"
            >
              <h3 className="font-sans text-base font-semibold">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{guide.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
