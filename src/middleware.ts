
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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  // console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Session from Supabase: ${session ? 'Exists' : 'Null'}`);


  const { pathname } = request.nextUrl;
  const isAuthenticated = !!session;

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
      if (isPublicAdminPath || isAdminRootPath) {
        if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
            // Allow access, page logic will handle session type
            return response; 
        }
        // User is authenticated but on a public admin page (login, forgot-password) or admin root.
        // Redirect to dashboard.
        const redirectUrl = new URL(ADMIN_DASHBOARD_PATH, request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        // Transfer cookies from the initial 'response' (potentially modified by Supabase) to the new redirectResponse
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
      }
      // User is authenticated and on a protected admin page (not login, forgot-pw, etc.)
      return response;
    } else {
      // User is not authenticated
      if (!isPublicAdminPath && !isAdminRootPath) {
        // Not authenticated and on a protected admin path that is not admin root.
        // Redirect to login.
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        const redirectParam = request.nextUrl.searchParams.get('redirect_url');
        const targetRedirect = redirectParam || (pathname + request.nextUrl.search);
        if (targetRedirect) {
            loginUrl.searchParams.set('redirect_url', targetRedirect);
        }
        
        const redirectResponse = NextResponse.redirect(loginUrl);
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
      }
      // User is not authenticated but on a public admin page (login, forgot-pw, update-pw) or admin root. Allow access.
      return response;
    }
  }

  // For non-admin public routes or if already handled, allow access
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg)$).*)',
  ],
};
