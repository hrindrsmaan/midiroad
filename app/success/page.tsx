import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DRUM_KIT_NAME,
  MIDI_KIT_COUNT,
  MIDI_PATTERN_COUNT,
  ONE_SHOT_COUNT,
} from "@/lib/bundle";

const bundleInfo = {
  name: "MidiRoad MIDI Drum Kit Bundle",
  description: `Your complete download: ${MIDI_PATTERN_COUNT} MIDI drum patterns across ${MIDI_KIT_COUNT} MIDI kits, plus ${ONE_SHOT_COUNT} one-shot WAVs from the ${DRUM_KIT_NAME}.`,
  highlights: ["MIDI Drum Patterns", "808 MIDIs", "Drum One-Shots"],
};

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const downloadHref = sessionId
    ? `/api/download?session_id=${encodeURIComponent(sessionId)}`
    : null;

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black">
      <nav className="flex items-center px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black fixed top-0 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="MidiRoad Home"
        >
          <Image src="/logo-white.png" alt="MidiRoad" width={640} height={640} priority className="h-10 w-auto" />
        </Link>
      </nav>
      <div className="px-6 py-24 md:py-32 mx-auto max-w-4xl space-y-12">
        {/* Main Success Card */}
        <div className="rounded-[2.5rem] border-4 border-black bg-white p-8 md:p-16 shadow-neo-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[13px] uppercase tracking-widest text-black font-bold mb-6">
              Order confirmed
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black">
              Payment successful.
            </h1>
            <p className="mt-6 text-xl font-medium text-black max-w-2xl leading-relaxed">
              Your bundle is now unlocked. Download the files below.
            </p>

            <div className="mt-14">
              <article className="rounded-3xl border-2 border-black bg-[#f4f4f0] p-6 md:p-10 shadow-neo">
                <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-5">
                    <p className="text-[12px] uppercase tracking-widest text-black font-bold">
                      Full download
                    </p>
                    <h2 className="text-3xl font-black text-black tracking-tighter">
                      {bundleInfo.name}
                    </h2>
                    <p className="text-[16px] font-medium text-black max-w-md leading-relaxed">
                      {bundleInfo.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-3 text-[13px] text-black font-bold uppercase tracking-wider">
                      {bundleInfo.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-full border-2 border-black bg-white px-4 py-2 shadow-[2px_2px_0_0_#000]"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {downloadHref ? (
                    <a href={downloadHref} download>
                      <Button
                        size="lg"
                        className="shrink-0 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider"
                      >
                        Download Bundle
                      </Button>
                    </a>
                  ) : (
                    <p className="text-sm font-bold max-w-[16rem]">
                      Check your email for your download link, or contact
                      support@midiroad.com.
                    </p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <section className="rounded-3xl border-2 border-black bg-[#ffc2f1] p-8 md:p-12 text-left shadow-neo-lg">
          <h2 className="text-3xl font-black text-black tracking-tighter">
            Need help?
          </h2>
          <p className="mt-4 text-[18px] font-medium text-black leading-relaxed max-w-2xl">
            Reach us at{" "}
            <a
              href="mailto:support@midiroad.com"
              className="text-black font-black hover:bg-black hover:text-[#ffc2f1] underline underline-offset-4 decoration-4 transition-colors px-1"
            >
              support@midiroad.com
            </a>
            {" "}and we&apos;ll help you get your files.
          </p>
        </section>

        {/* Simple Footer/Back Link */}
        <div className="pt-8 text-center flex flex-col items-center">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="font-bold uppercase tracking-wider"
            >
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
