// /src/app/api/inventory/categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM inventory_categories ORDER BY name ASC');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[CATEGORY_FETCH_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
