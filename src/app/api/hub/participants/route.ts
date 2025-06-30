import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT id, company_name, business_number, email, phone_number,
             address, notes, is_active, device_count, vlan_count,
             created_at, updated_at
      FROM participants
      ORDER BY created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[PARTICIPANTS_GET_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
}
