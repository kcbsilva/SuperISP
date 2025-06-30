// src/app/api/subscribers/list/route.ts
import { NextResponse } from 'next/server';
import { listSubscribers } from '@/services/postgres/subscribers';

export async function GET() {
  try {
    const subscribers = await listSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('[SUBSCRIBERS_LIST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
