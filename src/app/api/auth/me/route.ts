import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { seedDatabase } from '@/lib/seedData';

export async function GET() {
  try {
    await seedDatabase();
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
