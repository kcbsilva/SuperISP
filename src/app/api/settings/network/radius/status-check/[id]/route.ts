// src/app/api/network-radius/status-check/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ping from 'ping';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const result = await db.query('SELECT nasname FROM nas WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'NAS not found' }, { status: 404 });
    }

    const ip = result.rows[0].nasname;
    const res = await ping.promise.probe(ip, { timeout: 2 });

    const status = res.alive ? 'ok' : 'fail';
    await db.query('UPDATE nas SET snmp_status = $1 WHERE id = $2', [status, id]);

    return NextResponse.json({ id, status });
  } catch (err) {
    console.error('[GET /network-radius/status-check]', err);
    return NextResponse.json({ error: 'Error checking status' }, { status: 500 });
  }
}
