// /src/app/api/pops/list/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { logAction } from '@/lib/logging';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, name, location, status, description, created_at, updated_at
      FROM pops
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);

   await logAction({
     userId: 'system', // or pass via headers if needed
     action: 'LIST_POP',
     target: 'PoP',
     message: 'PoP list was retrieved.',
  });

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[POPS_LIST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch PoPs' },
      { status: 500 }
    );
  }
}
