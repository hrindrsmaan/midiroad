/**
 * Same table treatment as the homepage chord-pack comparison: feature labels
 * collapse into the first cell on small screens, MidiRoad in the brand column.
 */
export function CompareTable({
  caption,
  theirsLabel,
  rows,
}: {
  caption: string;
  theirsLabel: string;
  rows: { feature: string; ours: string; theirs: string }[];
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-md border border-line bg-card">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="hidden w-[18%] px-4 py-3 font-semibold text-muted md:table-cell md:px-5" />
            <th scope="col" className="px-4 py-3 font-semibold text-brand md:px-5">
              MidiRoad
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-muted md:px-5">
              {theirsLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-line align-top last:border-b-0">
              <th scope="row" className="hidden px-4 py-3.5 font-semibold text-ink md:table-cell md:px-5">
                {row.feature}
              </th>
              <td className="px-4 py-3.5 leading-relaxed text-ink md:px-5">
                <span className="mb-1 block text-xs font-semibold text-muted md:hidden">{row.feature}</span>
                {row.ours}
              </td>
              <td className="px-4 py-3.5 leading-relaxed text-muted md:px-5">
                <span className="mb-1 block text-xs font-semibold md:hidden">&nbsp;</span>
                {row.theirs}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
