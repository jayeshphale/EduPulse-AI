import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import { db } from '@/lib/db';
import { seedDatabase } from '@/lib/seedData';
import { Sparkles, Bot, BookOpen, ShieldCheck, Zap, ArrowRight, CheckCircle2, GraduationCap, Users } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  await seedDatabase();

  const courses = await db.course.findMany({
    where: { published: true },
    take: 3,
    include: {
      instructor: { select: { id: true, name: true, email: true, avatar: true } },
      modules: { include: { lessons: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalCourses = await db.course.count();
  const totalStudents = await db.user.count({ where: { role: 'STUDENT' } });
  const totalQuizzes = await db.quiz.count();

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="glow-spot-1"></div>
      <div className="glow-spot-2"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 pt-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300">
              Next.js 16 + Gemini AI Assessment Architecture
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Learning &{' '}
            <span className="text-gradient-purple">Bloom&apos;s AI Assessment</span> Engine
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Designed for <strong>House of Edtech</strong>. Create multi-module courses, auto-generate taxonomy-aligned quizzes with Gemini AI, run real-time student evaluations, and track skill mastery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" /> Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/ai-studio"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4 text-purple-300" /> Open AI Studio
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
              <span className="block text-2xl font-black text-indigo-400">{totalCourses}</span>
              <span className="text-xs text-slate-400 font-medium">Active Courses</span>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
              <span className="block text-2xl font-black text-purple-400">{totalQuizzes}</span>
              <span className="text-xs text-slate-400 font-medium">AI Quizzes</span>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
              <span className="block text-2xl font-black text-emerald-400">{totalStudents}</span>
              <span className="text-xs text-slate-400 font-medium">Enrolled Learners</span>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border border-white/10">
              <span className="block text-2xl font-black text-amber-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">Bloom&apos;s Coverage</span>
            </div>
          </div>
        </section>

        {/* Core Architecture Feature Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Built Beyond Basic CRUD
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Addressing real-world educational challenges with robust security, role-based workflows, dynamic content creation, and AI co-pilots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Gemini AI Assessment Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate multiple-choice questions categorized by Bloom&apos;s Taxonomy (Remember, Understand, Apply, Analyze, Evaluate).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Role-Based JWT Authorization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular access control enforcing strict privileges between Instructors (Curriculum authors), Students (Learners), and System Admins.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Prisma SQLite & Validation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-config local database layer with Zod request validation, parameterized queries, and real-time audit logging.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Courses Catalog */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Featured Curriculum <BookOpen className="w-5 h-5 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Explore interactive courses ready for student enrollment and assessment.
              </p>
            </div>

            <Link
              href="/courses"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course as any} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
