// src/lib/auth-edge.ts
// Edge runtime compatible JWT verification for middleware

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

export interface SessionPayload {
  username: string;
  role: 'admin' | 'client';
  iat?: number;
  exp?: number;
}

// Base64 URL decode
function base64UrlDecode(str: string): string {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4);
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(str);
}

// Simple JWT verification for Edge runtime
export function verifyJwtEdge(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(parts[1])) as SessionPayload;
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}