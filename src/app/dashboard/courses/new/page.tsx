'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIQuizGeneratorModal from '@/components/ai/AIQuizGeneratorModal';
import { Sparkles, Plus, BookOpen, Layers, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GeneratedQuestion } from '@/lib/ai';

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fullstack Engineering');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [published, setPublished] = useState(true);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80');

  // Module creation state
  const [moduleTitle, setModuleTitle] = useState('Module 1: Foundations & Architecture');
  const [lessonTitle, setLessonTitle] = useState('Lesson 1: Core Mechanics & Practice');
  const [lessonContent, setLessonContent] = useState('# Interactive Lesson\n\nWelcome to this course module. Read the markdown guides and take the quiz below!');

  const [aiQuestions, setAiQuestions] = useState<GeneratedQuestion[]>([]);
  const [isAIQuizOpen, setIsAIQuizOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Course
      const courseRes = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          level,
          published,
          coverImage,
        }),
      });

      const courseData = await courseRes.json();
      if (!courseData.success) {
        setError(courseData.error || 'Failed to create course');
        setLoading(false);
        return;
      }

      const courseId = courseData.course.id;

      // 2. Create Initial Module & Lesson
      const modRes = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: moduleTitle,
          lessons: [
            {
              title: lessonTitle,
              content: lessonContent,
              type: 'TEXT',
              duration: 15,
            },
          ],
        }),
      });

      const modData = await modRes.json();

      // 3. If AI Questions were generated, attach Quiz
      if (modData.success && modData.module && aiQuestions.length > 0) {
        const lessonId = modData.module.lessons?.[0]?.id;
        if (lessonId) {
          await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId,
              title: `${title} AI Assessment`,
              description: 'AI Generated Bloom Taxonomy Evaluation Quiz',
              passingScore: 70,
              questions: aiQuestions,
            }),
          });
        }
      }

      router.push(`/courses/${courseId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Connection error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Create New Course <BookOpen className="w-7 h-7 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author interactive curriculum, configure modules, and integrate Gemini AI quizzes.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Metadata */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
              1. Course Overview & Metadata
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js 16 Server Components Masterclass"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive breakdown of server rendering, Prisma database integration, and AI SDK..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fullstack Engineering">Fullstack Engineering</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Module & Initial Lesson */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">
              2. First Module & Lesson Setup
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Module Title</label>
              <input
                type="text"
                required
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Lesson Title</label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Lesson Content (Markdown Supported)</label>
              <textarea
                rows={5}
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* AI Quiz Attach */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" /> 3. Attach Gemini AI Quiz
                </h3>
                <p className="text-xs text-slate-400">
                  {aiQuestions.length > 0
                    ? `Attached ${aiQuestions.length} AI generated questions.`
                    : 'Optionally generate AI questions for this lesson.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAIQuizOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4" /> {aiQuestions.length > 0 ? 'Edit AI Quiz' : 'Generate AI Quiz'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-sm text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Creating Course & Seeding Modules...' : <><Plus className="w-4 h-4" /> Publish Course to Catalog</>}
          </button>
        </form>
      </main>

      <AIQuizGeneratorModal
        isOpen={isAIQuizOpen}
        onClose={() => setIsAIQuizOpen(false)}
        onQuestionsGenerated={(qs) => setAiQuestions(qs)}
      />

      <Footer />
    </div>
  );
}
