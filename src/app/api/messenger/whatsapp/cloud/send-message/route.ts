//src/app/api/messenger/whatsapp/cloud/send-message/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const configFile = path.resolve('./whatsapp-config.json');

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  if (!to || !message) {
    return NextResponse.json({ error: 'Missing "to" or "message"' }, { status: 400 });
  }

  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const { token, phoneNumberId } = config;

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true, response: response.data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
