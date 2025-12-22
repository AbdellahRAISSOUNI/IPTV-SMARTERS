"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "payment-methods",
    question: "What payment methods are available for our IPTV subscription?",
    answer:
      "We accept PayPal and debit/credit cards through a secure payment gateway with automatic currency conversion and no hidden fees.",
  },
  {
    id: "two-devices",
    question: "Can I use two devices at the same time with a single IPTV subscription?",
    answer:
      "Yes, you can watch on two screens simultaneously with the offer of 2 connections through IPTV Smarters Pro or Smarters Lite Player.",
  },
  {
    id: "bandwidth",
    question: "How much bandwidth does IPTV streaming consume?",
    answer:
      "Our IPTV streams use the latest H.264 technology, which offers the best compression and image quality. The average size of an IPTV stream is around 8 Mbps. However, when changing channels, the H.264 protocol can have a momentary peak to start displaying the image. For this reason, a minimum internet speed of 16 Mbps is required, and 30 Mbps is recommended for HD channels.",
  },
  {
    id: "devices-supported",
    question: "What types of devices are supported?",
    answer:
      "An IPTV Smarters Pro subscription supports various devices such as MAG, Android smartphones, Android boxes, Enigma, DreamBox, Vu+ (...), PC, VLC, Kodi/XBMC (...), Smart TV.",
  },
  {
    id: "satellite",
    question: "Do I need satellite to use IPTV?",
    answer:
      "No satellite equipment or parabolic antenna is needed. The connection to Smarters Pro servers is made through the internet.",
  },
  {
    id: "advantages",
    question: "What are the advantages of IPTV?",
    answer:
      "IPTV (Internet Protocol Television) offers several advantages. It represents a promising and highly profitable market that is valued by numerous telecommunications providers. Additionally, IPTV allows for the creation of new positive and profitable services that can generate additional income.",
  },
  {
    id: "fundamentals",
    question: "What are the fundamentals of the IPTV system?",
    answer:
      "Two basic IPTV systems: content transmitted to multiple users simultaneously (live transmission) or used for Video On Demand (VOD), where content is delivered individually to the subscriber who requested it. The system depends on a decoder (set-top box) and other essential components.",
  },
  {
    id: "what-is-iptv",
    question: "What is IPTV?",
    answer:
      "IPTV is Internet Protocol Television, highlighting its impact, its origin from the use of the Internet Protocol, and its probable use in sync with telecommunications where broadband connections are widespread. Any service providing data in packets can be utilized.",
  },
  {
    id: "support-response",
    question: "Response time for technical support tickets?",
    answer:
      "Upon sending a ticket for account activation or technical support, a response will be received within 30 minutes to 1 hour, with the objective to respond within the first hour. During peak hours, the response time may extend up to 2 hours.",
  },
  {
    id: "smart-tv-channels",
    question: "I downloaded the channel list, but the channels don't work on my Smart TV",
    answer:
      "Please make sure your channel list works by testing it with IPTV Smarters Pro or another IPTV application on a PC. If it still doesn't work, don't hesitate to contact us via WhatsApp.",
  },
  {
    id: "vlc-siptrv",
    question: "Channels work in VLC player, but don't work in the SiPTV app?",
    answer:
      "If you have TVs with webOS or Tizen and your transmissions are multicast, you must enable the UDP to HTTP function in the application settings and configure it on your router. IPTV SMARTERS PRO Subscription",
  },
  {
    id: "android-tv-box",
    question: "Can an Android TV Box device convert my TV into a Smart TV?",
    answer:
      "The answer is yes. In fact, you will have access to all kinds of applications from Google Play Store for Android. This turns your TV into an interactive device. You can use applications like Gmail, Firefox, Skype and many others directly from your TV. IPTV SMARTERS PRO Subscription",
  },
  {
    id: "wifi-ethernet",
    question: "Wi-Fi or Ethernet?",
    answer:
      "We always recommend connecting the device via cable (Ethernet).",
  },
  {
    id: "android-tv-box-install",
    question: "What is an Android TV Box and how to use it to install IPTV Smarters Pro?",
    answer:
      "An Android TV Box is an Android system device that converts your TV into a Smart TV, allowing you to install applications like IPTV Smarters Pro or Smarters Player Lite or ibo player. Installation of IPTV Smarters Pro: 1. Connect the box to your TV and make sure it's connected to the internet. 2. Install IPTV Smarters Pro from the Google Play Store. 3. Open the app, add a user and enter your IPTV credentials. 4. Enjoy the streaming of your IPTV channels! Install IPTV Smarters Pro or Smarters Player Lite (via Google Play Store) right now and start enjoying.",
  },
  {
    id: "free-trial",
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 24-hour free trial that gives you full access to all channels, movies, and series available in your IPTV subscription.",
  },
];

// Generate Schema.org JSON-LD for FAQ
const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export default function FAQSection() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const faqSchema = generateFAQSchema(faqData);

  return (
    <section id="faq" className="pt-0 pb-0 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1a1a1a] font-heading"
        >
          Frequently Asked Questions : IPTV Subscription
        </motion.h2>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#e5e7eb] overflow-hidden">
          {faqData.map((faq, index) => {
            const isOpen = openIndices.has(index);

            return (
              <div
                key={faq.id}
                className={`border-b-2 border-[#e5e7eb] last:border-b-0 ${
                  isOpen ? "bg-[#2563eb]/5" : ""
                } transition-all duration-300`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full py-4 px-6 text-left flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer ${
                    isOpen 
                      ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]" 
                      : "bg-white hover:bg-[#2563eb]/10"
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className={`text-sm sm:text-base font-semibold font-heading pr-4 flex-1 ${
                    isOpen ? "text-white" : "text-[#1a1a1a]"
                  }`}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                      isOpen ? "text-white" : "text-[#2563eb]"
                    }`} />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-gradient-to-b from-white to-[#f8fafc]"
                    >
                      <div className="px-6 py-5 border-l-4 border-[#2563eb] bg-white/50">
                        <p className="text-[#1a1a1a]/80 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

