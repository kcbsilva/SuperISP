// /src/app/api/inventory/categories/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name } = data;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid category name' }, { status: 400 });
    }

    const result = await db.query(
      'INSERT INTO inventory_categories (name) VALUES ($1) RETURNING *',
      [name]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('[CATEGORY_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
