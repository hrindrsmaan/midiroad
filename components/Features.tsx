export default function Features() {
  return (
    <section className="py-20 px-6 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {[
        "150+ MIDI Files (Melodies & Chords)",
        "200+ Drum Kits (808s, kicks, snares)",
        "Works with FL Studio, Ableton, Logic",
      ].map((item, i) => (
        <div key={i} className="p-6 bg-white rounded-xl shadow">
          <h3 className="font-semibold">{item}</h3>
        </div>
      ))}
    </section>
  );
}
