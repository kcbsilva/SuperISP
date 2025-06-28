// src/app/api/settings/network/vpn/remove/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await query(
      `DELETE FROM vpn_connections WHERE id = $1 RETURNING *`,
      [params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete VPN' }, { status: 500 });
  }
}
