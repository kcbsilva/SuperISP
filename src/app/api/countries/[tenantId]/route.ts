// src/app/api/countries/[tenantId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: {
    tenantId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { tenantId } = params;
    const result = await db.query(
      'SELECT * FROM countries WHERE tenant_id = $1 ORDER BY description ASC',
      [tenantId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[COUNTRIES_GET_ERROR]', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { tenantId } = params;
    const body = await req.json();
    const { description, date_format, currency } = body;

    if (!description || !date_format || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.query(
      `
      INSERT INTO countries (description, date_format, currency, tenant_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [description, date_format, currency, tenantId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[COUNTRIES_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to add country' }, { status: 500 });
  }
}
