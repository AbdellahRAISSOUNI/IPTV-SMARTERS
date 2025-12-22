"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-24 pb-0 sm:pt-24 sm:pb-0 md:pt-20 md:pb-0 lg:pt-20 lg:pb-0"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 sm:gap-8 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-6 text-center md:text-left md:pr-4 lg:pr-4 xl:pr-8"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-[1.1] xl:leading-[1.05] 2xl:leading-[1.05] text-[#1a1a1a] font-heading tracking-tight"
            >
              <span className="block underline decoration-[#2563eb] decoration-2 sm:decoration-2 md:decoration-3 lg:decoration-4 xl:decoration-[5px] underline-offset-2 sm:underline-offset-3 md:underline-offset-4 lg:underline-offset-4 xl:underline-offset-5 mb-1 sm:mb-1.5 md:mb-2">
                Best IPTV Provider
              </span>
              <span className="block mt-2 sm:mt-2.5 md:mt-3 lg:mt-3 xl:mt-4">
                Subscription <span className="text-[#2563eb]">Premium Service</span>
              </span>
            </motion.h1>

            {/* Descriptive Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl text-[#1a1a1a]/80 leading-relaxed max-w-xl lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl mx-auto md:mx-0"
            >
              Enjoy the Best IPTV Subscription, reliable and stable, with over{" "}
              <a href="#pricing" className="text-[#2563eb] hover:underline font-semibold">
                10,000 TV channels
              </a>
              , movies, series, and sports events in HD & 4K. Compatible with{" "}
              <span className="font-semibold text-[#1a1a1a]">
                IPTV Smarters Pro, ibo players
              </span>
              , etc. (Smart TV, Android, iOS, PC and Mac), our premium IPTV service works via{" "}
              <a href="#features" className="text-[#2563eb] hover:underline font-semibold">
                M3U playlist or Xtream Codes
              </a>
              .{" "}
              <span className="font-semibold text-[#1a1a1a]">
                Free IPTV test available
              </span>{" "}
              to discover the quality before purchase. Choose a secure IPTV subscription, without interruptions, with fast support.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="pt-1 sm:pt-2 flex justify-center md:justify-start"
            >
              <motion.a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector("#pricing");
                  if (element) {
                    const headerHeight = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 2xl:px-12 2xl:py-6 bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1d4ed8] transition-all duration-200 text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl group w-full sm:w-auto cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="whitespace-nowrap">View Offers</span>
                <ArrowRight className="w-4 h-4 sm:w-4 md:w-4 lg:w-5 sm:h-4 md:h-4 lg:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="relative w-full flex items-center justify-center md:justify-end mt-1 sm:mt-2 md:mt-0"
          >
            <div className="relative w-full max-w-full aspect-[4/3] sm:aspect-[4/3] md:aspect-[5/4] lg:aspect-[6/5] xl:aspect-[5/4] flex items-center justify-center overflow-visible lg:overflow-hidden">
              <div className="relative w-full h-full sm:w-[100%] sm:h-[100%] md:w-[100%] md:h-[100%] lg:w-[140%] lg:h-[140%] xl:w-[150%] xl:h-[150%] 2xl:w-[160%] 2xl:h-[160%] flex items-center justify-center">
                <Image
                  src="/images/carousel/hero.png"
                  alt="Premium IPTV Streaming Service - Watch on all devices"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 70vw"
                  quality={95}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
