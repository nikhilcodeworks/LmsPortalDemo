'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, User, Star, ArrowRight } from 'lucide-react';
import { Course } from '@/lib/types';
import { INITIAL_COURSES } from '@/lib/mockData';
import CourseImage from './CourseImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Course[]>(INITIAL_COURSES);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(INITIAL_COURSES);
    } else {
      const q = query.toLowerCase();
      const filtered = INITIAL_COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
      setResults(filtered);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-surface)]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course name, topic, or instructor..."
            className="w-full bg-transparent text-[var(--text-main)] placeholder-[var(--text-faint)] text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2 bg-[var(--bg-surface)]">
          {results.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
              <p className="text-sm font-medium text-[var(--text-main)]">No courses matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Try searching for &ldquo;Next.js&rdquo;, &ldquo;AI&rdquo;, or &ldquo;Design&rdquo;</p>
            </div>
          ) : (
            results.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                onClick={onClose}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--border-subtle)] transition-all group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                  <CourseImage
                    src={course.thumbnail}
                    alt={course.title}
                    category={course.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {course.category}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {course.rating}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors truncate mt-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-[var(--text-faint)]" />
                    {course.instructor.name}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-faint)] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[var(--bg-subtle)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>{results.length} course{results.length === 1 ? '' : 's'} available</span>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[10px] text-[var(--text-main)]">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
