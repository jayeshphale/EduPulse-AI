'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Sparkles, LogIn, GraduationCap, User, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full flex items-center justify-center relative z-10">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 w-full border border-white/10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-xs text-slate-400">
              Sign in to manage courses, take AI assessments, or view analytics.
            </p>
          </div>

          {/* Quick Demo Fill Buttons for Reviewers */}
          <div className="glass-card rounded-xl p-3 border border-indigo-500/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block text-center">
              ⚡ 1-Click Reviewer Demo Autofill
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoClick('instructor@edupulse.ai')}
                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-semibold text-purple-300 text-center flex flex-col items-center gap-1 transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Instructor
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('student@edupulse.ai')}
                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 text-center flex flex-col items-center gap-1 transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('admin@edupulse.ai')}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-semibold text-amber-300 text-center flex flex-col items-center gap-1 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@edupulse.ai"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-indigo-400 hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
