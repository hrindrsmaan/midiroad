import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Pin the workspace root so a stray lockfile in a parent folder can't
  // make Turbopack resolve modules (e.g. tailwindcss) from the wrong place.
  turbopack: {
    root: __dirname,
  },
  outputFileTracingIncludes: {
    "/api/download": ["./private/**/*"],
    "/api/library/[id]": ["./private/library.zip"],
    "/api/free-kit/download": ["./private/free-kit.zip"],
  },
  serverExternalPackages: ["pino", "@logtail/pino"],
};

export default nextConfig;
