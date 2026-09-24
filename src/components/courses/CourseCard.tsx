'use client';

import Link from 'next/link';
import { BookOpen, Users, Award, ChevronRight, Sparkles } from 'lucide-react';
import { CourseWithDetails } from '@/types';

interface CourseCardProps {
  course: CourseWithDetails;
}

export default function CourseCard({ course }: CourseCardProps) {
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'ADVANCED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col group">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${getLevelBadge(course.level)}`}>
            {course.level}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md">
            {course.category}
          </span>
        </div>

        {course.published && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Published
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>
        </div>

        {/* Stats & Instructor Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {course._count?.modules || course.modules?.length || 0} Modules
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              {course._count?.enrollments || 0} Students
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {course.instructor?.avatar ? (
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-400/40"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {course.instructor?.name?.charAt(0) || 'I'}
                </div>
              )}
              <span className="text-xs text-slate-300 font-medium">
                {course.instructor?.name || 'Instructor'}
              </span>
            </div>

            <Link
              href={`/courses/${course.id}`}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all group-hover:translate-x-0.5"
            >
              Explore <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
