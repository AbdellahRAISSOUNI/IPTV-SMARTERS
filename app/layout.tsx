import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Swap to custom font when loaded, but don't block
  preload: false, // Don't preload to reduce blocking
  adjustFontFallback: true, // Use fallback font immediately
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  // Only load specific weights to reduce font file size
  weight: ["400", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap", // Swap to custom font when loaded
  preload: false,
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  // Only load specific weights
  weight: ["400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  
  // Root metadata - will be overridden by locale-specific metadata
  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StreamPro",
  description: "Premium IPTV streaming service with crystal-clear quality, 99.9% uptime, and full device compatibility",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["English"],
  },
  sameAs: [],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1000",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Premium IPTV Streaming Service",
  description: "Premium IPTV streaming service with over 20,000 live TV channels, 4K quality, and support for all devices. Free test available.",
  brand: {
    "@type": "Brand",
    name: "StreamPro",
  },
  category: "IPTV Streaming Service",
  offers: [
    {
      "@type": "Offer",
      name: "1 Month Plan",
      price: "15",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}#pricing`,
    },
    {
      "@type": "Offer",
      name: "3 Months Plan",
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}#pricing`,
    },
    {
      "@type": "Offer",
      name: "6 Months Plan",
      price: "60",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}#pricing`,
    },
    {
      "@type": "Offer",
      name: "12 Months Plan",
      price: "100",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}#pricing`,
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1000",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "20,000+ Live TV Channels",
    "4K & HD Quality Streaming",
    "99.9% Uptime Guarantee",
    "All Devices Supported",
    "24/7 Customer Support",
    "Free Test Available",
    "Instant Activation",
    "VOD Library Access",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to own domain for faster resource loading */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BASE_URL || "https://iptv-smarters.vercel.app"} />
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Hreflang tags for SEO - will be updated by locale layout */}
        <link
          rel="alternate"
          hrefLang="en"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/en`}
        />
        <link
          rel="alternate"
          hrefLang="es"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/es`}
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/fr`}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/en`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const path = window.location.pathname;
                const localeMatch = path.match(/^\/(en|es|fr)/);
                if (localeMatch) {
                  document.documentElement.lang = localeMatch[1];
                }
                // Defer CSS loading to improve FCP - load CSS asynchronously on all devices
                const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                stylesheets.forEach(link => {
                  const originalHref = link.href;
                  // Create a new link element for async loading
                  const asyncLink = document.createElement('link');
                  asyncLink.rel = 'stylesheet';
                  asyncLink.href = originalHref;
                  asyncLink.media = 'print';
                  asyncLink.onload = function() { 
                    this.media = 'all';
                    // Remove the blocking stylesheet
                    link.remove();
                  };
                  // Fallback
                  setTimeout(function() {
                    asyncLink.media = 'all';
                    link.remove();
                  }, 100);
                  // Insert async stylesheet
                  document.head.insertBefore(asyncLink, link.nextSibling);
                });
              })();
            `,
          }}
        />
        {/* Optimize font loading - completely defer on mobile */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Defer font loading to not block render
              (function() {
                const isMobile = window.innerWidth < 768;
                // Always defer font loading to prevent blocking
                const loadFonts = function() {
                  if ('fonts' in document) {
                    // Load fonts asynchronously without blocking
                    Promise.all([
                      document.fonts.load('400 1em Inter'),
                      document.fonts.load('600 1em Inter'),
                      document.fonts.load('400 1em "Plus Jakarta Sans"'),
                      document.fonts.load('600 1em "Plus Jakarta Sans"'),
                      document.fonts.load('700 1em "Plus Jakarta Sans"'),
                    ]).catch(() => {});
                  }
                };
                
                if (isMobile) {
                  // On mobile, wait for page to be interactive
                  if (document.readyState === 'complete') {
                    setTimeout(loadFonts, 1000);
                  } else {
                    window.addEventListener('load', function() {
                      setTimeout(loadFonts, 1000);
                    });
                  }
                } else {
                  // On desktop, load after a short delay
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(loadFonts, { timeout: 500 });
                  } else {
                    setTimeout(loadFonts, 200);
                  }
                }
              })();
            `,
          }}
        />
        {/* Preload hero image - only on desktop to avoid blocking mobile */}
        <link rel="preload" as="image" href="/images/hero.png" fetchPriority="high" media="(min-width: 768px)" />
        {/* Critical CSS inline for faster FCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;background:#fff}
            h1,h2,h3,h4,h5,h6{font-family:system-ui,-apple-system,sans-serif;font-weight:700}
            #home{position:relative;overflow:hidden;background:#fff;padding-top:6rem}
            .max-w-7xl{max-width:80rem;margin:0 auto;padding:0 1rem}
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <div id="root">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
