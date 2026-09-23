'use client';

import React, { useState } from 'react';
import { Code2, Cpu, Sparkles, Cloud, BookOpen } from 'lucide-react';

interface CourseImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export default function CourseImage({ src, alt, className = '', category = '' }: CourseImageProps) {
  const [error, setError] = useState(false);

  const getCategoryIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('ml')) return Cpu;
    if (cat.includes('design') || cat.includes('ux')) return Sparkles;
    if (cat.includes('cloud') || cat.includes('devops')) return Cloud;
    if (cat.includes('dev')) return Code2;
    return BookOpen;
  };

  const Icon = getCategoryIcon();

  if (error || !src) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950 text-indigo-400 p-4 border border-[var(--border-subtle)] ${className}`}>
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-1.5 shadow-xs">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] text-center line-clamp-1">
          {category || 'Curriculum'}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
