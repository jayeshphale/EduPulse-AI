'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import { CourseWithDetails } from '@/types';
import { Search, Filter, Plus, BookOpen, Sparkles } from 'lucide-react';

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (category) queryParams.set('category', category);
      if (level) queryParams.set('level', level);

      const res = await fetch(`/api/courses?${queryParams.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, category, level]);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col relative overflow-hidden">
      <div className="glow-spot-1"></div>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              Course & Assessment Catalog <BookOpen className="w-7 h-7 text-indigo-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse interactive learning tracks featuring AI-evaluated quizzes and structured modules.
            </p>
          </div>

          <Link
            href="/dashboard/courses/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Course (Instructor)
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search course title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Fullstack Engineering">Fullstack Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Difficulty Levels</option>
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading course catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Courses Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or filters. Instructors can create new courses anytime.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
