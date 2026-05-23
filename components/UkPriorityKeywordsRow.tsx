"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import { getUkKeywordHref, getUkPriorityHubKeywords } from "@/lib/seo/uk-hub";

/** Mid-page priority keyword pills on the UK homepage only. */
export default function UkPriorityKeywordsRow() {
  const { locale, t } = useLanguage();
  if (locale !== "uk") return null;

  const guide = getInstallationUrl("iptv-installation-guide", locale);
  const firestick = getInstallationUrl("iptv-installation-firestick", locale);
  const smartTv = getInstallationUrl("iptv-installation-smart-tv", locale);
  const priorityKeywords = getUkPriorityHubKeywords();

  return (
    <section
      aria-label="Popular UK IPTV searches"
      className="border-b border-gray-100 bg-white py-8 sm:py-10"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <p className="text-center text-sm font-semibold text-[#1a1a1a] mb-4">
          {t("ukKeywords.subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {priorityKeywords.map((item, index) => (
            <Link
              key={item.keyword}
              href={getUkKeywordHref(locale, index, guide, firestick, smartTv)}
              className="inline-flex items-center rounded-full border border-[#2563eb]/30 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
