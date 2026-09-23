import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#09090b] py-12 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                LS
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-200">
                LearnSphere<span className="text-zinc-500 font-normal ml-0.5">labs</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Curated masterclasses for staff engineers, AI researchers, and technical founders. Built on Next.js 15 and MongoDB.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All systems operational // MERN v2</span>
            </div>
          </div>

          {/* Curriculums */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider mb-3">
              Curriculums
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/courses?category=Development" className="hover:text-zinc-200 transition-colors">
                  Web & Fullstack
                </Link>
              </li>
              <li>
                <Link href="/courses?category=AI+%26+ML" className="hover:text-zinc-200 transition-colors">
                  Generative AI
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Design+%26+UX" className="hover:text-zinc-200 transition-colors">
                  Design Systems
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Cloud+%26+DevOps" className="hover:text-zinc-200 transition-colors">
                  Cloud Infrastructure
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-zinc-200 transition-colors">
                  Instructor Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-200 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider mb-3">
              Engine
            </h4>
            <ul className="space-y-1.5 text-zinc-500 font-mono text-[11px]">
              <li>Next.js 15 App Router</li>
              <li>React 19 Server Actions</li>
              <li>MongoDB & Mongoose</li>
              <li>Tailwind CSS v4</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px] font-mono">
          <p>© 2026 LearnSphere Labs Inc. Built for production engineers.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Security</span>
            <span className="hover:text-zinc-400 cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
