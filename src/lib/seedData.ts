import { db } from './db';
import { hashPassword } from './auth';

export async function seedDatabase() {
  // Check if users already exist
  const existingUsersCount = await db.user.count();
  if (existingUsersCount > 0) {
    console.log('Database already seeded.');
    return;
  }

  console.log('Seeding initial EduPulse AI database...');

  const passwordHash = await hashPassword('password123');

  // Create Users
  const instructor = await db.user.create({
    data: {
      name: 'Dr. Alistair Vance',
      email: 'instructor@edupulse.ai',
      passwordHash,
      role: 'INSTRUCTOR',
      bio: 'Senior AI & Fullstack Educator with 12+ years of university and industry experience.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const student1 = await db.user.create({
    data: {
      name: 'Maya Lin',
      email: 'student@edupulse.ai',
      passwordHash,
      role: 'STUDENT',
      bio: 'Passionate developer focusing on Next.js 16 and AI application engineering.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const admin = await db.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@edupulse.ai',
      passwordHash,
      role: 'ADMIN',
      bio: 'EduPulse Platform Manager & Curriculum Auditor.',
    },
  });

  // Course 1: Next.js 16 Masterclass & Server Architecture
  const course1 = await db.course.create({
    data: {
      title: 'Next.js 16 App Router & Fullstack Architecture',
      slug: 'nextjs-16-fullstack-architecture',
      description: 'Master modern server-rendered React applications, Turbopack, Server Actions, streaming SSR, and Prisma integration.',
      category: 'Fullstack Engineering',
      level: 'INTERMEDIATE',
      published: true,
      instructorId: instructor.id,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    },
  });

  // Module 1.1: Core Concepts
  const module1 = await db.module.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: App Router Fundamentals & Server Components',
      description: 'Understanding React Server Components (RSC) vs Client Components in Next.js 16.',
      order: 1,
    },
  });

  const lesson1 = await db.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'React Server Components Architecture',
      content: `# React Server Components (RSC) in Next.js 16

React Server Components allow web applications to achieve zero-bundle-size React components rendered exclusively on the server.

### Key Benefits:
- **Zero Client JavaScript**: Code executed on the server doesn't inflate your JS bundle.
- **Direct Backend Access**: Query databases directly using Prisma or SQL inside your component.
- **Enhanced Security**: Keep secret keys, database credentials, and internal APIs strictly server-side.

\`\`\`tsx
// Example Server Component
import { db } from '@/lib/db';

export default async function CourseList() {
  const courses = await db.course.findMany();
  return (
    <ul>
      {courses.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  );
}
\`\`\`
`,
      type: 'TEXT',
      duration: 15,
      order: 1,
    },
  });

  const quiz1 = await db.quiz.create({
    data: {
      lessonId: lesson1.id,
      title: 'Check Your Knowledge: Server Components & Hydration',
      description: 'Test your understanding of RSC data flow and security boundaries.',
      passingScore: 75,
    },
  });

  await db.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        text: 'Which of the following is true about React Server Components in Next.js 16?',
        optionsJson: JSON.stringify([
          'They execute on the client browser and increase JavaScript bundle size.',
          'They run exclusively on the server, resulting in zero client-side bundle impact.',
          'They cannot query databases directly.',
          'They replace HTML tags with custom browser binaries.'
        ]),
        correctAnswer: 'They run exclusively on the server, resulting in zero client-side bundle impact.',
        explanation: 'Server components execute on the server during rendering and do not ship component logic to the client JS bundle.',
        difficulty: 'INTERMEDIATE',
        bloomTaxonomy: 'Understand',
      },
      {
        quizId: quiz1.id,
        text: 'What happens when you add "use client" directive at the top of a file?',
        optionsJson: JSON.stringify([
          'It converts the file to a pure database migration script.',
          'It marks the component and its imported dependencies for client-side interactivity.',
          'It disables JavaScript in the user browser.',
          'It runs only during deployment build time.'
        ]),
        correctAnswer: 'It marks the component and its imported dependencies for client-side interactivity.',
        explanation: 'The "use client" boundary designates an interactive module that gets hydrated on the browser.',
        difficulty: 'BEGINNER',
        bloomTaxonomy: 'Apply',
      }
    ],
  });

  // Course 2: AI Engineering & Gemini SDK Integration
  const course2 = await db.course.create({
    data: {
      title: 'Applied AI Engineering: AI-SDK & Gemini Systems',
      slug: 'applied-ai-engineering-gemini',
      description: 'Build real-world intelligent features including dynamic text generation, automated Bloom taxonomy grading, and adaptive lesson co-pilots.',
      category: 'Artificial Intelligence',
      level: 'ADVANCED',
      published: true,
      instructorId: instructor.id,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    },
  });

  const module2 = await db.module.create({
    data: {
      courseId: course2.id,
      title: 'Module 1: Generative Assessment & Structured AI Outputs',
      description: 'Enforcing JSON schemas and rubric guidelines when calling LLM endpoints.',
      order: 1,
    },
  });

  const lesson2 = await db.lesson.create({
    data: {
      moduleId: module2.id,
      title: 'Structuring AI Responses for Automated Grading',
      content: `# Automated AI Evaluation Systems

When designing AI assessment engines, structured JSON response formats ensure reliable, deterministic parsing into user dashboards.

### Steps:
1. Define clear Zod / JSON schemas.
2. Supply educational rubrics (Bloom's Taxonomy).
3. Provide actionable student feedback with remedial pointers.
`,
      type: 'AI_PRACTICE',
      duration: 20,
      order: 1,
    },
  });

  const quiz2 = await db.quiz.create({
    data: {
      lessonId: lesson2.id,
      title: 'Evaluation Engine & Prompting Mechanics',
      passingScore: 80,
    },
  });

  await db.question.createMany({
    data: [
      {
        quizId: quiz2.id,
        text: 'What is the primary benefit of enforcing JSON output schemas when generating AI quizzes?',
        optionsJson: JSON.stringify([
          'It reduces server power consumption.',
          'It guarantees predictable structured data parsing without brittle regex regex matching.',
          'It bypasses LLM token limits.',
          'It encrypts user data automatically.'
        ]),
        correctAnswer: 'It guarantees predictable structured data parsing without brittle regex regex matching.',
        explanation: 'Structured schema outputs prevent LLM hallucination in format structure.',
        difficulty: 'ADVANCED',
        bloomTaxonomy: 'Analyze',
      }
    ]
  });

  // Enroll Student 1 in Course 1 and 2
  await db.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      progress: 50,
      completed: false,
    },
  });

  await db.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
      progress: 20,
      completed: false,
    },
  });

  // Create a sample submission for student1 on quiz1
  await db.submission.create({
    data: {
      userId: student1.id,
      quizId: quiz1.id,
      score: 100,
      passed: true,
      answersJson: JSON.stringify([
        'They run exclusively on the server, resulting in zero client-side bundle impact.',
        'It marks the component and its imported dependencies for client-side interactivity.'
      ]),
      aiFeedback: '### Outstanding Performance!\n- **Strengths**: Clear understanding of Server Component bundle optimization and client directive boundaries.\n- **Taxonomy Mastery**: Apply (100%), Understand (100%).\n- **Next Steps**: Proceed to Module 2 to explore Server Actions and Form validation with Zod.',
    },
  });

  // Audit log
  await db.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      details: 'EduPulse AI database seeded with demo users, courses, quizzes, and initial student progress.',
    },
  });

  console.log('EduPulse AI database seed completed successfully!');
}
