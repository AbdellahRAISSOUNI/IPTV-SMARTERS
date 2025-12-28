import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to enable API routes for admin dashboard
  trailingSlash: true,
  images: {
    // Removed unoptimized: true - Vercel will optimize images automatically
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
