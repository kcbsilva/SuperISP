// src/app/api/vlans/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search')?.toLowerCase() || '';
  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

  const whereClause = search
    ? {
        OR: [
          { assignedTo: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { participant: { companyName: { contains: search, mode: 'insensitive' } } },
          { pop: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }
    : {};

  const [vlans, total] = await Promise.all([
    prisma.vlan.findMany({
      where: whereClause,
      include: {
        pop: true,
        participant: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vlan.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    data: vlans,
    total,
    page,
    pageSize,
  });
}
