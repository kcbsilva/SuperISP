import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { tenantId: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { tenantId } = params;
    const data = await req.json();

    await db.query(`
      CREATE TABLE IF NOT EXISTS setup_submissions (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await db.query(
      'INSERT INTO setup_submissions (tenant_id, data) VALUES ($1, $2) RETURNING *',
      [tenantId, data]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[SETUP_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to save setup data' }, { status: 500 });
  }
}
