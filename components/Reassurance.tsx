/**
 * One line of purchase reassurance under each buy button: the only place
 * the page states these promises, so they aren't repeated around the CTA.
 */
const REASSURANCE = [
  {
    label: "Secure checkout via Stripe",
    icon: "M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1Zm2 0h8V8a4 4 0 1 0-8 0v2Z",
  },
  {
    label: "Instant download",
    icon: "M12 3v10.6l3.3-3.3 1.4 1.4L12 16.4 7.3 11.7l1.4-1.4 3.3 3.3V3h2Zm-8 14h16v2H4v-2Z",
  },
  {
    label: "Royalty-free",
    icon: "m9.55 17.6-4.95-4.95 1.41-1.41 3.54 3.54 8.49-8.49 1.41 1.42-9.9 9.9Z",
  },
  {
    label: "30-day refund",
    icon: "M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7Z",
  },
];

export function Reassurance({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {REASSURANCE.map((r) => (
        <li key={r.label} className="flex items-center gap-1.5 text-xs text-muted">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden>
            <path d={r.icon} />
          </svg>
          {r.label}
        </li>
      ))}
    </ul>
  );
}

export default Reassurance;
