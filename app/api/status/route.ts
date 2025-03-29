import { NextResponse } from 'next/server';

export async function GET() {
  // Return a simple response with the current server time
  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    message: 'BrewLend API is running'
  });
} 