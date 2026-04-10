"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getInstallationUrl, getResellerUrl, getLegalUrl } from "@/lib/utils/installation-slugs";
import {
  OFFICIAL_IBO_PLAYER_URL,
  OFFICIAL_IPTV_SMARTERS_DOWNLOADS_URL,
  VLC_OFFICIAL_URL,
} from "@/lib/constants/official-player-links";

type Variant = "default" | "legal" | "installation" | "reseller";

interface SeoLinksPanelProps {
  variant?: Variant;
  className?: string;
}

export default function SeoLinksPanel({ variant = "default", className = "" }: SeoLinksPanelProps) {
  const { locale, t } = useLanguage();
  const guide = getInstallationUrl("iptv-installation-guide", locale);

  const internal: { id: string; href: string; label: string }[] = [
    { id: "pricing-1", href: `/${locale}/#pricing`, label: "IPTV subscription pricing" },
    { id: "pricing-2", href: `/${locale}/#pricing`, label: "IPTV plans & deals" },
    { id: "features-1", href: `/${locale}/#features`, label: "premium IPTV features" },
    { id: "features-2", href: `/${locale}/#features`, label: "IPTV Smarters Pro subscription" },
    { id: "faq-1", href: `/${locale}/#faq`, label: "IPTV FAQ" },
    { id: "faq-2", href: `/${locale}/#faq`, label: "M3U playlist & Xtream Codes help" },
    { id: "channels", href: `/${locale}/#channels`, label: "HD & 4K live TV channels" },
    { id: "testimonials", href: `/${locale}/#testimonials`, label: "customer reviews" },
    { id: "blog", href: `/${locale}/blog/`, label: "IPTV setup blog" },
    { id: "guide", href: guide, label: "IPTV Smarters installation guide" },
    { id: "install-hub", href: `/${locale}/installation/`, label: "device installation hub" },
    { id: "reseller-teaser", href: getResellerUrl("iptv-reseller-program", locale), label: "IPTV reseller program" },
  ];

  if (variant === "legal") {
    internal.push(
      { id: "privacy", href: getLegalUrl("privacy-policy", locale), label: "privacy policy" },
      { id: "terms", href: getLegalUrl("terms-of-service", locale), label: "terms of service" },
      { id: "refund", href: getLegalUrl("refund-policy", locale), label: "refund policy" },
    );
  }

  if (variant === "installation") {
    internal.push(
      { id: "firestick", href: getInstallationUrl("iptv-installation-firestick", locale), label: "install IPTV on Firestick" },
      { id: "smarttv", href: getInstallationUrl("iptv-installation-smart-tv", locale), label: "install IPTV on Smart TV" },
      { id: "windows", href: getInstallationUrl("iptv-installation-windows", locale), label: "install IPTV on Windows PC" },
      { id: "ios", href: getInstallationUrl("iptv-installation-ios", locale), label: "install IPTV on iPhone & iPad" },
      { id: "home-pricing", href: `/${locale}/#pricing`, label: "compare IPTV subscription prices" },
    );
  }

  if (variant === "reseller") {
    internal.push(
      { id: "reseller-pricing", href: `/${locale}/#pricing`, label: "IPTV plans for clients" },
      { id: "reseller-blog", href: `/${locale}/blog/`, label: "IPTV business & setup articles" },
      { id: "reseller-install", href: guide, label: "Smarters install guide for clients" },
    );
  }

  const external = [
    { id: "ext-smarters", href: OFFICIAL_IPTV_SMARTERS_DOWNLOADS_URL, label: t("officialOutbound.smartersDownloads") },
    { id: "ext-ibo", href: OFFICIAL_IBO_PLAYER_URL, label: t("officialOutbound.iboPlayerSite") },
    { id: "ext-vlc", href: VLC_OFFICIAL_URL, label: t("officialOutbound.vlcPlayer") },
  ];

  return (
    <section className={`rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5 ${className}`}>
      <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Popular IPTV links</p>
      <p className="text-xs sm:text-sm text-[#1a1a1a]/75 leading-relaxed">
        {internal.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? " • " : ""}
            <Link href={item.href} className="text-[#2563eb] hover:underline underline-offset-2">
              {item.label}
            </Link>
          </span>
        ))}
      </p>
      <p className="mt-2 text-xs text-[#1a1a1a]/60">
        {external.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? " • " : ""}
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:underline underline-offset-2">
              {item.label}
            </a>
          </span>
        ))}
      </p>
    </section>
  );
}
