// src/app/api/vlans/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await query(
      `
      INSERT INTO vlans (name, number, description, pop_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [body.name, body.number, body.description, body.pop_id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating VLAN:', error);
    return new NextResponse('Failed to create VLAN', { status: 500 });
  }
}
