'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIQuizGeneratorModal from '@/components/ai/AIQuizGeneratorModal';
import { Sparkles, Bot, BookOpen, Layers, Check, RefreshCw } from 'lucide-react';
import { GeneratedLesson } from '@/lib/ai';

export default function AIStudioPage() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [lessonTopic, setLessonTopic] = useState('React Server Components & Turbopack');
  const [lessonLevel, setLessonLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);

  const handleGenerateLesson = async () => {
    setGeneratingLesson(true);
    try {
      const res = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: lessonTopic, level: lessonLevel }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedLesson(data.lesson);
      } else {
        alert(data.error || 'Failed to generate lesson');
      }
    } catch (err) {
      console.error(err);
      alert('Error calling AI endpoint');
    } finally {
      setGeneratingLesson(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <div className="glow-spot-2"></div>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> Gemini AI Engine Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Content & Assessment Studio
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Auto-generate taxonomy-aligned multiple choice quizzes and structured lesson modules for your courses.
            </p>
          </div>

          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Launch AI Quiz Generator
          </button>
        </div>

        {/* AI Lesson Generator Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Lesson Outline Co-Pilot</h3>
              <p className="text-xs text-slate-400">Enter any educational topic to generate structured lesson notes & practice drills.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Lesson Topic</label>
              <input
                type="text"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                placeholder="e.g. Next.js 16 Server Components Architecture"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Level</label>
              <select
                value={lessonLevel}
                onChange={(e) => setLessonLevel(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateLesson}
            disabled={generatingLesson || !lessonTopic.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {generatingLesson ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Co-Pilot Writing Content...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" /> Generate Lesson Content
              </>
            )}
          </button>

          {/* Render Generated Lesson */}
          {generatedLesson && (
            <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-4 bg-indigo-950/10">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <h4 className="text-base font-bold text-white">{generatedLesson.title}</h4>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  Est. {generatedLesson.estimatedDuration} mins
                </span>
              </div>
              <p className="text-xs text-indigo-200 italic">{generatedLesson.summary}</p>
              <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono pt-2">
                {generatedLesson.content}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Quiz Generator Modal */}
      <AIQuizGeneratorModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
