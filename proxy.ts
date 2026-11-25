import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical host is the apex, https://midiroad.com.
 *
 * www.midiroad.com currently 307s at Vercel's domain layer, before this app
 * runs, so this proxy never sees those requests. The permanent status has to
 * be switched to 308 in the Vercel domain settings (see the branch notes).
 * nonp.midiroad.com does reach the app and was serving a second copy of every
 * page (HTTP 200). Any other *.midiroad.com host is the same kind of duplicate.
 * Preview deploys (*.vercel.app) and localhost stay as they are.
 */
const APEX = "midiroad.com";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/library" || path === "/library/") {
    const url = request.nextUrl.clone();
    url.pathname = "/midi";
    url.search = "";
    const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
    const local = !hostname || hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app");
    if (!local) {
      url.protocol = "https:";
      url.hostname = APEX;
      url.port = "";
    }
    return NextResponse.redirect(url, 301);
  }

  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const skip =
    !hostname ||
    hostname === APEX ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app");
  if (skip) return NextResponse.next();

  if (hostname === `www.${APEX}` || hostname.endsWith(`.${APEX}`)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = APEX;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|brand/|images/|previews/).*)"],
};
