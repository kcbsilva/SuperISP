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

  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  // console.log('[Middleware] All incoming cookies:', JSON.stringify(request.cookies.getAll())); // Uncomment for deep cookie debugging


  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Middleware] Supabase getSession Error:', sessionError.message);
  }
  console.log('[Middleware] Session from Supabase getSession:', session ? `User ID: ${session.user.id}` : 'null');


  const { pathname } = request.nextUrl;
  const isAuthenticated = !!session;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|webmanifest)$/) // Added webmanifest
  ) {
    return response;
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminRootPath = pathname === ADMIN_ROOT_PATH;
  const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);

  if (isAdminPath) {
    console.log(`[Middleware] Admin path check: isAuthenticated=${isAuthenticated}, isPublicAdminPath=${isPublicAdminPath}, isAdminRootPath=${isAdminRootPath}`);
    if (isAuthenticated) {
      // Allow access to update-password page even if authenticated, as it's part of recovery flow
      if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
        console.log('[Middleware] Authenticated user accessing update-password. Allowing.');
        return response;
      }

      if (isPublicAdminPath || isAdminRootPath) {
        console.log(`[Middleware] Authenticated user on public/root admin page (${pathname}). Redirecting to dashboard.`);
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url), {
          headers: response.headers, // Pass along headers (cookies might have been updated by getSession)
        });
      }
      console.log('[Middleware] Authenticated user on protected admin page. Allowing.');
      return response; // Allow access to other protected admin pages
    } else {
      // User is NOT authenticated
      if (!isPublicAdminPath && !isAdminRootPath) {
        console.log(`[Middleware] Unauthenticated user on protected admin page (${pathname}). Redirecting to login.`);
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        // Temporarily removed redirect_url preservation for debugging
        // const redirectUrl = request.nextUrl.searchParams.get('redirect_url') || pathname + request.nextUrl.search;
        // if (redirectUrl && !redirectUrl.startsWith(ADMIN_LOGIN_PATH)) {
        //   loginUrl.searchParams.set('redirect_url', redirectUrl);
        // }
        return NextResponse.redirect(loginUrl, {
          headers: response.headers, // Pass along headers
        });
      }
      console.log('[Middleware] Unauthenticated user on public admin page or admin root. Allowing.');
      return response; // Allow access to public admin pages (login, forgot-password) or /admin
    }
  }

  // For non-admin paths, just pass through
  // console.log('[Middleware] Non-admin path. Allowing.');
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg|webmanifest)$).*)',
  ],
};
