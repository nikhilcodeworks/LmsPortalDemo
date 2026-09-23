'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { 
  Sun, 
  Moon, 
  Search, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, role, switchRole, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    showToast('Signed out of session', 'info');
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                LS
              </div>
              <span className="font-semibold text-sm tracking-tight text-[var(--text-main)]">
                LearnSphere<span className="text-[var(--text-muted)] font-normal ml-1">labs</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                href="/courses"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/courses')
                    ? 'text-[var(--text-main)] bg-[var(--bg-subtle)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Curriculum
              </Link>

              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-[var(--text-main)] bg-[var(--bg-subtle)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/instructor"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/instructor')
                    ? 'text-[var(--text-main)] bg-[var(--bg-subtle)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Studio
              </Link>

              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-amber-500 bg-amber-500/10 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Search Shortcut */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-normal transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Search documentation...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[10px] text-[var(--text-faint)] font-mono border border-[var(--border-subtle)]">
                ⌘K
              </kbd>
            </button>

            {/* Persona Switcher (Clean, distinct pill buttons) */}
            <div className="hidden lg:flex items-center bg-[var(--bg-subtle)] border border-[var(--border-subtle)] p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => { switchRole('student'); showToast('Active mode: Student', 'info'); }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => { switchRole('instructor'); showToast('Active mode: Instructor', 'info'); }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  role === 'instructor'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Instructor
              </button>
              <button
                onClick={() => { switchRole('admin'); showToast('Active mode: Admin', 'info'); }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-[var(--bg-surface)] text-amber-500 font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-amber-500'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-transparent hover:border-[var(--border-subtle)] cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Profile Menu or Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[var(--border-strong)]"
                  />
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                </button>

                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-xl py-1.5 z-50 animate-in fade-in duration-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2.5 border-b border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-main)] truncate">{user.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors font-medium"
                      >
                        <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>Student Dashboard</span>
                      </Link>

                      <Link
                        href="/instructor"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors font-medium"
                      >
                        <Briefcase className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>Instructor Studio</span>
                      </Link>

                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-amber-500 hover:bg-[var(--bg-subtle)] transition-colors font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Admin Console</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[var(--border-subtle)]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary py-1.5 px-3.5 text-xs font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 md:hidden rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-4 py-3 space-y-2">
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
            >
              Curriculum Catalog
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
            >
              My Learning
            </Link>
            <Link
              href="/instructor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
            >
              Instructor Studio
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-amber-500 hover:bg-[var(--bg-subtle)]"
            >
              Admin Console
            </Link>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
