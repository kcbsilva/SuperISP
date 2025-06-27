// src/app/api/finances/entry-categories/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query('SELECT * FROM entry_categories ORDER BY created_at ASC');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('GET entry_categories error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, type, description, parentCategoryId } = await req.json();
    const result = await query(
      `INSERT INTO entry_categories (name, type, description, parent_category_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type, description || null, parentCategoryId || null]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('POST entry_categories error:', err);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}
