/**
 * Browser side of a credit-paid download (/api/library/*, /api/export):
 * saves the file, or says why it couldn't.
 */
export type PaidDownload =
  | { ok: true; filename: string; credits: number; charged: boolean }
  | { ok: false; error: "sign_in" | "no_credits" | "failed"; message: string };

export async function paidDownload(url: string, init?: RequestInit): Promise<PaidDownload> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return { ok: false, error: "failed", message: "Network error. Try again." };
  }
  if (res.status === 401 || res.status === 402) {
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: res.status === 401 ? "sign_in" : "no_credits", message: body.message ?? "" };
  }
  if (!res.ok) return { ok: false, error: "failed", message: "Download failed. Try again." };

  const filename =
    res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "midiroad.mid";
  const href = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);

  const credits = Number(res.headers.get("X-Credits") ?? 0);
  window.dispatchEvent(new CustomEvent(CREDITS_EVENT, { detail: credits }));
  return { ok: true, filename, credits, charged: res.headers.get("X-Charged") === "1" };
}

/** Fired with the new balance after each paid download, so the nav stays current. */
export const CREDITS_EVENT = "midiroad:credits";
