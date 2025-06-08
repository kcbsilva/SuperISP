// src/app/api/chat/flow.ts
// Note: In a real app, ensure this path is correct and writable by the server process.
// For Vercel, serverless functions usually can't write to the filesystem this way.
// You'd use a database or external storage.

import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises'; // Using fs.promises for async operations
import path from 'path';

// Determine the path to the flow file.
// __dirname is not available in ESM modules by default with Next.js app router.
// process.cwd() gives the root of your project.
const flowFilePath = path.resolve(process.cwd(), 'src', 'app', 'admin', 'messenger', 'flow', 'default.json');

export async function GET(req: NextRequest) {
  try {
    const content = await fs.readFile(flowFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error("Error reading flow file:", error);
    // If file not found, return a default empty flow or a specific error
    if (error.code === 'ENOENT') {
        // Optionally, create a default empty file if it doesn't exist
        // await fs.writeFile(flowFilePath, JSON.stringify({}, null, 2));
        // return NextResponse.json({}); 
      return NextResponse.json({ message: "Flow configuration file not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Error reading flow configuration.", error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await fs.writeFile(flowFilePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ message: 'Flow updated successfully' });
  } catch (error: any) {
    console.error("Error writing flow file:", error);
    return NextResponse.json({ message: "Error updating flow configuration.", error: error.message }, { status: 500 });
  }
}
