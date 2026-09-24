'use client';

import { useState } from 'react';
import { Sparkles, Bot, Check, Plus, RefreshCw, X, Layers } from 'lucide-react';
import { GeneratedQuestion } from '@/lib/ai';

interface AIQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated?: (questions: GeneratedQuestion[], topic: string) => void;
}

export default function AIQuizGeneratorModal({
  isOpen,
  onClose,
  onQuestionsGenerated,
}: AIQuizGeneratorModalProps) {
  const [topic, setTopic] = useState('Next.js 16 Server Actions & Zod Validation');
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [numQuestions, setNumQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedQuestions(data.questions);
      } else {
        alert(data.error || 'Failed to generate AI quiz');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleAttach = () => {
    if (onQuestionsGenerated) {
      onQuestionsGenerated(generatedQuestions, topic);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-purple-500/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Gemini AI Quiz & Assessment Builder
            </h2>
            <p className="text-xs text-slate-400">
              Generate Bloom&apos;s Taxonomy aligned multiple-choice questions instantly.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Topic or Concept</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js 16 Server Components"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Questions Count</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value={2}>2 Questions</option>
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate AI Questions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Preview */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Generated Assessment Items ({generatedQuestions.length})
              </h4>
              <button
                onClick={handleAttach}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Check className="w-4 h-4" /> Save Quiz to Course
              </button>
            </div>

            <div className="space-y-3">
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-400">Q{idx + 1}: {q.difficulty}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Taxonomy: {q.bloomTaxonomy}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">{q.text}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
