"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { openWhatsApp } from "@/lib/whatsapp";
import Image from "next/image";
import { parseUrlsToLinks } from "@/lib/utils/urlParser";
import {
  Check,
  Download,
  MessageCircle,
  Monitor,
  Zap,
  Tv,
  Shield,
  Users,
  PlayCircle,
} from "lucide-react";

// Lazy load non-critical components
const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

// Loading placeholder
const ComponentLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse rounded-lg" />
);

export default function InstallationPage() {
  const { t, locale } = useLanguage();

  const currentYear = new Date().getFullYear();

  const benefits = [
    {
      icon: Monitor,
      title: t("installation.benefit1Title"),
      desc: t("installation.benefit1Description"),
    },
    {
      icon: Zap,
      title: t("installation.benefit2Title"),
      desc: t("installation.benefit2Description"),
    },
    {
      icon: Tv,
      title: t("installation.benefit3Title"),
      desc: t("installation.benefit3Description"),
    },
    {
      icon: PlayCircle,
      title: t("installation.benefit4Title"),
      desc: t("installation.benefit4Description"),
    },
    {
      icon: Users,
      title: t("installation.benefit5Title"),
      desc: t("installation.benefit5Description"),
    },
    {
      icon: Shield,
      title: t("installation.benefit6Title"),
      desc: t("installation.benefit6Description"),
    },
  ];

  const liteBenefits = [
    t("installation.liteBenefit1"),
    t("installation.liteBenefit2"),
    t("installation.liteBenefit3"),
    t("installation.liteBenefit4"),
    t("installation.liteBenefit5"),
  ];

  const installationOptions = [
    {
      href: `/${locale}/iptv-installation-ios`,
      label: t("installation.appleIos"),
    },
    {
      href: `/${locale}/iptv-installation-smart-tv`,
      label: t("installation.smartTv"),
    },
    {
      href: `/${locale}/iptv-installation-windows`,
      label: t("installation.windows"),
    },
    {
      href: `/${locale}/iptv-installation-firestick`,
      label: t("installation.firestickAndroid"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <main className="pt-28 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2563eb] mb-6 leading-tight">
              {t("installation.title")}
            </h1>
            <p className="text-base text-[#1a1a1a]/80 leading-relaxed">
              {t("installation.introTitle")}
            </p>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-12"
          >
            <p className="text-base text-[#1a1a1a]/70 leading-relaxed mb-4">
              {t("installation.introDescription")}
            </p>
            <p className="text-base text-[#2563eb] font-medium">
              {t("installation.introTagline")}
            </p>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* What is IPTV Smarters Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4">
              {t("installation.whatIsTitle")}
            </h2>
            <p className="text-base text-[#1a1a1a]/70 leading-relaxed">
              {t("installation.whatIsDescription")}
            </p>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* Compatible With */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-6">
              {t("installation.compatibleTitle")}
            </h2>
            <ul className="space-y-2 text-base text-[#1a1a1a]/70">
              <li>• {t("installation.compatibleAndroid")}</li>
              <li>• {t("installation.compatibleSmartTv")}</li>
              <li>• {t("installation.compatibleFirestick")}</li>
              <li>• {t("installation.compatibleDesktop")}</li>
            </ul>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* Why Choose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-3">
              {t("installation.whyChooseTitle")}
            </h2>
            <p className="text-base text-[#1a1a1a]/70 mb-8 leading-relaxed">
              {t("installation.whyChooseSubtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#1a1a1a] mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

      <div className="h-px bg-gray-200 my-10" />

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-12"
          >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-3">
            {t("installation.downloadTitle")}
          </h2>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">
            {t("installation.smartTvGuideTitle")}
          </h3>
          <p className="text-base text-[#1a1a1a]/70 mb-4 leading-relaxed">
            {t("installation.smartTvGuideDescription")}
          </p>

          <div className="relative w-[90%] mx-auto aspect-[16/9] overflow-hidden rounded-lg mb-6">
            <Image
              src="/instalation/app.webp"
              alt="Téléchargement IPTV Smarters"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
              quality={75}
              priority={false}
            />
          </div>

          <a
            href={`/${locale}#pricing`}
            className="inline-flex items-center gap-2 text-base text-[#2563eb] hover:text-[#1d4ed8] font-semibold mb-6"
          >
            {t("installation.buySubscription")}
          </a>

          <div className="space-y-8 mt-8">
            {/* New Version */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">
                {t("installation.newVersionTitle")}
              </h3>
              <p className="text-base text-[#1a1a1a]/80 mb-5 leading-relaxed">
                {t("installation.newVersionSubtitle").replace("{year}", currentYear.toString())}
              </p>
              <div className="mb-5">
                <p className="text-sm font-medium text-[#1a1a1a] mb-3">
                  {t("installation.compatibleWithAll")}
                </p>
                <ul className="space-y-2 text-sm text-[#1a1a1a]/70">
                  <li className="flex items-center gap-2">
                    <span>📱</span>
                    <span>{t("installation.deviceSmartphones")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💻</span>
                    <span>{t("installation.deviceComputers")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📺</span>
                    <span>{t("installation.deviceSmartTvs")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>{t("installation.deviceBrowsers")}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-[#1a1a1a]/70 mb-3">{t("installation.downloadAvailable")}</p>
                <a
                  href="https://www.iptvsmarters.com/#downloads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#2563eb] hover:text-[#1d4ed8] font-medium hover:underline"
                >
                  <Download className="w-5 h-5" />
                  https://www.iptvsmarters.com/#downloads
                </a>
              </div>
            </div>

            {/* Old Version */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">
                {t("installation.oldVersionTitle")}
              </h3>
              <p className="text-base text-[#1a1a1a]/80 mb-4 leading-relaxed">
                {t("installation.oldVersionSubtitle").replace("{year}", (currentYear - 1).toString())}
              </p>
              <p className="text-sm text-[#1a1a1a]/70 mb-4">
                {parseUrlsToLinks(t("installation.oldVersionUrl"))}
              </p>
              <a
                href="https://www.iptvsmarters.com/smarters.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                {t("installation.downloadApk")}
              </a>
            </div>
          </div>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* Smart TV Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4">
              {t("installation.smartTvGuideTitle")}
            </h2>
            <p className="text-base text-[#1a1a1a]/70 leading-relaxed">
              {t("installation.smartTvGuideDescription")}
            </p>
          </motion.div>

      <div className="h-px bg-gray-200 my-6" />

          {/* Installation Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-8">
              {t("installation.howToInstall")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {installationOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.href}
                  className="group border-2 border-gray-200 rounded-lg p-5 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all duration-200 hover:shadow-sm"
                >
                  <p className="text-base font-semibold text-[#1a1a1a] group-hover:text-[#2563eb] transition-colors">
                    {option.label}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>

      <div className="h-px bg-gray-200 my-10" />

          {/* Smarters Player Lite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mb-12"
          >
        <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4">
          {t("installation.smartersLiteTitle")}
        </h2>
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-4">
          <Image
            src="/instalation/images-1.webp"
            alt="Smarters Player Lite"
            fill
            className="object-contain bg-white"
            sizes="(max-width: 768px) 100vw, 900px"
            quality={75}
          />
        </div>
        <p className="text-base text-[#1a1a1a]/70 mb-6 leading-relaxed">
          Vous cherchez une Application 100 % gratuite pour profiter de votre Abonnement IPTV ? Ne cherchez plus ! Smarters Player Lite est la solution idéale. Cette version légère de l'application IPTV Smarters vous permet d'accéder à vos chaînes TV, films, séries et contenus à la demande facilement, sans frais supplémentaires.
        </p>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
          {t("installation.whyLiteTitle")}
        </h3>
        <ul className="space-y-3 mb-6">
          {liteBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
              <span className="text-base text-[#1a1a1a]/70">{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="text-base text-[#1a1a1a]/70 leading-relaxed mb-4">
          {t("installation.liteDescription")}
        </p>
        <p className="text-base text-[#1a1a1a]/70 leading-relaxed mb-2">{t("installation.contactTitle")}</p>
        <p className="text-base text-[#1a1a1a]/70 leading-relaxed mb-4">
          {t("installation.contactDescription")}
        </p>
        <p className="text-base text-[#1a1a1a]/70 leading-relaxed">
          👉 {t("installation.contactAction")}
          <br />
          <a
            href={t("installation.contactLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] hover:text-[#1d4ed8] font-medium"
          >
            {t("installation.contactLink")}
          </a>
        </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="border-t border-gray-200 pt-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4">
              {t("installation.contactTitle")}
            </h2>
            <p className="text-base text-[#1a1a1a]/70 mb-4 leading-relaxed">
              {t("installation.contactDescription")}
            </p>
            <p className="text-base text-[#1a1a1a]/70 mb-6 leading-relaxed">
              {t("installation.contactAction")}
            </p>
            <button
              onClick={() => openWhatsApp(t("whatsapp.installationHelp"))}
              className="inline-flex items-center gap-2 text-base text-[#2563eb] hover:text-[#1d4ed8] font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Contact us on WhatsApp
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>

      {/* Floating WhatsApp Button */}
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
