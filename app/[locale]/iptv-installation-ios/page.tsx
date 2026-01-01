"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function AppleIosInstallation() {
  const { t } = useLanguage();

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
            {t("installation.appleIosTitle")}
          </motion.h1>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep1Title")}
                  </h2>
                  <div className="space-y-3">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.appleIosStep1Content")}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      <a
                        href="https://itunes.apple.com/us/app/iptv-smarters-player/id1383614816"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium break-all inline-block"
                      >
                        https://itunes.apple.com/us/app/iptv-smarters-player/id1383614816
                      </a>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">
                      {t("installation.appleIosStep1Search")}
                    </p>
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.appleIosStep1Install")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] overflow-hidden rounded-xl mt-4 sm:mt-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/apple ios/Screenshot-2024-08-16-at-21.32.22.png.webp"
                        alt="IPTV Smarters app download"
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 800px"
                        quality={80}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep2Title")}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.appleIosStep2Content")}
                    </p>
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.appleIosStep2Button")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep3Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.appleIosStep3Content")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep4Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.appleIosStep4Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/apple ios/image-24.png.webp"
                        alt="IPTV Smarters Live TV icon"
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 800px"
                        quality={80}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  5
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep5Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.appleIosStep5Content")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  6
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep6Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.appleIosStep6Content")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 7 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  7
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.appleIosStep7Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.appleIosStep7Content")}
                  </p>
                </div>
              </div>
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
