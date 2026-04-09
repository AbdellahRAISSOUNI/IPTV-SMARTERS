"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getInstallationUrl,
  getResellerUrl,
  getLegalUrl,
} from "@/lib/utils/installation-slugs";

const cardBase =
  "group border-2 rounded-xl p-5 transition-all duration-200 text-center hover:border-[#2563eb] hover:bg-[#2563eb]/5 hover:shadow-sm";

export default function InstallationExploreMoreSection() {
  const { t, locale } = useLanguage();
  const guide = getInstallationUrl("iptv-installation-guide", locale);

  const items: { href: string; title: string; subtitle: string; highlight?: boolean }[] = [
    {
      href: `/${locale}/#pricing`,
      title: t("installation.buySubscription"),
      subtitle: t("keywordHub.linkPricing"),
      highlight: true,
    },
    {
      href: `/${locale}/#features`,
      title: t("common.features"),
      subtitle: t("keywordHub.linkFeatures"),
    },
    {
      href: `/${locale}/#faq`,
      title: t("common.faq"),
      subtitle: t("keywordHub.linkFaq"),
    },
    {
      href: `/${locale}/blog/`,
      title: t("installation.readOurBlog"),
      subtitle: t("keywordHub.linkBlog"),
    },
    {
      href: getResellerUrl("iptv-reseller-program", locale),
      title: t("installation.becomeReseller"),
      subtitle: t("keywordHub.linkReseller"),
    },
    {
      href: guide,
      title: t("keywordHub.linkInstallGuide"),
      subtitle: t("installation.howToInstall"),
    },
    {
      href: getInstallationUrl("iptv-installation-firestick", locale),
      title: t("keywordHub.linkFirestick"),
      subtitle: t("installation.firestickAndroid"),
    },
    {
      href: getInstallationUrl("iptv-installation-ios", locale),
      title: t("keywordHub.linkIos"),
      subtitle: t("installation.appleIos"),
    },
    {
      href: getLegalUrl("privacy-policy", locale),
      title: t("common.privacyPolicy"),
      subtitle: t("relatedPages.policiesShort"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-10 pt-8 border-t border-gray-200"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-6">
        {t("installation.exploreMoreTitle")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${cardBase} ${
              item.highlight ? "border-[#2563eb]/30 bg-[#2563eb]/[0.03]" : "border-gray-200"
            }`}
          >
            <span
              className={`text-base font-semibold block ${
                item.highlight ? "text-[#2563eb] group-hover:text-[#1d4ed8]" : "text-[#1a1a1a] group-hover:text-[#2563eb]"
              }`}
            >
              {item.title}
            </span>
            <span className="text-sm text-[#1a1a1a]/70 mt-1 block">{item.subtitle}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
