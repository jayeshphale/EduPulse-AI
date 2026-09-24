import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { quizSubmissionSchema } from '@/lib/validations';
import { evaluateSubmissionAI } from '@/lib/ai';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to submit quiz' }, { status: 401 });
    }

    const body = await req.json();
    const validated = quizSubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    const { answers } = validated.data;

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: {
          include: {
            module: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = quiz.questions;
    if (questions.length === 0) {
      return NextResponse.json({ error: 'Quiz has no questions configured' }, { status: 400 });
    }

    let correctCount = 0;
    const questionSummary = questions.map((q, idx) => {
      const userAns = answers[idx] || '';
      const isCorrect = userAns.trim() === q.correctAnswer.trim();
      if (isCorrect) correctCount++;
      return {
        text: q.text,
        correctAnswer: q.correctAnswer,
        bloomTaxonomy: q.bloomTaxonomy,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Trigger AI detailed evaluation report
    const aiFeedback = await evaluateSubmissionAI(
      quiz.title,
      questionSummary,
      answers,
      score
    );

    const submission = await db.submission.create({
      data: {
        userId: user.id,
        quizId,
        score,
        passed,
        answersJson: JSON.stringify(answers),
        aiFeedback,
      },
    });

    // Update student progress in course enrollment
    const courseId = quiz.lesson.module.courseId;
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (enrollment) {
      const newProgress = Math.min(100, Math.max(enrollment.progress, passed ? enrollment.progress + 25 : enrollment.progress + 10));
      await db.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: newProgress,
          completed: newProgress >= 100,
          lastAccessedAt: new Date(),
        },
      });
    }

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'QUIZ_SUBMITTED',
        details: `Submitted quiz "${quiz.title}" with score ${score}% (${passed ? 'PASSED' : 'FAILED'})`,
      },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        score,
        passed,
        passingScore: quiz.passingScore,
        aiFeedback,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json({ error: 'Failed to evaluate quiz submission' }, { status: 500 });
  }
}
