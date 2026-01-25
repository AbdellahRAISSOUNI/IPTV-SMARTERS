import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  isInstallationSlug, 
  isResellerSlug, 
  isLegalSlug,
  getInstallationUrl,
  getResellerUrl,
  getLegalUrl,
} from '@/lib/utils/installation-slugs';
import type { Locale } from '@/lib/i18n';

// English slugs that should redirect to localized versions in non-English locales
const englishSlugs = [
  'iptv-installation-guide',
  'iptv-installation-ios',
  'iptv-installation-windows',
  'iptv-installation-smart-tv',
  'iptv-installation-firestick',
  'iptv-reseller-program',
  'refund-policy',
  'privacy-policy',
  'terms-of-service',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle English slugs in non-English locales (es, fr) - add noindex header before redirect
  // This prevents Google from indexing these redirecting URLs
  // Match pattern: /es/slug or /es/slug/ or /fr/slug or /fr/slug/
  const pathMatch = pathname.match(/^\/(es|fr)\/([^\/]+)(\/)?$/);
  if (pathMatch) {
    const locale = pathMatch[1] as Locale;
    const slug = pathMatch[2]; // Slug without trailing slash
    
    // Check if this is an English slug that should redirect to a localized version
    if (englishSlugs.includes(slug) && locale !== 'en') {
      let destination: string;
      
      if (isInstallationSlug(slug)) {
        destination = getInstallationUrl(slug, locale);
      } else if (isResellerSlug(slug)) {
        destination = getResellerUrl(slug, locale);
      } else if (isLegalSlug(slug)) {
        destination = getLegalUrl(slug, locale);
      } else {
        return NextResponse.next();
      }
      
      // Create redirect response with noindex header to prevent Google from indexing this URL
      const response = NextResponse.redirect(new URL(destination, request.url), 301);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/es/:path*',
    '/fr/:path*',
  ],
};


