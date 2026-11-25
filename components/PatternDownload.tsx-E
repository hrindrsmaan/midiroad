"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SignInModal, type DownloadGate } from "@/components/auth/SignInModal";
import { authClient } from "@/lib/auth-client";
import { paidDownload } from "@/lib/paid-download";

/**
 * Credit-gated MIDI download. Signed-out visitors get the sign-in modal;
 * the file bytes never ship with the page.
 */
export function PatternDownload({
  libraryId,
  fileName,
  google,
  path,
}: {
  libraryId: string;
  fileName: string;
  google: boolean;
  path: string;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [gate, setGate] = useState<DownloadGate | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const resumed = useRef(false);
  const callbackURL = `${path}?download=1`;

  const download = useCallback(async () => {
    setBusy(true);
    const result = await paidDownload(`/api/library/${libraryId}`);
    setBusy(false);
    if (result.ok) setNote(result.charged ? "Saved. 1 credit used." : "Saved. Already unlocked.");
    else if (result.error === "failed") setNote(result.message);
    else setGate(result.error);
  }, [libraryId]);

  useEffect(() => {
    if (resumed.current || isPending || !session) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("download") !== "1") return;
    resumed.current = true;
    url.searchParams.delete("download");
    window.history.replaceState(null, "", url.pathname + url.search);
    // Resume a download after sign-in. The helper updates the button state.
    /* eslint-disable react-hooks/set-state-in-effect */
    void download();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isPending, session, download]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!isPending && !session) setGate("sign_in");
          else void download();
        }}
        disabled={busy}
        className="h-11 cursor-pointer rounded-key border border-strong px-6 text-sm font-semibold transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        {busy ? "Saving…" : "Unlock this file · 1 credit"}
      </button>
      {note && <p className="text-sm text-muted">{note}</p>}
      <SignInModal
        reason={gate}
        fileName={fileName}
        google={google}
        callbackURL={callbackURL}
        onClose={() => setGate(null)}
      />
    </>
  );
}
