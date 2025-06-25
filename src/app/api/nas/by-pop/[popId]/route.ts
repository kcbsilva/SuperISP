// /src/app/api/nas/by-pop/[popId]/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { popId: string } }
) {
  try {
    const nasList = await prisma.nas.findMany({
      where: { popId: params.popId },
      select: { id: true, identifier: true },
    });

    return Response.json(nasList);
  } catch (error) {
    return new Response('Failed to fetch NAS for PoP', { status: 500 })
  }
}