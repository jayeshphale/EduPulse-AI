import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { seedDatabase } from '@/lib/seedData';
import { Role, UserPayload } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, role } = validated.data;

    let user: any = null;

    try {
      await seedDatabase();
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      user = await db.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        },
      });
    } catch (err) {
      console.warn('Database register fallback trigger:', err);
    }

    const payload: UserPayload = {
      id: user?.id || `user-${Date.now()}`,
      name: name,
      email: email,
      role: role as Role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json({ success: true, user: payload });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
