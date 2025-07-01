// src/app/api/settings/system-monitor/services/route.ts
import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

const monitoredServices = [
  { id: 'ubuntu', nameKey: 'service_ubuntu', systemd: null }, // Ubuntu itself
  { id: 'cron', nameKey: 'service_cron', systemd: 'cron' },
  { id: 'ntp', nameKey: 'service_ntp', systemd: 'ntp' },
  { id: 'freeradius', nameKey: 'service_freeradius', systemd: 'freeradius' },
  { id: 'nginx', nameKey: 'service_nginx', systemd: 'nginx' },
  { id: 'nodejs', nameKey: 'service_nodejs', systemd: null },
  { id: 'postgresql', nameKey: 'service_postgresql', systemd: 'postgresql' },
  { id: 'strongswan', nameKey: 'service_strongswan', systemd: 'strongswan' },
  { id: 'sshd', nameKey: 'service_sshd', systemd: 'sshd' },
  { id: 'prolter', nameKey: 'service_prolter', systemd: 'prolter' },
];

export async function GET() {
  try {
    const results = monitoredServices.map((svc) => {
      try {
        let isActive = false;

        if (svc.systemd) {
          const output = execSync(`systemctl is-active ${svc.systemd}`).toString().trim();
          isActive = output === 'active';
        } else {
          const psOutput = execSync(`ps aux | grep ${svc.id} | grep -v grep`).toString();
          isActive = psOutput.length > 0;
        }

        return {
          id: svc.id,
          nameKey: svc.nameKey,
          status: isActive ? 'Active' : 'Inactive',
        };
      } catch {
        return {
          id: svc.id,
          nameKey: svc.nameKey,
          status: 'Inactive',
        };
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('[SERVICES_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch service statuses' }, { status: 500 });
  }
}
