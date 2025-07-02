// /src/app/api/inventory/categories/remove/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    const result = await db.query(
      'DELETE FROM inventory_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CATEGORY_DELETE_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
