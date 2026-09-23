'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Clock, 
  Award, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_COURSES } from '@/lib/mockData';
import { Course } from '@/lib/types';
import CourseCard from '@/components/CourseCard';
import CourseImage from '@/components/CourseImage';
import CertificateModal from '@/components/CertificateModal';

export default function StudentDashboardPage() {
  const { user, isEnrolled, getCourseProgress, isBookmarked } = useAuth();
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'saved'>('in-progress');
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);

  const enrolledCourses = INITIAL_COURSES.filter((c) => isEnrolled(c.id));
  const bookmarkedCourses = INITIAL_COURSES.filter((c) => isBookmarked(c.id));

  // Determine completed vs in-progress courses
  const completedCourses = enrolledCourses.filter((course) => {
    const prog = getCourseProgress(course.id);
    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
    return prog && prog.completedLessonIds.length >= totalLessons && totalLessons > 0;
  });

  const inProgressCourses = enrolledCourses.filter((course) => !completedCourses.includes(course));

  // 7-day activity days
  const weekDays = [
    { day: 'Mon', completed: true, mins: 45 },
    { day: 'Tue', completed: true, mins: 60 },
    { day: 'Wed', completed: true, mins: 30 },
    { day: 'Thu', completed: true, mins: 75 },
    { day: 'Fri', completed: true, mins: 50 },
    { day: 'Sat', completed: false, mins: 0 },
    { day: 'Sun', completed: true, mins: 40 },
  ];

  const primaryActiveCourse = inProgressCourses[0] || enrolledCourses[0] || INITIAL_COURSES[0];
  const primaryProgress = getCourseProgress(primaryActiveCourse.id);
  const primaryTotal = primaryActiveCourse.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const primaryDone = primaryProgress?.completedLessonIds.length || 0;
  const primaryPercent = primaryTotal > 0 ? Math.round((primaryDone / primaryTotal) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
      
      {/* Welcome Banner & Overview Stats */}
      <div className="app-card p-6 sm:p-8 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--border-strong)]"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                  Role: <span className="text-[var(--text-main)] font-semibold capitalize">{user.role}</span> // Status: Active Student
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-bold text-[var(--text-main)] font-mono">{user.streakDays}d</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-medium">Streak</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-bold text-[var(--text-main)] font-mono">{user.totalHoursLearned}h</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-medium">Logged</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-center">
              <span className="block text-xl font-bold text-[var(--text-main)] font-mono">{user.certificatesEarned}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-medium">Certs</span>
            </div>
          </div>

        </div>
      </div>

      {/* Continue Learning Spotlight & Weekly Activity Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spotlight Course (2 Cols) */}
        <div className="lg:col-span-2 app-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <Play className="w-3 h-3 text-indigo-400 fill-current" />
                <span>Active Track</span>
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">{primaryPercent}% complete</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-44 aspect-video rounded-xl overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                <CourseImage
                  src={primaryActiveCourse.thumbnail}
                  alt={primaryActiveCourse.title}
                  category={primaryActiveCourse.category}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {primaryActiveCourse.category}
                </span>
                <h3 className="text-base font-semibold text-[var(--text-main)] truncate">
                  {primaryActiveCourse.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                  Instructor: {primaryActiveCourse.instructor.name}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>{primaryDone} / {primaryTotal} lectures</span>
              <span>{primaryActiveCourse.durationHours} hrs total</span>
            </div>

            <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${primaryPercent}%` }}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href={`/courses/${primaryActiveCourse.id}/learn`}
                className="btn-primary py-2 px-4 text-xs font-semibold shadow-xs"
              >
                <span>Resume Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Weekly Activity Heatmap (1 Col) */}
        <div className="app-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Activity Heatmap
              </span>
              <span className="text-xs font-mono text-emerald-500 font-semibold">5/7 Active</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              Consistent daily practice builds mastery.
            </p>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-mono transition-transform hover:scale-105 ${
                      d.completed
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-faint)] border border-[var(--border-subtle)]'
                    }`}
                    title={`${d.day}: ${d.mins} minutes`}
                  >
                    {d.completed ? '✓' : '·'}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Total active watch time: <span className="text-[var(--text-main)] font-semibold">300+ mins</span>
            </p>
          </div>
        </div>

      </div>

      {/* Course Categories & Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'in-progress'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            In Progress ({inProgressCourses.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            Completed ({completedCourses.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            Saved / Bookmarks ({bookmarkedCourses.length})
          </button>
        </div>

        {/* Tab Content Output */}
        {activeTab === 'in-progress' && (
          <div>
            {inProgressCourses.length === 0 ? (
              <div className="app-card p-12 text-center">
                <BookOpen className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[var(--text-main)]">No active courses</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Browse the curriculum catalog to enroll in your next masterclass.</p>
                <Link href="/courses" className="mt-4 btn-primary text-xs">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            {completedCourses.length === 0 ? (
              <div className="app-card p-12 text-center">
                <Award className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[var(--text-main)]">No completed courses yet</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Complete all lectures and quizzes in a course track to unlock verified completion certificates.
                </p>
                <button
                  onClick={() => setSelectedCertCourse(INITIAL_COURSES[0])}
                  className="mt-4 btn-secondary text-xs"
                >
                  Preview Sample Certificate
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <div key={course.id} className="relative group">
                    <CourseCard course={course} />
                    <button
                      onClick={() => setSelectedCertCourse(course)}
                      className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-bold text-[11px] shadow-sm flex items-center gap-1 z-20 cursor-pointer"
                    >
                      <Award className="w-3 h-3" />
                      <span>View Certificate</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {bookmarkedCourses.length === 0 ? (
              <div className="app-card p-12 text-center">
                <Bookmark className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[var(--text-main)]">No bookmarked courses</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Save courses you want to study later by clicking the bookmark icon on any card.
                </p>
                <Link href="/courses" className="mt-4 btn-primary text-xs">
                  Explore Curriculums
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCertCourse(null)}
          course={selectedCertCourse}
          studentName={user.name}
          certificateId={`CERT-${selectedCertCourse.id.toUpperCase()}-8829`}
          issueDate="October 2026"
        />
      )}

    </div>
  );
}
