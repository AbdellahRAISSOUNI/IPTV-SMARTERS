"use client";

import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  delay?: number;
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  popular = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        opacity: { duration: 0.25, delay },
        y: { 
          duration: 0.25, 
          delay,
          type: "tween",
          ease: "easeOut"
        },
        default: {
          type: "tween",
          duration: 0,
          ease: "linear"
        }
      }}
      whileHover={{ 
        y: -8,
        transition: {
          type: "tween",
          duration: 0,
          ease: "linear"
        }
      }}
      className={`relative p-4 sm:p-5 rounded-2xl backdrop-blur-sm ${
        popular
          ? "bg-[#2563eb] text-white shadow-2xl border-2 border-[#2563eb] ring-2 ring-[#2563eb]/20"
          : "bg-white text-[#1a1a1a] border-2 border-[#d1d5db] shadow-md hover:border-[#2563eb]/40 hover:shadow-xl hover:ring-2 hover:ring-[#2563eb]/10"
      }`}
      style={{
        transition: "box-shadow 0.075s, border-color 0.075s, ring 0.075s"
      }}
    >
      {/* Subtle background gradient for depth */}
      <div className={`absolute inset-0 rounded-2xl opacity-50 pointer-events-none ${
        popular 
          ? "bg-gradient-to-br from-white/10 to-transparent" 
          : "bg-gradient-to-br from-[#2563eb]/5 to-transparent"
      }`} />
      
      <h3 className={`text-lg sm:text-xl font-bold mb-3 relative z-10 tracking-tight ${popular ? "text-white" : "text-[#1a1a1a]"}`}>
        {name}
      </h3>
      <div className="mb-4 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl sm:text-3xl lg:text-3xl font-bold tracking-tight leading-none ${popular ? "text-white" : "text-[#1a1a1a]"}`}>
            {price}
          </span>
          {period && (
            <span className={`text-sm sm:text-base ${popular ? "text-white/80" : "text-[#1a1a1a]/60"}`}>
              {period}
            </span>
          )}
        </div>
      </div>
      <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-5 relative z-10">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.2, delay: delay + index * 0.02 }}
            className="flex items-start gap-2"
          >
            <svg
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 transition-transform duration-200 ${
                popular ? "text-white" : "text-[#2563eb]"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className={`text-xs sm:text-sm ${popular ? "text-white" : "text-[#1a1a1a]/80"}`}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>
      <motion.button
        onClick={() => {
          openWhatsApp(`Hello! I'm interested in the ${name} plan.`);
        }}
        whileHover={{ 
          scale: 1.03,
          y: -2
        }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 relative z-10 group cursor-pointer ${
          popular
            ? "bg-white text-[#2563eb] hover:bg-gray-50 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-white/50"
            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg hover:shadow-xl hover:ring-2 hover:ring-[#2563eb]/30"
        }`}
      >
        <span>Buy Now</span>
        <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
      </motion.button>
      <p
        className={`text-xs mt-2 text-center underline relative z-10 ${
          popular ? "text-white/90" : "text-[#1a1a1a]/70"
        }`}
      >
        5-day refund guarantee
      </p>
    </motion.div>
  );
}

