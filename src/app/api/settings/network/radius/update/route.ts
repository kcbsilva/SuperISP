// src/app/api/network-radius/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { encrypt } from '@/lib/encryption';

const NasSchema = z.object({
  id: z.number(),
  nasname: z.string().ip(),
  shortname: z.string().min(1),
  type: z.string().min(1),
  pop: z.object({ id: z.string() }).optional(),
  snmp_version: z.string().optional(),
  snmp_port: z.coerce.number().optional(),
  timeout: z.coerce.number().optional(),
  community: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = NasSchema.parse(body);

    const encryptedPassword = data.password ? encrypt(data.password) : null;
    const encryptedCommunity = data.community ? encrypt(data.community) : null;

    await db.query(`
      UPDATE nas SET
        nasname = $1,
        shortname = $2,
        type = $3,
        pop_id = $4,
        snmp_version = $5,
        snmp_port = $6,
        timeout = $7,
        community = $8,
        username = $9,
        password = $10,
        updated_at = now()
      WHERE id = $11
    `, [
      data.nasname,
      data.shortname,
      data.type,
      data.pop?.id || null,
      data.snmp_version || null,
      data.snmp_port || null,
      data.timeout || null,
      encryptedCommunity,
      data.username || null,
      encryptedPassword,
      data.id
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[UPDATE NAS]', err);
    return NextResponse.json({ error: err?.message || 'Failed to update NAS' }, { status: 500 });
  }
}
