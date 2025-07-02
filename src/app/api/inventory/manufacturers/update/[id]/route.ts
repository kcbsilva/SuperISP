// src/app/api/inventory/manufacturers/update/[id]/route.ts
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

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const id = params.id;
    const body = await req.json();
    const parsed = schema.parse(body);

    const result = await db.query(
      `
      UPDATE manufacturers
      SET business_name = $1,
          business_number = $2,
          address = $3,
          telephone = $4,
          email = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        parsed.businessName,
        parsed.businessNumber,
        parsed.address,
        parsed.telephone,
        parsed.email,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[UPDATE_MANUFACTURER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update manufacturer' }, { status: 500 });
  }
}
