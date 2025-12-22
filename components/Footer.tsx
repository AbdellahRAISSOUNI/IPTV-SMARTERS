"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, MessageCircle, ArrowRight, Globe } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/contexts/LanguageContext";
import { locales, type Locale } from "@/lib/i18n";

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    const headerHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export default function Footer() {
  const { t, locale, setLocale } = useLanguage();
  const currentYear = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl("Hello! I have a question about your IPTV service.");
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@iptvsubscriptionpro.es";

  const languageNames: Record<Locale, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
  };

  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden border-t border-white/5">
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/50 via-transparent to-[#1e3a8a]/30 pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 lg:py-4 xl:py-6 2xl:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-2">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo */}
            <div className="flex items-center mb-1.5">
              <div className="relative h-20 w-auto">
                <Image
                  src="/logo/Logo3-removebg-preview.png"
                  alt="IPTV Logo"
                  width={200}
                  height={80}
                  className="h-full w-auto object-contain brightness-0 invert"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base max-w-md mb-2.5">
              {t("footer.description")}
            </p>
            
            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/30 hover:scale-[1.02] group"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] group border border-white/20 hover:border-white/30"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h4 className="text-sm font-semibold text-white mb-1.5 tracking-wide">
              {t("footer.quickLinks")}
            </h4>
            <nav className="flex flex-col space-y-1.5" aria-label="Footer navigation">
              {[
                { href: "#home", label: t("common.home"), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#home") },
                { href: "#pricing", label: t("common.pricing"), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#pricing") },
                { href: "#features", label: t("common.features"), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#features") },
                { href: "#faq", label: t("common.faq"), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "#faq") },
                { href: "#contact", label: t("common.contact"), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  const contactSection = document.querySelector("#contact") || document.querySelector("#faq");
                  if (contactSection) {
                    const headerHeight = 80;
                    const elementPosition = contactSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }},
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm group inline-flex items-center gap-2 w-fit"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Legal Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-white mb-1.5 tracking-wide">
              {t("footer.legal")}
            </h4>
            <nav className="flex flex-col space-y-1.5 mb-4" aria-label="Legal links">
              {[
                { href: "/privacy-policy", label: t("common.privacyPolicy") },
                { href: "/terms-and-conditions", label: t("common.termsOfService") },
                { href: "/refund-policy", label: t("common.refundPolicy") },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm group inline-flex items-center gap-2 w-fit"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </a>
              ))}
            </nav>
            
            {/* Payment Methods - Under Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-1.5 tracking-wide">
                {t("footer.paymentMethods")}
              </h4>
              <div className="relative w-full max-w-[160px] h-auto opacity-80 hover:opacity-100 transition-opacity duration-200 bg-white/5 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <Image
                  src="/images/Methode-de-paiment.webp"
                  alt="Payment methods accepted"
                  width={400}
                  height={60}
                  className="w-full h-auto object-contain"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Copyright and Language Picker */}
        <div className="border-t border-white/10 pt-1.5 mt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <p className="text-sm text-white/50">
              {t("footer.copyright").replace("{year}", currentYear.toString())}
            </p>
            
            {/* Language Picker */}
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/50" />
              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocale(loc)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                      locale === loc
                        ? "bg-[#2563eb] text-white shadow-sm"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    aria-label={`Switch to ${languageNames[loc]}`}
                    title={languageNames[loc]}
                  >
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
