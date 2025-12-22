import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const title = "Premium IPTV Streaming Service | Free Test Available";
  const description = "Experience premium IPTV streaming with 20,000+ channels, 4K quality, and 99.9% uptime. Free test available. Works on all devices. Start streaming today!";
  
  return {
    title,
    description,
    keywords: [
      "IPTV",
      "streaming service",
      "premium IPTV",
      "IPTV subscription",
      "live TV streaming",
      "4K IPTV",
      "IPTV free test",
      "streaming TV",
      "IPTV service",
    ],
    authors: [{ name: "StreamPro" }],
    creator: "StreamPro",
    publisher: "StreamPro",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: "StreamPro - Premium IPTV Service",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "StreamPro Premium IPTV Streaming Service",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
      creator: "@streampro",
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
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
    },
  };
}

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
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div id="root">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
