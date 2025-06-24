// src/app/api/pops/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, location, description, status } = body;

    if (!id || !name || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.query(
      `
        UPDATE pops
        SET name = $1,
            location = $2,
            description = $3,
            status = $4,
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `,
      [name, location, description || null, status || 'Active', id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[API] /api/pops/edit error:', error);
    return NextResponse.json({ error: 'Interal Server Error' }, { status: 500 });
  }
}