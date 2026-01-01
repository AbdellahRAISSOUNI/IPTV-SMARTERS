import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import { locales, type Locale, getTranslations } from "@/lib/i18n";

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationNameMap[locale],
    description: organizationDescMap[locale],
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/logo/Logo3-removebg-preview.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
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
        name: locale === "en" ? "3 Months Plan" : locale === "es" ? "Plan de 3 Meses" : "Plan de 3 Mois",
        price: "19.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}#pricing`,
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "6 Months Plan" : locale === "es" ? "Plan de 6 Meses" : "Plan de 6 Mois",
        price: "24.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}#pricing`,
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "12 Months Plan" : locale === "es" ? "Plan de 12 Meses" : "Plan de 12 Mois",
        price: "39.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}#pricing`,
      },
      {
        "@type": "Offer",
        name: locale === "en" ? "24 Months Plan" : locale === "es" ? "Plan de 24 Meses" : "Plan de 24 Mois",
        price: "54.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/${locale}#pricing`,
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
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const translations = getTranslations(locale);
  
  const localeMap: Record<Locale, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
  };

  const titleMap: Record<Locale, string> = {
    en: "Best IPTV Subscription Service 2026 | IPTV Smarters Pro | 20,000+ Channels | Free Test | Instant Activation",
    es: "Mejor Servicio IPTV 2026 | IPTV Smarters Pro | 20,000+ Canales | Prueba Gratis | Activación Instantánea",
    fr: "Meilleur Service IPTV 2026 | IPTV Smarters Pro | 20,000+ Chaînes | Essai Gratuit | Activation Instantanée",
  };

  const descriptionMap: Record<Locale, string> = {
    en: "Get the #1 IPTV subscription service with IPTV Smarters Pro. Access 20,000+ live TV channels, movies, and series in 4K quality. 99.9% uptime guarantee. Free test available. Works on Windows, Android, iOS, Mac, Smart TV, Firestick. Instant activation. Best IPTV service 2024. Premium IPTV subscription plans starting from €19.99. IPTV Smarters Pro codes and accounts available.",
    es: "Obtén el servicio de suscripción IPTV #1 con IPTV Smarters Pro. Accede a más de 20,000 canales de TV en vivo, películas y series en calidad 4K. Garantía de 99.9% de tiempo de actividad. Prueba gratuita disponible. Funciona en Windows, Android, iOS, Mac, Smart TV, Firestick. Activación instantánea. Mejor servicio IPTV 2024. Planes de suscripción IPTV premium desde €19.99. Códigos y cuentas IPTV Smarters Pro disponibles.",
    fr: "Obtenez le service d'abonnement IPTV #1 avec IPTV Smarters Pro. Accédez à plus de 20,000 chaînes TV en direct, films et séries en qualité 4K. Garantie de disponibilité 99.9%. Essai gratuit disponible. Fonctionne sur Windows, Android, iOS, Mac, Smart TV, Firestick. Activation instantanée. Meilleur service IPTV 2024. Plans d'abonnement IPTV premium à partir de 19,99€. Codes et comptes IPTV Smarters Pro disponibles.",
  };

  const title = titleMap[locale];
  const description = descriptionMap[locale];

  // Enhanced keywords for each language - Comprehensive SEO keywords
  const keywordsMap: Record<Locale, string[]> = {
    en: [
      // User requested keywords
      "iptv smarters pro subscription",
      "iptv subscription",
      "subscription iptv",
      "iptv smarters",
      "best iptv service",
      // Core IPTV keywords
      "IPTV",
      "IPTV service",
      "IPTV streaming",
      "premium IPTV",
      "IPTV provider",
      "best IPTV",
      "IPTV subscription service",
      "IPTV subscription provider",
      "IPTV subscription plans",
      "IPTV subscription price",
      "IPTV subscription cost",
      // IPTV Smarters Pro keywords
      "IPTV Smarters Pro",
      "IPTV Smarters Pro subscription",
      "IPTV Smarters Pro service",
      "IPTV Smarters Pro codes",
      "IPTV Smarters Pro account",
      "IPTV Smarters Pro login",
      "IPTV Smarters Pro app",
      "IPTV Smarters Pro download",
      "IPTV Smarters Pro Windows",
      "IPTV Smarters Pro Android",
      "IPTV Smarters Pro iOS",
      "IPTV Smarters Pro Mac",
      "IPTV Smarters Pro APK",
      // Streaming and quality keywords
      "streaming service",
      "live TV streaming",
      "4K IPTV",
      "HD IPTV",
      "FHD IPTV",
      "IPTV 4K streaming",
      "IPTV HD quality",
      "IPTV free test",
      "IPTV trial",
      "free IPTV test",
      // Content keywords
      "live TV channels",
      "VOD streaming",
      "video on demand",
      "IPTV channels",
      "IPTV movies",
      "IPTV series",
      "sports IPTV",
      "IPTV sports channels",
      // Device compatibility
      "IPTV for Smart TV",
      "IPTV for Android",
      "IPTV for iOS",
      "IPTV for Windows",
      "IPTV for Mac",
      "IPTV for Firestick",
      "IPTV for Roku",
      "IPTV for Apple TV",
      "IPTV for MAG",
      "IPTV for Enigma",
      // Technical keywords
      "M3U playlist",
      "Xtream Codes",
      "IPTV codes",
      "IPTV credentials",
      "IPTV account",
      "IPTV server",
      "IPTV reseller",
      "IPTV panel",
      // Service features
      "IPTV with EPG",
      "IPTV catch up",
      "IPTV recording",
      "IPTV multi-screen",
      "IPTV multi-device",
      "IPTV family plan",
      // Geographic keywords
      "IPTV USA",
      "IPTV UK",
      "IPTV Canada",
      "IPTV worldwide",
      "international IPTV",
      // Additional relevant keywords
      "affordable IPTV",
      "cheap IPTV",
      "reliable IPTV",
      "stable IPTV",
      "IPTV without buffering",
      "IPTV anti-freeze",
      "IPTV 24/7 support",
      "instant IPTV activation",
      "IPTV setup guide",
      "how to use IPTV",
    ],
    es: [
      // User requested keywords
      "comprar iptv",
      "iptv españa",
      "iptv smarters pro",
      "iptv smarters",
      "suscripción iptv",
      "iptv españa comprar",
      "comprar códigos iptv smarters pro",
      "comprar codigo iptv smarters pro",
      "comprar codigo iptv",
      // Core IPTV keywords
      "IPTV",
      "servicio IPTV",
      "streaming IPTV",
      "IPTV premium",
      "proveedor IPTV",
      "mejor IPTV",
      "servicio de suscripción IPTV",
      "proveedor de suscripción IPTV",
      "planes de suscripción IPTV",
      "precio suscripción IPTV",
      "costo suscripción IPTV",
      // IPTV Smarters Pro keywords
      "IPTV Smarters Pro",
      "suscripción IPTV Smarters Pro",
      "servicio IPTV Smarters Pro",
      "códigos IPTV Smarters Pro",
      "cuenta IPTV Smarters Pro",
      "inicio de sesión IPTV Smarters Pro",
      "aplicación IPTV Smarters Pro",
      "descargar IPTV Smarters Pro",
      "IPTV Smarters Pro Windows",
      "IPTV Smarters Pro Android",
      "IPTV Smarters Pro iOS",
      "IPTV Smarters Pro Mac",
      "IPTV Smarters Pro APK",
      // Streaming and quality keywords
      "servicio de streaming",
      "transmisión de TV en vivo",
      "IPTV 4K",
      "IPTV HD",
      "IPTV FHD",
      "streaming IPTV 4K",
      "calidad IPTV HD",
      "prueba IPTV gratuita",
      "prueba IPTV",
      "test IPTV gratis",
      // Content keywords
      "canales de TV en vivo",
      "streaming VOD",
      "video bajo demanda",
      "canales IPTV",
      "películas IPTV",
      "series IPTV",
      "IPTV deportes",
      "canales deportivos IPTV",
      // Device compatibility
      "IPTV para Smart TV",
      "IPTV para Android",
      "IPTV para iOS",
      "IPTV para Windows",
      "IPTV para Mac",
      "IPTV para Firestick",
      "IPTV para Roku",
      "IPTV para Apple TV",
      "IPTV para MAG",
      "IPTV para Enigma",
      // Technical keywords
      "lista de reproducción M3U",
      "códigos Xtream",
      "códigos IPTV",
      "credenciales IPTV",
      "cuenta IPTV",
      "servidor IPTV",
      "revendedor IPTV",
      "panel IPTV",
      // Service features
      "IPTV con EPG",
      "IPTV catch up",
      "IPTV grabación",
      "IPTV multi-pantalla",
      "IPTV multi-dispositivo",
      "plan familiar IPTV",
      // Geographic keywords
      "IPTV España",
      "IPTV México",
      "IPTV Argentina",
      "IPTV Colombia",
      "IPTV Chile",
      "IPTV Latinoamérica",
      "IPTV mundial",
      "IPTV internacional",
      // Additional relevant keywords
      "IPTV económico",
      "IPTV barato",
      "IPTV confiable",
      "IPTV estable",
      "IPTV sin cortes",
      "IPTV anti-congelación",
      "soporte IPTV 24/7",
      "activación instantánea IPTV",
      "guía configuración IPTV",
      "cómo usar IPTV",
      "mejor IPTV España",
      "IPTV España precio",
      "IPTV España comprar",
      "donde comprar IPTV",
      "comprar IPTV online",
      "comprar suscripción IPTV",
      "comprar cuenta IPTV",
      "comprar código IPTV",
      "vender IPTV",
      "revender IPTV",
    ],
    fr: [
      // User requested keywords
      "abonnement iptv",
      "iptv abonnement",
      "abonnement ip tv",
      "iptv smarters pro",
      "iptv smarters pro windows",
      "iptv smarters pro android",
      // Core IPTV keywords
      "IPTV",
      "service IPTV",
      "streaming IPTV",
      "IPTV premium",
      "fournisseur IPTV",
      "meilleur IPTV",
      "service d'abonnement IPTV",
      "fournisseur d'abonnement IPTV",
      "plans d'abonnement IPTV",
      "prix abonnement IPTV",
      "coût abonnement IPTV",
      // IPTV Smarters Pro keywords
      "IPTV Smarters Pro",
      "abonnement IPTV Smarters Pro",
      "service IPTV Smarters Pro",
      "codes IPTV Smarters Pro",
      "compte IPTV Smarters Pro",
      "connexion IPTV Smarters Pro",
      "application IPTV Smarters Pro",
      "télécharger IPTV Smarters Pro",
      "IPTV Smarters Pro Windows",
      "IPTV Smarters Pro Android",
      "IPTV Smarters Pro iOS",
      "IPTV Smarters Pro Mac",
      "IPTV Smarters Pro APK",
      // Streaming and quality keywords
      "service de streaming",
      "diffusion TV en direct",
      "IPTV 4K",
      "IPTV HD",
      "IPTV FHD",
      "streaming IPTV 4K",
      "qualité IPTV HD",
      "essai IPTV gratuit",
      "essai IPTV",
      "test IPTV gratuit",
      // Content keywords
      "chaînes TV en direct",
      "streaming VOD",
      "vidéo à la demande",
      "chaînes IPTV",
      "films IPTV",
      "séries IPTV",
      "IPTV sport",
      "chaînes sport IPTV",
      // Device compatibility
      "IPTV pour Smart TV",
      "IPTV pour Android",
      "IPTV pour iOS",
      "IPTV pour Windows",
      "IPTV pour Mac",
      "IPTV pour Firestick",
      "IPTV pour Roku",
      "IPTV pour Apple TV",
      "IPTV pour MAG",
      "IPTV pour Enigma",
      // Technical keywords
      "liste de lecture M3U",
      "codes Xtream",
      "codes IPTV",
      "identifiants IPTV",
      "compte IPTV",
      "serveur IPTV",
      "revendeur IPTV",
      "panneau IPTV",
      // Service features
      "IPTV avec EPG",
      "IPTV catch up",
      "IPTV enregistrement",
      "IPTV multi-écran",
      "IPTV multi-appareil",
      "forfait familial IPTV",
      // Geographic keywords
      "IPTV France",
      "IPTV Belgique",
      "IPTV Suisse",
      "IPTV Canada",
      "IPTV Québec",
      "IPTV Afrique",
      "IPTV mondial",
      "IPTV international",
      // Additional relevant keywords
      "IPTV abordable",
      "IPTV pas cher",
      "IPTV fiable",
      "IPTV stable",
      "IPTV sans gel",
      "IPTV anti-gel",
      "support IPTV 24/7",
      "activation instantanée IPTV",
      "guide configuration IPTV",
      "comment utiliser IPTV",
      "meilleur IPTV France",
      "IPTV France prix",
      "IPTV France acheter",
      "où acheter IPTV",
      "acheter IPTV en ligne",
      "acheter abonnement IPTV",
      "acheter compte IPTV",
      "acheter code IPTV",
      "vendre IPTV",
      "revendre IPTV",
    ],
  };

  // Generate hreflang alternates
  const alternates: Record<string, string> = {};
  locales.forEach((loc) => {
    alternates[loc] = `${baseUrl}/${loc}`;
  });

  // Site name translations
  const siteNameMap: Record<Locale, string> = {
    en: "StreamPro - Premium IPTV Service",
    es: "StreamPro - Servicio IPTV Premium",
    fr: "StreamPro - Service IPTV Premium",
  };

  return {
    title,
    description,
    keywords: keywordsMap[locale],
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
      url: `${baseUrl}/${locale}`,
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
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

