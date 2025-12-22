"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactSection() {
  const whatsappUrl = getWhatsAppUrl("Hello! I have a question about your IPTV service.");
  
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@iptvsubscriptionpro.es";

  return (
    <section id="contact" className="pt-4 pb-8 lg:pt-6 lg:pb-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="bg-[#2563eb] rounded-lg overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center">
              {/* Left Side - Text Content */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white uppercase mb-2">
                  Do you have questions?
                </h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Our support team is available for you 24 hours a day, 7 days a week, ready to answer all your doubts and concerns.
                </p>
              </div>

              {/* Right Side - Contact Options */}
              <div className="flex flex-row md:flex-col gap-5 md:gap-4">
                {/* WhatsApp */}
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium underline">WhatsApp</span>
                </motion.a>

                {/* Email */}
                <motion.a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <Mail className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-base md:text-lg font-medium underline">E-mail</span>
                    <span className="text-sm text-white/70 hidden md:block">{contactEmail}</span>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

