// src/app/api/subscribers/remove/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteSubscriber } from '@/services/postgres/subscribers';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deletedSubscriber = await deleteSubscriber(params.id);
    return NextResponse.json(deletedSubscriber);
  } catch (error) {
    console.error('[SUBSCRIBER_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
