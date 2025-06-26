// src/app/api/settings/network/devices/delete/[id]/route.ts
// DELETE /api/settings/network/devices/delete/:id
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM devices WHERE id = $1', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting device:', error);
    return new NextResponse('Failed to delete device', { status: 500 });
  }
}
