'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserPayload } from '@/types';
import { Sparkles, BookOpen, Bot, BarChart3, Plus, GraduationCap, User, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* Welcome Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Active Role: {user?.role || 'STUDENT'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome to your Workspace, {user?.name || 'Learner'} 👋
            </h1>
            <p className="text-xs text-slate-400">
              Manage curriculum, run AI quiz evaluations, and analyze learning metrics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
              <Link
                href="/dashboard/courses/new"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Course
              </Link>
            ) : null}

            <Link
              href="/dashboard/ai-studio"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Bot className="w-4 h-4 text-purple-300" /> AI Studio
            </Link>
          </div>
        </div>

        {/* Dashboard Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/courses"
            className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                Browse Catalog <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore course outlines, video lessons, and interactive markdown modules.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/ai-studio"
            className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-purple-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                Gemini AI Studio <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generate Bloom&apos;s taxonomy assessments and structured lesson content automatically.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                Skill Analytics <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspect taxonomy mastery breakdowns, student submission scores, and audit logs.
              </p>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
