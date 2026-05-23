import { getTranslations, type Locale } from "@/lib/i18n";
import { getFaqPricingAnswerText } from "@/lib/seo/schema-pricing";
import { getInstallationUrl } from "@/lib/utils/installation-slugs";

type FaqItem = { question: string; answer: string };

function faqEntry(
  question: string,
  answer: string
): { "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } } {
  return {
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  };
}

function readFaqBlock(locale: Locale, key: string): FaqItem | null {
  const faq = getTranslations(locale).faq as Record<string, FaqItem | string>;
  const block = faq[key];
  if (block && typeof block === "object" && "question" in block && "answer" in block) {
    return block as FaqItem;
  }
  return null;
}

/** Homepage FAQPage schema entities — locale-specific (Canada uses ca.json copy). */
export function getHomeFaqMainEntity(locale: Locale) {
  if (locale === "ca") {
    const whatIs = readFaqBlock("ca", "whatIsIptv");
    const devices = readFaqBlock("ca", "devicesSupported");
    const freeTrial = readFaqBlock("ca", "freeTrial");

    return [
      faqEntry(
        whatIs?.question ?? "What is IPTV and how does IPTV Canada work?",
        whatIs?.answer ??
          "IPTV delivers TV over the internet. Our best iptv canada service includes credentials for premium servers, IPTV Smarters Pro, and 25,000+ channels plus VOD in Canada."
      ),
      faqEntry(
        "How much does an IPTV subscription cost in Canada?",
        getFaqPricingAnswerText("ca")
      ),
      faqEntry(
        freeTrial?.question ?? "Can I get a free trial of IPTV Canada?",
        freeTrial?.answer ??
          "Yes — we offer a 24-hour free trial. Contact us on WhatsApp to start your iptv canada trial risk-free."
      ),
      faqEntry(
        devices?.question ?? "What devices work with IPTV in Canada?",
        devices?.answer ??
          "Firestick, Android TV, Smart TV, Apple TV, Roku, iptv box, iPhone, iPad, Windows, and Mac — see our Canada installation guides."
      ),
      faqEntry(
        "How do I install IPTV Smarters Pro in Canada?",
        `We provide step-by-step guides for Firestick, Smart TV, Windows, iOS, and iptv box setup at ${getInstallationUrl("iptv-installation-guide", "ca")}.`
      ),
      faqEntry(
        "Can I watch the 2026 FIFA World Cup with IPTV in Canada?",
        "You can stream compatible football channels with our iptv subscription. Lineup varies by broadcaster rights — request a free trial on WhatsApp to confirm channels for your province."
      ),
      faqEntry(
        "Do you offer a free IPTV trial before the World Cup?",
        "Yes. Start a free IPTV Canada trial on WhatsApp to test quality, devices, and the sports channels you need before the tournament."
      ),
      faqEntry(
        "Which devices are best for World Cup streaming in Canada?",
        "Firestick, Android TV, Smart TV, and iptv box devices work well. Use a stable 30+ Mbps connection for HD/4K match streaming."
      ),
      faqEntry(
        "Will World Cup streams be in HD or 4K?",
        "Our service supports HD and 4K where available. For match days, use wired Ethernet when possible and the device recommended for your plan."
      ),
    ];
  }

  if (locale === "en") {
    return [
      faqEntry(
        "What is IPTV Smarters Pro?",
        "IPTV Smarters Pro is a premium IPTV streaming service that provides access to over 20,000 live TV channels, movies, and series in 4K quality. It works on all devices including Windows, Android, iOS, Mac, and Smart TVs."
      ),
      faqEntry("How much does IPTV subscription cost?", getFaqPricingAnswerText("en")),
      faqEntry(
        "Is a free test available?",
        "Yes, we offer a free test of our IPTV service so you can experience the quality before purchasing. Contact us via WhatsApp to get your free test."
      ),
      faqEntry(
        "What devices are supported?",
        "Our IPTV service works on all devices including Windows PC, Android phones and tablets, iOS devices (iPhone/iPad), Mac computers, Smart TVs, Firestick, Roku, Apple TV, and more."
      ),
      faqEntry(
        "How do I install IPTV Smarters Pro?",
        "We provide detailed installation guides for all devices. Visit our installation guide page for step-by-step instructions for Windows, Android, iOS, Smart TV, and Firestick."
      ),
      faqEntry(
        "Can I watch the 2026 FIFA World Cup with IPTV Smarters Pro?",
        "You can use IPTV Smarters Pro with our IPTV subscription to enjoy compatible football channels and match viewing. Channel availability depends on regional broadcasters and rights—request a free test first to confirm the lineup for your area."
      ),
      faqEntry(
        "Do you offer a free IPTV test before the World Cup starts?",
        "Yes. We offer a free IPTV test so you can check streaming quality, device compatibility, and the channels you care about before the 2026 FIFA World Cup."
      ),
      faqEntry(
        "Which devices are best for World Cup streaming?",
        "Our service works across Windows PC, Android phones and tablets, iOS devices, Mac computers, Smart TVs, Firestick, Roku, and Apple TV—so you can watch the 2026 World Cup on your preferred screen."
      ),
      faqEntry(
        "Will the World Cup stream in HD or 4K?",
        "We are built for stable HD/4K streaming. For best results during match days, use a stable internet connection and the device recommended for your plan."
      ),
    ];
  }

  return null;
}
