import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

export type Locale = 'en' | 'es' | 'fr';

export const locales: Locale[] = ['en', 'es', 'fr'];

export const defaultLocale: Locale = 'en';

export const translations = {
  en,
  es,
  fr,
} as const;

export type TranslationKey = keyof typeof en | string;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

// Country to locale mapping for automatic detection
export const countryToLocale: Record<string, Locale> = {
  // Spanish-speaking countries
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'CL': 'es', // Chile
  'PE': 'es', // Peru
  'VE': 'es', // Venezuela
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // Dominican Republic
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panama
  'UY': 'es', // Uruguay
  'PR': 'es', // Puerto Rico
  // French-speaking countries
  'FR': 'fr', // France
  'BE': 'fr', // Belgium
  'CH': 'fr', // Switzerland (French-speaking regions)
  'CA': 'fr', // Canada (French-speaking regions)
  'LU': 'fr', // Luxembourg
  'MC': 'fr', // Monaco
  'SN': 'fr', // Senegal
  'CI': 'fr', // Ivory Coast
  'CM': 'fr', // Cameroon
  'MG': 'fr', // Madagascar
  'CD': 'fr', // Democratic Republic of Congo
  'ML': 'fr', // Mali
  'BF': 'fr', // Burkina Faso
  'NE': 'fr', // Niger
  'TD': 'fr', // Chad
  'GN': 'fr', // Guinea
  'RW': 'fr', // Rwanda
  'BJ': 'fr', // Benin
  'TG': 'fr', // Togo
  'CF': 'fr', // Central African Republic
  'CG': 'fr', // Republic of Congo
  'GA': 'fr', // Gabon
  'MR': 'fr', // Mauritania
  'BI': 'fr', // Burundi
  'DJ': 'fr', // Djibouti
  'KM': 'fr', // Comoros
  'VU': 'fr', // Vanuatu
  'NC': 'fr', // New Caledonia
  'PF': 'fr', // French Polynesia
  'PM': 'fr', // Saint Pierre and Miquelon
  'WF': 'fr', // Wallis and Futuna
  'YT': 'fr', // Mayotte
  'RE': 'fr', // Réunion
  'GP': 'fr', // Guadeloupe
  'MQ': 'fr', // Martinique
  'GF': 'fr', // French Guiana
  'BL': 'fr', // Saint Barthélemy
  'MF': 'fr', // Saint Martin
  // Default to English for all other countries
};

export function detectLocaleFromCountry(countryCode: string): Locale {
  return countryToLocale[countryCode.toUpperCase()] || defaultLocale;
}


