import {
  DRUM_KIT_NAME,
  MIDI_COUNTS,
  MIDI_PATTERN_COUNT,
  ONE_SHOTS,
  ONE_SHOT_COUNT,
} from "@/lib/bundle";

const DAWS = ["FL Studio", "Ableton", "Logic", "Reason", "Studio One", "Maschine"];

function CountGrid({
  title,
  items,
}: {
  title: string;
  items: { count: number; label: string }[];
}) {
  const total = items.reduce((n, i) => n + i.count, 0);
  return (
    <div>
      <p className="mb-3 flex items-baseline justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
        {title}
        <span className="text-gray-600">{total} files</span>
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-3"
          >
            <span className="block text-xl font-black tracking-tight text-white">
              {item.count}
            </span>
            <span className="block text-xs text-gray-400">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhatsInside() {
  return (
    <section
      id="whats-inside"
      className="py-16 md:py-24 px-6 bg-[#0e1014] border-t border-white/10 text-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#2bd96b]">
              {MIDI_PATTERN_COUNT} MIDIs · {ONE_SHOT_COUNT} WAVs
            </p>
            <h2 className="text-2xl md:text-3xl leading-tight">
              What&apos;s inside
            </h2>
          </div>
          <p className="text-sm font-light tracking-wide text-gray-400 max-w-sm">
            Every file in the download, counted. One-shots are 44.1 kHz WAVs.
          </p>
        </div>

        <div className="space-y-8">
          <CountGrid title="MIDI patterns" items={MIDI_COUNTS} />
          <CountGrid title={`One-shots · ${DRUM_KIT_NAME}`} items={ONE_SHOTS} />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[11px] font-black uppercase tracking-widest text-gray-500">
            Compatible with
          </span>
          {DAWS.map((daw) => (
            <span
              key={daw}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300"
            >
              {daw}
            </span>
          ))}
          <span className="text-xs text-gray-500">& every major DAW</span>
        </div>
      </div>
    </section>
  );
}

export default WhatsInside;
