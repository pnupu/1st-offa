/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Add trusted domains for authentication
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'"
          }
        ],
      },
    ];
  },
  // Add rewrites for authentication
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/auth/callback/google',
          destination: '/api/auth/callback/google'
        }
      ],
      afterFiles: [],
      fallback: []
    };
  },
};

export default config;