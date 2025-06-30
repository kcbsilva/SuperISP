// src/app/api/subscribers/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateSubscriber } from '@/services/postgres/subscribers';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const updatedSubscriber = await updateSubscriber(params.id, updates);
    return NextResponse.json(updatedSubscriber);
  } catch (error) {
    console.error('[SUBSCRIBER_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 });
  }
}
