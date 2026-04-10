"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getInstallationUrl,
  getResellerUrl,
  getLegalUrl,
} from "@/lib/utils/installation-slugs";

type RelatedPagesStripProps = {
  className?: string;
  /** Extra classes for the link row (e.g. justify-center) */
  navClassName?: string;
  /** Show “Related pages” heading above the links */
  showTitle?: boolean;
};

export default function RelatedPagesStrip({
  className = "",
  navClassName = "",
  showTitle = false,
}: RelatedPagesStripProps) {
  const { locale, t } = useLanguage();
  const guide = getInstallationUrl("iptv-installation-guide", locale);

  const links: { id: string; href: string; label: string }[] = [
    { id: "home", href: `/${locale}/`, label: t("common.home") },
    { id: "pricing", href: `/${locale}/#pricing`, label: t("common.pricing") },
    { id: "trial", href: `/${locale}/#pricing`, label: t("relatedPages.linkFreeTrialPricing") },
    { id: "m3u-faq", href: `/${locale}/#faq`, label: t("relatedPages.linkM3uXtream") },
    { id: "features-core", href: `/${locale}/#features`, label: t("common.features") },
    { id: "faq", href: `/${locale}/#faq`, label: t("common.faq") },
    { id: "hub", href: `/${locale}/installation/`, label: t("relatedPages.linkInstallationHub") },
    { id: "guide", href: guide, label: t("installation.howToInstall") },
    { id: "firestick", href: getInstallationUrl("iptv-installation-firestick", locale), label: t("relatedPages.linkFirestickPage") },
    { id: "smarttv", href: getInstallationUrl("iptv-installation-smart-tv", locale), label: t("installation.smartTv") },
    { id: "windows", href: getInstallationUrl("iptv-installation-windows", locale), label: t("relatedPages.linkWindowsPc") },
    { id: "ios", href: getInstallationUrl("iptv-installation-ios", locale), label: t("relatedPages.linkIosApp") },
    { id: "blog", href: `/${locale}/blog/`, label: t("common.blog") },
    { id: "reseller", href: getResellerUrl("iptv-reseller-program", locale), label: t("relatedPages.linkResellerProgram") },
    { id: "privacy", href: getLegalUrl("privacy-policy", locale), label: t("common.privacyPolicy") },
    { id: "terms", href: getLegalUrl("terms-of-service", locale), label: t("common.termsOfService") },
    { id: "refund", href: getLegalUrl("refund-policy", locale), label: t("common.refundPolicy") },
  ];

  return (
    <div className={className}>
      {showTitle && (
        <p className="text-sm font-semibold text-[#1a1a1a] mb-3">{t("relatedPages.title")}</p>
      )}
      <nav
        aria-label={t("relatedPages.navLabel")}
        className={`flex flex-wrap gap-2 ${navClassName}`}
      >
        {links.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2563eb] hover:border-[#2563eb]/40 hover:bg-[#2563eb]/5 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
