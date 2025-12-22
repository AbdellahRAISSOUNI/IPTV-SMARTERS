"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Play, Zap } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function CTASection() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@streampro.com";
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    setMousePosition({ x: xPos, y: yPos });
  };

  return (
    <section className="pt-2 pb-10 lg:pt-4 lg:pb-12 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl bg-gradient-to-br from-[#2563eb]/3 via-white to-[#2563eb]/3 border border-[#2563eb]/10 p-8 sm:p-10 lg:p-11 overflow-hidden"
        >
          {/* Mouse tracking gradient */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.08), transparent 50%)`,
            }}
          />

          <div className="relative z-10">
            {/* Small badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 mb-4"
            >
              <Zap className="w-3 h-3 text-[#2563eb]" />
              <span className="text-xs font-medium text-[#2563eb]">Instant Activation</span>
            </motion.div>

            {/* Heading */}
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-2.5 leading-tight font-heading tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <span className="block">Ready to Start</span>
              <span className="block mt-1">
                <span className="underline decoration-[#2563eb] decoration-2 sm:decoration-3 underline-offset-3">Streaming</span>{" "}
                <span className="text-[#2563eb]">Now?</span>
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-[#1a1a1a]/65 text-sm sm:text-base mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Free test available. No credit card required. Experience 50,000+ channels and 70,000+ movies in HD & 4K quality.
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5">
              {/* WhatsApp Button */}
              <motion.a
                href={getWhatsAppUrl("Hello! I'd like to start a free test of your IPTV service.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#25D366]/25 transition-all duration-300 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -1,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <MessageCircle className="w-4.5 h-4.5 relative z-10" />
                <span className="relative z-10 text-sm sm:text-base">Start Free Test</span>
              </motion.a>

              {/* Email Button */}
              <motion.a
                href={`mailto:${email}`}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#1a1a1a]/20 hover:border-[#2563eb] text-[#1a1a1a] hover:text-[#2563eb] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -1,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background on hover */}
                <motion.div
                  className="absolute inset-0 bg-[#2563eb]/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <Mail className="w-4.5 h-4.5 relative z-10" />
                <span className="relative z-10 text-sm sm:text-base">Contact Us</span>
              </motion.a>
            </div>

            {/* Small trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center justify-center gap-4 mt-6 text-xs text-[#1a1a1a]/50"
            >
              <div className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" />
                <span>50,000+ Channels</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>99.9% Uptime</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
