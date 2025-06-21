// src/app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assumes a pg wrapper is set up

export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, project_name, pop_name, status
      FROM projects
      ORDER BY created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
