'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RefreshCw, Award, Bot, HelpCircle } from 'lucide-react';
import { QuizWithQuestions } from '@/types';

interface QuizPlayerProps {
  quiz: QuizWithQuestions;
  onComplete?: (score: number) => void;
}

export default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(quiz.questions.length).fill('')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    passingScore: number;
    aiFeedback?: string | null;
  } | null>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const options: string[] = currentQuestion
    ? typeof currentQuestion.optionsJson === 'string'
      ? JSON.parse(currentQuestion.optionsJson)
      : currentQuestion.options || []
    : [];

  const handleSelectOption = (option: string) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = option;
    setSelectedAnswers(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers: selectedAnswers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.submission);
        if (onComplete) onComplete(data.submission.score);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllAnswered = selectedAnswers.every((a) => a.trim() !== '');

  if (result) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
        {/* Result Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${
              result.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {result.score}%
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {result.passed ? 'Assessment Passed!' : 'Assessment Review Required'}
                {result.passed && <Award className="w-5 h-5 text-emerald-400" />}
              </h3>
              <p className="text-xs text-slate-400">
                Passing requirement: {result.passingScore}%
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setCurrentIndex(0);
              setSelectedAnswers(Array(quiz.questions.length).fill(''));
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Re-take Quiz
          </button>
        </div>

        {/* AI Detailed Evaluation Feedback Report */}
        {result.aiFeedback && (
          <div className="glass-card rounded-xl p-6 border border-purple-500/30 space-y-3 bg-purple-950/20">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>Gemini AI Assessment Evaluation Report</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-purple-500/20 pt-3">
              {result.aiFeedback}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
      {/* Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Taxonomy: {currentQuestion?.bloomTaxonomy || 'Understand'}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white leading-snug">
          {currentQuestion?.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl text-sm font-medium border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span>{option}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Hint if present */}
      {currentQuestion?.explanation && (
        <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>Note: Select the option that best enforces system modularity and type safety.</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={!selectedAnswers[currentIndex]}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            Next Question <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered || isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Evaluating with AI...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Submit & Evaluate
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
