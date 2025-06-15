import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

// const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
// const ADMIN_LOGIN_PATH = '/admin/login';
// const ADMIN_PUBLIC_PATHS = [ADMIN_LOGIN_PATH, '/admin/forgot-password', '/admin/update-password'];

export async function middleware(request: NextRequest) {
  // --- Authentication logic is simplified due to direct PostgreSQL and placeholder auth ---
  // In a production scenario with custom PostgreSQL auth, you'd verify a JWT token here.
  console.log(`[Middleware - PostgreSQL Mode] Path: ${request.nextUrl.pathname}. Passing through.`);
  return NextResponse.next();

  /* Original Middleware Logic (If you implement custom JWT auth with PostgreSQL)
  const response = NextResponse.next();
  const token = request.cookies.get('auth-token')?.value; // Example cookie name

  let session = null;
  if (token) {
    // session = verifyJwtEdge(token); // You'd need a verifyJwtEdge compatible with your JWTs
  }

  const pathname = request.nextUrl.pathname;
  const isAuthenticated = !!session; // Based on your JWT verification
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminRootPath = pathname === '/admin';
  const isPublicAdminPath = ADMIN_PUBLIC_PATHS.includes(pathname);

  if (isAdminPath) {
    if (isAuthenticated) {
      if (isPublicAdminPath || isAdminRootPath) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
      }
      return response;
    } else {
      if (!isPublicAdminPath && !isAdminRootPath) {
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
        // loginUrl.searchParams.set('redirect_url', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }
  }
  return response;
  */
}
