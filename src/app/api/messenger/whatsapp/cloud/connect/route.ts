//src/app/api/messenger/whatsapp/cloud/connect/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFile = path.resolve('./whatsapp-config.json');

export async function POST(req: NextRequest) {
  const { token, phoneNumberId } = await req.json();

  if (!token || !phoneNumberId) {
    return NextResponse.json({ error: 'Missing token or phoneNumberId' }, { status: 400 });
  }

  const data = { token, phoneNumberId };

  fs.writeFileSync(configFile, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true, message: 'Connected successfully', data });
}

export async function GET() {
  try {
    const config = fs.readFileSync(configFile, 'utf-8');
    return NextResponse.json(JSON.parse(config));
  } catch {
    return NextResponse.json({ connected: false });
  }
}
