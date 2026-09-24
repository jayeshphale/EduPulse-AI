import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { quizSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ['INSTRUCTOR', 'ADMIN'])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const validated = quizSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { lessonId, title, description, passingScore } = validated.data;
    const { questions } = body;

    const quiz = await db.quiz.create({
      data: {
        lessonId,
        title,
        description,
        passingScore,
      },
    });

    if (Array.isArray(questions) && questions.length > 0) {
      for (const q of questions) {
        await db.question.create({
          data: {
            quizId: quiz.id,
            text: q.text,
            optionsJson: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            difficulty: q.difficulty || 'INTERMEDIATE',
            bloomTaxonomy: q.bloomTaxonomy || 'Understand',
          },
        });
      }
    }

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
