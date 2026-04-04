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
import { getInstallationMetadata, getResellerMetadata, getLegalMetadata } from '@/lib/utils/metadata-loader';
import { locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { getRouteMetaKeywords } from '@/lib/seo/corpus-route-keywords';
import { localizedSlugSeoConfig } from '@/lib/seo/route-seed-keywords';
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';

// Import layout components
import InstallationGuideLayout from '../iptv-installation-guide/layout';
import WindowsInstallationLayout from '../iptv-installation-windows/layout';
import ResellerLayout from '../iptv-reseller-program/layout';

type NestedLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const layoutMap: Record<string, React.ComponentType<NestedLayoutProps>> = {
  'iptv-installation-guide': InstallationGuideLayout,
  'iptv-installation-windows': WindowsInstallationLayout,
  'iptv-reseller-program': ResellerLayout,
};

async function loadSlugMetadata(
  englishSlug: string,
  locale: Locale
): Promise<{ title: string; description: string }> {
  if (englishSlug === 'iptv-installation-guide') {
    return getInstallationMetadata(locale, 'guide');
  }
  if (englishSlug === 'iptv-installation-windows') {
    return getInstallationMetadata(locale, 'windows');
  }
  if (englishSlug === 'iptv-installation-ios') {
    return getInstallationMetadata(locale, 'ios');
  }
  if (englishSlug === 'iptv-installation-smart-tv') {
    return getInstallationMetadata(locale, 'smartTv');
  }
  if (englishSlug === 'iptv-installation-firestick') {
    return getInstallationMetadata(locale, 'firestick');
  }
  if (englishSlug === 'iptv-reseller-program') {
    return getResellerMetadata(locale);
  }
  if (englishSlug === 'refund-policy') {
    return getLegalMetadata(locale, 'refundPolicy');
  }
  if (englishSlug === 'privacy-policy') {
    return getLegalMetadata(locale, 'privacyPolicy');
  }
  if (englishSlug === 'terms-of-service') {
    return getLegalMetadata(locale, 'termsOfService');
  }
  return { title: '', description: '' };
}

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
  
  let title = '';
  let description = '';
  let keywords: string[] = [];

  try {
    const metadata = await loadSlugMetadata(englishSlug, locale);
    title = metadata?.title || '';
    description = metadata?.description || '';
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

  const seoCfg = localizedSlugSeoConfig[englishSlug];
  if (seoCfg) {
    keywords = getRouteMetaKeywords(locale, seoCfg.profile, seoCfg.seeds[locale]);
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
  
  if (
    !englishSlug ||
    (!isInstallationSlug(englishSlug) && !isResellerSlug(englishSlug) && !isLegalSlug(englishSlug))
  ) {
    return <>{children}</>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pro-iptvsmarters.com';
  const currentUrl = isInstallationSlug(englishSlug)
    ? getInstallationUrl(englishSlug, locale)
    : isResellerSlug(englishSlug)
      ? getResellerUrl(englishSlug, locale)
      : getLegalUrl(englishSlug, locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const LayoutComponent = layoutMap[englishSlug];
  const seoCfg = localizedSlugSeoConfig[englishSlug];
  const needsJsonLd = !LayoutComponent && seoCfg;

  const jsonLdBlock = needsJsonLd
    ? await renderSlugWebPageJsonLd(englishSlug, locale, canonicalUrl, baseUrl)
    : null;

  if (LayoutComponent) {
    return (
      <LayoutComponent params={Promise.resolve({ locale })}>{children}</LayoutComponent>
    );
  }

  return (
    <>
      {jsonLdBlock}
      {children}
    </>
  );
}

async function renderSlugWebPageJsonLd(
  englishSlug: string,
  locale: Locale,
  canonicalUrl: string,
  baseUrl: string
) {
  const seoCfg = localizedSlugSeoConfig[englishSlug];
  if (!seoCfg) return null;
  let title = '';
  let description = '';
  try {
    const m = await loadSlugMetadata(englishSlug, locale);
    title = m.title;
    description = m.description;
  } catch {
    return null;
  }
  const keywords = getRouteMetaKeywords(locale, seoCfg.profile, seoCfg.seeds[locale]);
  return (
    <WebPageJsonLd
      url={canonicalUrl}
      name={title}
      description={description}
      locale={locale}
      keywords={keywords}
      siteUrl={`${baseUrl}/${locale}/`}
    />
  );
}
