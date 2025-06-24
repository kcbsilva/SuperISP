// src/app/api/network-radius/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { z } from 'zod';

const NasSchema = z.object({
  nasname: z.string().ip(),
  shortname: z.string().min(1),
  type: z.string().min(1),
  pop: z.object({ id: z.string() }).optional(),

  // Optional SNMP / Auth fields
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
    const data = NasSchema.parse(body); // ✅ Validation here

    const encryptedPassword = data.password ? encrypt(data.password) : null;
    const encryptedCommunity = data.community ? encrypt(data.community) : null;

    const result = await db.query(`
      INSERT INTO nas (
        nasname, shortname, type, pop_id,
        snmp_version, snmp_port, timeout,
        community, username, password
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10
      ) RETURNING id
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
    ]);

    return NextResponse.json({ id: result.rows[0].id });
  } catch (err: any) {
    console.error('[CREATE NAS]', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create NAS' },
      { status: 500 }
    );
  }
}
