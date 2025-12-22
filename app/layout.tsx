import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
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
                // Defer non-critical CSS to improve FCP
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = document.querySelector('link[rel="stylesheet"]')?.href || '';
                document.head.appendChild(link);
              })();
            `,
          }}
        />
        {/* Inline critical CSS optimization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimize font loading
              if ('fonts' in document) {
                Promise.all([
                  document.fonts.load('400 1em Inter'),
                  document.fonts.load('600 1em Plus Jakarta Sans'),
                ]).catch(() => {});
              }
            `,
          }}
        />
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
