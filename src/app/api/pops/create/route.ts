import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, location, description, status = 'active' } = await req.json();

    const result = await db.query(`
      INSERT INTO pops (name, location, description, status)
      VALUES ($1, $2, $3)
      RETURNING id, name, location, status
    `, [name, location, description, status]);

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('[CREATE POP]', err);
    return NextResponse.json({ error: 'Failed to create PoP' }, { status: 500 });
  }
}
