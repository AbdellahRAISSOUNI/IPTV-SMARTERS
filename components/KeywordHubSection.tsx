"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getInstallationUrl,
  getResellerUrl,
  getLegalUrl,
} from "@/lib/utils/installation-slugs";

type HubItem = { href: string; label: string; id: string };

export default function KeywordHubSection() {
  const { locale, t } = useLanguage();
  const guide = getInstallationUrl("iptv-installation-guide", locale);

  const keywordLinks: HubItem[] = [
    { id: "home", href: `/${locale}/`, label: t("keywordHub.linkHome") },
    { id: "pricing", href: `/${locale}/#pricing`, label: t("keywordHub.linkPricing") },
    { id: "features", href: `/${locale}/#features`, label: t("keywordHub.linkFeatures") },
    { id: "faq", href: `/${locale}/#faq`, label: t("keywordHub.linkFaq") },
    { id: "latest-blog", href: `/${locale}/#latest-blog`, label: t("keywordHub.linkLatestBlog") },
    { id: "channels", href: `/${locale}/#channels`, label: t("keywordHub.linkChannels") },
    { id: "testimonials", href: `/${locale}/#testimonials`, label: t("keywordHub.linkTestimonials") },
    { id: "cta", href: `/${locale}/#cta`, label: t("keywordHub.linkContact") },
    { id: "install-guide", href: guide, label: t("keywordHub.linkInstallGuide") },
    {
      id: "compatible",
      href: `${guide}#compatible-devices`,
      label: t("keywordHub.linkCompatibleDevices"),
    },
    {
      id: "download",
      href: `${guide}#download-iptv-smarters`,
      label: t("keywordHub.linkDownloadSection"),
    },
    {
      id: "install-options",
      href: `${guide}#installation-options`,
      label: t("keywordHub.linkInstallOptions"),
    },
    {
      id: "lite",
      href: `${guide}#smarters-lite`,
      label: t("keywordHub.linkSmartersLite"),
    },
    {
      id: "firestick",
      href: getInstallationUrl("iptv-installation-firestick", locale),
      label: t("keywordHub.linkFirestick"),
    },
    {
      id: "smarttv",
      href: getInstallationUrl("iptv-installation-smart-tv", locale),
      label: t("keywordHub.linkSmartTv"),
    },
    {
      id: "windows",
      href: getInstallationUrl("iptv-installation-windows", locale),
      label: t("keywordHub.linkWindows"),
    },
    {
      id: "ios",
      href: getInstallationUrl("iptv-installation-ios", locale),
      label: t("keywordHub.linkIos"),
    },
    { id: "blog", href: `/${locale}/blog/`, label: t("keywordHub.linkBlog") },
    {
      id: "reseller",
      href: getResellerUrl("iptv-reseller-program", locale),
      label: t("keywordHub.linkReseller"),
    },
    {
      id: "m3u-xtream",
      href: `/${locale}/#faq`,
      label: t("keywordHub.linkM3uXtream"),
    },
    { id: "privacy", href: getLegalUrl("privacy-policy", locale), label: t("keywordHub.linkPrivacy") },
    { id: "terms", href: getLegalUrl("terms-of-service", locale), label: t("keywordHub.linkTerms") },
    { id: "refund", href: getLegalUrl("refund-policy", locale), label: t("keywordHub.linkRefund") },
  ];

  return (
    <section id="keyword-hub" className="py-10 sm:py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3">{t("keywordHub.title")}</h2>
          <p className="text-sm sm:text-base text-[#1a1a1a]/70 mb-5">{t("keywordHub.subtitle")}</p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {keywordLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="inline-flex items-center rounded-full border border-[#2563eb]/30 bg-white px-4 py-2 text-sm font-medium text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
