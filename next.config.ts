import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/api/download": ["./private/**/*"],
    "/api/library/[id]": ["./private/library.zip"],
  },
  serverExternalPackages: ["pino", "@logtail/pino"],
};

export default nextConfig;
