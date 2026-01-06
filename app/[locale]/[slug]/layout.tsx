import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { getEnglishSlugFromLocalized, isInstallationSlug, isResellerSlug, getResellerSlug, getResellerUrl, getInstallationUrl } from '@/lib/utils/installation-slugs';
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
  
  // If it's not an installation or reseller page, return basic metadata
  if (!englishSlug || (!isInstallationSlug(englishSlug) && !isResellerSlug(englishSlug))) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
  
  // Get language-specific URL
  const currentUrl = isInstallationSlug(englishSlug) 
    ? getInstallationUrl(englishSlug, locale)
    : getResellerUrl(englishSlug, locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;
  
  // Generate alternates with language-specific URLs
  const languageAlternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const altUrl = isInstallationSlug(englishSlug)
      ? getInstallationUrl(englishSlug, loc)
      : getResellerUrl(englishSlug, loc);
    languageAlternates[loc] = `${baseUrl}${altUrl}`;
  });
  const defaultUrl = isInstallationSlug(englishSlug)
    ? getInstallationUrl(englishSlug, 'en')
    : getResellerUrl(englishSlug, 'en');
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
