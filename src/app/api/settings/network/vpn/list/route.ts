// src/app/api/settings/network/vpn/list/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`SELECT * FROM vpn_connections ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch VPN connections' }, { status: 500 });
  }
}
