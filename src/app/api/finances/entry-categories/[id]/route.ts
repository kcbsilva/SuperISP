// src/app/api/finances/entry-categories/[id]/route.ts
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, type, description, parentCategoryId } = await req.json();
    const result = await query(
      `UPDATE entry_categories
       SET name = $1, type = $2, description = $3, parent_category_id = $4
       WHERE id = $5
       RETURNING *`,
      [name, type, description || null, parentCategoryId || null, params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('PUT entry_categories error:', err);
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM entry_categories WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE entry_categories error:', err);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
