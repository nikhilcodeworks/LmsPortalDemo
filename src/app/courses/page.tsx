'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  BookOpen, 
  RotateCcw 
} from 'lucide-react';
import { INITIAL_COURSES } from '@/lib/mockData';
import { Course } from '@/lib/types';
import CourseCard from '@/components/CourseCard';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [level, setLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const categories = ['All', 'Development', 'AI & ML', 'Design & UX', 'Cloud & DevOps'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    let result = [...INITIAL_COURSES];

    if (category !== 'All') {
      result = result.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (level !== 'All') {
      result = result.filter((c) => c.level.toLowerCase() === level.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category, level, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          Curriculum Catalog
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
          Deep-dive masterclasses covering modern fullstack engineering, distributed systems, and generative AI architectures.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="app-card p-4 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, frameworks, or instructors..."
              className="app-input app-input-icon-left"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">Level:</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              aria-label="Filter courses by difficulty level"
              className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[var(--border-strong)] cursor-pointer font-mono"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-[var(--bg-surface)] text-[var(--text-main)]">
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort courses"
              className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[var(--border-strong)] cursor-pointer font-mono"
            >
              <option value="popular" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Most Popular</option>
              <option value="rating" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Highest Rated</option>
              <option value="price-asc" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Price: Low to High</option>
              <option value="price-desc" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-[var(--border-subtle)] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
          {(category !== 'All' || level !== 'All' || search.trim() !== '') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 ml-auto whitespace-nowrap transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Courses Output Grid */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
        <span>
          Showing <span className="text-[var(--text-main)] font-semibold">{filteredCourses.length}</span> course{filteredCourses.length === 1 ? '' : 's'}
        </span>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="app-card p-12 text-center">
          <BookOpen className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[var(--text-main)]">No courses match criteria</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 btn-secondary text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesCatalogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xs text-[var(--text-muted)] font-mono">Loading curriculum catalog...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
