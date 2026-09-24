'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, BookOpen, BarChart3, Bot, LogIn, LogOut, User, Shield, GraduationCap, ChevronDown } from 'lucide-react';
import { UserPayload } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const handleDemoSwitch = async (email: string) => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        router.refresh();
      }
    } finally {
      setDemoLoading(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              EduPulse <span className="text-gradient-purple font-black">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              House of Edtech Engine
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          <Link
            href="/courses"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname.startsWith('/courses')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Catalog
          </Link>

          <Link
            href="/dashboard/ai-studio"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === '/dashboard/ai-studio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            AI Generator
          </Link>

          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === '/dashboard/analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
        </nav>

        {/* User Account & Quick Demo Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Button for Reviewers */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{user ? `Role: ${user.role}` : '1-Click Demo Accounts'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl p-2 border border-white/10 z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Quick Role Switcher
                </div>
                <button
                  onClick={() => handleDemoSwitch('instructor@edupulse.ai')}
                  disabled={demoLoading}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 flex items-center justify-between transition-colors text-purple-300"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <GraduationCap className="w-4 h-4 text-purple-400" /> Instructor Demo
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Create & AI</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch('student@edupulse.ai')}
                  disabled={demoLoading}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 flex items-center justify-between transition-colors text-emerald-300"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-emerald-400" /> Student Demo
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Learn & Quiz</span>
                </button>

                <button
                  onClick={() => handleDemoSwitch('admin@edupulse.ai')}
                  disabled={demoLoading}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 flex items-center justify-between transition-colors text-amber-300"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Shield className="w-4 h-4 text-amber-400" /> Admin Demo
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Audit & Stats</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-200 hover:text-white font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white font-medium flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
