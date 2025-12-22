"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Tv,
  Video,
  Film,
  Zap,
  Server,
  Headphones,
} from "lucide-react";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "premium-channels",
    icon: <Tv className="w-12 h-12 sm:w-14 sm:h-14" strokeWidth={1.5} />,
    title: "Premium Channels",
    description: "We offer more than 50,000 TV channels, and the number of online channels grows every day. Nothing surpasses the transmission quality of our channels. IPTV SMARTERS PRO subscription.",
  },
  {
    id: "vod-movies",
    icon: <Video className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />,
    title: "VOD Movies",
    description: "We offer almost 70,000 movies, including all the latest releases. We provide almost all popular movies, including the best rated on IMDB: Buy IPTV.",
  },
  {
    id: "vod-series",
    icon: <Film className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />,
    title: "TV Series on VOD",
    description: "We also offer a wide selection of television series (more than 70,000) in our VOD section. Watch all the latest episodes now on your device: paid IPTV.",
  },
  {
    id: "anti-freezing",
    icon: <Zap className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />,
    title: "Anti-Freezing Technology",
    description: "Our services integrate advanced H.264 technology, which guarantees efficient compression and optimal image quality. Thanks to this innovation, we offer a fluid streaming experience with Anti-Freezing Technology.",
  },
  {
    id: "availability",
    icon: <Server className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />,
    title: "99.99% Availability",
    description: "We always strive to offer an IPTV subscription service of the best quality to our users. Maintaining a large number of TV channels and VOD content is not an easy task. Even so, we guarantee 99.99% availability on our streaming server. Uninterrupted IPTV.",
  },
  {
    id: "support",
    icon: <Headphones className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />,
    title: "24/7 Live Support",
    description: "Our dedicated support team is always ready to help our valuable clients 24 hours a day, 7 days a week. Our team provides assistance exclusively for billing questions and technical problems.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="pt-12 pb-6 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-18 xl:gap-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-white flex flex-col items-center text-center px-4"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-6 text-[#2563eb]">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold mb-5 text-[#1a1a1a] text-xl sm:text-xl lg:text-2xl tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[#1a1a1a]/75 leading-relaxed text-base sm:text-lg lg:text-lg max-w-lg mx-auto font-bold">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 lg:mt-10 flex justify-center"
        >
          <div className="relative w-full max-w-3xl h-auto">
            <Image
              src="/images/trust.png-1536x61.webp"
              alt="Trust badges and certifications"
              width={1536}
              height={61}
              className="w-full h-auto object-contain"
              quality={90}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

