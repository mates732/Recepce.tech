import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: img.youtube.com i1.ytimg.com i2.ytimg.com i3.ytimg.com i4.ytimg.com",
      "connect-src 'self' https://api.vapi.ai wss://api.vapi.ai https://*.daily.co wss://*.daily.co",
      "frame-src 'self' https://zlaty-hreben.vercel.app https://*.daily.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  serverExternalPackages: [],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i1.ytimg.com" },
      { protocol: "https", hostname: "i2.ytimg.com" },
      { protocol: "https", hostname: "i3.ytimg.com" },
      { protocol: "https", hostname: "i4.ytimg.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/ponici-preview/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https://www.ponici.cz",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.ponici.cz",
              "style-src 'self' 'unsafe-inline' https://www.ponici.cz fonts.googleapis.com",
              "font-src 'self' data: https://www.ponici.cz fonts.gstatic.com",
              "img-src 'self' data: blob: https://www.ponici.cz",
              "connect-src 'self' https://www.ponici.cz wss://www.ponici.cz",
              "media-src 'self' https://www.ponici.cz",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://www.ponici.cz",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:locale/live-demo",
        destination: "/:locale/profese",
        permanent: true,
      },
      {
        source: "/live-demo",
        destination: "/profese",
        permanent: true,
      },
      {
        source: "/:locale/ai-receptionist",
        destination: "/:locale/systems/communication",
        permanent: true,
      },
      {
        source: "/ai-receptionist",
        destination: "/systems/communication",
        permanent: true,
      },
      {
        source: "/:locale/ai.assistent",
        destination: "/:locale/systems/communication",
        permanent: true,
      },
      {
        source: "/ai.assistent",
        destination: "/systems/communication",
        permanent: true,
      },
      {
        source: "/:locale/projekty/ai-sistent/voice-assistant",
        destination: "/:locale/systems/communication/voice",
        permanent: true,
      },
      {
        source: "/projekty/ai-sistent/voice-assistant",
        destination: "/systems/communication/voice",
        permanent: true,
      },
      {
        source: "/:locale/projekty/ai-sistent/chat-assistant",
        destination: "/:locale/systems/communication/chat",
        permanent: true,
      },
      {
        source: "/projekty/ai-sistent/chat-assistant",
        destination: "/systems/communication/chat",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
