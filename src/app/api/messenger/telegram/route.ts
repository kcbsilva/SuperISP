import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.message) {
    const chatId = body.message.chat.id;
    const receivedText = body.message.text;

    // Simple reply
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${receivedText}`,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return NextResponse.json({ status: 'ok' });
}

export async function GET() {
  return NextResponse.json({ status: 'online' });
}
