// src/app/api/subscribers/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/services/postgres/subscribers';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newSubscriber = await addSubscriber(data);
    return NextResponse.json(newSubscriber);
  } catch (error) {
    console.error('[SUBSCRIBER_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 });
  }
}
