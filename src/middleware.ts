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

  // Check for session and handle potential token refresh
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Middleware] Error getting session:', sessionError.message);
  }

  const { pathname } = request.nextUrl;
  const isAuthenticated = !!session;

  console.log(`[Middleware] Path: ${pathname}, Authenticated: ${isAuthenticated}`);

  // Skip middleware for static assets and API routes
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
      console.log(`[Middleware] User IS AUTHENTICATED. Path: ${pathname}`);
      
      // Handle update-password specially - always allow if authenticated
      if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
        console.log(`[Middleware] Authenticated user on update-password. Allowing.`);
        return response;
      }
      
      // Redirect authenticated users away from public admin pages
      if (isPublicAdminPath || isAdminRootPath) {
        console.log(`[Middleware] Authenticated user on public admin path ${pathname}. Redirecting to dashboard.`);
        const redirectUrl = new URL(ADMIN_DASHBOARD_PATH, request.url);
        
        // Create a new response with redirect and preserve any cookies that might have been set
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        // Copy over any cookies that were set during session refresh
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        
        return redirectResponse;
      }
      
      // User is authenticated and on a protected admin page - allow access
      console.log(`[Middleware] Authenticated user on protected admin path ${pathname}. Allowing.`);
      return response;
      
    } else {
      // User is NOT authenticated
      console.log(`[Middleware] User IS NOT AUTHENTICATED. Path: ${pathname}`);
      
      if (!isPublicAdminPath && !isAdminRootPath) {
        // Not authenticated and trying to access protected admin path
        console.log(`[Middleware] Unauthenticated user on protected admin path ${pathname}. Redirecting to login.`);
        
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        const redirectParam = request.nextUrl.searchParams.get('redirect_url');
        const targetRedirect = redirectParam || (pathname + request.nextUrl.search);

        // Only add redirect_url if it's not the login page itself
        if (targetRedirect && targetRedirect !== ADMIN_LOGIN_PATH && !targetRedirect.startsWith(ADMIN_LOGIN_PATH + '?')) {
          loginUrl.searchParams.set('redirect_url', targetRedirect);
        }
        
        const redirectResponse = NextResponse.redirect(loginUrl);
        
        // Preserve any cookies
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        
        return redirectResponse;
      }
      
      // User is not authenticated but on a public admin page - allow access
      console.log(`[Middleware] Unauthenticated user on public admin path ${pathname} or admin root. Allowing.`);
      return response;
    }
  }

  // For non-admin routes, allow access
  console.log(`[Middleware] Non-admin path ${pathname}. Allowing.`);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg)$).*)',
  ],
};