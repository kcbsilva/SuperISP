// src/app/api/vlans/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vlanId = params.id;
    const body = await req.json();

    const updateQuery = `
      UPDATE vlans
      SET
        vlan_id = $1,
        description = $2,
        pop_id = $3,
        is_tagged = $4,
        status = $5,
        assigned_to = $6,
        available_in_hub = $7,
        participant_id = $8
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      body.vlanId,
      body.description,
      body.popId,
      body.isTagged,
      body.status,
      body.assignedTo,
      body.availableInHub,
      body.participantId || null,
      vlanId,
    ];

    const result = await query(updateQuery, values);

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Failed to update VLAN:', error);
    return NextResponse.json({ error: 'Unable to update VLAN.' }, { status: 500 });
  }
}
