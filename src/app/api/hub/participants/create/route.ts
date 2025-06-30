import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const {
      companyName,
      businessNumber,
      email,
      phoneNumber,
      address,
      notes
    } = await req.json();

    const result = await query(
      `INSERT INTO participants
        (company_name, business_number, email, phone_number, address, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [companyName, businessNumber, email, phoneNumber, address, notes]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('[PARTICIPANTS_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 });
  }
}
