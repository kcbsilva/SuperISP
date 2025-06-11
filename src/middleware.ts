
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_ROOT_PATH = '/admin';

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
          // If you are using 'request.cookies.set', set it on the response instead.
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If you are using 'request.cookies.set', set it on the response instead.
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
    return response;
  }

  const isAdminLoginPath = pathname === ADMIN_LOGIN_PATH;
  const isAdminRootPath = pathname === ADMIN_ROOT_PATH;
  const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);

  if (isAdminPath) {
    if (isAuthenticated) {
      if (isAdminLoginPath || isAdminRootPath) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
      }
      return response; // User is authenticated and on a protected admin page (not login/root)
    } else {
      // User is not authenticated
      if (!isAdminLoginPath && !isAdminRootPath) {
        // And not on login or admin root, redirect to login
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        // Preserve redirect_url if it was already there from a client-side redirect attempt
        const existingRedirectUrl = request.nextUrl.searchParams.get('redirect_url');
        loginUrl.searchParams.set('redirect_url', existingRedirectUrl || (pathname + request.nextUrl.search));
        return NextResponse.redirect(loginUrl);
      }
      // If not authenticated but already on login or admin root, allow access
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
