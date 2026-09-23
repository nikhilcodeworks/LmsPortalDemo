'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { Spinner } from '@/components/Loader';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Welcome back! Signed in successfully.', 'success');
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else if (email.toLowerCase().includes('instructor')) {
        router.push('/instructor');
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Invalid email or password');
      showToast(res.error || 'Login failed', 'error');
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string, redirectPath: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setErrorMessage('');

    const res = await login(demoEmail, demoPass);
    setLoading(false);

    if (res.success) {
      showToast(`Logged in as ${demoEmail.split('@')[0]}`, 'success');
      router.push(redirectPath);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 relative">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-9 h-9 rounded-lg bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
              LS
            </div>
            <span className="font-semibold text-xl tracking-tight text-[var(--text-main)]">
              LearnSphere<span className="text-[var(--text-muted)] font-normal text-sm ml-1">labs</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Sign in to LearnSphere
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Access your courses, notes, and engineering projects
          </p>
        </div>

        {/* 1-Click Instant Demo Credentials */}
        <div className="app-card p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              1-Click Demo Profiles
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@learnsphere.io', 'student123', '/dashboard')}
              className="p-2.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[var(--text-main)]">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('instructor@learnsphere.io', 'instructor123', '/instructor')}
              className="p-2.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[var(--text-main)]">Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@learnsphere.io', 'admin123', '/admin')}
              className="p-2.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[var(--text-main)]">Admin</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="app-card p-6 sm:p-7 rounded-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--text-main)] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="app-input app-input-icon-left"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[var(--text-main)]">
                  Password
                </label>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="app-input app-input-icon-left app-input-icon-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 text-xs font-semibold justify-center shadow-xs"
              >
                {loading ? <Spinner size="sm" /> : <span>Sign in to account</span>}
                {!loading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
          </form>

          {/* Alternative Switch */}
          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
              Don&apos;t have an account yet?{' '}
              <Link href="/signup" className="text-[var(--text-main)] font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
