import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is disabled by removing --turbopack from package.json scripts
  // This allows Lighthouse to work properly with Webpack
};

export default nextConfig;
