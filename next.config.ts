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
      // Root page redirect - prevent duplicate content (301 permanent redirect)
      {
        source: '/',
        destination: '/en/',
        permanent: true,
      },
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
      // Reseller program redirect (old route)
      {
        source: '/:locale/revendeur',
        destination: '/:locale/iptv-reseller-program',
        permanent: true,
      },
      // Language-specific reseller program redirects (redirect English URLs to localized URLs for non-English)
      // Spanish redirect
      {
        source: '/es/iptv-reseller-program',
        destination: '/es/programa-revendedor-iptv',
        permanent: true,
      },
      // French redirect
      {
        source: '/fr/iptv-reseller-program',
        destination: '/fr/programme-revendeur-iptv',
        permanent: true,
      },
      // Language-specific installation page redirects (redirect English URLs to localized URLs for non-English)
      // Spanish redirects
      {
        source: '/es/iptv-installation-guide',
        destination: '/es/guia-instalacion-iptv',
        permanent: true,
      },
      {
        source: '/es/iptv-installation-ios',
        destination: '/es/instalacion-ios-iptv',
        permanent: true,
      },
      {
        source: '/es/iptv-installation-windows',
        destination: '/es/instalacion-windows-iptv',
        permanent: true,
      },
      {
        source: '/es/iptv-installation-smart-tv',
        destination: '/es/instalacion-smart-tv-iptv',
        permanent: true,
      },
      {
        source: '/es/iptv-installation-firestick',
        destination: '/es/instalacion-firestick-iptv',
        permanent: true,
      },
      // French redirects
      {
        source: '/fr/iptv-installation-guide',
        destination: '/fr/guide-installation-iptv',
        permanent: true,
      },
      {
        source: '/fr/iptv-installation-ios',
        destination: '/fr/installation-ios-iptv',
        permanent: true,
      },
      {
        source: '/fr/iptv-installation-windows',
        destination: '/fr/installation-windows-iptv',
        permanent: true,
      },
      {
        source: '/fr/iptv-installation-smart-tv',
        destination: '/fr/installation-smart-tv-iptv',
        permanent: true,
      },
      {
        source: '/fr/iptv-installation-firestick',
        destination: '/fr/installation-firestick-iptv',
        permanent: true,
      },
      // Legal pages redirects - Spanish
      {
        source: '/es/refund-policy',
        destination: '/es/politica-de-reembolso',
        permanent: true,
      },
      {
        source: '/es/privacy-policy',
        destination: '/es/politica-de-privacidad',
        permanent: true,
      },
      {
        source: '/es/terms-of-service',
        destination: '/es/terminos-de-servicio',
        permanent: true,
      },
      // Legal pages redirects - French
      {
        source: '/fr/refund-policy',
        destination: '/fr/politique-de-remboursement',
        permanent: true,
      },
      {
        source: '/fr/privacy-policy',
        destination: '/fr/politique-de-confidentialite',
        permanent: true,
      },
      {
        source: '/fr/terms-of-service',
        destination: '/fr/conditions-utilisation',
        permanent: true,
      },
      // Alternative redirects for old URLs
      {
        source: '/:locale/terms-and-conditions',
        destination: '/:locale/terms-of-service',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
