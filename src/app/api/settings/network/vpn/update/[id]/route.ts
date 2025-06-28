// src/app/api/settings/network/vpn/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, remote_address, local_subnet, remote_subnet, pre_shared_key, enabled } = body;

    const result = await query(
      `UPDATE vpn_connections SET
        name = $1,
        remote_address = $2,
        local_subnet = $3,
        remote_subnet = $4,
        pre_shared_key = $5,
        enabled = $6
       WHERE id = $7 RETURNING *`,
      [name, remote_address, local_subnet, remote_subnet, pre_shared_key, enabled, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update VPN' }, { status: 500 });
  }
}
