import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(request: NextRequest) {
  const log = await request.json();
  fs.appendFileSync('api_server.log', JSON.stringify(log) + '\n');
  return NextResponse.json({ status: 'ok' });
}
