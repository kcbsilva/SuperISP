// src/app/api/vlans/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vlanId = params.id;
    const body = await req.json();

    // Optional: Validate required fields here or with a Zod schema

    const updatedVlan = await prisma.vlan.update({
      where: { id: vlanId },
      data: {
        vlanId: body.vlanId,
        description: body.description,
        popId: body.popId,
        isTagged: body.isTagged,
        status: body.status,
        assignedTo: body.assignedTo,
        availableInHub: body.availableInHub,
        participantId: body.participantId || null,
      },
    });

    return NextResponse.json(updatedVlan, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update VLAN:', error);
    return NextResponse.json(
      { error: 'Unable to update VLAN.' },
      { status: 500 }
    );
  }
}
