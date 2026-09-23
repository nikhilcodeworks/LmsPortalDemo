'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  DollarSign, 
  CreditCard, 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  RotateCcw, 
  ArrowUpRight, 
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { Spinner } from '@/components/Loader';
import { 
  INITIAL_COURSES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PAYOUTS, 
  INITIAL_USERS_LIST 
} from '@/lib/mockData';
import { Course, PaymentTransaction, InstructorPayout, UserProfile } from '@/lib/types';
import CourseImage from '@/components/CourseImage';

export default function AdminPanelPage() {
  const { role, switchRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'courses' | 'users'>('overview');

  // State collections
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [payouts, setPayouts] = useState<InstructorPayout[]>(INITIAL_PAYOUTS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS_LIST);

  // Transaction Filters
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'all' | 'completed' | 'refunded' | 'pending'>('all');

  // Action Loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // If not admin, provide 1-click admin unlock banner
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Administrator Access Required</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2">
            You are currently viewing the system as a <span className="text-indigo-400 font-bold capitalize">{role}</span>.
            Click below to switch to the Demo Admin role.
          </p>
        </div>
        <button
          onClick={() => {
            switchRole('admin');
            showToast('Switched to Administrator role', 'success');
          }}
          className="btn-primary py-2.5 px-5 text-xs font-semibold"
        >
          Unlock Admin Panel (1-Click)
        </button>
      </div>
    );
  }

  // Transaction Actions
  const handleRefund = async (txId: string) => {
    setActionLoadingId(txId);
    await new Promise((r) => setTimeout(r, 600));

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'refunded' } : t))
    );
    setActionLoadingId(null);
    showToast(`Transaction ${txId} successfully refunded.`, 'info');
  };

  // Payout Actions
  const handleApprovePayout = async (payoutId: string) => {
    setActionLoadingId(payoutId);
    await new Promise((r) => setTimeout(r, 700));

    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'paid' } : p))
    );
    setActionLoadingId(null);
    showToast(`Instructor payout ${payoutId} processed and sent!`, 'success');
  };

  // Course Actions
  const handleToggleCourseStatus = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextStatus = c.status === 'published' ? 'draft' : 'published';
          showToast(`Course "${c.title}" is now ${nextStatus}`, 'info');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleToggleFeatured = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextState = !c.isFeatured;
          showToast(`Course marked as ${nextState ? 'Featured' : 'Standard'}`, 'success');
          return { ...c, isFeatured: nextState };
        }
        return c;
      })
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    showToast('Course deleted from platform catalog', 'info');
  };

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`User ${u.name} is now ${nextStatus}`, nextStatus === 'active' ? 'success' : 'error');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchStatus = txStatusFilter === 'all' || t.status === txStatusFilter;
    const matchSearch =
      !txSearch.trim() ||
      t.transactionRef.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.courseTitle.toLowerCase().includes(txSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // KPI Calculations
  const totalVolume = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCommission = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => acc + t.platformFee, 0);

  const pendingPayoutsTotal = payouts
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Platform Administration & Payment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Global management for courses, payments, transactions, instructor payouts, and users.
          </p>
        </div>

        {/* Global Admin Stats Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Payment Gateways Online</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Management</span>
          {pendingPayoutsTotal > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono">
              1
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Management</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono">
            {courses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono">
            {users.length}
          </span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">Total Transaction Volume</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-mono">${totalVolume.toLocaleString()}</span>
                <span className="text-xs text-emerald-500 font-semibold font-mono">+24.8%</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Gross revenue across all courses</p>
            </div>

            <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">Platform Commission (20%)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-amber-500 font-mono">${totalCommission.toFixed(2)}</span>
                <span className="text-xs text-emerald-500 font-semibold font-mono">+18.2%</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Net platform margins captured</p>
            </div>

            <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">Pending Instructor Payouts</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-rose-500 font-mono">${pendingPayoutsTotal.toFixed(2)}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-semibold font-mono">Action</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Requested withdrawals awaiting dispatch</p>
            </div>

            <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">Active Platform Students</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-indigo-400 font-mono">48,200</span>
                <span className="text-xs text-emerald-500 font-semibold font-mono">+14.1%</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Enrolled across 92 countries</p>
            </div>
          </div>

          {/* Platform Performance & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 app-card p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">Recent High-Value Enrollments</h3>
                <button onClick={() => setActiveTab('payments')} className="text-xs text-indigo-400 hover:underline">
                  View All &rarr;
                </button>
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {transactions.slice(0, 4).map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-main)]">{t.userName}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate max-w-sm">{t.courseTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[var(--text-main)] font-mono">${t.amount} USD</span>
                      <span className={`block text-[10px] uppercase font-semibold font-mono ${t.status === 'completed' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="app-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">Infrastructure Health</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">MongoDB Database Cluster</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Synced
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Stripe Payment Gateway</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Certificate Signer Engine</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RSA Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">CDN Video Cache Hit Rate</span>
                  <span className="text-indigo-400 font-semibold font-mono">98.4%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => showToast('System telemetry refreshed', 'info')}
                  className="w-full btn-secondary py-2 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Telemetry</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PAYMENT MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Payout Requests Banner */}
          <div className="app-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Instructor Withdrawal & Payout Requests</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Approve and dispatch instructor course revenue shares to their linked Stripe/Bank accounts.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {payouts.map((p) => (
                <div key={p.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-main)]">{p.instructorName}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">({p.destinationAccount})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {p.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">Ref: {p.payoutRef} • Date: {p.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[var(--text-main)] font-mono">${p.amount.toFixed(2)} USD</span>
                    {p.status === 'pending' ? (
                      <button
                        onClick={() => handleApprovePayout(p.id)}
                        disabled={actionLoadingId === p.id}
                        className="btn-primary py-1.5 px-3 text-xs"
                      >
                        {actionLoadingId === p.id ? <Spinner size="sm" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>Approve Payout</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)] font-medium font-mono">Dispatched</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Ledger Table with Search & Filter */}
          <div className="app-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">Payment Transactions Ledger</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Real-time student payments and refunds</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search transaction, buyer, course..."
                    className="app-input app-input-icon-left text-xs"
                  />
                </div>

                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value as any)}
                  aria-label="Filter transactions by payment status"
                  className="app-input font-mono text-xs w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-main)]">
                <thead className="bg-[var(--bg-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] font-mono font-semibold">
                  <tr>
                    <th className="p-4">Transaction Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="p-4 font-mono font-semibold text-indigo-400">{tx.transactionRef}</td>
                      <td className="p-4">
                        <span className="font-semibold text-[var(--text-main)] block">{tx.userName}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">{tx.userEmail}</span>
                      </td>
                      <td className="p-4 max-w-xs truncate font-medium text-[var(--text-main)]">
                        {tx.courseTitle}
                      </td>
                      <td className="p-4 font-mono">
                        <span className="font-bold text-[var(--text-main)]">${tx.amount.toFixed(2)}</span>
                        <span className="block text-[10px] text-emerald-500">+${tx.platformFee.toFixed(2)} fee</span>
                      </td>
                      <td className="p-4 font-medium text-[var(--text-muted)]">{tx.paymentMethod}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : tx.status === 'refunded'
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {tx.status === 'completed' && (
                          <button
                            onClick={() => handleRefund(tx.id)}
                            disabled={actionLoadingId === tx.id}
                            className="btn-secondary py-1 px-2.5 text-xs text-rose-500 hover:text-rose-400"
                          >
                            {actionLoadingId === tx.id ? <Spinner size="sm" /> : 'Issue Refund'}
                          </button>
                        )}
                        {tx.status === 'refunded' && (
                          <span className="text-[var(--text-muted)] text-[11px] font-mono">Refunded</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="app-card p-5 sm:p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">Course Administration</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Approve, unpublish, feature, or remove masterclasses.</p>
            </div>
            <Link
              href="/instructor"
              className="btn-primary py-1.5 px-3.5 text-xs font-semibold"
            >
              + Create Course
            </Link>
          </div>

          <div className="app-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-[var(--border-subtle)] overflow-x-auto">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                      <CourseImage
                        src={c.thumbnail}
                        alt={c.title}
                        category={c.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {c.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${c.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'}`}>
                          {c.status || 'published'}
                        </span>
                        {c.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text-main)] mt-1">{c.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                        ${c.price} USD • {c.studentsEnrolled.toLocaleString()} students • Instructor: {c.instructor.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleFeatured(c.id)}
                      className="btn-secondary py-1 px-2.5 text-xs"
                    >
                      {c.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>

                    <button
                      onClick={() => handleToggleCourseStatus(c.id)}
                      className="btn-secondary py-1 px-2.5 text-xs"
                    >
                      {c.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="app-card rounded-2xl overflow-hidden animate-in fade-in duration-150">
          <div className="p-5 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">User & Persona Directory</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage accounts, view activity streak, and change status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-main)]">
              <thead className="bg-[var(--bg-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] font-mono font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Activity Streak</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--border-subtle)]"
                      />
                      <div>
                        <span className="font-semibold text-[var(--text-main)] block">{u.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[var(--text-muted)]">
                      {u.streakDays} days ({u.totalHoursLearned}h logged)
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`btn-secondary py-1 px-2.5 text-xs ${
                          u.status === 'active' ? 'text-rose-500 hover:text-rose-400' : 'text-emerald-500 hover:text-emerald-400'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
