import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { "/api/download": ["./private/**/*"] },
  serverExternalPackages: ["pino", "@logtail/pino"],
};

export default nextConfig;
