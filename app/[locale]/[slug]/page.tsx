import { notFound, redirect } from 'next/navigation';
import { getEnglishSlugFromLocalized, isInstallationSlug, isResellerSlug, isLegalSlug } from '@/lib/utils/installation-slugs';
import type { Locale } from '@/lib/i18n';
import { locales } from '@/lib/i18n';

// Import page components directly
import InstallationGuidePage from '../iptv-installation-guide/page';
import IosInstallationPage from '../iptv-installation-ios/page';
import WindowsInstallationPage from '../iptv-installation-windows/page';
import SmartTvInstallationPage from '../iptv-installation-smart-tv/page';
import FirestickInstallationPage from '../iptv-installation-firestick/page';
import ResellerPage from '../iptv-reseller-program/page';
import RefundPolicyPage from '../refund-policy/page';
import PrivacyPolicyPage from '../privacy-policy/page';
import TermsOfServicePage from '../terms-of-service/page';

// Map English slugs to their page components
const installationPageMap: Record<string, React.ComponentType> = {
  'iptv-installation-guide': InstallationGuidePage,
  'iptv-installation-ios': IosInstallationPage,
  'iptv-installation-windows': WindowsInstallationPage,
  'iptv-installation-smart-tv': SmartTvInstallationPage,
  'iptv-installation-firestick': FirestickInstallationPage,
  'iptv-reseller-program': ResellerPage,
  'refund-policy': RefundPolicyPage,
  'privacy-policy': PrivacyPolicyPage,
  'terms-of-service': TermsOfServicePage,
};

export default async function InstallationSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;
  
  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;
  
  // Check if this is a localized installation, reseller, or legal slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);
  
  // If it's not an installation, reseller, or legal page, return 404
  if (!englishSlug || (!isInstallationSlug(englishSlug) && !isResellerSlug(englishSlug) && !isLegalSlug(englishSlug))) {
    notFound();
  }
  
  // Get the appropriate page component
  const PageComponent = installationPageMap[englishSlug];
  
  if (!PageComponent) {
    notFound();
  }
  
  // Render the page component
  return <PageComponent />;
}
