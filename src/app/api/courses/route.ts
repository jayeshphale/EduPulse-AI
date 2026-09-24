import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';
import { seedDatabase } from '@/lib/seedData';

export async function GET(req: Request) {
  try {
    await seedDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (level) whereClause.level = level;
    if (publishedOnly) whereClause.published = true;
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const courses = await db.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await seedDatabase();

    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Unauthorized. Instructor role required.' }, { status: 403 });
    }

    const body = await req.json();
    const validated = courseSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { title, description, category, level, published, coverImage } = validated.data;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const course = await db.course.create({
      data: {
        title,
        slug,
        description,
        category,
        level: level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        published,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        instructorId: user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'COURSE_CREATED',
        details: `Instructor ${user.name} created course: ${course.title}`,
      },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
