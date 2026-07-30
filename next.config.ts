import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i1.ytimg.com" },
      { protocol: "https", hostname: "i2.ytimg.com" },
      { protocol: "https", hostname: "i3.ytimg.com" },
      { protocol: "https", hostname: "i4.ytimg.com" },
    ],
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
