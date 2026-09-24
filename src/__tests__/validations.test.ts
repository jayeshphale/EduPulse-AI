import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  courseSchema,
  generateQuizAISchema,
  quizSubmissionSchema,
} from '../lib/validations';

describe('Zod Validations Test Suite', () => {
  it('should validate registration input correctly', () => {
    const valid = registerSchema.safeParse({
      name: 'Jayesh Phale',
      email: 'jayesh@edupulse.ai',
      password: 'securepassword123',
      role: 'INSTRUCTOR',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = registerSchema.safeParse({
      name: 'Jayesh',
      email: 'invalid-email',
      password: '123',
    });
    expect(invalidEmail.success).toBe(false);
  });

  it('should validate login schema', () => {
    const result = loginSchema.safeParse({
      email: 'instructor@edupulse.ai',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should validate course schema defaults', () => {
    const courseData = courseSchema.safeParse({
      title: 'Next.js 16 Masterclass',
      description: 'Comprehensive guide to modern server rendering and Turbopack.',
    });
    expect(courseData.success).toBe(true);
    if (courseData.success) {
      expect(courseData.data.category).toBe('Computer Science');
      expect(courseData.data.level).toBe('BEGINNER');
    }
  });

  it('should validate AI Quiz Generation parameters', () => {
    const aiParams = generateQuizAISchema.safeParse({
      topic: 'React Server Components',
      difficulty: 'INTERMEDIATE',
      numQuestions: 3,
    });
    expect(aiParams.success).toBe(true);
  });

  it('should validate Quiz Submissions', () => {
    const submission = quizSubmissionSchema.safeParse({
      quizId: '123e4567-e89b-12d3-a456-426614174000',
      answers: ['Option A', 'Option B'],
    });
    expect(submission.success).toBe(true);
  });
});
