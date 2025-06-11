// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_ROOT_PATH = '/admin';
const ADMIN_FORGOT_PASSWORD_PATH = '/admin/forgot-password';
const ADMIN_UPDATE_PASSWORD_PATH = '/admin/update-password';

const PUBLIC_ADMIN_PATHS = [
  ADMIN_LOGIN_PATH,
  ADMIN_FORGOT_PASSWORD_PATH,
  ADMIN_UPDATE_PASSWORD_PATH,
  // ADMIN_ROOT_PATH is handled separately as it might redirect to login or dashboard
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAuthenticated = !!session;

  // Allow requests for API routes, Next.js static files, and image optimization files immediately
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
    return response;
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminRootPath = pathname === ADMIN_ROOT_PATH;
  const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);

  if (isAdminPath) {
    if (isAuthenticated) {
      // If authenticated and trying to access login, forgot-password, or admin root, redirect to dashboard
      if (isPublicAdminPath || isAdminRootPath) {
        // Exception: if on update-password and authenticated, it might be a PASSWORD_RECOVERY session, so allow it.
        // Supabase client on the update-password page will handle the token.
        // If it's a regular session on update-password, LayoutRenderer might redirect.
        if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
            return response;
        }
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
      }
      return response; // User is authenticated and on a protected admin page
    } else {
      // User is not authenticated
      if (!isPublicAdminPath && !isAdminRootPath) {
        // And not on a public admin page or admin root, redirect to login
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        const existingRedirectUrl = request.nextUrl.searchParams.get('redirect_url');
        loginUrl.searchParams.set('redirect_url', existingRedirectUrl || (pathname + request.nextUrl.search));
        return NextResponse.redirect(loginUrl);
      }
      // If not authenticated but already on a public admin page (login, forgot-password, update-password) or admin root, allow access
      return response;
    }
  }

  // For non-admin public routes or if already handled, allow access
  return response;
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
