import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { verifyToken, AUTH_COOKIE_NAME } from './lib/rbac/jwt';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Routes that require authentication (matched after locale prefix is stripped)
const PROTECTED_ROUTES = ['/admin', '/upload'];

// Routes that require specific permissions (route → permission)
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin': [], // Any authenticated user can access admin (sections are permission-gated)
  '/upload': ['media.upload'],
};

function getPathWithoutLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.replace(`/${locale}`, '') || '/';
    }
  }
  return pathname;
}

function getLocaleFromPath(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-page routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  );

  if (isProtected) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const locale = getLocaleFromPath(pathname);

    // Check JWT token
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        // Check route-specific permissions
        const requiredPerms = ROUTE_PERMISSIONS[pathWithoutLocale];
        if (requiredPerms && requiredPerms.length > 0) {
          const hasPerms = requiredPerms.every((p) =>
            (payload.permissions as string[]).includes(p)
          );
          if (!hasPerms) {
            // Redirect to admin with access denied
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/admin`;
            url.searchParams.set('error', 'forbidden');
            return NextResponse.redirect(url);
          }
        }

        // Authenticated & authorized — proceed with intl middleware
        return intlMiddleware(request);
      }
    }

    // Fallback: Check legacy cookie (backward compatibility during migration)
    const legacyCookie = request.cookies.get('admin_session')?.value;
    if (legacyCookie) {
      try {
        JSON.parse(legacyCookie);
        // Legacy session valid — proceed (will be migrated on next login)
        return intlMiddleware(request);
      } catch {
        // Invalid legacy cookie
      }
    }

    // Not authenticated — redirect to login
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Public routes — just handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
  ],
};