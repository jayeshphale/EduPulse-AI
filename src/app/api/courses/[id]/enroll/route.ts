import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to enroll' }, { status: 401 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const existing = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Already enrolled', enrollment: existing });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        progress: 0,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'COURSE_ENROLLED',
        details: `Student ${user.name} enrolled in course: ${course.title}`,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}
