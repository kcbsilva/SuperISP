
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
  // Create a base response. This response object will be mutated by Supabase
  // if it needs to set/refresh cookies during getSession or other auth operations.
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
          // The Supabase client will call this to set cookies.
          // We need to ensure this happens on the `response` object we will return.
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Same as above, for removing cookies.
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Check for session and handle potential token refresh
  // This getSession() call might use the `set` and `remove` cookie handlers above,
  // modifying `response.cookies` if a token refresh occurs.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Middleware] Error getting session:', sessionError.message);
    // Potentially, if session fetch fails critically, you might redirect to an error page or login.
    // For now, we'll proceed, and lack of session will be handled.
  }

  const { pathname } = request.nextUrl;
  const isAuthenticated = !!session;

  // Optional: Log cookies being sent from the browser to the middleware
  // console.log(`[Middleware] Cookies received for path ${pathname}:`, JSON.stringify(request.cookies.getAll()));
  console.log(`[Middleware] Path: ${pathname}, Authenticated (after getSession): ${isAuthenticated}, Session User ID: ${session?.user?.id || 'None'}`);


  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/api') || // Exclude all /api routes
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg')
  ) {
    return response; // Return the potentially modified response (e.g., if getSession refreshed tokens)
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminRootPath = pathname === ADMIN_ROOT_PATH;
  const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);

  if (isAdminPath) {
    if (isAuthenticated) {
      console.log(`[Middleware] User IS AUTHENTICATED. Path: ${pathname}`);
      
      if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
        console.log(`[Middleware] Authenticated user on update-password. Allowing.`);
        return response; // Return potentially modified response
      }
      
      if (isPublicAdminPath || isAdminRootPath) {
        console.log(`[Middleware] Authenticated user on public admin path ${pathname}. Redirecting to dashboard.`);
        // Create a new redirect response, BUT explicitly use the headers from the `response` object
        // that Supabase auth might have modified (e.g., with Set-Cookie for token refresh).
        const redirectResponse = NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url), {
          headers: response.headers, // Carry over any Set-Cookie headers
        });
        return redirectResponse;
      }
      
      console.log(`[Middleware] Authenticated user on protected admin path ${pathname}. Allowing.`);
      return response; // Return potentially modified response
      
    } else {
      console.log(`[Middleware] User IS NOT AUTHENTICATED. Path: ${pathname}`);
      
      if (!isPublicAdminPath && !isAdminRootPath) {
        console.log(`[Middleware] Unauthenticated user on protected admin path ${pathname}. Redirecting to login.`);
        
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        const redirectParam = request.nextUrl.searchParams.get('redirect_url');
        const targetRedirect = redirectParam || (pathname + request.nextUrl.search);

        if (targetRedirect && targetRedirect !== ADMIN_LOGIN_PATH && !targetRedirect.startsWith(ADMIN_LOGIN_PATH + '?')) {
          loginUrl.searchParams.set('redirect_url', targetRedirect);
        }
        
        // Similar to above, use headers from the potentially modified `response`
        const redirectResponse = NextResponse.redirect(loginUrl, {
          headers: response.headers, // Carry over any Set-Cookie headers
        });
        return redirectResponse;
      }
      
      console.log(`[Middleware] Unauthenticated user on public admin path ${pathname} or admin root. Allowing.`);
      return response; // Return potentially modified response
    }
  }

  console.log(`[Middleware] Non-admin path ${pathname}. Allowing.`);
  return response; // Return potentially modified response
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - .png, .svg, .jpg, .jpeg (image files)
    // This ensures the middleware runs on page navigations but not on static asset requests.
    '/((?!api|_next/static|_next/image|.*\\.(?:ico|png|svg|jpg|jpeg)$).*)',
  ],
};
