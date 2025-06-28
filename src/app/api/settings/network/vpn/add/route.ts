// src/app/api/settings/network/vpn/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, remote_address, local_subnet, remote_subnet, pre_shared_key, enabled } = body;

    const result = await query(
      `INSERT INTO vpn_connections (name, remote_address, local_subnet, remote_subnet, pre_shared_key, enabled)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, remote_address, local_subnet, remote_subnet, pre_shared_key, enabled]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create VPN' }, { status: 500 });
  }
}
