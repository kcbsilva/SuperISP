import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = params;

    const result = await query(
      `UPDATE participants
       SET is_active = FALSE,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[PARTICIPANTS_DELETE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}
