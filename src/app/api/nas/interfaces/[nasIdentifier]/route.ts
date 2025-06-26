// src/app/api/nas/interfaces/[nasIdentifier]/route.ts
import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { nasIdentifier: string } }
) {
  try {
    const result = await query(
      `
      SELECT i.*
      FROM interfaces i
      JOIN nas n ON i.nas_id = n.id
      WHERE n.identifier = $1
      `,
      [params.nasIdentifier]
    );

    if (result.rows.length === 0) {
      return new Response('NAS not found or no interfaces', { status: 404 });
    }

    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching NAS interfaces:', error);
    return new Response('Failed to fetch interfaces', { status: 500 });
  }
}
