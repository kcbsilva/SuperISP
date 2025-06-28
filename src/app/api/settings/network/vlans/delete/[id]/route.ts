// src/app/api/vlans/delete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM vlans WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting VLAN:', error);
    return new NextResponse('Failed to delete VLAN', { status: 500 });
  }
}
