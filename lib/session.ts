import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** The signed-in user in a route handler or server component, or null. */
export async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** JSON error the client turns into "sign in" / "get credits" prompts. */
export const creditError = (status: 401 | 402, credits = 0) =>
  Response.json(
    status === 401
      ? { error: "sign_in", message: "Sign in to download. New accounts get free credits." }
      : { error: "no_credits", message: "You're out of credits.", credits },
    { status },
  );

export function midiResponse(bytes: Uint8Array, filename: string, credits: number, charged: boolean) {
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "audio/midi",
      "Content-Disposition": `attachment; filename="${filename.replace(/["\\\r\n]/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Credits": String(credits),
      "X-Charged": charged ? "1" : "0",
    },
  });
}
