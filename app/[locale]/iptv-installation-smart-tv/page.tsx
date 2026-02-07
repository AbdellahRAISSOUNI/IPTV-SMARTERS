"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function SmartTvInstallation() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-[#2563eb] mb-6 sm:mb-8"
          >
            {locale === "fr" && (
              <>
                Comment configurer votre{" "}
                <a
                  href={`/${locale}#pricing`}
                  className="hover:text-[#1d4ed8] hover:underline"
                >
                  ABONNEMENT IPTV
                </a>{" "}
                sur Smart TV avec l'application IPTV SMARTERS PRO :
              </>
            )}
            {locale === "en" && (
              <>
                How to configure your{" "}
                <a
                  href={`/${locale}#pricing`}
                  className="hover:text-[#1d4ed8] hover:underline"
                >
                  IPTV SUBSCRIPTION
                </a>{" "}
                on Smart TV with IPTV SMARTERS PRO app:
              </>
            )}
            {locale === "es" && (
              <>
                Cómo configurar tu{" "}
                <a
                  href={`/${locale}#pricing`}
                  className="hover:text-[#1d4ed8] hover:underline"
                >
                  SUSCRIPCIÓN IPTV
                </a>{" "}
                en Smart TV con la aplicación IPTV SMARTERS PRO:
              </>
            )}
          </motion.h1>

          {/* Image - Only Once */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/smartTv/image-_16_.jpg.webp"
                alt="IPTV Smarters Pro on Smart TV"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 900px"
                quality={80}
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 sm:mb-10"
          >
            <div className="bg-gray-50/50 rounded-lg p-6 sm:p-8 border border-gray-100">
              <p className="text-base sm:text-lg text-[#1a1a1a]/85 leading-relaxed">
                {t("installation.smartTvDescription")}
              </p>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Samsung Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-[#2563eb] flex-1 max-w-12"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {t("installation.smartTvSamsungTitle")}
              </h2>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Step 1 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    1
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvSamsungStep1")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvSamsungStep2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    3
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvSamsungStep3")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* LG Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-[#2563eb] flex-1 max-w-12"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {t("installation.smartTvLgTitle")}
              </h2>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Step 1 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    1
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvLgStep1")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvLgStep2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    3
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.smartTvLgStep3")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Explore more - internal links to main site and blog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-6">
              {t("installation.exploreMoreTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={`/${locale}#pricing`}
                className="group border-2 border-[#2563eb]/30 rounded-xl p-5 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all duration-200 text-center"
              >
                <span className="text-base font-semibold text-[#2563eb] group-hover:text-[#1d4ed8] block">
                  {t("installation.buySubscription")}
                </span>
                <span className="text-sm text-[#1a1a1a]/70 mt-1 block">Get your subscription</span>
              </a>
              <a
                href={`/${locale}/blog/`}
                className="group border-2 border-gray-200 rounded-xl p-5 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all duration-200 text-center"
              >
                <span className="text-base font-semibold text-[#1a1a1a] group-hover:text-[#2563eb] block">
                  {t("installation.readOurBlog")}
                </span>
                <span className="text-sm text-[#1a1a1a]/70 mt-1 block">Tips & guides</span>
              </a>
              <a
                href={getInstallationUrl('iptv-reseller-program', locale)}
                className="group border-2 border-gray-200 rounded-xl p-5 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all duration-200 text-center"
              >
                <span className="text-base font-semibold text-[#1a1a1a] group-hover:text-[#2563eb] block">
                  {t("installation.becomeReseller")}
                </span>
                <span className="text-sm text-[#1a1a1a]/70 mt-1 block">Start your business</span>
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
