// src/app/api/users/[tenantId]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request, { params }: { params: { tenantId: string } }) {
  const { fullName, email, password } = await req.json();
  const tenantId = params.tenantId;

  if (!tenantId || !email || !password || !fullName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.query(
    'INSERT INTO users (full_name, email, password, tenant_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fullName, email, hashed, tenantId, 'admin']
  );

  return NextResponse.json(result.rows[0]);
}
