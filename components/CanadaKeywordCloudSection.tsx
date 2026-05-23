"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";
import {
  getCanadaHubKeywords,
  getCanadaKeywordHref,
} from "@/lib/seo/canada-hub";

/**
 * Visible Canada SEO keyword cloud — shown on /ca pages (homepage footer area and hub).
 * Collapsed by default; user can expand to see all topic pills.
 */
export default function CanadaKeywordCloudSection() {
  const { locale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (locale !== "ca") return null;

  const guide = getInstallationUrl("iptv-installation-guide", locale);
  const firestick = getInstallationUrl("iptv-installation-firestick", locale);
  const smartTv = getInstallationUrl("iptv-installation-smart-tv", locale);
  const keywords = getCanadaHubKeywords();
  const panelId = "canada-keywords-panel";

  return (
    <section
      id="canada-iptv-keywords"
      className="py-10 sm:py-12 bg-white border-t border-gray-100"
      aria-labelledby="canada-keywords-heading"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="rounded-2xl border border-red-200/60 bg-red-50/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h2
                id="canada-keywords-heading"
                className="text-xl sm:text-2xl font-bold text-[#1a1a1a]"
              >
                {t("canadaKeywords.title")}
              </h2>
              <p className="text-sm sm:text-base text-[#1a1a1a]/70 mt-2">
                {t("canadaKeywords.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-300/60 bg-white px-4 py-2.5 text-sm font-semibold text-red-900 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors self-start sm:self-center"
            >
              {isOpen
                ? t("canadaKeywords.collapseLabel")
                : t("canadaKeywords.expandLabel")}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          </div>

          <div
            id={panelId}
            hidden={!isOpen}
            className={isOpen ? "block" : "hidden"}
          >
            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2 border-t border-red-200/40">
              {keywords.map((item, index) => (
                <Link
                  key={`${item.keyword}-${index}`}
                  href={getCanadaKeywordHref(
                    locale,
                    index,
                    guide,
                    firestick,
                    smartTv
                  )}
                  className="inline-flex items-center rounded-full border border-red-300/50 bg-white px-3.5 py-1.5 text-sm font-medium text-red-900 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
