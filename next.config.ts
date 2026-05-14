import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    return [
      {
        source: "/:locale/live-demo",
        destination: "/:locale/profese",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
