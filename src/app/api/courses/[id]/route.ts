import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await db.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Fetch course error:', error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const course = await db.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this course.' }, { status: 403 });
    }

    const body = await req.json();
    const validated = courseSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const updated = await db.course.update({
      where: { id },
      data: validated.data as any,
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'COURSE_UPDATED',
        details: `Updated course: ${updated.title}`,
      },
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const course = await db.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && course.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this course.' }, { status: 403 });
    }

    await db.course.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'COURSE_DELETED',
        details: `Deleted course ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
