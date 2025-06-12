
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Dummy auth check - Restored to demo/demo
  if (email === 'demo' && password === 'demo') {
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
