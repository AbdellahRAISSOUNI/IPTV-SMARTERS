import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import {
  getEnglishSlugFromLocalized,
  isInstallationSlug,
  isResellerSlug,
  isLegalSlug,
  getResellerUrl,
  getInstallationUrl,
  getLegalUrl,
} from '@/lib/utils/installation-slugs';
import { getInstallationMetadata, getResellerMetadata } from '@/lib/utils/metadata-loader';
import { locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

// Import layout components
import InstallationGuideLayout from '../iptv-installation-guide/layout';
import WindowsInstallationLayout from '../iptv-installation-windows/layout';
import ResellerLayout from '../iptv-reseller-program/layout';

const layoutMap: Record<string, React.ComponentType<{ children: React.ReactNode }>> = {
  'iptv-installation-guide': InstallationGuideLayout,
  'iptv-installation-windows': WindowsInstallationLayout,
  'iptv-reseller-program': ResellerLayout,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;
  
  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';
  
  // Check if this is a localized installation or reseller slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);
  
  // If it's not an installation, reseller, or legal page, return basic metadata
  if (
    !englishSlug ||
    (!isInstallationSlug(englishSlug) && !isResellerSlug(englishSlug) && !isLegalSlug(englishSlug))
  ) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
  
  // Get language-specific URL
  const currentUrl = isInstallationSlug(englishSlug)
    ? getInstallationUrl(englishSlug, locale)
    : isResellerSlug(englishSlug)
    ? getResellerUrl(englishSlug, locale)
    : getLegalUrl(englishSlug, locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  
  // Generate alternates with language-specific URLs
  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const altUrl = isInstallationSlug(englishSlug)
      ? getInstallationUrl(englishSlug, loc)
      : isResellerSlug(englishSlug)
      ? getResellerUrl(englishSlug, loc)
      : getLegalUrl(englishSlug, loc);
    languageAlternates[loc] = `${baseUrl}${altUrl}`;
  });
  const defaultUrl = isInstallationSlug(englishSlug)
    ? getInstallationUrl(englishSlug, 'en')
    : isResellerSlug(englishSlug)
    ? getResellerUrl(englishSlug, 'en')
    : getLegalUrl(englishSlug, 'en');
  languageAlternates['x-default'] = `${baseUrl}${defaultUrl}`;
  
  // Load metadata based on page type
  let title = '';
  let description = '';
  let keywords: string[] = [];
  
  try {
    if (englishSlug === 'iptv-installation-guide') {
      const metadata = await getInstallationMetadata(locale, 'guide');
      title = metadata?.title || '';
      description = metadata?.description || '';
    } else if (englishSlug === 'iptv-installation-windows') {
      const metadata = await getInstallationMetadata(locale, 'windows');
      title = metadata?.title || '';
      description = metadata?.description || '';
    } else if (englishSlug === 'iptv-installation-ios') {
      const metadata = await getInstallationMetadata(locale, 'ios');
      title = metadata?.title || '';
      description = metadata?.description || '';
    } else if (englishSlug === 'iptv-installation-smart-tv') {
      const metadata = await getInstallationMetadata(locale, 'smartTv');
      title = metadata?.title || '';
      description = metadata?.description || '';
    } else if (englishSlug === 'iptv-installation-firestick') {
      const metadata = await getInstallationMetadata(locale, 'firestick');
      title = metadata?.title || '';
      description = metadata?.description || '';
    } else if (englishSlug === 'iptv-reseller-program') {
      const metadata = await getResellerMetadata(locale);
      title = metadata?.title || '';
      description = metadata?.description || '';
      keywords = {
        en: [
          "iptv reseller program", "become iptv reseller", "iptv reseller", "white label iptv", "iptv reseller panel",
          "iptv business", "start iptv business", "iptv reseller account", "iptv reseller pricing", "iptv reseller support",
          "iptv reseller platform", "iptv reseller credits", "iptv reseller program benefits", "iptv reseller opportunity",
          "iptv reseller white label",
        ],
        es: [
          "programa revendedor iptv", "convertirse revendedor iptv", "revendedor iptv", "iptv white label", "panel revendedor iptv",
          "negocio iptv", "iniciar negocio iptv", "cuenta revendedor iptv", "precios revendedor iptv", "soporte revendedor iptv",
          "plataforma revendedor iptv", "créditos revendedor iptv", "beneficios programa revendedor iptv", "oportunidad revendedor iptv",
          "revendedor iptv white label",
        ],
        fr: [
          "programme revendeur iptv", "devenir revendeur iptv", "revendeur iptv", "iptv white label", "panneau revendeur iptv",
          "business iptv", "démarrer business iptv", "compte revendeur iptv", "tarifs revendeur iptv", "support revendeur iptv",
          "plateforme revendeur iptv", "crédits revendeur iptv", "avantages programme revendeur iptv", "opportunité revendeur iptv",
          "revendeur iptv white label",
        ],
      }[locale];
    } else if (englishSlug === 'refund-policy') {
      const titleMap: Record<Locale, string> = {
        en: 'Refund Policy | Officiel IPTV Abonnement',
        es: 'Política de Reembolso | Officiel IPTV Abonnement',
        fr: 'Politique de Remboursement | Officiel IPTV Abonnement',
      };
      const descriptionMap: Record<Locale, string> = {
        en: 'Learn about our 5-day money-back guarantee and how refunds are handled for your IPTV subscription with Officiel IPTV Abonnement.',
        es: 'Conozca nuestra garantía de reembolso de 5 días y cómo se gestionan los reembolsos de su suscripción IPTV con Officiel IPTV Abonnement.',
        fr: 'Découvrez notre garantie de remboursement de 5 jours et la manière dont les remboursements sont gérés pour votre abonnement IPTV avec Officiel IPTV Abonnement.',
      };
      title = titleMap[locale];
      description = descriptionMap[locale];
      keywords = {
        en: ['iptv refund policy', 'money-back guarantee iptv', 'iptv subscription refund'],
        es: ['política de reembolso iptv', 'garantía de reembolso iptv', 'reembolso suscripción iptv'],
        fr: ['politique de remboursement iptv', 'garantie de remboursement iptv', 'remboursement abonnement iptv'],
      }[locale];
    } else if (englishSlug === 'privacy-policy') {
      const titleMap: Record<Locale, string> = {
        en: 'Privacy Policy | Officiel IPTV Abonnement',
        es: 'Política de Privacidad | Officiel IPTV Abonnement',
        fr: 'Politique de Confidentialité | Officiel IPTV Abonnement',
      };
      const descriptionMap: Record<Locale, string> = {
        en: 'Read how Officiel IPTV Abonnement collects, uses, and protects your personal data while you use our IPTV services and website.',
        es: 'Conozca cómo Officiel IPTV Abonnement recopila, utiliza y protege sus datos personales mientras utiliza nuestros servicios IPTV y nuestro sitio web.',
        fr: 'Découvrez comment Officiel IPTV Abonnement collecte, utilise et protège vos données personnelles lors de l’utilisation de nos services IPTV et de notre site web.',
      };
      title = titleMap[locale];
      description = descriptionMap[locale];
      keywords = {
        en: ['iptv privacy policy', 'data protection iptv', 'iptv personal data'],
        es: ['política de privacidad iptv', 'protección de datos iptv', 'datos personales iptv'],
        fr: ['politique de confidentialité iptv', 'protection des données iptv', 'données personnelles iptv'],
      }[locale];
    } else if (englishSlug === 'terms-of-service') {
      const titleMap: Record<Locale, string> = {
        en: 'Terms of Service | Officiel IPTV Abonnement',
        es: 'Términos de Servicio | Officiel IPTV Abonnement',
        fr: "Conditions d'Utilisation | Officiel IPTV Abonnement",
      };
      const descriptionMap: Record<Locale, string> = {
        en: 'Review the terms and conditions governing the use of the Officiel IPTV Abonnement website and IPTV subscription services.',
        es: 'Revise los términos y condiciones que rigen el uso del sitio web y los servicios de suscripción IPTV de Officiel IPTV Abonnement.',
        fr: "Consultez les termes et conditions régissant l'utilisation du site et des services d'abonnement IPTV d'Officiel IPTV Abonnement.",
      };
      title = titleMap[locale];
      description = descriptionMap[locale];
      keywords = {
        en: ['iptv terms of service', 'iptv terms and conditions', 'iptv website terms'],
        es: ['términos de servicio iptv', 'términos y condiciones iptv', 'condiciones sitio web iptv'],
        fr: ["conditions d'utilisation iptv", 'termes et conditions iptv', 'conditions site web iptv'],
      }[locale];
    }
  } catch (error) {
    console.error('Error loading page metadata:', error);
    // Fallback titles
    const fallbackTitles: Record<string, Record<Locale, string>> = {
      'iptv-installation-guide': {
        en: 'IPTV Installation Guide',
        es: 'Guía de Instalación IPTV',
        fr: 'Guide d\'Installation IPTV',
      },
      'iptv-installation-ios': {
        en: 'Install IPTV on iOS',
        es: 'Instalar IPTV en iOS',
        fr: 'Installer IPTV sur iOS',
      },
      'iptv-installation-windows': {
        en: 'Install IPTV on Windows',
        es: 'Instalar IPTV en Windows',
        fr: 'Installer IPTV sur Windows',
      },
      'iptv-installation-smart-tv': {
        en: 'Install IPTV on Smart TV',
        es: 'Instalar IPTV en Smart TV',
        fr: 'Installer IPTV sur Smart TV',
      },
      'iptv-installation-firestick': {
        en: 'Install IPTV on Firestick',
        es: 'Instalar IPTV en Firestick',
        fr: 'Installer IPTV sur Firestick',
      },
      'iptv-reseller-program': {
        en: 'IPTV Reseller Program',
        es: 'Programa Revendedor IPTV',
        fr: 'Programme Revendeur IPTV',
      },
      'refund-policy': {
        en: 'Refund Policy',
        es: 'Política de Reembolso',
        fr: 'Politique de Remboursement',
      },
      'privacy-policy': {
        en: 'Privacy Policy',
        es: 'Política de Privacidad',
        fr: 'Politique de Confidentialité',
      },
      'terms-of-service': {
        en: 'Terms of Service',
        es: 'Términos de Servicio',
        fr: "Conditions d'Utilisation",
      },
    };
    title = fallbackTitles[englishSlug]?.[locale] || 'Page';
    description = `Complete guide for ${englishSlug}`;
  }
  
  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
  };
  
  const siteNameMap: Record<Locale, string> = {
    en: 'StreamPro - Premium IPTV Service',
    es: 'StreamPro - Servicio IPTV Premium',
    fr: 'StreamPro - Service IPTV Premium',
  };
  
  const ogImage = `${baseUrl}/images/hero.png`;
  
  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'article',
      locale: localeMap[locale],
      url: canonicalUrl,
      siteName: siteNameMap[locale],
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@streampro',
      site: '@streampro',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function InstallationSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;
  
  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;
  
  // Check if this is a localized installation or reseller slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);
  
  // If it's not an installation or reseller page, just return children
  if (!englishSlug || (!isInstallationSlug(englishSlug) && !isResellerSlug(englishSlug))) {
    return <>{children}</>;
  }
  
  // Get the appropriate layout component if it exists
  const LayoutComponent = layoutMap[englishSlug];
  
  if (LayoutComponent) {
    return <LayoutComponent>{children}</LayoutComponent>;
  }
  
  // Default layout
  return <>{children}</>;
}
