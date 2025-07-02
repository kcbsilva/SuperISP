// /api/inventory/suppliers/remove/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = params;

  try {
    await db.query(`DELETE FROM suppliers WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
