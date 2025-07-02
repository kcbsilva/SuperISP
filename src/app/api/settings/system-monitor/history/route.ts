// src/app/api/settings/system-monitor/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';

export async function GET(req: NextRequest) {
  const url = new URL(req.url || '');
  const interval = url.searchParams.get('interval') || '1min';

  // Simulate 30 data points
  const data = Array.from({ length: 30 }, (_, i) => {
    const timeLabel = `${i}${interval === '1sec' ? 's' : 'm'}`; // label based on interval
    const load = os.loadavg()[0];
    const cores = os.cpus().length;
    const cpu = Math.min(Math.round((load / cores) * 100 + Math.random() * 10), 100);
    const ram = Math.min(
      Math.round(
        ((os.totalmem() - os.freemem()) / os.totalmem()) * 100 + Math.random() * 10
      ),
      100
    );

    return { time: timeLabel, cpu, ram };
  });

  return NextResponse.json(data);
}
