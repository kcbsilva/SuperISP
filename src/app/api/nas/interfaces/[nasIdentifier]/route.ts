// /src/app/api/nas/interfaces/[nasIdentifier]/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { nasIdentifier: string } }
) {
  try {
    const nas = await prisma.nas.findUnique({
      where: { identifier: params.nasIdentifier },
      select: { interfaces: true },
    });

    if (!nas) return new Response('NAS not found', { status: 404 });

    return Response.json(nas.interfaces || []);
  } catch (error) {
    return new Response('Failed to fetch interfaces', { status: 500 });
  }
}
