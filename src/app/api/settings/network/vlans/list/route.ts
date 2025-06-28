// src/app/api/vlans/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search')?.toLowerCase() || '';
    const sortField = searchParams.get('sortField') || 'created_at'; // make sure this matches your SQL column
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    const offset = (page - 1) * pageSize;

    const searchQuery = search
      ? `
        WHERE 
          v.assigned_to ILIKE $1 OR
          v.description ILIKE $1 OR
          p.company_name ILIKE $1 OR
          po.name ILIKE $1
      `
      : '';

    const searchParam = `%${search}%`;
    const values = search ? [searchParam, pageSize, offset] : [pageSize, offset];

    const dataQuery = `
      SELECT v.*, p.company_name as participant_company, po.name as pop_name
      FROM vlans v
      LEFT JOIN participants p ON v.participant_id = p.id
      LEFT JOIN pops po ON v.pop_id = po.id
      ${searchQuery}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM vlans v
      LEFT JOIN participants p ON v.participant_id = p.id
      LEFT JOIN pops po ON v.pop_id = po.id
      ${searchQuery}
    `;

    const [dataResult, countResult] = await Promise.all([
      query(dataQuery, values),
      query(countQuery, search ? [searchParam] : []),
    ]);

    return NextResponse.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching VLAN list:', error);
    return new NextResponse('Failed to fetch VLANs', { status: 500 });
  }
}
