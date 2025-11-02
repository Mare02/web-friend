import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using Turbopack for faster development builds
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
