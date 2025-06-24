// src/app/api/pops/list/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, name, location, description, status, created_at, updated_at
      FROM pops
      ORDER BY name ASC
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[GET POPS LIST]', err);
    return NextResponse.json({ error: 'Failed to load PoPs' }, { status: 500 });
  }
}
