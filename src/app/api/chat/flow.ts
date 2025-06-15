// src/app/api/chat/flow.ts
import { NextRequest, NextResponse } from 'next/server';
// Intentionally removing fs and path imports for this test version of GET
// import fs from 'node:fs/promises';
// import path from 'path';

// const flowFilePath = path.resolve(process.cwd(), 'src', 'app', 'admin', 'messenger', 'flow', 'default.json');

const DUMMY_FLOW_DATA = {
  "start": {
    "message": "This is a dummy flow from the API route (debug mode).",
    "options": [
      { "keyword": "1", "next": "next_step" }
    ]
  },
  "next_step": {
    "message": "This is the next dummy step.",
    "options": []
  }
};

export async function GET(req: NextRequest) {
  try {
    // Simulate a slight delay if needed
    // await new Promise(resolve => setTimeout(resolve, 100));
    console.log("/api/chat/flow GET hit, returning dummy data for debugging.");
    return NextResponse.json(DUMMY_FLOW_DATA);
  } catch (error: any) {
    console.error("Error in /api/chat/flow GET (dummy data mode):", error);
    // Ensure a JSON response even for errors if NextResponse.json is expected by client
    return NextResponse.json({ message: "Error processing dummy flow data.", error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // req.json() internally uses JSON.parse for the request body
    console.log("/api/chat/flow POST hit with body (dummy endpoint):", body);
    // In a real scenario, you'd save 'body' to your data store (e.g., default.json or database)
    // For now, we just acknowledge it. The original fs.writeFile is commented out.
    // const fs = require('node:fs/promises');
    // const path = require('path');
    // const flowFilePath = path.resolve(process.cwd(), 'src', 'app', 'admin', 'messenger', 'flow', 'default.json');
    // await fs.writeFile(flowFilePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ message: 'Flow update acknowledged by dummy endpoint. Data not saved.' });
  } catch (error: any) {
    console.error("Error in /api/chat/flow POST (dummy endpoint):", error);
    return NextResponse.json({ message: "Error updating flow (dummy endpoint).", error: error.message }, { status: 500 });
  }
}
