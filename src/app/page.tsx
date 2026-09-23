'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Layers, 
  Code2, 
  Cpu, 
  Cloud, 
  Sparkles,
  CheckCircle2,
  Terminal,
  Award,
  Users
} from 'lucide-react';
import { INITIAL_COURSES } from '@/lib/mockData';
import CourseCard from '@/components/CourseCard';

const CATEGORIES = [
  { name: 'All Curriculums', icon: Layers },
  { name: 'Development', icon: Code2 },
  { name: 'AI & ML', icon: Cpu },
  { name: 'Design & UX', icon: Sparkles },
  { name: 'Cloud & DevOps', icon: Cloud },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Curriculums');
  const [activePreviewTab, setActivePreviewTab] = useState<'code' | 'notes' | 'quiz'>('code');

  const filteredCourses = selectedCategory === 'All Curriculums'
    ? INITIAL_COURSES
    : INITIAL_COURSES.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="flex flex-col w-full grid-bg">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Subtle Monospace Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>October 2026 Cohorts & Self-Paced Masterclasses</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-main)] max-w-4xl mx-auto leading-[1.08] mb-6">
            Engineered for depth. Built for real production code.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Skip generic beginner tutorials. Master distributed systems, autonomous AI agents, Next.js 15 internals, and design systems directly from staff engineers and open-source contributors.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-16">
            <Link
              href="/courses"
              className="w-full sm:w-auto btn-primary px-6 py-3 text-xs shadow-sm"
            >
              <span>Explore All Curriculums</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto btn-secondary px-6 py-3 text-xs"
            >
              <span>Explore Demo Accounts</span>
            </Link>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14 text-left">
            <div className="app-card p-4 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-mono">48,000+</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Active Students</p>
            </div>
            <div className="app-card p-4 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-mono">99.4%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Satisfaction Rate</p>
            </div>
            <div className="app-card p-4 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-mono">4.95 / 5</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Average Course Rating</p>
            </div>
            <div className="app-card p-4 rounded-xl">
              <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-mono">100%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Verifiable Certificates</p>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 border-t border-[var(--border-subtle)] max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-widest font-mono text-[var(--text-faint)] mb-6 font-semibold">
              Curriculums authored by engineers with experience at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-[var(--text-muted)] font-semibold text-sm tracking-wider">
              <span className="hover:text-[var(--text-main)] transition-colors">▲ Vercel</span>
              <span className="hover:text-[var(--text-main)] transition-colors">stripe</span>
              <span className="hover:text-[var(--text-main)] transition-colors">Linear</span>
              <span className="hover:text-[var(--text-main)] transition-colors">Figma</span>
              <span className="hover:text-[var(--text-main)] transition-colors">GitHub</span>
              <span className="hover:text-[var(--text-main)] transition-colors">CLOUDFLARE</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Platform Inspector */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-[var(--border-subtle)]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-semibold">
            The Learning Environment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-1.5 tracking-tight">
            Designed like your everyday developer tools.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2">
            Cinematic high-framerate playback, synchronized notes, runnable code snippets, and structured assessments.
          </p>
        </div>

        {/* Tabbed Studio Mockup */}
        <div className="max-w-4xl mx-auto rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-2xl">
          {/* Mock Window Header */}
          <div className="px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2">
                learnsphere-player // lecture-02.tsx
              </span>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[11px] font-mono">
              <button
                onClick={() => setActivePreviewTab('code')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreviewTab === 'code' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Code Snippet
              </button>
              <button
                onClick={() => setActivePreviewTab('notes')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreviewTab === 'notes' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Sync Notes
              </button>
              <button
                onClick={() => setActivePreviewTab('quiz')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreviewTab === 'quiz' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Assessment
              </button>
            </div>
          </div>

          {/* Mock Window Body */}
          <div className="p-6 bg-[var(--bg-surface)] text-left min-h-[220px]">
            {activePreviewTab === 'code' && (
              <div className="font-mono text-xs text-[var(--text-main)] leading-relaxed">
                <span className="text-[var(--text-faint)]">// React Server Component with Mongoose caching</span>
                <br />
                <span className="text-indigo-400">export default async function</span> CourseCatalog({'{'} params {'}'}) {'{'}
                <br />
                &nbsp;&nbsp;<span className="text-[var(--text-muted)]">const</span> data = <span className="text-indigo-400">await</span> getCourseCached(params.slug);
                <br />
                &nbsp;&nbsp;<span className="text-indigo-400">return</span> (
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-emerald-500">CoursePlayer</span> initialLesson={'{'}data.lessons[0]{'}'} /&gt;
                <br />
                &nbsp;&nbsp;);
                <br />
                {'}'}
              </div>
            )}

            {activePreviewTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>Timestamp 14:20 — Architecture Notes</span>
                  <span className="text-emerald-500 font-semibold">✓ Auto-saved 2s ago</span>
                </div>
                <p className="text-xs text-[var(--text-main)] leading-relaxed font-mono bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border-subtle)]">
                  - Server components eliminate client bundle weight for heavy Markdown & syntax parsers.<br />
                  - Wrap interactive UI components with &ldquo;use client&rdquo; only at leaves of the component tree.<br />
                  - Use tag-based cache revalidation for instant edge invalidation.
                </p>
              </div>
            )}

            {activePreviewTab === 'quiz' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Assessment Question 1 of 3</span>
                  <span className="text-amber-500 font-semibold">Passing score: 66%</span>
                </div>
                <p className="text-[var(--text-main)] font-medium">
                  What is the primary architectural benefit of React Server Components in Next.js?
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between">
                  <span>✓ Server dependencies are not sent to client bundle</span>
                  <span className="text-[10px] font-bold">CORRECT</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curriculums Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
              Featured Engineering Tracks
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Complete, end-to-end architectures designed for senior engineering roles.
            </p>
          </div>

          <Link
            href="/courses"
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 transition-colors"
          >
            <span>All 4 Curriculums</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[var(--border-subtle)] scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid of Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Practitioner Reviews */}
      <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-semibold">
              Feedback from Practitioners
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-1">
              Engineers who shipped with LearnSphere
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="app-card p-6 rounded-xl space-y-3">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                &ldquo;Elena&apos;s Next.js & Mongoose course helped us eliminate hydration mismatches and reduced our query latency from 220ms down to 18ms.&rdquo;
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  AP
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-main)]">Aarav Patel</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">Senior Engineer @ SaaS Platform</p>
                </div>
              </div>
            </div>

            <div className="app-card p-6 rounded-xl space-y-3">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                &ldquo;The ReAct agent reasoning section gave our team the exact blueprint we needed to construct deterministic tool execution in production.&rdquo;
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-[10px] font-bold">
                  DM
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-main)]">David Miller</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">AI Research Engineer</p>
                </div>
              </div>
            </div>

            <div className="app-card p-6 rounded-xl space-y-3">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                &ldquo;Hands down the cleanest LMS interface I&apos;ve used. Fast, keyboard-friendly, zero distractions when watching at 1.5x speed.&rdquo;
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                  CB
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-main)]">Chloe Bennett</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Contrast, Spacious CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl p-8 sm:p-14 text-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)] mb-3 relative z-10">
            Ready to Upgrade Your Career?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
            Join thousands of engineers and designers building modern applications with Next.js, MERN stack, and Generative AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
            <Link
              href="/courses"
              className="w-full sm:w-auto btn-primary px-6 py-2.5 text-xs font-semibold shadow-xs"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto btn-secondary px-6 py-2.5 text-xs font-medium"
            >
              <span>Go to Student Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
