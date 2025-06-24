// /src/app/api/pops/delete/route.ts
import { db } from '@/lib/db';
import { logAction } from '@/lib/logging';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, userId = 'system' } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing PoP ID' }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE pops SET deleted_at = NOW() WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'PoP not found or already deleted' }, { status: 404 });
    }

    await logAction({
      userId,
      action: 'DELETE_POP',
      target: 'PoP',
      targetId: id,
      message: `PoP "${name || id}" was soft-deleted.`,
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[POPS_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete PoP' }, { status: 500 });
  }
}
