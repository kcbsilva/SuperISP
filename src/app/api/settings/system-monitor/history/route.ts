// src/app/api/settings/system-monitor/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';

const memory = {
  data: [] as { time: string; cpu: number; ram: number }[],
  maxLength: 500,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const interval = searchParams.get('interval') || '1min';

    const load = os.loadavg()[0];
    const cores = os.cpus().length;
    const cpuUsage = Math.min(Math.round((load / cores) * 100), 100);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsage = Math.round((usedMem / totalMem) * 100);

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    memory.data.push({ time: timeLabel, cpu: cpuUsage, ram: ramUsage });
    if (memory.data.length > memory.maxLength) memory.data.shift();

    let result: typeof memory.data = [];

    switch (interval) {
      case '1sec':
        result = memory.data.slice(-10);
        break;
      case '1min':
        result = memory.data.slice(-60);
        break;
      case '5min':
        result = memory.data.slice(-300);
        break;
      case '30min':
        result = memory.data.slice(-1800);
        break;
      case '1h':
        result = memory.data.slice(-3600);
        break;
      case '1d':
        result = memory.data.slice(-86400);
        break;
      default:
        result = memory.data.slice(-60);
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[SYSTEM_MONITOR_HISTORY_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch system monitor history.' }, { status: 500 });
  }
}
