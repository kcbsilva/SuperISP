import { NextResponse, type NextRequest } from 'next/server';
// Supabase imports removed

export const config = {
  matcher: ['/admin/:path*'],
};

// const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
// const ADMIN_LOGIN_PATH = '/admin/login';
// const ADMIN_PUBLIC_PATHS = [ADMIN_LOGIN_PATH, '/admin/forgot-password', '/admin/update-password'];

export async function middleware(request: NextRequest) {
  // --- Temporarily Disabled Auth ---
  console.log(`[Middleware - Auth Disabled] Path: ${request.nextUrl.pathname}. Passing through.`);
  return NextResponse.next();
  // --- End Temporarily Disabled Auth ---

  /* Original Middleware Logic (Commented Out)
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  // console.log('[Middleware] Path:', request.nextUrl.pathname);
  // console.log('[Middleware] Session from Supabase getSession:', session ? `User ID: ${session.user.id}` : 'No session');
  // To see all cookies:
  // console.log('[Middleware] All incoming cookies:', JSON.stringify(request.cookies.getAll()));


  const pathname = request.nextUrl.pathname;

  const isAuthenticated = !!session;
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminRootPath = pathname === '/admin'; // Specifically /admin
  const isPublicAdminPath = ADMIN_PUBLIC_PATHS.includes(pathname);

  if (isAdminPath) {
    if (isAuthenticated) {
      // User is authenticated
      if (isPublicAdminPath || isAdminRootPath) {
        // Authenticated user is on a public admin page (login, forgot-password) or admin root, redirect to dashboard
        console.log('[Middleware] Authenticated user on public/root admin page. Redirecting to dashboard.');
        const redirectResponse = NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url), {
          headers: response.headers, // Carry over any Set-Cookie headers
        });
        return redirectResponse;
      }
      // Authenticated user on a protected admin page, allow access
      return response;
    } else {
      // User is not authenticated
      if (!isPublicAdminPath && !isAdminRootPath) {
        // Unauthenticated user trying to access a protected admin page, redirect to login
        console.log('[Middleware] Unauthenticated user on protected admin page. Redirecting to login.');
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        // loginUrl.searchParams.set('redirect_url', pathname); // Temporarily removed for debugging loop
        const redirectResponse = NextResponse.redirect(loginUrl, {
          headers: response.headers, // Carry over any Set-Cookie headers
        });
        return redirectResponse;
      }
      // Unauthenticated user on a public admin page (login, forgot-password) or admin root, allow access
      return response;
    }
  }

  return response;
  */
}
