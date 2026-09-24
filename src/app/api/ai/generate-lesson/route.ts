import { NextResponse } from 'next/server';
import { generateAILesson } from '@/lib/ai';
import { generateLessonAISchema } from '@/lib/validations';
import { getCurrentUser, hasRole } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Instructor role required' }, { status: 403 });
    }

    const body = await req.json();
    const validated = generateLessonAISchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { topic, level, keyConcepts } = validated.data;
    const lesson = await generateAILesson(topic, level, keyConcepts);

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    console.error('AI lesson generation error:', error);
    return NextResponse.json({ error: 'Failed to generate AI lesson' }, { status: 500 });
  }
}
