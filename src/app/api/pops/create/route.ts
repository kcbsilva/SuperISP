// /src/app/api/pops/create/route.ts
import { db } from '@/lib/db';
import { logAction } from '@/lib/logging';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, description = '', status = 'Active', userId = 'system' } = body;

    if (!name || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.query(
      `
        INSERT INTO pops (name, location, description, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [name, location, description, status]
    );

    const newPop = result.rows[0];

    await logAction({
      userId,
      action: 'CREATE_POP',
      target: 'PoP',
      targetId: newPop.id,
      message: `PoP "${newPop.name}" created at ${newPop.location}`,
    });

    return NextResponse.json(newPop);
  } catch (error) {
    console.error('[POPS_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create PoP' },
      { status: 500 }
    );
  }
}
