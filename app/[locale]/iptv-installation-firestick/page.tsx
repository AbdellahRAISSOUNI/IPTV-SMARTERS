"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { parseUrlsToLinks } from "@/lib/utils/urlParser";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function FirestickAndroidIosInstallation() {
  const { t, locale } = useLanguage();

  const imageOrder = [
    "image-3.jpg.webp", // Main image
    "image-3-1.jpg.webp", // After "Comment installer"
    "image-5.png.webp", // Step 3
    "image-6.png.webp", // Step 4
    "image-4.jpg.webp", // Step 5
    "image-5.jpg.webp", // Step 6
    "image-6.jpg.webp", // Step 7
    "image-7.jpg.webp", // Step 8
    "image-8.png.webp", // Step 9
    "image-8.jpg.webp", // Step 10
    "image-9.png.webp", // Step 11
    "image-9.jpg.webp", // Step 12
    "image-11.jpg.webp", // Step 13 (first)
    "image-10.jpg.webp", // Step 13 (second)
    "image-_13_.jpg.webp", // Step 15
    "image-10.png.webp", // Step 16 (first)
    "image-11.png.webp", // Step 16 (second)
    "image-12.png.webp", // Terms
    "image-_14_.jpg.webp", // Add user
    "image-13.png.webp", // Two ways
    "image-14.png.webp", // Load playlist
    "image-15.png.webp", // Playlist screen
    "image-17.png.webp", // Access
    "image-18.png.webp", // Move home
  ];

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
            {t("installation.firestickTitle")}
          </motion.h1>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-8 sm:mb-10"
          >
            <div className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200">
              <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-3">
                {t("installation.firestickIntro")}
                {locale === "fr" && (
                  <>
                    {" "}
                    <a
                      href={`/${locale}#pricing`}
                      className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                    >
                      Abonnement IPTV
                    </a>
                  </>
                )}
                {locale === "en" && (
                  <>
                    {" "}
                    <a
                      href={`/${locale}#pricing`}
                      className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                    >
                      IPTV Subscription
                    </a>
                  </>
                )}
                {locale === "es" && (
                  <>
                    {" "}
                    <a
                      href={`/${locale}#pricing`}
                      className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                    >
                      Suscripción IPTV
                    </a>
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative w-full max-w-xl mx-auto aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-3.jpg.webp"
                alt="IPTV Smarters Pro on FireStick"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 600px"
                quality={80}
              />
            </div>
          </motion.div>

          {/* How to Install Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-[#2563eb] flex-1 max-w-12"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {t("installation.firestickHowToInstallTitle")}
              </h2>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-6">
              {t("installation.firestickHowToInstallContent")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm mb-6">
              <Image
                src="/instalation/firestick/image-3-1.jpg.webp"
                alt="Downloader app"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed">
              {t("installation.firestickDownloadAppIntro")}
            </p>
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
                    {t("installation.firestickStep2Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.firestickStep2Content")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep3Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep3Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-5.png.webp"
                        alt="Search downloader"
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

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep4Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep4Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-6.png.webp"
                        alt="Settings menu"
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
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  5
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep5Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep5Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-4.jpg.webp"
                        alt="My Fire TV"
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

          {/* Step 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  6
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep6Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep6Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-5.jpg.webp"
                        alt="Developer Options"
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

          {/* Step 7 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  7
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep7Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep7Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-6.jpg.webp"
                        alt="Unknown sources"
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

          {/* Step 8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  8
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep8Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep8Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-7.jpg.webp"
                        alt="Enable downloader"
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

          {/* Step 9 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  9
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep9Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep9Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-8.png.webp"
                        alt="Downloader interface"
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

          {/* Step 10 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  10
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep10Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {parseUrlsToLinks(t("installation.firestickStep10Content"))}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-8.jpg.webp"
                        alt="Enter URL"
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

          {/* Step 11 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  11
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep11Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep11Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-9.png.webp"
                        alt="Download progress"
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

          {/* Step 12 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  12
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep12Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep12Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-9.jpg.webp"
                        alt="Install prompt"
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

          {/* Step 13 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  13
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep13Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep13Content")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                        <Image
                          src="/instalation/firestick/image-11.jpg.webp"
                          alt="Installation progress"
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, 400px"
                          quality={80}
                        />
                      </div>
                      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                        <Image
                          src="/instalation/firestick/image-10.jpg.webp"
                          alt="Installation complete"
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, 400px"
                          quality={80}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 14 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  14
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep14Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep14Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/firestick/image-_13_.jpg.webp"
                        alt="Installation notification"
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

          {/* Step 15 & 16 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  15
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep15Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium mb-4">
                    {t("installation.firestickStep15Content")}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6 ml-8 sm:ml-9 mt-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  16
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.firestickStep16Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.firestickStep16Content")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                        <Image
                          src="/instalation/firestick/image-10.png.webp"
                          alt="Delete option"
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, 400px"
                          quality={80}
                        />
                      </div>
                      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                        <Image
                          src="/instalation/firestick/image-11.png.webp"
                          alt="Confirm delete"
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, 400px"
                          quality={80}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* How to Use Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-[#2563eb] flex-1 max-w-12"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {t("installation.firestickHowToUseTitle")}
              </h2>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-6">
              {t("installation.firestickHowToUseContent")}{" "}
              <a
                href={t("installation.officielIptvPricingLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
              >
                {t("installation.officielIptvPricingLink")}
              </a>
            </p>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.95 }}
            className="mb-6 sm:mb-8"
          >
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickTermsTitle")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-12.png.webp"
                alt="Terms of use"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Add User */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="mb-6 sm:mb-8"
          >
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickAddUserTitle")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-_14_.jpg.webp"
                alt="Add user screen"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Two Ways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.05 }}
            className="mb-6 sm:mb-8"
          >
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickTwoWaysTitle")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-13.png.webp"
                alt="Connection options"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Load Playlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
              {t("installation.firestickLoadPlaylistTitle")}
            </h3>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickLoadPlaylistContent")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm mb-4">
              <Image
                src="/instalation/firestick/image-14.png.webp"
                alt="Authorize access"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickPlaylistScreenContent")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-15.png.webp"
                alt="M3U playlist screen"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.15 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
              {t("installation.firestickAccessTitle")}
            </h3>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickAccessContent")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm mb-4">
              <Image
                src="/instalation/firestick/image-17.png.webp"
                alt="Application list"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickAccessScrollContent")}
            </p>
            <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed mb-4">
              {t("installation.firestickMoveHomeContent")}
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/firestick/image-18.png.webp"
                alt="Move to home screen"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={80}
              />
            </div>
          </motion.div>

          {/* Enjoy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-xl p-6 sm:p-8 text-center shadow-lg">
              <p className="text-xl sm:text-2xl font-bold text-white mb-4">
                {t("installation.firestickEnjoy")}
              </p>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                {t("installation.firestickClosingMessage")}
              </p>
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
