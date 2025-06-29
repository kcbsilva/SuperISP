// src/app/api/setup/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await db.query(`
      CREATE TABLE IF NOT EXISTS setup_submissions (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await db.query(
      'INSERT INTO setup_submissions (data) VALUES ($1) RETURNING *',
      [data]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[SETUP_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to save setup data' }, { status: 500 });
  }
}
