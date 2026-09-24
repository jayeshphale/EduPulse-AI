'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AnalyticsSummary } from '@/types';
import { BarChart3, Users, BookOpen, Award, Activity, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData.analytics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              Educational & Skill Analytics <BarChart3 className="w-7 h-7 text-cyan-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time insights on course completion, Bloom&apos;s Taxonomy mastery levels, and audit logs.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{data?.totalCourses || 0}</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Enrolled Learners</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{data?.totalStudents || 0}</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Average Quiz Score</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{data?.averageQuizScore || 0}%</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Completion Rate</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{data?.completionRate || 0}%</div>
          </div>
        </div>

        {/* Bloom's Taxonomy Mastery Radar & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Bloom&apos;s Taxonomy Mastery Radar
            </h3>
            <p className="text-xs text-slate-400">
              Measures student cognitive domain mastery across assessment categories.
            </p>

            <div className="space-y-4">
              {data?.skillBreakdown?.map((item) => (
                <div key={item.taxonomy} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.taxonomy}</span>
                    <span className="text-indigo-400">{item.masteryScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Audit Logs */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" /> Platform Security & Audit Activity
            </h3>
            <p className="text-xs text-slate-400">
              Live immutable log of user logins, course creations, and AI assessment submissions.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {data?.recentActivity?.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-300">{log.action}</span>
                    <span className="text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
