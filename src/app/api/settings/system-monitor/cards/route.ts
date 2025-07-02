// src/app/api/settings/system-monitor/cards/route.ts
import { NextResponse } from 'next/server';
import os from 'os';
import { execSync } from 'child_process';

export async function GET() {
  try {
    // CPU usage
    const load = os.loadavg()[0];
    const cores = os.cpus().length;
    const cpuUsage = Math.min(Math.round((load / cores) * 100), 100);

    // RAM usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsedGB = parseFloat((usedMem / 1_073_741_824).toFixed(1)); // GB
    const ramTotalGB = parseFloat((totalMem / 1_073_741_824).toFixed(1));

    // Disk usage (assumes root mount `/`)
    const df = execSync('df --output=used,size -BG / | tail -1').toString().trim();
    const [usedStr, sizeStr] = df.split(/\s+/);
    const diskUsed = parseInt(usedStr.replace('G', ''), 10);
    const diskTotal = parseInt(sizeStr.replace('G', ''), 10);

    // PostgreSQL status
    const pgStatus = execSync('pg_isready').toString();
    const postgresConnected = pgStatus.includes('accepting connections');

    const metrics = [
      {
        nameKey: 'cpu_usage',
        value: cpuUsage,
        unit: '%',
        icon: 'Cpu',
        status: 'ok',
        progress: cpuUsage,
      },
      {
        nameKey: 'ram_usage',
        value: ramUsedGB,
        unit: `/${ramTotalGB} GB`,
        icon: 'MemoryStick',
        status: 'ok',
        progress: Math.round((ramUsedGB / ramTotalGB) * 100),
      },
      {
        nameKey: 'disk_usage',
        value: diskUsed,
        unit: `/${diskTotal} GB`,
        icon: 'HardDrive',
        status: 'ok',
        progress: Math.round((diskUsed / diskTotal) * 100),
      },
      {
        nameKey: 'postgres_status',
        value: postgresConnected ? 'Connected' : 'Not Connected',
        icon: 'Database',
        status: postgresConnected ? 'ok' : 'error',
      },
    ];

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[SYSTEM_MONITOR_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to retrieve system metrics.' }, { status: 500 });
  }
}
