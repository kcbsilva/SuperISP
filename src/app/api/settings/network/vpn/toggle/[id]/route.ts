// src/app/api/settings/network/vpn/toggle/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { enabled } = await req.json();
    const result = await query(
      `UPDATE vpn_connections SET enabled = $1 WHERE id = $2 RETURNING *`,
      [enabled, params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update VPN status' }, { status: 500 });
  }
}
