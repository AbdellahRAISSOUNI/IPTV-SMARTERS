"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { openWhatsApp } from "@/lib/whatsapp";
import { Check, Download, MessageCircle } from "lucide-react";

// Lazy load non-critical components
const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

// Loading placeholder
const ComponentLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse rounded-lg" />
);

export default function InstallationPage() {
  const { t, locale } = useLanguage();

  const benefits = [
    t("installation.benefit1Title"),
    t("installation.benefit2Title"),
    t("installation.benefit3Title"),
    t("installation.benefit4Title"),
    t("installation.benefit5Title"),
    t("installation.benefit6Title"),
  ];

  const benefitDescriptions = [
    t("installation.benefit1Description"),
    t("installation.benefit2Description"),
    t("installation.benefit3Description"),
    t("installation.benefit4Description"),
    t("installation.benefit5Description"),
    t("installation.benefit6Description"),
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
      href: `/${locale}/installation/apple-ios`,
      label: t("installation.appleIos"),
    },
    {
      href: `/${locale}/installation/smart-tv`,
      label: t("installation.smartTv"),
    },
    {
      href: `/${locale}/installation/windows`,
      label: t("installation.windows"),
    },
    {
      href: `/${locale}/installation/firestick-android-ios`,
      label: t("installation.firestickAndroid"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <main className="pt-32 pb-16">
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
            <div className="space-y-5">
              {benefits.map((benefit, index) => (
                <div key={index} className="border-b border-gray-200 pb-5 last:border-0 last:pb-0">
                  <h3 className="text-base font-medium text-[#1a1a1a] mb-2">
                    {benefit}
                  </h3>
                  <p className="text-base text-[#1a1a1a]/60 leading-relaxed">
                    {benefitDescriptions[index]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4">
              {t("installation.downloadSectionTitle")}
            </h2>
            <p className="text-base text-[#1a1a1a]/70 mb-8 leading-relaxed">
              {t("installation.downloadSectionDescription")}
            </p>

            <div className="space-y-4">
              {/* New Version */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                    {t("installation.newVersionTitle")}
                  </h3>
                  <p className="text-sm text-[#1a1a1a]/60 mb-4">
                    {t("installation.newVersionSubtitle")}
                  </p>
                </div>
                <a
                  href="https://www.iptvsmarters.com/#downloads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#2563eb] hover:text-[#1d4ed8] font-medium"
                >
                  <Download className="w-5 h-5" />
                  {t("installation.downloadAvailable")}
                </a>
              </div>

              {/* Old Version */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                    {t("installation.oldVersionTitle")}
                  </h3>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">
                    {t("installation.oldVersionSubtitle")}
                  </p>
                  <p className="text-sm text-[#1a1a1a]/60 mb-4">
                    {t("installation.oldVersionUrl")}
                  </p>
                </div>
                <a
                  href="https://www.iptvsmarters.com/smarters.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#2563eb] hover:text-[#1d4ed8] font-medium"
                >
                  <Download className="w-5 h-5" />
                  Download APK
                </a>
              </div>
            </div>
          </motion.div>

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
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-colors duration-200"
                >
                  <p className="text-base font-medium text-[#1a1a1a]">
                    {option.label}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>

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
            <p className="text-base text-[#1a1a1a]/70 mb-6 leading-relaxed">
              {t("installation.smartersLiteIntro")}
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
            <p className="text-base text-[#1a1a1a]/70 leading-relaxed">
              {t("installation.liteDescription")}
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
              onClick={() => openWhatsApp("Hello! I need help with IPTV Smarters Pro installation.")}
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
