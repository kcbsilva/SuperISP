// src/app/api/settings/network/devices/create/route.ts
// POST /api/settings/network/devices/create

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const {
      name, description, ip, type, manufacturer, popId,
      monitor, readable, radius, provision, backup,
      connectionType, username, password
    } = await req.json();

    const result = await pool.query(
      `INSERT INTO devices (
        name, description, ip_address, type, manufacturer, pop_id,
        monitor, readable, radius, provision, backup,
        connection_type, username, password
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        name, description, ip, type, manufacturer, popId || null,
        monitor, readable, radius, provision, backup,
        connectionType, username, password
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating device:', error);
    return new NextResponse('Failed to create device', { status: 500 });
  }
}
