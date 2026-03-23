const bundleInfo = {
  name: "Premium MIDI + Drum Kit Bundle",
  description:
    "Your complete download with 300+ MIDI sequences and 200+ mix-ready drum samples. Everything is organized and DAW-ready.",
  link: "/downloads/midiroad.zip",
  highlights: ["MIDI Progressions", "Premium Drum Hits", "Session Starters"],
};

export default function Success() {
  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff90e8] selection:text-black">
      <nav className="flex items-center px-6 py-5 md:px-8 w-full border-b-2 border-black bg-black sticky top-0 z-50">
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
      </nav>
      <div className="px-6 py-16 md:py-24 mx-auto max-w-4xl space-y-12">
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
              Your bundle is now unlocked. Download the files below or use the
              link we just sent to your email. The link stays active for 30
              days.
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
                  <a
                    href={bundleInfo.link}
                    download
                    className="btn-primary cursor-pointer shrink-0 inline-flex items-center justify-center px-10 py-5 text-[15px] font-bold uppercase tracking-wider"
                  >
                    Download Bundle
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <section className="rounded-3xl border-2 border-black bg-[#ffc2f1] p-8 md:p-12 text-left shadow-neo-lg">
          <h2 className="text-3xl font-black text-black tracking-tighter">Need help?</h2>
          <p className="mt-4 text-[18px] font-medium text-black leading-relaxed max-w-2xl">
            Reply to the order confirmation email or reach us at{" "}
            <a
              href="mailto:help@midiroad.com"
              className="text-black font-black hover:bg-black hover:text-[#ffc2f1] underline underline-offset-4 decoration-4 transition-colors px-1"
            >
              help@midiroad.com
            </a>
            . We'll get you back inside the kit within minutes.
          </p>
        </section>
        
        {/* Simple Footer/Back Link */}
        <div className="pt-8 text-center flex flex-col items-center">
          <a href="/" className="inline-flex items-center justify-center gap-3 text-[15px] font-bold uppercase tracking-wider text-black bg-white border-2 border-black rounded-full px-8 py-4 shadow-[2px_2px_0_0_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all">
            <div className="w-6 h-6 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center -ml-2">
              <span className="text-black font-black text-[12px] leading-none pt-[1px]">M</span>
            </div>
            Return to Homepage
          </a>
        </div>
      </div>
    </main>
  );
}
