// src/app/api/users/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { full_name, role_id } = body;

    if (!id || !full_name || !role_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `UPDATE users
       SET full_name = $1, role_id = $2
       WHERE id = $3
       RETURNING id, email, full_name, role_id`,
      [full_name, role_id, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: any) {
    console.error('[USER_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
