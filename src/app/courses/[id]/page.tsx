'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QuizPlayer from '@/components/quizzes/QuizPlayer';
import { CourseWithDetails, QuizWithQuestions } from '@/types';
import { Sparkles, BookOpen, Users, Play, CheckCircle, ChevronDown, ChevronUp, Award, Lock, ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState<CourseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizWithQuestions | null>(null);
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>({});

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.course) {
        setCourse(data.course);
        // Expand first module by default
        if (data.course.modules && data.course.modules.length > 0) {
          setOpenModuleIds({ [data.course.modules[0].id]: true });
          if (data.course.modules[0].lessons.length > 0) {
            setActiveLessonId(data.course.modules[0].lessons[0].id);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
      const data = await res.json();
      if (data.success || data.message === 'Already enrolled') {
        setEnrolled(true);
      } else {
        alert(data.error || 'Please log in to enroll');
      }
    } catch {
      alert('Error enrolling in course');
    }
  };

  const toggleModule = (modId: string) => {
    setOpenModuleIds((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold">Course Not Found</h2>
          <Link href="/courses" className="text-xs text-indigo-400 hover:underline">Back to Catalog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find currently active lesson object
  let activeLessonObj = null;
  if (course.modules) {
    for (const mod of course.modules) {
      const found = mod.lessons.find((l) => l.id === activeLessonId);
      if (found) {
        activeLessonObj = found;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 relative z-10">
        {/* Back navigation */}
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
        </Link>

        {/* Course Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10">
                {course.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-2 font-medium text-slate-200">
                {course.instructor?.avatar && (
                  <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
                )}
                Instructed by {course.instructor?.name}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-indigo-400" /> {course.modules?.length || 0} Modules
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-400" /> {course._count?.enrollments || 0} Enrolled
              </span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium">Access Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${enrolled ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></div>
                <span className="text-sm font-bold text-white">
                  {enrolled ? 'Enrolled Student' : 'Open Curriculum'}
                </span>
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolled}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                enrolled
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {enrolled ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Enrolled & Active
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Enroll & Unlock All Modules
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Layout: Left Syllabus Tree, Right Lesson Viewer or Quiz Player */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Syllabus Navigation Tree */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Curriculum Syllabus
            </h3>

            <div className="space-y-3">
              {course.modules?.map((mod, modIdx) => (
                <div key={mod.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Module {modIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">{mod.title}</span>
                    </div>
                    {openModuleIds[mod.id] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openModuleIds[mod.id] && (
                    <div className="p-2 bg-slate-950/40 border-t border-white/5 space-y-1">
                      {mod.lessons.map((les) => {
                        const isActive = activeLessonId === les.id && !activeQuiz;
                        return (
                          <div key={les.id} className="space-y-1">
                            <button
                              onClick={() => {
                                setActiveLessonId(les.id);
                                setActiveQuiz(null);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                                isActive
                                  ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                                  : 'text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <Play className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{les.title}</span>
                              </span>
                              <span className="text-[10px] text-slate-500">{les.duration}m</span>
                            </button>

                            {/* Quizzes attached to lesson */}
                            {les.quizzes?.map((qz) => (
                              <button
                                key={qz.id}
                                onClick={() => {
                                  setActiveQuiz(qz as any);
                                  setActiveLessonId(les.id);
                                }}
                                className={`w-full text-left pl-7 pr-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between transition-all ${
                                  activeQuiz?.id === qz.id
                                    ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-500/40'
                                    : 'text-purple-300/80 hover:bg-purple-500/10'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                                  <span>Quiz: {qz.title}</span>
                                </span>
                                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">AI</span>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Main Viewer: Quiz Player OR Lesson Content Viewer */}
          <div className="lg:col-span-2">
            {activeQuiz ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Interactive AI Quiz Mode
                  </h3>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Return to Lesson
                  </button>
                </div>
                <QuizPlayer quiz={activeQuiz} />
              </div>
            ) : activeLessonObj ? (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Active Lesson</span>
                    <h2 className="text-xl font-bold text-white">{activeLessonObj.title}</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                    {activeLessonObj.type}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                  {activeLessonObj.content}
                </div>

                {activeLessonObj.quizzes && activeLessonObj.quizzes.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <button
                      onClick={() => setActiveQuiz(activeLessonObj.quizzes![0] as any)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <Bot className="w-4 h-4 text-purple-300" /> Start AI Assessment for this Lesson
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center border border-white/10 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">Select a lesson from the syllabus</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
