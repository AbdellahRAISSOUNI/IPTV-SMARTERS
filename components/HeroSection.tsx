"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { isMobile } from "@/lib/utils/performance";

export default function HeroSection() {
  const { t } = useLanguage();
  const mobile = typeof window !== 'undefined' ? isMobile() : false;

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-24 pb-0 sm:pt-24 sm:pb-0 md:pt-20 md:pb-0 lg:pt-20 lg:pb-0"
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 sm:gap-8 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
          {/* Left Column - Text Content - This should be LCP on mobile - order-1 on mobile to appear first */}
          <div className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-6 text-center md:text-left md:pr-4 lg:pr-4 xl:pr-8 order-1 md:order-1">
            {/* Main Heading */}
            <h1 className="text-[1.575rem] sm:text-[1.96875rem] md:text-[2.3625rem] lg:text-[2.3625rem] xl:text-[3.15rem] 2xl:text-[3.9375rem] font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-[1.1] xl:leading-[1.05] 2xl:leading-[1.05] text-[#1a1a1a] font-heading tracking-tight">
              <span className="block underline decoration-[#2563eb] decoration-2 sm:decoration-2 md:decoration-3 lg:decoration-4 xl:decoration-[5px] underline-offset-2 sm:underline-offset-3 md:underline-offset-4 lg:underline-offset-4 xl:underline-offset-5 mb-1 sm:mb-1.5 md:mb-2">
                {t("hero.title")}
              </span>
              <span className="block mt-2 sm:mt-2.5 md:mt-3 lg:mt-3 xl:mt-4">
                {t("hero.subtitlePart1")}{" "}
                <span className="text-[#2563eb]">{t("hero.subtitlePart2")}</span>
              </span>
            </h1>

            {/* Descriptive Paragraph */}
            <p className="text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl text-[#1a1a1a]/80 leading-relaxed max-w-xl lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl mx-auto md:mx-0">
              {t("hero.description")}{" "}
              <a href="#pricing" className="text-[#2563eb] hover:underline font-semibold">
                {t("hero.channelsLink")}
              </a>
              {t("hero.description2")}{" "}
              <span className="font-semibold text-[#1a1a1a]">
                {t("hero.compatibleDevices")}
              </span>
              {t("hero.description3")}{" "}
              <a href="#features" className="text-[#2563eb] hover:underline font-semibold">
                {t("hero.m3uLink")}
              </a>
              {t("hero.description4")}{" "}
              <span className="font-semibold text-[#1a1a1a]">
                {t("hero.freeTest")}
              </span>{" "}
              {t("hero.description5")}
            </p>

            {/* CTA Button */}
            <div className="pt-1 sm:pt-2 flex justify-center md:justify-start">
              <a
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
              >
                <span className="whitespace-nowrap">{t("common.viewOffers")}</span>
                <ArrowRight className="w-4 h-4 sm:w-4 md:w-4 lg:w-5 sm:h-4 md:h-4 lg:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column - Image - order-2 on mobile to appear after text (LCP optimization) */}
          <div className="relative w-full flex items-center justify-center md:justify-end mt-1 sm:mt-2 md:mt-0 order-2 md:order-2">
            <div className="relative w-full max-w-full aspect-[4/3] sm:aspect-[4/3] md:aspect-[5/4] lg:aspect-[6/5] xl:aspect-[5/4] flex items-center justify-center overflow-visible lg:overflow-hidden">
              <div className="relative w-full h-full sm:w-[100%] sm:h-[100%] md:w-[100%] md:h-[100%] lg:w-[140%] lg:h-[140%] xl:w-[150%] xl:h-[150%] 2xl:w-[160%] 2xl:h-[160%] flex items-center justify-center">
                <Image
                  src="/images/hero.png"
                  alt="Premium IPTV Streaming Service - Watch on all devices"
                  fill
                  className="object-contain"
                  priority={!mobile}
                  fetchPriority={mobile ? "low" : "high"}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 70vw"
                  quality={mobile ? 20 : 40}
                  loading={mobile ? "lazy" : "eager"}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
