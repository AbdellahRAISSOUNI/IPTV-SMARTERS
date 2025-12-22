"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Monitor } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentCarousel from "@/components/ContentCarousel";
import LogoCarousel from "@/components/LogoCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import DeviceCarousel from "@/components/DeviceCarousel";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PricingCard from "@/components/PricingCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { openWhatsApp } from "@/lib/whatsapp";

export default function Home() {
  const pricingPlans = [
    {
      name: "3 Months",
      price: "€19.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
      ],
    },
    {
      name: "6 Months",
      price: "€24.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
      ],
    },
    {
      name: "12 Months",
      price: "€39.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
      ],
      popular: true,
    },
    {
      name: "24 Months",
      price: "€54.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
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
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
      ],
    },
    {
      name: "6 Months",
      price: "€39.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
      ],
    },
    {
      name: "12 Months",
      price: "€59.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Adult content (with password)",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
        "+1 Free Month",
      ],
      popular: true,
    },
    {
      name: "24 Months",
      price: "€89.99",
      period: "",
      features: [
        "Instant activation!",
        "Free updates (TV and VOD)",
        "+50,000 live and sports channels",
        "+70,000 movies and series from around the world",
        "Adult content (with password)",
        "Anti-freezing system",
        "Channels in 4K, FHD, HD and Premium",
        "Fast and stable",
        "M3U, MAG and Enigma formats",
        "Compatible with Smart TV, smartphone and PC",
        "Server always available",
        "24/7 Support",
        "+2 Free Months",
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
      <section id="pricing" className="pt-8 pb-0 sm:pt-12 sm:pb-0 lg:pt-16 lg:pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Red line */}
            <div className="w-16 h-0.5 bg-red-600 mx-auto mb-6"></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-[#1a1a1a]">
              Our IPTV Subscription Prices
            </h2>
          </motion.div>

          {/* 1 Connection Plans */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="relative px-6 py-2.5 rounded-lg border-[3px] border-gray-300 bg-gray-100">
                <div className="absolute inset-0 bg-[#2563eb] rounded-lg"></div>
                <span className="relative z-10 font-semibold text-base text-white uppercase tracking-wide">
                  1 Connection
                </span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  name={plan.name}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* 2 Connections + Premium Plans */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="relative px-6 py-2.5 rounded-lg border-[3px] border-gray-300 bg-gray-100">
                <div className="absolute inset-0 bg-[#2563eb] rounded-lg"></div>
                <span className="relative z-10 font-semibold text-base text-white uppercase tracking-wide">
                  2 Connections + Premium
                </span>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  name={plan.name}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="pt-2 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[304px] h-auto">
              <Image
                src="/images/Methode-de-paiment.webp"
                alt="Payment methods accepted"
                width={1536}
                height={61}
                className="w-full h-auto object-contain"
                quality={90}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Channels Section */}
      <section className="pt-2 pb-12 lg:pt-4 lg:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
              Channels from all over the world.
            </h2>

            {/* Image */}
            <div className="flex justify-center py-4">
              <div className="relative w-full max-w-2xl h-auto">
                <Image
                  src="/asset-6.png"
                  alt="Worldwide channels coverage"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-contain"
                  quality={90}
                />
              </div>
            </div>

            {/* Text */}
            <p className="text-lg sm:text-xl text-[#1a1a1a]/70 max-w-2xl mx-auto font-bold">
              Join more than 5,000 satisfied customers.
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
                className="bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg hover:shadow-xl hover:ring-2 hover:ring-[#2563eb]/30 py-3 px-8 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mx-auto"
              >
                <span>BUY NOW</span>
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
