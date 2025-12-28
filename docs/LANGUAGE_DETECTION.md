# Language Detection & Automatic Switching Documentation

## Table of Contents
1. [Overview](#overview)
2. [Language Detection Flow](#language-detection-flow)
3. [Architecture](#architecture)
4. [Implementation Details](#implementation-details)
5. [Configuration](#configuration)
6. [Usage Guide](#usage-guide)
7. [Technical Details](#technical-details)

---

## Overview

This IPTV service website implements an intelligent **automatic language detection and switching system** that provides users with content in their preferred language (English, Spanish, or French) without manual intervention.

### Supported Languages
- **English (en)** - Default language
- **Spanish (es)** - For Spanish-speaking countries
- **French (fr)** - For French-speaking countries

### Key Features
- ✅ Instant language detection on first visit
- ✅ Browser language detection (synchronous, no delay)
- ✅ IP-based geolocation detection (background, non-blocking)
- ✅ LocalStorage persistence for user preferences
- ✅ URL-based routing (`/en`, `/es`, `/fr`)
- ✅ Manual language switching via footer
- ✅ Automatic locale sync with URL pathname

---

## Language Detection Flow

### Detection Priority Order

When a user visits the root URL (`/`), the system follows this priority:

```
1. Check if already on locale route → Skip detection
   └─ If URL is /en, /es, or /fr → Already detected

2. Check localStorage for saved preference → Instant redirect
   └─ If 'preferred-locale' exists → Redirect immediately

3. Detect browser language → Instant redirect
   └─ navigator.language → Map to locale → Redirect

4. IP-based geolocation (background) → Enhancement
   └─ Only if browser language is English (default)
   └─ Fetches country code → Maps to locale → Redirects if different
```

### Visual Flow Diagram

```
User visits "/"
    │
    ├─→ Already on /en|/es|/fr? → YES → Skip detection
    │
    ├─→ NO → Check localStorage
    │       │
    │       ├─→ Found? → YES → Redirect to /{stored-locale}
    │       │
    │       └─→ NO → Check browser language
    │                 │
    │                 ├─→ 'es' → Redirect to /es
    │                 ├─→ 'fr' → Redirect to /fr
    │                 └─→ Other → Redirect to /en
    │                              │
    │                              └─→ Background: Fetch IP geolocation
    │                                     │
    │                                     └─→ If country suggests different locale
    │                                        → Redirect to /{country-locale}
```

---

## Architecture

### File Structure

```
app/
├── page.tsx                    # Root page - triggers LocaleDetector
├── layout.tsx                 # Root layout (fonts, metadata)
└── [locale]/                  # Dynamic locale routes
    ├── layout.tsx             # Locale layout - wraps with LanguageProvider
    ├── page.tsx               # Home page
    └── installation/          # Installation pages per locale
        ├── page.tsx
        ├── windows/
        ├── apple-ios/
        ├── smart-tv/
        └── firestick-android-ios/

components/
├── Header.tsx                 # Navigation (uses useLanguage hook)
├── Footer.tsx                 # Footer with language switcher
├── HeroSection.tsx            # Hero section (uses translations)
└── ... (other components)

contexts/
└── LanguageContext.tsx        # Core language state management
    ├── LanguageProvider       # Context provider
    ├── useLanguage()          # Hook to access language context
    └── LocaleDetector         # Automatic detection component

lib/
└── i18n/
    ├── index.ts               # i18n configuration
    │   ├── locales array      # ['en', 'es', 'fr']
    │   ├── defaultLocale      # 'en'
    │   ├── countryToLocale    # Country code → locale mapping
    │   └── detectLocaleFromCountry()  # Mapping function
    └── translations/
        ├── en.json            # English translations
        ├── es.json            # Spanish translations
        └── fr.json            # French translations
```

### Component Hierarchy

```
RootLayout (app/layout.tsx)
└── RootPage (app/page.tsx)
    └── LocaleDetector (detects & redirects)
         │
         └──→ Redirects to /{locale}
              │
              └── LocaleLayout (app/[locale]/layout.tsx)
                   └── LanguageProvider
                        └── Page Components
                             ├── Header (uses useLanguage)
                             ├── HeroSection (uses t() function)
                             ├── Footer (language switcher)
                             └── ... (all components)
```

---

## Implementation Details

### 1. LocaleDetector Component

**Location:** `contexts/LanguageContext.tsx` (lines 74-135)

**Purpose:** Automatically detects user's preferred language on first visit.

**Key Features:**
- Runs only once per session (`detected` state)
- Checks if already on locale route (prevents infinite loops)
- Prioritizes localStorage for instant redirects
- Uses browser language for immediate detection
- Background IP detection with 1-second timeout (non-blocking)

**Code Flow:**
```typescript
useEffect(() => {
  // 1. Skip if already detected or on locale route
  if (detected || isLocaleRoute) return;
  
  // 2. Check localStorage (instant)
  const storedLocale = localStorage.getItem('preferred-locale');
  if (storedLocale) {
    router.replace(`/${storedLocale}${currentPath}`);
    setDetected(true);
    return;
  }
  
  // 3. Detect browser language (instant)
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  let detectedLocale = defaultLocale; // 'en'
  
  if (browserLang === 'es') detectedLocale = 'es';
  else if (browserLang === 'fr') detectedLocale = 'fr';
  
  // 4. Redirect immediately
  router.replace(`/${detectedLocale}${currentPath}`);
  setDetected(true);
  
  // 5. Background IP detection (only if default locale)
  if (detectedLocale === defaultLocale) {
    (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const res = await fetch('https://ipapi.co/json/', { 
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          return; // Silently return for non-ok responses (429, etc.)
        }
        
        const data = await res.json();
        
        if (data && data.country_code) {
          const countryLocale = detectLocaleFromCountry(data.country_code);
          if (countryLocale !== detectedLocale) {
            router.replace(`/${countryLocale}${currentPath}`);
          }
        }
      } catch (error) {
        // Silently fail - already redirected to default or network error
      }
    })();
  }
}, [router, detected]);
```

### 2. Country-to-Locale Mapping

**Location:** `lib/i18n/index.ts` (lines 24-86)

**Purpose:** Maps ISO country codes to appropriate locales.

**Mapping Logic:**
```typescript
export const countryToLocale: Record<string, Locale> = {
  // Spanish-speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', // ... 20+ countries
  
  // French-speaking countries
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', // ... 30+ countries
  
  // All other countries default to 'en'
};

export function detectLocaleFromCountry(countryCode: string): Locale {
  return countryToLocale[countryCode.toUpperCase()] || defaultLocale;
}
```

**Spanish Countries (20+):**
ES, MX, AR, CO, CL, PE, VE, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY, PR

**French Countries (30+):**
FR, BE, CH, CA, LU, MC, SN, CI, CM, MG, CD, ML, BF, NE, TD, GN, RW, BJ, TG, CF, CG, GA, MR, BI, DJ, KM, VU, NC, PF, PM, WF, YT, RE, GP, MQ, GF, BL, MF

### 3. LanguageProvider Context

**Location:** `contexts/LanguageContext.tsx` (lines 18-64)

**Purpose:** Manages language state and provides translation function.

**Features:**
- Syncs locale with URL pathname automatically
- Provides `t()` function for translations
- Stores preference in localStorage on change
- Updates URL when locale changes

**API:**
```typescript
interface LanguageContextType {
  locale: Locale;                    // Current locale: 'en' | 'es' | 'fr'
  setLocale: (locale: Locale) => void; // Change locale
  t: (key: string) => string;        // Translation function
  translations: Translations;         // Full translations object
}
```

**Usage in Components:**
```typescript
const { locale, setLocale, t } = useLanguage();

// Get translation
const title = t("hero.title");

// Change language
setLocale('es'); // Updates URL, state, and localStorage
```

### 4. URL-Based Routing

**Next.js App Router Structure:**
- `app/[locale]/` - Dynamic route segment for locale
- `app/[locale]/layout.tsx` - Wraps all locale pages
- `app/[locale]/page.tsx` - Home page per locale

**URL Examples:**
- `/` → Detects and redirects
- `/en` → English home page
- `/es` → Spanish home page
- `/fr` → French home page
- `/en/installation` → English installation page
- `/es/installation/windows` → Spanish Windows installation

**Locale Sync:**
```typescript
// Automatically syncs locale from URL pathname
useEffect(() => {
  const pathLocale = pathname.split('/')[1] as Locale;
  if (locales.includes(pathLocale)) {
    setLocaleState(pathLocale);
  }
}, [pathname]);
```

### 5. Translation System

**Translation Files:**
- `lib/i18n/translations/en.json` - English
- `lib/i18n/translations/es.json` - Spanish
- `lib/i18n/translations/fr.json` - French

**Translation Structure:**
```json
{
  "common": {
    "home": "Home",
    "pricing": "Pricing"
  },
  "hero": {
    "title": "Best IPTV Provider",
    "description": "..."
  }
}
```

**Translation Function:**
```typescript
// Supports nested keys with dot notation
t("common.home")           // "Home"
t("hero.title")            // "Best IPTV Provider"
t("pricing.oneConnection")  // "1 Connection"
```

**Fallback Behavior:**
- If translation key not found → Returns key string
- Logs warning to console in development

### 6. Manual Language Switching

**Location:** `components/Footer.tsx` (lines 194-214)

**UI:** Language switcher buttons in footer (EN, ES, FR)

**Implementation:**
```typescript
{locales.map((loc) => (
  <button
    key={loc}
    onClick={() => setLocale(loc)}
    className={locale === loc ? "active" : ""}
  >
    {loc.toUpperCase()}
  </button>
))}
```

**What Happens on Click:**
1. `setLocale()` is called
2. State updates immediately
3. URL updates via `router.replace()`
4. Preference saved to localStorage
5. All components re-render with new translations

---

## Configuration

### Adding a New Language

1. **Add locale to configuration:**
   ```typescript
   // lib/i18n/index.ts
   export type Locale = 'en' | 'es' | 'fr' | 'de'; // Add 'de'
   export const locales: Locale[] = ['en', 'es', 'fr', 'de'];
   ```

2. **Create translation file:**
   ```
   lib/i18n/translations/de.json
   ```

3. **Import and add to translations:**
   ```typescript
   import de from './translations/de.json';
   export const translations = {
     en, es, fr, de
   };
   ```

4. **Add country mappings (optional):**
   ```typescript
   export const countryToLocale: Record<string, Locale> = {
     // ... existing mappings
     'DE': 'de', 'AT': 'de', 'CH': 'de', // German-speaking countries
   };
   ```

5. **Update browser language detection:**
   ```typescript
   // In LocaleDetector
   if (browserLang === 'de') {
     detectedLocale = 'de';
   }
   ```

6. **Update metadata in layout:**
   ```typescript
   // app/layout.tsx and app/[locale]/layout.tsx
   alternates: {
     languages: {
       en: `${baseUrl}/en`,
       es: `${baseUrl}/es`,
       fr: `${baseUrl}/fr`,
       de: `${baseUrl}/de`, // Add
     }
   }
   ```

### Changing Default Language

```typescript
// lib/i18n/index.ts
export const defaultLocale: Locale = 'es'; // Change from 'en' to 'es'
```

### Changing IP Detection Service

```typescript
// contexts/LanguageContext.tsx
// Replace ipapi.co with another service
fetch('https://ip-api.com/json/', {
  signal: AbortSignal.timeout(1000)
})
  .then(res => res.json())
  .then(data => {
    // Adjust response parsing based on API format
    const countryCode = data.countryCode; // ip-api.com format
    // ...
  });
```

### Adjusting Detection Timeout

```typescript
// contexts/LanguageContext.tsx
fetch('https://ipapi.co/json/', {
  signal: AbortSignal.timeout(2000) // Change from 1000ms to 2000ms
})
```

---

## Usage Guide

### Using Translations in Components

```typescript
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function MyComponent() {
  const { t, locale } = useLanguage();
  
  return (
    <div>
      <h1>{t("common.title")}</h1>
      <p>Current language: {locale}</p>
    </div>
  );
}
```

### Programmatically Changing Language

```typescript
import { useLanguage } from "@/contexts/LanguageContext";

function LanguageButton() {
  const { setLocale, locale } = useLanguage();
  
  return (
    <button onClick={() => setLocale('es')}>
      Switch to Spanish
    </button>
  );
}
```

### Accessing Full Translations Object

```typescript
const { translations } = useLanguage();

// Direct access to translation object
const heroTitle = translations.hero.title;
```

### Server-Side Components

For server components, use the `getTranslations` function directly:

```typescript
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function ServerComponent({ 
  params 
}: { 
  params: Promise<{ locale: Locale }> 
}) {
  const { locale } = await params;
  const translations = getTranslations(locale);
  
  return <h1>{translations.hero.title}</h1>;
}
```

---

## Technical Details

### Performance Optimizations

1. **Instant Redirects:**
   - Browser language detection is synchronous (no delay)
   - localStorage check is instant
   - No loading states needed

2. **Non-Blocking IP Detection:**
   - Only runs if browser language is default (English)
   - 1-second timeout with AbortController prevents hanging
   - Fails silently if API is unavailable (429 errors suppressed)
   - Doesn't block initial page load
   - Uses `async/await` with try-catch for error handling

3. **Static Export:**
   - All pages pre-rendered at build time
   - Fast initial load
   - No server required

4. **Lazy Loading:**
   - Components loaded on demand
   - Reduces initial bundle size

5. **Error Suppression:**
   - IP geolocation errors are suppressed in console
   - Prevents console noise from network failures
   - Maintains clean user experience

### Browser Compatibility

- **Modern Browsers:** Full support
- **localStorage:** Required (all modern browsers support)
- **navigator.language:** Supported in all browsers
- **AbortSignal.timeout():** Modern browsers (fallback available)

### SEO Considerations

- **hreflang tags:** Properly set for all locales
- **Canonical URLs:** Locale-specific canonical URLs
- **Metadata:** Locale-specific titles, descriptions, keywords
- **Structured Data:** Language-specific schema.org markup

### State Management

- **React Context:** For global language state
- **URL as Source of Truth:** Locale synced with pathname
- **localStorage:** Persists user preference
- **No External State Library:** Pure React Context API

### Error Handling

- **Missing Translation Keys:** Returns key string, logs warning
- **Invalid Locale:** Falls back to default locale
- **IP API Failure:** Silently fails, uses browser language
- **Network Timeout:** 1-second timeout prevents hanging

### Testing Scenarios

1. **First Visit (No localStorage):**
   - Should detect browser language
   - Should redirect to appropriate locale

2. **Returning User (localStorage exists):**
   - Should use stored preference
   - Should redirect immediately

3. **Manual Language Change:**
   - Should update URL
   - Should save to localStorage
   - Should update all translations

4. **Direct URL Access:**
   - `/en` → Should show English
   - `/es` → Should show Spanish
   - `/fr` → Should show French

5. **Invalid Locale:**
   - `/invalid` → Should show 404 or redirect to default

---

## Troubleshooting

### Language Not Detecting

**Check:**
1. Is `LocaleDetector` component rendered in root page?
2. Is browser language set correctly?
3. Is localStorage accessible?
4. Check browser console for errors

### Translations Not Updating

**Check:**
1. Is component using `useLanguage()` hook?
2. Is translation key correct?
3. Does translation exist in JSON file?
4. Check for typos in translation keys

### IP Detection Not Working

**Check:**
1. Is API endpoint accessible?
2. Check network tab for failed requests
3. Is timeout too short?
4. Does country code mapping exist?

### URL Not Updating

**Check:**
1. Is `router.replace()` being called?
2. Is Next.js router properly configured?
3. Check for navigation errors in console

---

## Future Enhancements

Potential improvements:

1. **Cookie Support:** Fallback if localStorage unavailable
2. **Accept-Language Header:** Server-side detection
3. **More Languages:** Add German, Italian, Portuguese, etc.
4. **Language Switcher in Header:** Quick access
5. **RTL Support:** For Arabic, Hebrew
6. **Translation Management:** CMS integration
7. **A/B Testing:** Test different detection strategies

---

## References

- **Next.js App Router:** https://nextjs.org/docs/app
- **React Context API:** https://react.dev/reference/react/useContext
- **IP Geolocation API:** https://ipapi.co/
- **ISO Country Codes:** https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

---

**Last Updated:** 2024
**Version:** 1.0.0

