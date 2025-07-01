// src/app/api/settings/system-monitor/services/restart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

const allowedServices = {
  cron: 'cron',
  ntp: 'ntp',
  freeradius: 'freeradius',
  nginx: 'nginx',
  postgresql: 'postgresql',
  strongswan: 'strongswan',
  sshd: 'sshd',
  prolter: 'prolter',
} as const;

type AllowedService = keyof typeof allowedServices;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = body?.service as string;

    if (!service || !(service in allowedServices)) {
      return NextResponse.json(
        { error: 'Invalid or unauthorized service.' },
        { status: 400 }
      );
    }

    const systemdName = allowedServices[service as AllowedService];

    execSync(`sudo systemctl restart ${systemdName}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[RESTART_SERVICE_ERROR]`, error);
    return NextResponse.json(
      { error: 'Failed to restart service.' },
      { status: 500 }
    );
  }
}
