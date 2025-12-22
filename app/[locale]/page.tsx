"use client";

import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Monitor } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { openWhatsApp } from "@/lib/whatsapp";

// Lazy load non-critical components
const ContentCarousel = lazy(() => import("@/components/ContentCarousel"));
const LogoCarousel = lazy(() => import("@/components/LogoCarousel"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const DeviceCarousel = lazy(() => import("@/components/DeviceCarousel"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const PricingCard = lazy(() => import("@/components/PricingCard"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));
const CTASection = lazy(() => import("@/components/CTASection"));

// Loading placeholder component
const ComponentLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse rounded-lg" />
);

export default function Home() {
  const { t } = useLanguage();

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingPlans = [
    {
      name: "3 Months",
      price: "€19.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
    },
    {
      name: "6 Months",
      price: "€24.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
    },
    {
      name: "12 Months",
      price: "€39.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
      popular: true,
    },
    {
      name: "24 Months",
      price: "€54.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
    },
  ];


  // Channel logos
  const channelLogos = [
    "/carouselle-channels/abc-tv-logo-Copy.webp",
    "/carouselle-channels/ae-tv-logo-1.png",
    "/carouselle-channels/AMC-tv-logo.webp",
    "/carouselle-channels/cbs-tv-logo.png",
    "/carouselle-channels/discovery-channel-tv-logo.png",
    "/carouselle-channels/fox-tv-logo.png",
    "/carouselle-channels/hbo-tv-logo.webp",
    "/carouselle-channels/history-tv-logo.png",
    "/carouselle-channels/national-geographic-tv-logo.png",
    "/carouselle-channels/nbc-tv-logo.png",
    "/carouselle-channels/tnt-tv-logo.png",
    "/carouselle-channels/usa-network-logo.webp",
  ];

  // Streaming service logos
  const streamingLogos = [
    "/carouselle-streaming/580b57fcd9996e24bc43c529-300x169-min-1.png",
    "/carouselle-streaming/Bein_sport_logo-1024x595-1-min-300x174-2.png",
    "/carouselle-streaming/canal-logo-png-transparent-385x385-1-e1677705689705-min-300x149-2.webp",
    "/carouselle-streaming/FOX_Sports_logo.svg-1024x606-min-300x178-2.png",
    "/carouselle-streaming/HBO-Max-Logo-768x432-2-min-300x169-2.png",
    "/carouselle-streaming/pngegg-2-e1677705730772-min-300x155-2.png",
    "/carouselle-streaming/sky-sports-logo-png-8-768x432-1-min-300x169-2.png",
  ];

  // Premium plans
  const premiumPlans = [
    {
      name: "3 Months",
      price: "€29.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
    },
    {
      name: "6 Months",
      price: "€39.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
      ],
    },
    {
      name: "12 Months",
      price: "€59.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.adultContent"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
        t("pricing.freeMonth"),
      ],
      popular: true,
    },
    {
      name: "24 Months",
      price: "€89.99",
      period: "",
      features: [
        t("pricing.instantActivation"),
        t("pricing.freeUpdates"),
        t("pricing.liveChannels"),
        t("pricing.moviesSeries"),
        t("pricing.adultContent"),
        t("pricing.antiFreezing"),
        t("pricing.quality"),
        t("pricing.fastStable"),
        t("pricing.formats"),
        t("pricing.compatible"),
        t("pricing.serverAvailable"),
        t("pricing.support"),
        t("pricing.freeMonths"),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ContentCarousel />
      <LogoCarousel images={channelLogos} size="large" direction="right" speed={0.4} />
      <LogoCarousel images={streamingLogos} direction="left" speed={0.7} />
      <FeaturesSection />
      <DeviceCarousel />

      {/* Pricing Section */}
      <section id="pricing" className="pt-8 pb-0 sm:pt-12 sm:pb-0 lg:pt-16 lg:pb-0 xl:pt-20 xl:pb-0 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            {/* Red line */}
            <div className="w-16 h-0.5 bg-red-600 mx-auto mb-6"></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-8 xl:mb-12 2xl:mb-16 text-[#1a1a1a]">
              {t("pricing.title")}
            </h2>
          </motion.div>

          {/* 1 Connection Plans */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-8"
            >
              <div className="relative px-6 py-2.5 rounded-lg border-[3px] border-gray-300 bg-gray-100">
                <div className="absolute inset-0 bg-[#2563eb] rounded-lg"></div>
                <span className="relative z-10 font-semibold text-base text-white uppercase tracking-wide">
                  {t("pricing.oneConnection")}
                </span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10">
              {pricingPlans.map((plan, index) => (
                <Suspense key={index} fallback={<div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}>
                  <PricingCard
                    name={plan.name}
                    price={plan.price}
                    period={plan.period}
                    features={plan.features}
                    popular={plan.popular}
                    delay={index * 0.05}
                  />
                </Suspense>
              ))}
            </div>
          </div>

          {/* 2 Connections + Premium Plans */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-8"
            >
              <div className="relative px-6 py-2.5 rounded-lg border-[3px] border-gray-300 bg-gray-100">
                <div className="absolute inset-0 bg-[#2563eb] rounded-lg"></div>
                <span className="relative z-10 font-semibold text-base text-white uppercase tracking-wide">
                  {t("pricing.twoConnectionsPremium")}
                </span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10">
              {premiumPlans.map((plan, index) => (
                <Suspense key={index} fallback={<div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}>
                  <PricingCard
                    name={plan.name}
                    price={plan.price}
                    period={plan.period}
                    features={plan.features}
                    popular={plan.popular}
                    delay={index * 0.05}
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="pt-2 pb-0 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[304px] h-auto">
              <Image
                src="/images/Methode-de-paiment.webp"
                alt="Payment methods accepted"
                width={1536}
                height={61}
                className="w-full h-auto object-contain"
                quality={75}
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Suspense fallback={<ComponentLoader />}>
        <TestimonialsSection />
      </Suspense>

      {/* Channels Section */}
      <section className="pt-2 pb-12 lg:pt-4 lg:pb-16 xl:pt-6 xl:pb-20 2xl:pt-8 2xl:pb-24 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-8"
          >
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#1a1a1a]">
              {t("common.channelsWorldwide")}
            </h2>

            {/* Image */}
            <div className="flex justify-center py-4 xl:py-6 2xl:py-8">
              <div className="relative w-full max-w-2xl xl:max-w-4xl 2xl:max-w-5xl h-auto">
                <Image
                  src="/asset-6.png"
                  alt="Worldwide channels coverage"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-contain"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text */}
            <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-[#1a1a1a]/70 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto font-bold">
              {t("common.joinCustomers")}
            </p>

            {/* Button */}
            <div className="pt-1">
              <motion.button
                onClick={() => {
                  openWhatsApp("Hello! I'm interested in your IPTV service.");
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -2
                }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg hover:shadow-xl hover:ring-2 hover:ring-[#2563eb]/30 py-3 xl:py-4 2xl:py-5 px-8 xl:px-10 2xl:px-12 rounded-lg font-semibold text-base sm:text-lg xl:text-xl 2xl:text-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mx-auto"
              >
                <span>{t("common.buyNow")}</span>
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<ComponentLoader />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
