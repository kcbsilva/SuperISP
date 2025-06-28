// src/app/api/maps/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_: NextRequest) {
  try {
    const result = await query(`
      SELECT p.id, p.project_name, p.pop_id, p.status, pops.name AS pop_name
      FROM map_projects p
      LEFT JOIN pops ON p.pop_id = pops.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
