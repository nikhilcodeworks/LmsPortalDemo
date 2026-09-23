'use client';

import React from 'react';

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl glass-card overflow-hidden flex flex-col animate-pulse border border-white/5">
      <div className="aspect-video w-full bg-white/5" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-5 bg-white/10 rounded w-4/5" />
          <div className="h-3 bg-white/5 rounded w-full" />
        </div>
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="h-5 bg-white/10 rounded w-16" />
          <div className="h-8 bg-white/10 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-white/5 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-white/10 rounded w-36" />
              <div className="h-2.5 bg-white/5 rounded w-24" />
            </div>
          </div>
          <div className="h-3.5 bg-white/10 rounded w-20 hidden sm:block" />
          <div className="h-6 bg-white/10 rounded-lg w-16" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader({ text = 'Preparing your learning environment...' }: { text?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-indigo-600/30 animate-ping" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-300 animate-pulse">{text}</p>
    </div>
  );
}
