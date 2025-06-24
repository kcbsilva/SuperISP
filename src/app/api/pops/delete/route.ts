// src/app/api/pops/delete/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const result = await db.query(`DELETE FROM pops WHERE id = $1`, [id]);
    return NextResponse.json({ deleted: result.rowCount });
  } catch (error) {
    console.error('Error deleting PoP:', error);
    return NextResponse.json({ error: 'Failed to delete PoP' }, { status: 500 });
  }
}
