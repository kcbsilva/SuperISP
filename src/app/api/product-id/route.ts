import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const filePath = join(process.cwd(), 'product-id.txt');

export async function GET() {
  try {
    let id: string;
    try {
      id = (await fs.readFile(filePath, 'utf8')).trim();
    } catch {
      id = randomUUID();
      await fs.writeFile(filePath, id, 'utf8');
    }
    return NextResponse.json({ productId: id });
  } catch (e) {
    console.error('Failed to load product ID:', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

