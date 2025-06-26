// src/app/api/settings/network/devices/update/[id]/route.ts
// PUT /api/settings/network/devices/update/:id

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      name, description, ip, type, manufacturer, popId,
      monitor, readable, radius, provision, backup,
      connectionType, username, password
    } = await req.json();

    const result = await pool.query(
      `UPDATE devices SET
        name = $1,
        description = $2,
        ip_address = $3,
        type = $4,
        manufacturer = $5,
        pop_id = $6,
        monitor = $7,
        readable = $8,
        radius = $9,
        provision = $10,
        backup = $11,
        connection_type = $12,
        username = $13,
        password = $14,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *`,
      [
        name, description, ip, type, manufacturer, popId || null,
        monitor, readable, radius, provision, backup,
        connectionType, username, password, params.id
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating device:', error);
    return new NextResponse('Failed to update device', { status: 500 });
  }
}
