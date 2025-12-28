import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin dashboard requires server-side rendering
  // Static export is disabled
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Modern JavaScript - target modern browsers to reduce polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Optimize for modern browsers - reduce polyfills
  transpilePackages: [],
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {},
};

export default nextConfig;
