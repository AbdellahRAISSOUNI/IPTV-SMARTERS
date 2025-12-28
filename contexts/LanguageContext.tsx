"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslations, type Locale, locales, defaultLocale, detectLocaleFromCountry } from '@/lib/i18n';

type Translations = ReturnType<typeof getTranslations>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  // Update locale from URL path
  useEffect(() => {
    const pathLocale = pathname.split('/')[1] as Locale;
    if (locales.includes(pathLocale)) {
      setLocaleState(pathLocale);
    }
  }, [pathname]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Update URL to reflect new locale
    const currentPath = pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|es|fr)/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.replace(newPath);
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  const translations = getTranslations(locale);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Client component to detect locale on first visit - Instant redirect, no loading
export function LocaleDetector() {
  const router = useRouter();
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    if (detected) return;

    // Check if we're already on a locale route
    const currentPath = window.location.pathname;
    const isLocaleRoute = locales.some(locale => currentPath.startsWith(`/${locale}`));
    
    if (isLocaleRoute) {
      setDetected(true);
      return;
    }

    // Check for stored preference first (instant)
    const storedLocale = localStorage.getItem('preferred-locale') as Locale | null;
    if (storedLocale && locales.includes(storedLocale)) {
      router.replace(`/${storedLocale}${currentPath === '/' ? '' : currentPath}`);
      setDetected(true);
      return;
    }

    // Detect from browser language (instant)
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    let detectedLocale: Locale = defaultLocale;
    
    if (browserLang === 'es') {
      detectedLocale = 'es';
    } else if (browserLang === 'fr') {
      detectedLocale = 'fr';
    }

    // Redirect immediately based on browser language, then enhance with IP detection in background
    router.replace(`/${detectedLocale}${currentPath === '/' ? '' : currentPath}`);
    setDetected(true);

    // Optionally enhance with IP detection in background (non-blocking)
    // Silently fail if API is unavailable or rate-limited
    if (detectedLocale === defaultLocale) {
      // Use a try-catch wrapper to prevent any errors from appearing in console
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1000);
          
          const res = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal,
            // Suppress CORS and network errors
            mode: 'cors',
            credentials: 'omit'
          });
          
          clearTimeout(timeoutId);
          
          // Check if response is ok before parsing
          if (!res.ok) {
            return; // Silently return for non-ok responses (429, etc.)
          }
          
          const data = await res.json();
          
          if (data && data.country_code) {
            const countryLocale = detectLocaleFromCountry(data.country_code);
            // Only redirect if different from browser language
            if (countryLocale !== detectedLocale) {
              router.replace(`/${countryLocale}${currentPath === '/' ? '' : currentPath}`);
            }
          }
        } catch (error) {
          // Completely suppress all errors - this is just an enhancement feature
          // Already redirected to default locale, so failures are acceptable
        }
      })();
    }
  }, [router, detected]);

  return null;
}

