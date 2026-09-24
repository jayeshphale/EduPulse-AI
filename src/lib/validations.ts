import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().default('Computer Science'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  published: z.boolean().default(false),
  coverImage: z.string().optional(),
});

export const moduleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2, 'Module title is required'),
  description: z.string().optional(),
  order: z.number().int().min(1).default(1),
});

export const lessonSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().min(2, 'Lesson title is required'),
  content: z.string().min(5, 'Content is required'),
  type: z.enum(['TEXT', 'VIDEO', 'QUIZ', 'AI_PRACTICE']).default('TEXT'),
  duration: z.number().int().min(1).default(10),
  order: z.number().int().min(1).default(1),
});

export const quizSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().min(3, 'Quiz title is required'),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).default(70),
});

export const questionSchema = z.object({
  quizId: z.string().uuid(),
  text: z.string().min(5, 'Question text is required'),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required'),
  correctAnswer: z.string().min(1, 'Correct answer required'),
  explanation: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  bloomTaxonomy: z.string().default('Understand'),
});

export const quizSubmissionSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.array(z.string()),
});

export const generateQuizAISchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  numQuestions: z.number().min(1).max(10).default(3),
  targetAudience: z.string().optional(),
});

export const generateLessonAISchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  keyConcepts: z.string().optional(),
});
