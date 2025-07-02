// /api/inventory/suppliers/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { businessName, email, telephone } = await req.json();

    if (!businessName || !email || !telephone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO suppliers (business_name, email, telephone) VALUES ($1, $2, $3)`,
      [businessName, email, telephone]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
