import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { seedDatabase } from '@/lib/seedData';
import { Role, UserPayload } from '@/types';

export async function POST(req: Request) {
  try {
    // Ensure database has demo data initialized
    await seedDatabase();

    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const { email, password } = validated.data;
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      avatar: user.avatar,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        details: `User ${user.email} (${user.role}) logged in successfully.`,
      },
    });

    return NextResponse.json({ success: true, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
