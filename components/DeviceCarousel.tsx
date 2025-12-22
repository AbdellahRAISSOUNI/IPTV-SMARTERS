"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

export default function DeviceCarousel() {
  return (
    <section className="pt-4 pb-0 sm:pt-6 sm:pb-0 lg:pt-8 lg:pb-0 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 sm:gap-8 lg:gap-10 items-center w-full">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full flex items-center justify-center md:justify-start"
          >
            <div className="relative w-full max-w-[90%] aspect-square md:aspect-[4/5] lg:aspect-square flex items-center justify-center mx-auto">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl"></div>
              <Image
                src="/images/aall devices.png"
                alt="All devices supported - Smart TV, Android, iOS, Windows, macOS and more"
                fill
                className="object-contain opacity-95"
                sizes="(max-width: 768px) 75vw, 40vw"
                quality={90}
              />
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden pr-6 sm:pr-8 lg:pr-12"
          >
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] font-heading leading-tight break-words"
            >
              Compatible with All Your Devices
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-[#1a1a1a]/75 leading-relaxed break-words"
            >
              Whether you're at home or on the go, access your IPTV service from any device you have. Start watching on your TV, continue on your phone, or pick up where you left off on your laptop.
            </motion.p>

            {/* Device List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="space-y-3.5 sm:space-y-4"
            >
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-1" strokeWidth={2.5} />
                <p className="text-sm sm:text-base text-[#1a1a1a]/85 break-words min-w-0">
                  <span className="font-semibold text-[#1a1a1a]">Smart TVs</span> — Samsung, LG, Sony, Android TV, and more
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-1" strokeWidth={2.5} />
                <p className="text-sm sm:text-base text-[#1a1a1a]/85 break-words min-w-0">
                  <span className="font-semibold text-[#1a1a1a]">Mobile</span> — Android phones and iPhones with dedicated apps
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-1" strokeWidth={2.5} />
                <p className="text-sm sm:text-base text-[#1a1a1a]/85 break-words min-w-0">
                  <span className="font-semibold text-[#1a1a1a]">Computers</span> — Windows, macOS, and Linux
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-1" strokeWidth={2.5} />
                <p className="text-sm sm:text-base text-[#1a1a1a]/85 break-words min-w-0">
                  <span className="font-semibold text-[#1a1a1a]">Streaming Devices</span> — Fire TV, Apple TV, Roku, Chromecast
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 sm:w-5 sm:h-5 text-[#2563eb] flex-shrink-0 mt-1" strokeWidth={2.5} />
                <p className="text-sm sm:text-base text-[#1a1a1a]/85 break-words min-w-0">
                  <span className="font-semibold text-[#1a1a1a]">Web</span> — Watch directly in any modern browser
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

