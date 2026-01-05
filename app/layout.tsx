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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://iptv-smarters.vercel.app";
  
  const title = "Best IPTV Subscription Service | IPTV Smarters Pro | 20,000+ Channels | Free Test";
  const description = "Get the #1 IPTV subscription service with IPTV Smarters Pro. Access 20,000+ live TV channels, movies, and series in 4K quality. 99.9% uptime guarantee. Free test available. Works on Windows, Android, iOS, Mac, Smart TV, Firestick. Instant activation.";
  const ogImage = `${baseUrl}/images/hero.png`;
  
  // Root metadata - default to English, but support all languages
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/en`,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${baseUrl}/en`,
      siteName: "StreamPro - Premium IPTV Service",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@streampro",
      site: "@streampro",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "og:image:secure_url": ogImage,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
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
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="UsDivhmxwn1peRYhvqO8TmyNGB180fGmIwM8BST2kh4" />
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
                try {
                  var path = window.location.pathname;
                  var localeMatch = path.match(/^\/(en|es|fr)/);
                  if (localeMatch) {
                    document.documentElement.lang = localeMatch[1];
                  }
                } catch (e) {
                  // Suppress errors
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && window.addEventListener) {
                    window.addEventListener('error', function(e) {
                      try {
                        if (e && e.message && typeof e.message === 'string' && e.message.indexOf('ipapi.co') !== -1) {
                          e.preventDefault();
                        }
                      } catch (err) {
                        // Suppress
                      }
                    }, true);
                  }
                } catch (err) {
                  // Suppress
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && window.addEventListener) {
                    window.addEventListener('unhandledrejection', function(e) {
                      try {
                        if (e && e.reason) {
                          var reasonStr = '';
                          if (e.reason.message && typeof e.reason.message === 'string') {
                            reasonStr = e.reason.message;
                          } else {
                            try {
                              reasonStr = String(e.reason);
                            } catch (strErr) {
                              // Suppress
                            }
                          }
                          if (reasonStr.indexOf('ipapi.co') !== -1) {
                            e.preventDefault();
                          }
                        }
                      } catch (err) {
                        // Suppress
                      }
                    });
                  }
                } catch (err) {
                  // Suppress
                }
              })();
            `,
          }}
        />
        {/* Fonts already have display: swap, no need for manual loading */}
        {/* Preload hero image only on desktop - on mobile, text is LCP */}
        <link rel="preload" as="image" href="/images/hero.png" fetchPriority="high" media="(min-width: 768px)" />
        {/* Fonts already have display: swap, no need for manual loading */}
        {/* Preload hero image only on desktop - on mobile, text is LCP */}
        <link rel="preload" as="image" href="/images/hero.png" fetchPriority="high" media="(min-width: 768px)" />
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
