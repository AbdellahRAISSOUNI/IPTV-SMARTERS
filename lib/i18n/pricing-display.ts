import type { Locale } from "@/lib/i18n";

type PricingSlice = Record<string, unknown> | undefined;

/** Default ISO 4217 currency per locale when not set in translations */
export const DEFAULT_PRICE_CURRENCY: Record<Locale, string> = {
  en: "USD",
  ca: "CAD",
  uk: "GBP",
  es: "EUR",
  fr: "EUR",
};

/** Whether the “Premium Plans (Multiple Connections)” block is shown on the homepage. */
export function isPremiumPlansSectionEnabled(pricing: PricingSlice): boolean {
  if (!pricing) return true;
  const value = pricing.showPremiumPlans;
  if (value === false || value === "false" || value === "0") return false;
  return true;
}

/** ISO 4217 code from locale JSON (admin-editable) with locale fallback. */
export function getLocaleCurrencyCode(locale: Locale, pricing?: PricingSlice): string {
  const fromPricing = pricing?.currencyCode;
  if (typeof fromPricing === "string" && /^[A-Z]{3}$/i.test(fromPricing.trim())) {
    return fromPricing.trim().toUpperCase();
  }
  return DEFAULT_PRICE_CURRENCY[locale];
}
