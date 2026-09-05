/**
 * TrustBadges — visual seal components for product guarantees.
 *
 * Each seal is a real "stamp" — circular icon medallion on the left, bold
 * label on the right — rather than just text in a pill. Matches the
 * neo-brutalist theme (hard black borders, sharp shadows).
 */

type SealProps = {
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  /** Background color of the icon disc. */
  disc?: string;
  /** Whether to tilt the seal slightly for visual energy. */
  tilt?: boolean;
};

function Seal({ label, sublabel, icon, disc = "#ff90e8", tilt }: SealProps) {
  return (
    <div
      role="figure"
      aria-label={label}
      className={`flex items-center gap-2.5 ${tilt ? "-rotate-2" : ""}`}
    >
      <div className="relative shrink-0">
        {/* Bordered ring */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
          {/* Coloured disc */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: disc }}
          >
            <span className="text-black text-base sm:text-lg leading-none">
              {icon}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-black">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

/** Decorative SVG icons rendered inside the colored disc. */
const IconShield = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7Z" />
  </svg>
);
const IconDownload = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 3v10.6l3.3-3.3 1.4 1.4L12 16.4 7.3 11.7l1.4-1.4 3.3 3.3V3h2Zm-8 14h16v2H4v-2Z" />
  </svg>
);
const IconCheck = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="m9.55 17.6-4.95-4.95 1.41-1.41 3.54 3.54 8.49-8.49 1.41 1.42-9.9 9.9Z" />
  </svg>
);

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <Seal
        label="Instant Download"
        sublabel="Ready in 60 sec"
        icon={IconDownload}
        disc="#ff90e8"
        tilt
      />
      <Seal
        label="Royalty-Free"
        sublabel="Sell your beats"
        icon={IconCheck}
        disc="#a0e8ff"
      />
      <Seal
        label="30-Day Refund"
        sublabel="No questions"
        icon={IconShield}
        disc="#9eff9e"
        tilt
      />
    </div>
  );
}

/**
 * Prominent "Money-Back Guarantee" seal block.
 * Placed near the CTA as a visual promise, not just a footnote.
 */
export function GuaranteeSeal() {
  return (
    <div className="relative w-full rounded-2xl border-2 border-black bg-gradient-to-br from-[#9eff9e] to-[#7ee07e] p-4 shadow-[4px_4px_0_0_#000]">
      <div className="flex items-start gap-4">
        {/* Big shield medallion */}
        <div className="shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black flex items-center justify-center">
              <span className="text-[#9eff9e] text-xl sm:text-2xl">
                {IconShield}
              </span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-black">
            Our Promise To You
          </p>
          <h3 className="text-lg sm:text-xl font-black text-black leading-tight mt-0.5">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-[12px] sm:text-[13px] text-black/80 leading-snug mt-1">
            Not satisfied? Email us within 30 days for a{" "}
            <strong>full refund</strong>—no paperwork, no friction.
          </p>
        </div>
      </div>

      {/* "Stamped" sealed ribbon overlay */}
      <div className="pointer-events-none absolute -top-2 -right-2 rotate-12 bg-black text-[#9eff9e] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-[2px_2px_0_0_#ff90e8] border-2 border-black">
        ✓ Guaranteed
      </div>
    </div>
  );
}

export default TrustBadges;
