"use client";

import { ExternalLink } from "lucide-react";
import {
  OFFICIAL_IBO_PLAYER_URL,
  OFFICIAL_IPTV_SMARTERS_DOWNLOADS_URL,
} from "@/lib/constants/official-player-links";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Highlights official player-app download pages: users need an IPTV player to consume
 * M3U / Xtream credentials from their subscription; these are the canonical outbound links.
 */
export default function OfficialPlayerAppsSection() {
  const { t } = useLanguage();

  return (
    <section
      className="border-y border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-10 sm:py-12"
      aria-labelledby="official-player-apps-heading"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2
            id="official-player-apps-heading"
            className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3"
          >
            {t("officialPlayerApps.title")}
          </h2>
          <p className="text-sm sm:text-base text-[#1a1a1a]/70 leading-relaxed">
            {t("officialPlayerApps.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              {t("officialPlayerApps.smartersTitle")}
            </h3>
            <p className="text-sm text-[#1a1a1a]/75 leading-relaxed flex-1 mb-5">
              {t("officialPlayerApps.smartersBody")}
            </p>
            <a
              href={OFFICIAL_IPTV_SMARTERS_DOWNLOADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition-colors"
            >
              {t("officialPlayerApps.smartersCta")}
              <ExternalLink className="w-4 h-4 opacity-90" aria-hidden />
            </a>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              {t("officialPlayerApps.iboTitle")}
            </h3>
            <p className="text-sm text-[#1a1a1a]/75 leading-relaxed flex-1 mb-5">
              {t("officialPlayerApps.iboBody")}
            </p>
            <a
              href={OFFICIAL_IBO_PLAYER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#2563eb] bg-white px-5 py-3 text-sm font-semibold text-[#2563eb] hover:bg-[#2563eb]/5 transition-colors"
            >
              {t("officialPlayerApps.iboCta")}
              <ExternalLink className="w-4 h-4 opacity-90" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
