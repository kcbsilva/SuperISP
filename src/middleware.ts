import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'prolter_auth'; // Must match the one in AuthContext

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticatedCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Allow requests for API routes, Next.js static files, and image optimization files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico') || // Favicon
    pathname.endsWith('.png') || // Other image assets
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  // If the user is trying to access the login page
  if (pathname.startsWith('/admin/login')) {
    if (isAuthenticatedCookie?.value === 'true') {
      // If authenticated, redirect from login to dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If not authenticated, allow access to login page
    return NextResponse.next();
  }

  // For all other routes, check if authenticated
  if (isAuthenticatedCookie?.value !== 'true') {
    // If not authenticated, redirect to login page
    // Preserve the originally requested path as a query parameter for redirection after login
    const loginUrl = new URL('/admin/login', request.url);
    // loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and not on the login page, allow access
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This can be adjusted based on your public assets.
     */
    '/((?!api|_next/static|_next/image|.*\.(?:ico|png|svg)$).*)',
  ],
};
