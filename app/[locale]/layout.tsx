import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import { locales, type Locale, getTranslations } from "@/lib/i18n";
import { getHomepageKeywordList } from "@/lib/seo/site-keywords";
import { getHomepageMetadata } from "@/lib/utils/metadata-loader";
import { getContactEmailForLocale } from "@/lib/utils/contact-email";

// Generate structured data for SEO
function generateStructuredData(locale: Locale, baseUrl: string) {
  const organizationNameMap: Record<Locale, string> = {
    en: "StreamPro",
    es: "StreamPro",
    fr: "StreamPro",
  };

  const organizationDescMap: Record<Locale, string> = {
    en: "Premium IPTV streaming service with crystal-clear quality, 99.9% uptime, and full device compatibility",
    es: "Servicio de streaming IPTV premium con calidad cristalina, 99.9% de tiempo de actividad y compatibilidad total con dispositivos",
    fr: "Service de streaming IPTV premium avec une qualité cristalline, 99.9% de disponibilité et compatibilité totale des appareils",
  };

  const productNameMap: Record<Locale, string> = {
    en: "Premium IPTV Streaming Service",
    es: "Servicio de Streaming IPTV Premium",
    fr: "Service de Streaming IPTV Premium",
  };

  const productDescMap: Record<Locale, string> = {
    en: "Premium IPTV streaming service with over 20,000 live TV channels, 4K quality, and support for all devices. Free test available.",
    es: "Servicio de streaming IPTV premium con más de 20,000 canales de TV en vivo, calidad 4K y soporte para todos los dispositivos. Prueba gratuita disponible.",
    fr: "Service de streaming IPTV premium avec plus de 20,000 chaînes TV en direct, qualité 4K et support pour tous les appareils. Essai gratuit disponible.",
  };

  const t = getTranslations(locale);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationNameMap[locale],
    description: organizationDescMap[locale],
    url: `${baseUrl}/${locale}/`, // Include trailing slash for consistency
    logo: `${baseUrl}/logo/Logo3-removebg-preview.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: getContactEmailForLocale(locale),
      availableLanguage: locale === "en" ? ["English"] : locale === "es" ? ["Spanish", "Español"] : ["French", "Français"],
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
    name: productNameMap[locale],
    description: productDescMap[locale],
    image: [`${baseUrl}/images/hero.png`],
    brand: {
      "@type": "Brand",
      name: "StreamPro",
    },
    category: locale === "en" 
      ? "IPTV Streaming Service"
      : locale === "es"
      ? "Servicio de Streaming IPTV"
      : "Service de Streaming IPTV",
    offers: [
      {
        "@type": "Offer",
        name: t.pricing?.plan3Months || "3 Months Plan",
        price: (t.pricing?.plan3MonthsPrice || "€19.99").replace(/[^\d.]/g, ""),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}/#pricing`, // Include trailing slash before hash
        priceValidUntil: "2026-12-31",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry:
              locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          },
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "EUR",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            businessDays: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
            },
            cutoffTime: "17:00",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry:
            locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          returnPolicyDays: 30,
          merchantReturnDays: 30,
          returnFees: "https://schema.org/FreeReturn",
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "6 Months Plan" : locale === "es" ? "Plan de 6 Meses" : "Plan de 6 Mois",
        price: "24.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}/#pricing`, // Include trailing slash before hash
        priceValidUntil: "2026-12-31",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry:
              locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          },
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "EUR",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            businessDays: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
            },
            cutoffTime: "17:00",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry:
            locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          returnPolicyDays: 30,
          merchantReturnDays: 30,
          returnFees: "https://schema.org/FreeReturn",
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "12 Months Plan" : locale === "es" ? "Plan de 12 Meses" : "Plan de 12 Mois",
        price: "39.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}/#pricing`, // Include trailing slash before hash
        priceValidUntil: "2026-12-31",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry:
              locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          },
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "EUR",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            businessDays: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
            },
            cutoffTime: "17:00",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry:
            locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          returnPolicyDays: 30,
          merchantReturnDays: 30,
          returnFees: "https://schema.org/FreeReturn",
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "24 Months Plan" : locale === "es" ? "Plan de 24 Meses" : "Plan de 24 Mois",
        price: "54.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}/#pricing`, // Include trailing slash before hash
        priceValidUntil: "2026-12-31",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry:
              locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          },
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "EUR",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            businessDays: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
            },
            cutoffTime: "17:00",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry:
            locale === "en" ? "US" : locale === "es" ? "ES" : "FR",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          returnPolicyDays: 30,
          merchantReturnDays: 30,
          returnFees: "https://schema.org/FreeReturn",
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: locale === "en"
      ? [
          "20,000+ Live TV Channels",
          "4K & HD Quality Streaming",
          "99.9% Uptime Guarantee",
          "All Devices Supported",
          "24/7 Customer Support",
          "Free Test Available",
          "Instant Activation",
          "VOD Library Access",
        ]
      : locale === "es"
      ? [
          "Más de 20,000 Canales de TV en Vivo",
          "Streaming en Calidad 4K y HD",
          "Garantía de 99.9% de Tiempo de Actividad",
          "Todos los Dispositivos Compatibles",
          "Soporte al Cliente 24/7",
          "Prueba Gratuita Disponible",
          "Activación Instantánea",
          "Acceso a Biblioteca VOD",
        ]
      : [
          "Plus de 20,000 Chaînes TV en Direct",
          "Streaming en Qualité 4K et HD",
          "Garantie de Disponibilité 99.9%",
          "Tous les Appareils Compatibles",
          "Support Client 24/7",
          "Essai Gratuit Disponible",
          "Activation Instantanée",
          "Accès à la Bibliothèque VOD",
        ],
  };

  // FAQ Schema for homepage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: locale === "en"
      ? [
          {
            "@type": "Question",
            name: "What is IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "IPTV Smarters Pro is a premium IPTV streaming service that provides access to over 20,000 live TV channels, movies, and series in 4K quality. It works on all devices including Windows, Android, iOS, Mac, and Smart TVs.",
            },
          },
          {
            "@type": "Question",
            name: "How much does IPTV subscription cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our IPTV subscription plans start from €19.99 for 3 months, with options for 6 months (€24.99), 12 months (€39.99), and 24 months (€54.99). All plans include instant activation and free test available.",
            },
          },
          {
            "@type": "Question",
            name: "Is a free test available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we offer a free test of our IPTV service so you can experience the quality before purchasing. Contact us via WhatsApp to get your free test.",
            },
          },
          {
            "@type": "Question",
            name: "What devices are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our IPTV service works on all devices including Windows PC, Android phones and tablets, iOS devices (iPhone/iPad), Mac computers, Smart TVs, Firestick, Roku, Apple TV, and more.",
            },
          },
          {
            "@type": "Question",
            name: "How do I install IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We provide detailed installation guides for all devices. Visit our installation guide page for step-by-step instructions for Windows, Android, iOS, Smart TV, and Firestick.",
            },
          },
          {
            "@type": "Question",
            name: "Can I watch the 2026 FIFA World Cup with IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can use IPTV Smarters Pro with our IPTV subscription to enjoy compatible football channels and match viewing. Channel availability depends on regional broadcasters and rights—request a free test first to confirm the lineup for your area.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer a free IPTV test before the World Cup starts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We offer a free IPTV test so you can check streaming quality, device compatibility, and the channels you care about before the 2026 FIFA World Cup.",
            },
          },
          {
            "@type": "Question",
            name: "Which devices are best for World Cup streaming?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our service works across Windows PC, Android phones and tablets, iOS devices, Mac computers, Smart TVs, Firestick, Roku, and Apple TV—so you can watch the 2026 World Cup on your preferred screen.",
            },
          },
          {
            "@type": "Question",
            name: "Will the World Cup stream in HD or 4K?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We are built for stable HD/4K streaming. For best results during match days, use a stable internet connection and the device recommended for your plan.",
            },
          },
        ]
      : locale === "es"
      ? [
          {
            "@type": "Question",
            name: "¿Qué es IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "IPTV Smarters Pro es un servicio de streaming IPTV premium que proporciona acceso a más de 20,000 canales de TV en vivo, películas y series en calidad 4K. Funciona en todos los dispositivos incluyendo Windows, Android, iOS, Mac y Smart TVs.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuánto cuesta la suscripción IPTV?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nuestros planes de suscripción IPTV comienzan desde €19.99 por 3 meses, con opciones para 6 meses (€24.99), 12 meses (€39.99) y 24 meses (€54.99). Todos los planes incluyen activación instantánea y prueba gratuita disponible.",
            },
          },
          {
            "@type": "Question",
            name: "¿Hay una prueba gratuita disponible?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, ofrecemos una prueba gratuita de nuestro servicio IPTV para que puedas experimentar la calidad antes de comprar. Contáctanos por WhatsApp para obtener tu prueba gratuita.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué dispositivos son compatibles?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nuestro servicio IPTV funciona en todos los dispositivos incluyendo PC con Windows, teléfonos y tabletas Android, dispositivos iOS (iPhone/iPad), computadoras Mac, Smart TVs, Firestick, Roku, Apple TV y más.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo instalo IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Proporcionamos guías de instalación detalladas para todos los dispositivos. Visita nuestra página de guía de instalación para instrucciones paso a paso para Windows, Android, iOS, Smart TV y Firestick.",
            },
          },
          {
            "@type": "Question",
            name: "¿Puedo ver la Copa Mundial FIFA 2026 con IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Puedes usar IPTV Smarters Pro con nuestra suscripción IPTV para disfrutar canales de fútbol compatibles y ver los partidos. La disponibilidad de canales depende de los broadcasters regionales y los derechos—solicita primero una prueba gratuita para confirmar la lista en tu zona.",
            },
          },
          {
            "@type": "Question",
            name: "¿Ofrecen una prueba gratuita de IPTV antes del Mundial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí. Ofrecemos una prueba gratuita para que puedas comprobar la calidad del streaming, la compatibilidad con tu dispositivo y los canales que te interesan antes del Mundial FIFA 2026.",
            },
          },
          {
            "@type": "Question",
            name: "¿En qué dispositivos puedo ver el Mundial por IPTV?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nuestro servicio funciona en PC Windows, teléfonos y tabletas Android, dispositivos iOS, Mac, Smart TV, Firestick, Roku y Apple TV—para que puedas ver el Mundial 2026 en la pantalla que prefieras.",
            },
          },
          {
            "@type": "Question",
            name: "¿El Mundial se transmite en HD o 4K?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Estamos enfocados en un streaming estable en HD/4K. Para obtener mejores resultados durante los partidos, usa una conexión a internet estable y el dispositivo recomendado para tu plan.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "Qu'est-ce que IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "IPTV Smarters Pro est un service de streaming IPTV premium qui fournit l'accès à plus de 20,000 chaînes TV en direct, films et séries en qualité 4K. Il fonctionne sur tous les appareils incluant Windows, Android, iOS, Mac et Smart TVs.",
            },
          },
          {
            "@type": "Question",
            name: "Combien coûte l'abonnement IPTV?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nos plans d'abonnement IPTV commencent à partir de 19,99€ pour 3 mois, avec des options pour 6 mois (24,99€), 12 mois (39,99€) et 24 mois (54,99€). Tous les plans incluent une activation instantanée et un essai gratuit disponible.",
            },
          },
          {
            "@type": "Question",
            name: "Un essai gratuit est-il disponible?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, nous offrons un essai gratuit de notre service IPTV afin que vous puissiez expérimenter la qualité avant d'acheter. Contactez-nous via WhatsApp pour obtenir votre essai gratuit.",
            },
          },
          {
            "@type": "Question",
            name: "Quels appareils sont pris en charge?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Notre service IPTV fonctionne sur tous les appareils incluant PC Windows, téléphones et tablettes Android, appareils iOS (iPhone/iPad), ordinateurs Mac, Smart TVs, Firestick, Roku, Apple TV et plus encore.",
            },
          },
          {
            "@type": "Question",
            name: "Comment installer IPTV Smarters Pro?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous fournissons des guides d'installation détaillés pour tous les appareils. Visitez notre page de guide d'installation pour des instructions étape par étape pour Windows, Android, iOS, Smart TV et Firestick.",
            },
          },
          {
            "@type": "Question",
            name: "Puis-je regarder la Coupe du Monde FIFA 2026 avec IPTV Smarters Pro ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Vous pouvez utiliser IPTV Smarters Pro avec notre abonnement IPTV pour profiter de chaînes de football compatibles et regarder les matchs. La disponibilité dépend des diffuseurs régionaux et des droits—demandez d’abord un essai gratuit pour confirmer la liste dans votre zone.",
            },
          },
          {
            "@type": "Question",
            name: "Proposez-vous un essai IPTV gratuit avant la Coupe du Monde ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui. Nous proposons un essai IPTV gratuit afin que vous puissiez vérifier la qualité du streaming, la compatibilité avec vos appareils et les chaînes qui vous intéressent avant la Coupe du Monde FIFA 2026.",
            },
          },
          {
            "@type": "Question",
            name: "Sur quels appareils puis-je regarder la Coupe du Monde en IPTV ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Notre service fonctionne sur PC Windows, téléphones et tablettes Android, appareils iOS, ordinateurs Mac, Smart TV, Firestick, Roku et Apple TV—pour que vous puissiez regarder la Coupe du Monde 2026 sur l’écran de votre choix.",
            },
          },
          {
            "@type": "Question",
            name: "Le streaming des matchs sera-t-il en HD ou 4K ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nous privilégions un streaming stable en HD/4K. Pour de meilleures performances pendant les jours de match, utilisez une connexion internet stable et l’appareil recommandé pour votre formule.",
            },
          },
        ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : locale === "es" ? "Inicio" : "Accueil",
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  return { organizationSchema, productSchema, faqSchema, breadcrumbSchema };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  
  // Validate locale before processing - prevent errors from invalid routes like /placeholder-image.png
  if (!locales.includes(localeParam as Locale)) {
    // Return basic metadata for invalid locales (will be handled by notFound() in layout)
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }
  
  const locale = localeParam as Locale;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";
  const translations = getTranslations(locale);
  
  const localeMap: Record<Locale, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
  };

  // Load metadata from file
  const homepageMetadata = await getHomepageMetadata(locale);
  const title = homepageMetadata.title;
  const description = homepageMetadata.description;

  // Generate hreflang alternates
  const alternates: Record<string, string> = {};
  locales.forEach((loc) => {
    alternates[loc] = `${baseUrl}/${loc}/`;
  });
  // Add x-default pointing to English (default locale)
  alternates['x-default'] = `${baseUrl}/en/`;

  // Site name translations
  const siteNameMap: Record<Locale, string> = {
    en: "StreamPro - Premium IPTV Service",
    es: "StreamPro - Servicio IPTV Premium",
    fr: "StreamPro - Service IPTV Premium",
  };

  return {
    title,
    description,
    keywords: getHomepageKeywordList(locale),
    authors: [{ name: "StreamPro" }],
    creator: "StreamPro",
    publisher: "StreamPro",
    applicationName: "StreamPro IPTV",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/`, // Include trailing slash to match next.config trailingSlash: true
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `${baseUrl}/${locale}/`, // Include trailing slash for consistency
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/hero.png`,
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
      images: [`${baseUrl}/images/hero.png`],
      creator: "@streampro",
      site: "@streampro",
    },
    other: {
      "og:image:secure_url": `${baseUrl}/images/hero.png`,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
      "article:author": "StreamPro",
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
    verification: {
      // Add your verification codes here when available
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.pro-iptvsmarters.com";
  const { organizationSchema, productSchema, faqSchema, breadcrumbSchema } = generateStructuredData(locale as Locale, baseUrl);

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </LanguageProvider>
  );
}

