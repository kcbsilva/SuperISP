// src/app/api/maps/projects/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { project_name, pop_id, status } = await req.json();

    if (!project_name || !pop_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `UPDATE map_projects
       SET project_name = $1, pop_id = $2, status = $3
       WHERE id = $4
       RETURNING id, project_name, pop_id, status`,
      [project_name, pop_id, status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updated = result.rows[0];
    const popResult = await query('SELECT name FROM pops WHERE id = $1', [updated.pop_id]);
    updated.pop_name = popResult.rows[0]?.name || null;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
