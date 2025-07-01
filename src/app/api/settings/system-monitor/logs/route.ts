import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get('source') || 'syslog';

  try {
    if (source === 'postgres') {
      const pgPath = '/var/log/postgresql/postgresql-15-main.log';
      if (existsSync(pgPath)) {
        const content = readFileSync(pgPath, 'utf-8').split('\n').slice(-50).join('\n');
        return NextResponse.json({ logs: content });
      }
    }

    if (source === 'journalctl') {
      const output = execSync('journalctl -n 50 --no-pager').toString();
      return NextResponse.json({ logs: output });
    }

    // Default: syslog
    const syslogPath = '/var/log/syslog';
    if (existsSync(syslogPath)) {
      const logs = readFileSync(syslogPath, 'utf-8').split('\n').slice(-50).join('\n');
      return NextResponse.json({ logs });
    }

    return NextResponse.json({ logs: 'No logs available.' });
  } catch (error) {
    console.error('[LOGS_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load logs.' }, { status: 500 });
  }
}
