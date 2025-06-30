import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const {
      companyName,
      businessNumber,
      email,
      phoneNumber,
      address,
      notes,
      isActive
    } = await req.json();

    const result = await query(
      `UPDATE participants
       SET company_name = $1,
           business_number = $2,
           email = $3,
           phone_number = $4,
           address = $5,
           notes = $6,
           is_active = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [companyName, businessNumber, email, phoneNumber, address, notes, isActive, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('[PARTICIPANTS_UPDATE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}
