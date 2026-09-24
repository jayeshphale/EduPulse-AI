'use client';

import { Sparkles, Heart, Code, Layers, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-white/10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <span className="text-lg font-bold text-white">EduPulse AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An AI-native learning & assessment platform engineered for Next.js 16. Built specifically for the <strong>House of Edtech Fullstack Developer Assignment</strong>.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Next.js 16 App Router
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Gemini AI Engine
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Code className="w-3 h-3" /> Prisma SQLite
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Application Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/courses" className="hover:text-indigo-400 transition-colors">Course Catalog & Outline</a>
              </li>
              <li>
                <a href="/dashboard/ai-studio" className="hover:text-purple-400 transition-colors">AI Quiz & Lesson Studio</a>
              </li>
              <li>
                <a href="/dashboard/analytics" className="hover:text-cyan-400 transition-colors">Skill Mastery & Analytics</a>
              </li>
              <li>
                <a href="/auth/login" className="hover:text-emerald-400 transition-colors">Demo Auth Login</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Mandatory Candidate Submission Info */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Candidate Information
            </h4>
            <div className="glass-card rounded-xl p-4 space-y-3 border border-indigo-500/20">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Developed By</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  Jayesh Phale <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </span>
              </div>
              
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://github.com/jayeshphale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 hover:text-white flex items-center gap-2 transition-all border border-white/10"
                >
                  <svg className="w-4 h-4 text-indigo-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Profile</span>
                </a>

                <a
                  href="https://linkedin.com/in/jayeshphale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 hover:text-white flex items-center gap-2 transition-all border border-white/10"
                >
                  <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /> for <strong>House of Edtech</strong> Fullstack Assignment (Sep 2026.1).
          </p>
          <p>© 2026 EduPulse AI. Candidate: Jayesh Phale.</p>
        </div>
      </div>
    </footer>
  );
}
