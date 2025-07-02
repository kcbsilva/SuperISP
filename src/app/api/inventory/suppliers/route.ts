// /api/inventory/suppliers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`SELECT * FROM suppliers ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[SUPPLIERS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}
