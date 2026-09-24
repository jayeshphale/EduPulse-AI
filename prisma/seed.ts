import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Prisma Seed...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const existingCount = await prisma.user.count();
  if (existingCount > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  // Instructor
  const instructor = await prisma.user.create({
    data: {
      name: 'Dr. Alistair Vance',
      email: 'instructor@edupulse.ai',
      passwordHash,
      role: 'INSTRUCTOR',
      bio: 'Senior AI & Fullstack Educator with 12+ years of university and industry experience.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Student
  const student = await prisma.user.create({
    data: {
      name: 'Maya Lin',
      email: 'student@edupulse.ai',
      passwordHash,
      role: 'STUDENT',
      bio: 'Passionate developer focusing on Next.js 16 and AI application engineering.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@edupulse.ai',
      passwordHash,
      role: 'ADMIN',
      bio: 'EduPulse Platform Manager & Curriculum Auditor.',
    },
  });

  // Course 1
  const course1 = await prisma.course.create({
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

  const module1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: App Router Fundamentals & Server Components',
      description: 'Understanding React Server Components (RSC) vs Client Components in Next.js 16.',
      order: 1,
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'React Server Components Architecture',
      content: `# React Server Components (RSC) in Next.js 16\n\nReact Server Components allow web applications to achieve zero-bundle-size React components rendered exclusively on the server.\n\n### Key Benefits:\n- **Zero Client JavaScript**: Code executed on the server doesn't inflate your JS bundle.\n- **Direct Backend Access**: Query databases directly using Prisma or SQL inside your component.\n- **Enhanced Security**: Keep secret keys, database credentials, and internal APIs strictly server-side.\n\n\`\`\`tsx\n// Example Server Component\nimport { db } from '@/lib/db';\n\nexport default async function CourseList() {\n  const courses = await db.course.findMany();\n  return (\n    <ul>\n      {courses.map(c => <li key={c.id}>{c.title}</li>)}\n    </ul>\n  );\n}\n\`\`\`\n`,
      type: 'TEXT',
      duration: 15,
      order: 1,
    },
  });

  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      title: 'Check Your Knowledge: Server Components & Hydration',
      description: 'Test your understanding of RSC data flow and security boundaries.',
      passingScore: 75,
    },
  });

  await prisma.question.createMany({
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

  // Course 2
  const course2 = await prisma.course.create({
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

  const module2 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Module 1: Generative Assessment & Structured AI Outputs',
      description: 'Enforcing JSON schemas and rubric guidelines when calling LLM endpoints.',
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      moduleId: module2.id,
      title: 'Structuring AI Responses for Automated Grading',
      content: `# Automated AI Evaluation Systems\n\nWhen designing AI assessment engines, structured JSON response formats ensure reliable, deterministic parsing into user dashboards.\n\n### Steps:\n1. Define clear Zod / JSON schemas.\n2. Supply educational rubrics (Bloom's Taxonomy).\n3. Provide actionable student feedback with remedial pointers.\n`,
      type: 'AI_PRACTICE',
      duration: 20,
      order: 1,
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      lessonId: lesson2.id,
      title: 'Evaluation Engine & Prompting Mechanics',
      passingScore: 80,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz2.id,
        text: 'What is the primary benefit of enforcing JSON output schemas when generating AI quizzes?',
        optionsJson: JSON.stringify([
          'It reduces server power consumption.',
          'It guarantees predictable structured data parsing without brittle regex matching.',
          'It bypasses LLM token limits.',
          'It encrypts user data automatically.'
        ]),
        correctAnswer: 'It guarantees predictable structured data parsing without brittle regex matching.',
        explanation: 'Structured schema outputs prevent LLM hallucination in format structure.',
        difficulty: 'ADVANCED',
        bloomTaxonomy: 'Analyze',
      }
    ]
  });

  // Enroll Student in Course 1 and 2
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 50,
      completed: false,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      progress: 20,
      completed: false,
    },
  });

  // Submission for Student on Quiz 1
  await prisma.submission.create({
    data: {
      userId: student.id,
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
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      details: 'EduPulse AI database seeded with demo users, courses, quizzes, and initial student progress.',
    },
  });

  console.log('Prisma Seed Finished Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
