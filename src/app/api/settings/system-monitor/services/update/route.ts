// src/app/api/settings/system-monitor/services/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

const updateScripts = {
  ubuntu: `sudo apt-get update && sudo apt-get upgrade -y`,
  prolter: `cd /opt/Prolter && sudo systemctl stop prolter && git pull && npm run build && sudo systemctl start prolter`,
} as const;

type UpdatableService = keyof typeof updateScripts;

function isUpdatableService(service: any): service is UpdatableService {
  return Object.keys(updateScripts).includes(service);
}

export async function POST(req: NextRequest) {
  try {
    const { service } = await req.json();

    if (!isUpdatableService(service)) {
      return NextResponse.json({ error: 'Invalid update target' }, { status: 400 });
    }

    const command = updateScripts[service];
    console.log(`[UPDATE] Running command for ${service}: ${command}`);

    const output = execSync(command, {
      encoding: 'utf-8',
      timeout: 300_000, // 5 minutes
    });

    return NextResponse.json({ success: true, output });
  } catch (error: any) {
    console.error('[UPDATE_SERVICE_ERROR]', error);
    return NextResponse.json(
      { error: 'Update failed', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
