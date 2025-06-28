// src/app/api/settings/network/vpn/generate/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  writeServerVpnConfigToDisk,
  generateIpsecConf,
  generateIpsecSecrets
} from '@/lib/generateStrongSwanConfig';

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await query(`SELECT * FROM vpn_users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'VPN user not found' }, { status: 404 });
    }

    const vpn = result.rows[0];

    const options = {
      leftId: '@vpn.prolter.local',
      leftSubnet: '192.168.250.1/24',
      writeToDisk: true,
    };

    writeServerVpnConfigToDisk(vpn, options);

    return NextResponse.json({ message: 'VPN config written to /etc' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}
