// src/app/api/network-radius/list/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your PostgreSQL connection
import { NasType } from '@/components/network-radius/NasTable';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT
        n.id,
        n.nasname,
        n.shortname,
        n.type,
        n.snmp_status,
        p.id AS pop_id,
        p.name AS pop_name
      FROM nas n
      LEFT JOIN pops p ON n.pop_id = p.id
      ORDER BY n.id DESC
    `);

    const formatted: NasType[] = result.rows.map((row: any) => ({
      id: row.id,
      nasname: row.nasname,
      shortname: row.shortname,
      type: row.type,
      snmp_status: row.snmp_status ?? 'pending',
      pop: row.pop_id ? { id: row.pop_id, name: row.pop_name } : null
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('[GET /network-radius/list]', err);
    return NextResponse.json({ error: 'Failed to fetch NAS list' }, { status: 500 });
  }
}
