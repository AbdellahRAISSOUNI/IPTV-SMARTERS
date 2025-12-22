"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, CheckCircle2 } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function CTASection() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@streampro.com";

  return (
    <section className="relative py-14 lg:py-20 bg-[#020617] overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-120px] h-72 w-72 rounded-full bg-[#2563eb]/25 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] h-72 w-72 rounded-full bg-[#22c55e]/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }} />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl bg-white/5 border border-white/10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.65)]"
        >
          <div className="flex flex-col items-center text-center gap-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-1.5 border border-white/10 text-xs sm:text-sm text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Instant IPTV test · No credit card required</span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-heading leading-tight mb-2">
                Ready to unlock your{" "}
                <span className="text-[#22c55e]">Premium IPTV</span>{" "}
                experience?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto">
                Get a free IPTV test with thousands of Live TV channels, movies and series.
                Stable servers, anti-freeze technology and support that actually replies.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <motion.a
                href={getWhatsAppUrl(
                  "Hello! I'd like to start a free IPTV test and get your best offers."
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Start free IPTV test on WhatsApp"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97, y: 0 }}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#22c55e] px-6 py-3.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#22c55e]/40 hover:bg-[#16a34a] transition-all duration-150 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span className="whitespace-nowrap">Start Free Test on WhatsApp</span>
              </motion.a>

              <motion.a
                href={`mailto:${email}`}
                aria-label="Contact us via email"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97, y: 0 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Prefer email? {email}</span>
              </motion.a>
            </div>

            {/* Small trust row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] sm:text-xs text-white/60">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>99.9% uptime servers</span>
              </div>
              <span className="hidden sm:inline text-white/20">•</span>
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Works on Smart TV, Android, iOS & more</span>
              </div>
              <span className="hidden sm:inline text-white/20">•</span>
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 fast support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

