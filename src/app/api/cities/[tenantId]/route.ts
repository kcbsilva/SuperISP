// src/app/api/cities/[tenantId]/route.ts
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
      'SELECT * FROM cities WHERE tenant_id = $1 ORDER BY name ASC',
      [tenantId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[CITIES_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { tenantId } = params;
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing city name' }, { status: 400 });
    }

    const result = await db.query(
      `
      INSERT INTO cities (name, tenant_id)
      VALUES ($1, $2)
      RETURNING *`,
      [name, tenantId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[CITIES_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to add city' }, { status: 500 });
  }
}
