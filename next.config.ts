import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/api/download": ["./private/**/*"],
    "/api/library/[id]": ["./private/library.zip"],
    "/api/free-kit/download": ["./private/free-kit.zip"],
  },
  serverExternalPackages: ["pino", "@logtail/pino"],
};

export default nextConfig;
