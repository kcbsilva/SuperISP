// src/app/api/pops/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logAction } from '@/lib/logging'; // Make sure this exists and is implemented

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, location, description, status, userId } = body;

    if (!id || !name || !location || !userId) {
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

    const updated = result.rows[0];

    await logAction({
      userId,
      action: 'UPDATE_POP',
      target: 'PoP',
      targetId: updated.id.toString(),
      message: `PoP "${updated.name}" was updated.`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] /api/pops/edit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
