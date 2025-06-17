//src/app/api/messenger/whatsapp/diconnect/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFile = path.resolve('./whatsapp-config.json');

export async function POST() {
  try {
    fs.unlinkSync(configFile);
    return NextResponse.json({ success: true, message: 'Disconnected successfully' });
  } catch {
    return NextResponse.json({ error: 'Already disconnected or file not found' }, { status: 400 });
  }
}
