// src/app/api/vlans/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const vlan = await prisma.vlan.create({ data: body });
  return NextResponse.json(vlan);
}
