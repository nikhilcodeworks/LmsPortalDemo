'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Award, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { Course } from '@/lib/types';
import { INITIAL_COURSES } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import CourseImage from '@/components/CourseImage';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isEnrolled, enrollInCourse, isBookmarked, toggleBookmark } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    const found = INITIAL_COURSES.find(
      (c) => c.id === resolvedParams.id || c.slug === resolvedParams.id
    );
    if (found) {
      setCourse(found);
      if (found.sections.length > 0) {
        setExpandedSection(found.sections[0].id);
      }
    }
  }, [resolvedParams.id]);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-main)]">Course Not Found</h2>
        <p className="text-xs text-[var(--text-muted)] mt-2">The course you are looking for does not exist.</p>
        <Link href="/courses" className="mt-4 btn-primary text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const bookmarked = isBookmarked(course.id);
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const handleEnrollClick = () => {
    if (!enrolled) {
      enrollInCourse(course.id);
    }
    router.push(`/courses/${course.id}/learn`);
  };

  return (
    <div className="w-full flex-1">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left 2 Cols: Course Overview */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {course.category}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {course.level}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Updated {course.lastUpdated}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-main)] tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Headline */}
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {course.headline}
              </p>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{course.rating.toFixed(1)}</span>
                  <span className="text-[var(--text-faint)] font-normal">({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{course.studentsEnrolled.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{course.durationHours} hours total</span>
                </div>
              </div>

              {/* Instructor Mini Badge */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--border-strong)]"
                />
                <div>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">Created by</p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    {course.instructor.name}
                  </p>
                </div>
              </div>

            </div>

            {/* Right 1 Col: Floating Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="app-card rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 sticky top-20">
                
                {/* Video Preview Aspect */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-subtle)] group">
                  {!isPlayingPreview ? (
                    <>
                      <CourseImage
                        src={course.thumbnail}
                        alt="Preview thumbnail"
                        category={course.category}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setIsPlayingPreview(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-text)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </button>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                        Preview Syllabus
                      </span>
                    </>
                  ) : (
                    <iframe
                      src={`${course.previewVideoUrl}?autoplay=1`}
                      title="Course Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[var(--text-main)] font-mono">${course.price}</span>
                  <span className="text-sm text-[var(--text-faint)] line-through font-mono">${course.originalPrice}</span>
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Primary CTA button */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full btn-primary py-3 text-xs font-semibold justify-center shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current mr-1" />
                    <span>{enrolled ? 'Resume Course Player' : 'Enroll Now — Lifetime Access'}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(course.id)}
                    className="w-full btn-secondary py-2.5 text-xs font-medium justify-center cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Course'}</span>
                  </button>
                </div>

                {/* Benefits List */}
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{totalLessons} in-depth master lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interactive assessments & quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Official Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>30-Day unconditional money-back guarantee</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            
            {/* What you'll learn */}
            <div className="app-card p-6 sm:p-7 rounded-2xl">
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>What You Will Master</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-[var(--text-muted)] leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Syllabus Accordion */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)]">Course Curriculum</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                    {course.sections.length} sections • {totalLessons} lessons • {course.durationHours} hours
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.sections.map((section) => {
                  const isExpanded = expandedSection === section.id;
                  return (
                    <div
                      key={section.id}
                      className="app-card rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                      >
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--text-main)]">
                            {section.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{section.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-mono">
                            {section.lessons.length} lessons
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3.5 sm:p-4 pl-5 sm:pl-6 flex items-center justify-between hover:bg-[var(--bg-surface)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-[var(--text-main)]">
                                    {lesson.title}
                                  </p>
                                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{lesson.summary}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                {lesson.quiz && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    Quiz
                                  </span>
                                )}
                                <span className="text-xs text-[var(--text-muted)] font-mono">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="app-card p-6 rounded-xl">
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-3">Requirements & Prerequisites</h3>
              <ul className="space-y-1.5 text-xs text-[var(--text-muted)] list-disc list-inside">
                {course.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Instructor Bio Card */}
            <div className="app-card p-6 sm:p-7 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-3">
                About the Instructor
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-[var(--border-strong)] shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-base font-bold text-[var(--text-main)]">{course.instructor.name}</h4>
                  <p className="text-xs text-indigo-400">{course.instructor.role}</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{course.instructor.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[var(--text-muted)] font-mono">
                    <span>★ {course.instructor.rating} Rating</span>
                    <span>{course.instructor.studentsCount.toLocaleString()} Students</span>
                    <span>{course.instructor.coursesCount} Courses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Reviews */}
            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Student Feedback</h3>
              <div className="space-y-3">
                {course.reviews.map((rev) => (
                  <div key={rev.id} className="app-card p-4 sm:p-5 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-main)]">{rev.userName}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
