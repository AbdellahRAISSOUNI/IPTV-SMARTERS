import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";
import {
  DEFAULT_PRICE_CURRENCY,
  getLocaleCurrencyCode,
} from "@/lib/i18n/pricing-display";

/** ISO 4217 currency for schema.org offers per locale (defaults) */
export const PRICE_CURRENCY = DEFAULT_PRICE_CURRENCY;

/** Primary market country for shipping / return policy in structured data */
export const SCHEMA_COUNTRY: Record<Locale, string> = {
  en: "US",
  ca: "CA",
  es: "ES",
  fr: "FR",
};

const STANDARD_PLANS = [
  { nameKey: "plan3Months" as const, priceKey: "plan3MonthsPrice" as const },
  { nameKey: "plan6Months" as const, priceKey: "plan6MonthsPrice" as const },
  { nameKey: "plan12Months" as const, priceKey: "plan12MonthsPrice" as const },
  { nameKey: "plan24Months" as const, priceKey: "plan24MonthsPrice" as const },
];

/** Extract numeric amount from display strings like "$29 CA", "$27.99 CAD", or "€19.99". */
export function parsePriceAmount(displayPrice: string): string {
  const normalized = displayPrice.replace(/,/g, "");
  const match = normalized.match(/(\d+\.?\d*)/);
  return match ? match[1] : "0";
}

function buildShippingDetails(locale: Locale, pricing?: Record<string, string | boolean>) {
  const currency = getLocaleCurrencyCode(locale, pricing);
  const country = SCHEMA_COUNTRY[locale];
  return {
    "@type": "OfferShippingDetails" as const,
    shippingDestination: {
      "@type": "DefinedRegion" as const,
      addressCountry: country,
    },
    shippingRate: {
      "@type": "MonetaryAmount" as const,
      value: "0",
      currency,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime" as const,
      businessDays: {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      cutoffTime: "17:00",
      handlingTime: {
        "@type": "QuantitativeValue" as const,
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue" as const,
        minValue: 0,
        maxValue: 0,
        unitCode: "DAY",
      },
    },
  };
}

function buildReturnPolicy(locale: Locale) {
  return {
    "@type": "MerchantReturnPolicy" as const,
    applicableCountry: SCHEMA_COUNTRY[locale],
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    returnPolicyDays: 30,
    merchantReturnDays: 30,
    returnFees: "https://schema.org/FreeReturn",
    returnMethod: "https://schema.org/ReturnByMail",
  };
}

/** Standard 1-connection plan offers from locale translations (independent per locale). */
export function getStandardProductOffers(locale: Locale, baseUrl: string) {
  const t = getTranslations(locale);
  const pricing = t.pricing as Record<string, string | boolean>;
  const currency = getLocaleCurrencyCode(locale, pricing);

  return STANDARD_PLANS.map(({ nameKey, priceKey }) => {
    const name = String(pricing[nameKey] ?? nameKey);
    const priceDisplay = String(pricing[priceKey] ?? "0");
    return {
      "@type": "Offer" as const,
      name,
      price: parsePriceAmount(priceDisplay),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/#pricing`,
      priceValidUntil: "2026-12-31",
      shippingDetails: buildShippingDetails(locale, pricing),
      hasMerchantReturnPolicy: buildReturnPolicy(locale),
    };
  });
}

/** FAQ answer text for pricing question — uses live translation prices per locale. */
export function getFaqPricingAnswerText(locale: Locale): string {
  const p = getTranslations(locale).pricing as Record<string, string | boolean>;
  const plans = [
    { label: String(p.plan3Months || "3 months"), price: String(p.plan3MonthsPrice ?? "") },
    { label: String(p.plan6Months || "6 months"), price: String(p.plan6MonthsPrice ?? "") },
    { label: String(p.plan12Months || "12 months"), price: String(p.plan12MonthsPrice ?? "") },
    { label: String(p.plan24Months || "24 months"), price: String(p.plan24MonthsPrice ?? "") },
  ];

  if (locale === "ca") {
    return `Our IPTV subscription plans start from ${plans[0].price} for ${plans[0].label}, with options for ${plans[1].label} (${plans[1].price}), ${plans[2].label} (${plans[2].price}), and ${plans[3].label} (${plans[3].price}). All plans include instant activation and a free trial. ${String(p.currencyNote || "Prices in CAD.")}`;
  }
  if (locale === "es") {
    return `Nuestros planes de suscripción IPTV comienzan desde ${plans[0].price} por ${plans[0].label}, con opciones para ${plans[1].label} (${plans[1].price}), ${plans[2].label} (${plans[2].price}) y ${plans[3].label} (${plans[3].price}). Todos los planes incluyen activación instantánea y prueba gratuita disponible.`;
  }
  if (locale === "fr") {
    return `Nos plans d'abonnement IPTV commencent à partir de ${plans[0].price} pour ${plans[0].label}, avec des options pour ${plans[1].label} (${plans[1].price}), ${plans[2].label} (${plans[2].price}) et ${plans[3].label} (${plans[3].price}). Tous les plans incluent une activation instantanée et un essai gratuit disponible.`;
  }
  return `Our IPTV subscription plans start from ${plans[0].price} for ${plans[0].label}, with options for ${plans[1].label} (${plans[1].price}), ${plans[2].label} (${plans[2].price}), and ${plans[3].label} (${plans[3].price}). All plans include instant activation and a free test available.`;
}
