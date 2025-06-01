import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { appendFileSync } from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

export function middleware(request: NextRequest) {

  // Log middleware access to a file for debugging
  try {
    const timestamp = new Date().toISOString();
    appendFileSync('debug_log.txt', `[MIDDLEWARE] Accessed at: ${timestamp}\n`);
  } catch (error) {
    console.error('Failed to write to debug_log.txt from middleware:', error);
  }

  const response = NextResponse.next();
  response.headers.set('X-Middleware-Ran', 'true');
  // Note: We are not returning the response here immediately anymore
  // because we need to execute the rest of the middleware logic.
  // The response object will be modified and returned later if needed
  // (e.g., for redirects).


  console.log('➡️ Middleware received request for:', request.url);
  console.log('Referer:', request.headers.get('referer'));
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  console.log('🔍 Path:', pathname);
  console.log('🍪 Token:', token ? 'exists' : 'missing');

  // Explicit list of public paths that never require auth
  const publicPaths = [
    '/admin/(auth)/login',
    '/client/login',
    '/api/auth', // Add any API auth endpoints
  ];

  // Check if current path is public
  console.log('Checking if path is public...');
  const isPublicPath = publicPaths.some(publicPath => 
    pathname === publicPath || 
    pathname.startsWith(publicPath)
  );
  console.log('Is public path:', isPublicPath);
  
  // 1. If path is public, allow access unconditionally
  if (isPublicPath) {
    console.log('➡️ Public path access allowed');
    return NextResponse.next();
  }

  // 2. For protected paths, check authentication
  console.log('Starting authentication check...');
  try {
    if (token) {
      // Verify token (throws if invalid)
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Valid token for:', decoded);
      
      // Valid token, allow access
      return NextResponse.next();
    }
  } catch (error) {
    console.log('❌ Invalid token:', error.message);
    // Clear invalid token and redirect to login

    const response = NextResponse.redirect(
      new URL(pathname.startsWith('/client') ? '/client/login' : '/admin/(auth)/login', request.url)
    );
    console.log('🗑️ Deleting invalid token cookie and redirecting to login');
    response.cookies.delete('token');
    return response;
  }

  // 3. No token or invalid token case (caught above)
  console.log('🔒 Unauthenticated access attempt to protected path');
  const loginUrl = pathname.startsWith('/client') ? '/client/login' : '/admin/(auth)/login';
  return NextResponse.redirect(new URL(loginUrl, request.url));
}

export const config = {
  matcher: [
    // Temporary: Only match the admin login path for debugging
    '/admin/(auth)/login',
  ],
};