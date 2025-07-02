// /api/inventory/suppliers/update/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const { businessName, email, telephone } = await req.json();

    if (!businessName || !email || !telephone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      `UPDATE suppliers SET business_name = $1, email = $2, telephone = $3 WHERE id = $4`,
      [businessName, email, telephone, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}
