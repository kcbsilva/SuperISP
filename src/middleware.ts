
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'prolter_auth'; // Must match the one in AuthContext
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_ROOT_PATH = '/admin'; // Assuming /admin is a redirector or similar

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticatedCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = isAuthenticatedCookie?.value === 'true';

  // Allow requests for API routes, Next.js static files, and image optimization files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg')
  ) {
    return NextResponse.next();
  }

  // Handle /admin routes
  if (pathname.startsWith(ADMIN_ROOT_PATH)) {
    // If trying to access login page or admin root itself
    if (pathname === ADMIN_LOGIN_PATH || pathname === ADMIN_ROOT_PATH) {
      if (isAuthenticated) {
        // If authenticated, redirect from login/root to admin dashboard
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
      }
      // If not authenticated, allow access to login page or admin root
      return NextResponse.next();
    }

    // For any other /admin/* path (e.g., /admin/dashboard, /admin/settings)
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      // Optionally, pass a redirect query param if your login page handles it
      // loginUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // If authenticated and on a protected admin path, allow access
    return NextResponse.next();
  }

  // For non-admin public routes or if already handled, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - specific static assets (e.g., .ico, .png, .svg, .jpg, .jpeg)
     *
     * This ensures that all actual page routes are processed by the middleware.
     */
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg)$).*)',
  ],
};

    