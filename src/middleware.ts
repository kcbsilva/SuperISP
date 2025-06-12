
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

  // IMPORTANT: supabase.auth.getSession() can potentially update response.cookies through the
  // 'set' and 'remove' callbacks in its options, especially if a token refresh occurs.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Middleware] Error getting session:', sessionError.message);
  }
  
  // console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Session from Supabase getSession: ${session ? 'Exists' : 'Null'}`);
  // console.log('[Middleware] Request cookies:', JSON.stringify(request.cookies.getAll()));
  // if (session) {
  //   console.log('[Middleware] Session object:', JSON.stringify(session, null, 2));
  // }


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
      // console.log(`[Middleware] User IS AUTHENTICATED. Path: ${pathname}`);
      if (isPublicAdminPath || isAdminRootPath) {
        if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
            // console.log(`[Middleware] Authenticated user on update-password. Allowing.`);
            // For update-password, it's crucial that any Set-Cookie headers from session refresh are passed back.
            return response; 
        }
        // User is authenticated but on a public admin page (login, forgot-password) or admin root.
        // Redirect to dashboard.
        // console.log(`[Middleware] Authenticated user on public admin path ${pathname}. Redirecting to dashboard.`);
        const redirectUrl = new URL(ADMIN_DASHBOARD_PATH, request.url);
        // Pass the headers from the `response` object, which may have been modified by Supabase.
        return NextResponse.redirect(redirectUrl, { headers: response.headers });
      }
      // User is authenticated and on a protected admin page.
      // console.log(`[Middleware] Authenticated user on protected admin path ${pathname}. Allowing.`);
      return response;
    } else {
      // User is not authenticated
      // console.log(`[Middleware] User IS NOT AUTHENTICATED. Path: ${pathname}`);
      if (!isPublicAdminPath && !isAdminRootPath) {
        // Not authenticated and on a protected admin path that is not admin root.
        // Redirect to login.
        // console.log(`[Middleware] Unauthenticated user on protected admin path ${pathname}. Redirecting to login.`);
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        const redirectParam = request.nextUrl.searchParams.get('redirect_url');
        const targetRedirect = redirectParam || (pathname + request.nextUrl.search);

        if (targetRedirect && targetRedirect !== ADMIN_LOGIN_PATH && !targetRedirect.startsWith(ADMIN_LOGIN_PATH + '?')) {
            loginUrl.searchParams.set('redirect_url', targetRedirect);
        }
        
        // Pass the headers from the `response` object.
        return NextResponse.redirect(loginUrl, { headers: response.headers });
      }
      // User is not authenticated but on a public admin page or admin root. Allow access.
      // console.log(`[Middleware] Unauthenticated user on public admin path ${pathname} or admin root. Allowing.`);
      return response;
    }
  }

  // For non-admin public routes or if already handled, allow access
  // console.log(`[Middleware] Non-admin path ${pathname}. Allowing.`);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg)$).*)',
  ],
};
