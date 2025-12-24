"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function WindowsInstallation() {
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
            {t("installation.windowsTitle")}
          </motion.h1>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative w-full max-w-xl mx-auto aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
              <Image
                src="/instalation/windows/How-to-Install-IPTV-Smarters-pro-on-Windows.jpg.webp"
                alt="How to Install IPTV Smarters Pro on Windows"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 600px"
                quality={80}
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8 sm:mb-10"
          >
            <div className="bg-gray-50 rounded-lg p-5 sm:p-6 border border-gray-200">
              <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed">
                {t("installation.windowsDescription")}
              </p>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-[#2563eb] flex-1 max-w-12"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {t("installation.windowsHowItWorks")}
              </h2>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
          </motion.div>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep1Title")}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.windowsStep1Content")}
                    </p>
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.windowsStep1Content2")}
                    </p>
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
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep2Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.windowsStep2Content")}
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
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep3Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.windowsStep3Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/windows/Screenshot-2024-08-16-at-21.58.08.png.webp"
                        alt="IPTV Smarters Pro download menu"
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
                    {t("installation.windowsStep4Title")}
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                      {t("installation.windowsStep4Content")}
                    </p>
                    <div className="relative w-full max-w-2xl mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                      <Image
                        src="/instalation/windows/Screenshot-2024-08-16-at-21.58.13.png.webp"
                        alt="IPTV Smarters Pro download file"
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
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  5
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep5Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.windowsStep5Content")}
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
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  6
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep6Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.windowsStep6Content")}
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
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  7
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep7Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {locale === "fr" && (
                      <>
                        Une fois l'installation terminée, démarrez le programme IPTV Smarters. Cliquez sur « Ajouter un nouvel utilisateur » et sélectionnez « Connexion avec l'API Xtream Codes ». Saisissez vos identifiants (nom d'utilisateur, mot de passe et URL du portail) pour votre{" "}
                        <a
                          href={`/${locale}#pricing`}
                          className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                        >
                          service IPTV
                        </a>
                        .
                      </>
                    )}
                    {locale === "en" && (
                      <>
                        Once the installation is complete, start the IPTV Smarters program. Click on « Add a new user » and select « Connection with Xtream Codes API ». Enter your credentials (username, password and portal URL) for your{" "}
                        <a
                          href={`/${locale}#pricing`}
                          className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                        >
                          IPTV service
                        </a>
                        .
                      </>
                    )}
                    {locale === "es" && (
                      <>
                        Una vez completada la instalación, inicia el programa IPTV Smarters. Haz clic en « Agregar un nuevo usuario » y selecciona « Conexión con API Xtream Codes ». Ingresa tus credenciales (nombre de usuario, contraseña y URL del portal) para tu{" "}
                        <a
                          href={`/${locale}#pricing`}
                          className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
                        >
                          servicio IPTV
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gray-200 my-5 sm:my-6" />

          {/* Step 8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="border-l-2 border-[#2563eb]/30 pl-5 sm:pl-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                  8
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t("installation.windowsStep8Title")}
                  </h2>
                  <p className="text-base sm:text-lg text-[#1a1a1a] leading-relaxed font-medium">
                    {t("installation.windowsStep8Content")}
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