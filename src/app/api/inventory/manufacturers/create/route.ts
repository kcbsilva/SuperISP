// src/app/api/inventory/manufacturers/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  businessName: z.string().min(1),
  businessNumber: z.string().min(1),
  address: z.string().min(1),
  telephone: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const result = await db.query(
      `
      INSERT INTO manufacturers (
        id, business_name, business_number, address, telephone, email
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5
      )
      RETURNING *
      `,
      [
        parsed.businessName,
        parsed.businessNumber,
        parsed.address,
        parsed.telephone,
        parsed.email,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[CREATE_MANUFACTURER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create manufacturer' }, { status: 500 });
  }
}
