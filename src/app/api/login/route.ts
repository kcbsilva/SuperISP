import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email } = await request.json();

  console.warn('Login attempt for', email, '- authentication not implemented.');

  return NextResponse.json({ message: 'Authentication not implemented' }, { status: 501 });
}