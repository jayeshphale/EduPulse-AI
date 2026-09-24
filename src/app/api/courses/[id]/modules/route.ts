import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, order, lessons } = body;

    if (!title) {
      return NextResponse.json({ error: 'Module title is required' }, { status: 400 });
    }

    const moduleRecord = await db.module.create({
      data: {
        courseId,
        title,
        description,
        order: order || 1,
      },
    });

    if (Array.isArray(lessons) && lessons.length > 0) {
      for (let i = 0; i < lessons.length; i++) {
        const les = lessons[i];
        await db.lesson.create({
          data: {
            moduleId: moduleRecord.id,
            title: les.title || `Lesson ${i + 1}`,
            content: les.content || 'Content coming soon.',
            type: les.type || 'TEXT',
            duration: les.duration || 10,
            order: i + 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, module: moduleRecord });
  } catch (error) {
    console.error('Create module error:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}
