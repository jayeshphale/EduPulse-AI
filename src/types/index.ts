export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type LessonType = 'TEXT' | 'VIDEO' | 'QUIZ' | 'AI_PRACTICE';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
}

export interface CourseWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: Difficulty;
  published: boolean;
  coverImage?: string | null;
  instructorId: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  modules?: ModuleWithLessons[];
  _count?: {
    modules: number;
    enrollments: number;
  };
}

export interface ModuleWithLessons {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  createdAt: Date | string;
  lessons: LessonWithQuiz[];
}

export interface LessonWithQuiz {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: LessonType;
  duration: number;
  order: number;
  createdAt: Date | string;
  quizzes?: QuizWithQuestions[];
}

export interface QuizWithQuestions {
  id: string;
  lessonId: string;
  title: string;
  description?: string | null;
  passingScore: number;
  questions: QuestionItem[];
}

export interface QuestionItem {
  id: string;
  quizId: string;
  text: string;
  optionsJson: string; // JSON parsed as string[]
  options?: string[];
  correctAnswer: string;
  explanation?: string | null;
  difficulty: Difficulty;
  bloomTaxonomy: string;
}

export interface SubmissionResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  passed: boolean;
  answers: string[];
  aiFeedback?: string | null;
  submittedAt: Date | string;
  quiz?: {
    title: string;
    passingScore: number;
  };
}

export interface AnalyticsSummary {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  completionRate: number;
  recentActivity: {
    id: string;
    action: string;
    details: string;
    timestamp: string;
  }[];
  skillBreakdown: {
    taxonomy: string;
    masteryScore: number;
  }[];
}
