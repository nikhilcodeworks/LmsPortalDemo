'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Star, 
  Clock, 
  Bookmark, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import CourseImage from './CourseImage';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

export default function CourseCard({ course, featured }: CourseCardProps) {
  const { isEnrolled, isBookmarked, toggleBookmark, getCourseProgress } = useAuth();
  const enrolled = isEnrolled(course.id);
  const bookmarked = isBookmarked(course.id);
  const progress = getCourseProgress(course.id);

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = progress?.completedLessonIds.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="group relative rounded-xl bg-[var(--bg-surface)] hover:shadow-lg border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
        <CourseImage
          src={course.thumbnail}
          alt={course.title}
          category={course.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Minimal Bookmark Pill */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(course.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            bookmarked 
              ? 'bg-[var(--bg-surface)] text-rose-500 border border-rose-500/30' 
              : 'bg-[var(--bg-surface)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
          }`}
          aria-label="Bookmark course"
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Level Tag (Subtle, Monospace) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-tight bg-[var(--bg-surface)]/90 text-[var(--text-main)] border border-[var(--border-subtle)] shadow-xs">
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-tight bg-[var(--bg-surface)]/90 text-[var(--text-muted)] border border-[var(--border-subtle)] shadow-xs">
            {course.durationHours} hrs
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2 font-mono">
            <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-[var(--text-main)] font-medium">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-[var(--text-faint)] font-normal">({course.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/courses/${course.id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Headline / Summary */}
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {course.headline}
          </p>
        </div>

        {/* Footer Area: Instructor & CTA */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-[var(--border-subtle)] shrink-0"
              onError={(e) => {
                // fallback to a clean colored avatar on error
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs text-[var(--text-muted)] font-medium truncate">
              {course.instructor.name}
            </span>
          </div>

          {enrolled ? (
            <Link
              href={`/courses/${course.id}/learn`}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Resume</span>
              <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-[var(--text-main)] font-mono">
                ${course.price}
              </span>
              <Link
                href={`/courses/${course.id}`}
                className="btn-primary py-1 px-3 text-xs"
              >
                <span>View</span>
              </Link>
            </div>
          )}
        </div>

        {/* Progress Strip (if enrolled) */}
        {enrolled && (
          <div className="w-full bg-[var(--bg-subtle)] h-1.5 rounded-full overflow-hidden mt-1 border border-[var(--border-subtle)]">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
