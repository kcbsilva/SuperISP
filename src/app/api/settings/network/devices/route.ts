// src/app/api/settings/network/devices/route.ts
// GET /api/settings/network/devices
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return new NextResponse('Failed to fetch devices', { status: 500 });
  }
}