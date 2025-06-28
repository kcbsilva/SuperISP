// src/app/api/network-radius/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    await db.query('DELETE FROM nas WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE NAS]', err);
    return NextResponse.json({ error: 'Failed to delete NAS' }, { status: 500 });
  }
}
