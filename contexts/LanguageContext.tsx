"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslations, type Locale, locales, defaultLocale, detectLocaleFromCountry } from '@/lib/i18n';
import { getEnglishSlugFromLocalized, getInstallationSlug, isInstallationSlug, isResellerSlug, getResellerSlug } from '@/lib/utils/installation-slugs';

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
    if (newLocale === locale) {
      // Already on this locale, no need to change
      return;
    }
    
    setLocaleState(newLocale);
    // Update URL to reflect new locale
    // Use window.location.pathname as fallback to ensure we get the actual current path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    // Remove locale prefix and normalize path
    const pathWithoutLocale = currentPath.replace(/^\/(en|es|fr)/, '') || '/';
    
    // Check if current path is an installation page and translate the slug
    let translatedPath = pathWithoutLocale;
    if (pathWithoutLocale && pathWithoutLocale !== '/') {
      // Extract slug from path (remove leading slash and trailing slash if present)
      const currentSlug = pathWithoutLocale.replace(/^\/+|\/+$/g, '').trim();
      
      if (!currentSlug) {
        // Empty slug, just go to homepage
        translatedPath = '/';
      } else {
        // Find English slug - try current locale first, then check all locales
        let englishSlug: string | null = getEnglishSlugFromLocalized(currentSlug, locale);
        
        // If not found as localized slug, check if it's already English (installation or reseller)
        if (!englishSlug && (isInstallationSlug(currentSlug) || isResellerSlug(currentSlug))) {
          englishSlug = currentSlug;
        }
        
        // If we found an English slug (either from reverse lookup or it's already English)
        if (englishSlug) {
          if (isInstallationSlug(englishSlug)) {
            // Translate to new locale's slug for installation pages
            const newSlug = getInstallationSlug(englishSlug, newLocale);
            // Ensure we have a leading slash and handle trailing slash based on next.config
            translatedPath = `/${newSlug}/`;
          } else if (isResellerSlug(englishSlug)) {
            // Translate to new locale's slug for reseller pages
            const newSlug = getResellerSlug(englishSlug, newLocale);
            // Ensure we have a leading slash and handle trailing slash based on next.config
            translatedPath = `/${newSlug}/`;
          }
        }
        // If it's not an installation or reseller page, keep the path as-is (but ensure trailing slash)
        else if (translatedPath !== '/' && !translatedPath.endsWith('/')) {
          translatedPath = `${translatedPath}/`;
        }
      }
    }
    
    const newPath = `/${newLocale}${translatedPath === '/' ? '' : translatedPath}`;
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

