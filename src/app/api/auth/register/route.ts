import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { seedDatabase } from '@/lib/seedData';

import { Role, UserPayload } from '@/types';

export async function POST(req: Request) {
  try {
    await seedDatabase();

    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, role } = validated.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      },
    });

    const payload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      avatar: user.avatar,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        details: `New ${user.role} registered: ${user.email}`,
      },
    });

    return NextResponse.json({ success: true, user: payload });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
