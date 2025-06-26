// src/app/api/nas/by-pop/[popId]/route.ts
import { NextRequest } from 'next/server';
import { query } from '@/lib/db'; // pg pool wrapper

export async function GET(
  req: NextRequest,
  { params }: { params: { popId: string } }
) {
  try {
    const result = await query(
      'SELECT id, identifier FROM nas WHERE pop_id = $1',
      [params.popId]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching NAS by PoP:', error);
    return new Response('Failed to fetch NAS for PoP', { status: 500 });
  }
}
