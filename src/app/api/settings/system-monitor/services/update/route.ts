// src/app/api/settings/system-monitor/services/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

const updateScripts = {
  ubuntu: `sudo /usr/bin/apt-get update && sudo /usr/bin/apt-get upgrade -y`,
  prolter: `cd /opt/Prolter && sudo /bin/systemctl stop prolter && sudo /usr/bin/git pull && /usr/bin/npm run build && sudo /bin/systemctl start prolter`,
} as const;

type UpdatableService = keyof typeof updateScripts;

export async function POST(req: NextRequest) {
  try {
    const { service } = await req.json();

    // Validate service name
    if (!Object.keys(updateScripts).includes(service)) {
      return NextResponse.json({ error: 'Invalid update target' }, { status: 400 });
    }

    const command = updateScripts[service as UpdatableService];
    console.log('[UPDATE_SERVICE] Running:', command);

    const output = execSync(command, { encoding: 'utf-8' });
    console.log('[UPDATE_SERVICE_OUTPUT]', output);

    return NextResponse.json({ success: true, output });
  } catch (error: any) {
    console.error('[UPDATE_SERVICE_ERROR]', error.message);
    console.error('[STDERR]', error.stderr?.toString());
    console.error('[STDOUT]', error.stdout?.toString());

    return NextResponse.json(
      {
        error: 'Update failed',
        details: error.message || 'Unknown error',
        stderr: error.stderr?.toString() || '',
        stdout: error.stdout?.toString() || '',
      },
      { status: 500 }
    );
  }
}
