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
  // Redirects for SEO-friendly URLs
  async redirects() {
    return [
      // Installation guide redirect
      {
        source: '/:locale/installation',
        destination: '/:locale/iptv-installation-guide',
        permanent: true,
      },
      // Device-specific installation redirects
      {
        source: '/:locale/installation/apple-ios',
        destination: '/:locale/iptv-installation-ios',
        permanent: true,
      },
      {
        source: '/:locale/installation/smart-tv',
        destination: '/:locale/iptv-installation-smart-tv',
        permanent: true,
      },
      {
        source: '/:locale/installation/windows',
        destination: '/:locale/iptv-installation-windows',
        permanent: true,
      },
      {
        source: '/:locale/installation/firestick-android-ios',
        destination: '/:locale/iptv-installation-firestick',
        permanent: true,
      },
      // Reseller program redirect
      {
        source: '/:locale/revendeur',
        destination: '/:locale/iptv-reseller-program',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
