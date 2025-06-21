// src/app/api/chat/flow.ts
import { NextRequest, NextResponse } from 'next/server';
// Intentionally removing fs and path imports for this test version of GET
// import fs from 'node:fs/promises';
// import path from 'path';

// const flowFilePath = path.resolve(process.cwd(), 'src', 'app', 'admin', 'messenger', 'flow', 'default.json');

export async function GET(req: NextRequest) {
  console.warn('/api/chat/flow GET called - not implemented');
  return NextResponse.json({ message: 'Flow retrieval not implemented' }, { status: 501 });
}

export async function POST(req: NextRequest) {
  console.warn('/api/chat/flow POST called - not implemented');
  return NextResponse.json({ message: 'Flow update not implemented' }, { status: 501 });
}
