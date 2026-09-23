'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  Star, 
  Plus, 
  Play, 
  TrendingUp, 
  Trash2, 
  Edit3,
  Eye,
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  X, 
  CreditCard, 
  Building, 
  ArrowRight,
  Video,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { Spinner } from '@/components/Loader';
import { INITIAL_COURSES, INITIAL_PAYOUTS } from '@/lib/mockData';
import { Course, InstructorPayout } from '@/lib/types';
import CourseImage from '@/components/CourseImage';

export default function InstructorStudioPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'courses' | 'payouts'>('courses');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [payouts, setPayouts] = useState<InstructorPayout[]>(INITIAL_PAYOUTS);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [previewingCourse, setPreviewingCourse] = useState<Course | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payout Form
  const [payoutAmount, setPayoutAmount] = useState('1420.50');
  const [bankAccount, setBankAccount] = useState('Stripe Connect (**** 4829)');

  // Form State for New or Edited Course
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    category: 'Development' as Course['category'],
    level: 'Intermediate' as Course['level'],
    price: 69,
    originalPrice: 149,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
    sectionTitle: 'Section 1: Architecture & Getting Started',
    lessonTitle: 'Introduction & Setup',
    lessonVideoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
    lessonDuration: '15:00',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      headline: '',
      category: 'Development',
      level: 'Intermediate',
      price: 69,
      originalPrice: 149,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      previewVideoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
      sectionTitle: 'Section 1: Architecture & Getting Started',
      lessonTitle: 'Introduction & Setup',
      lessonVideoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
      lessonDuration: '15:00',
    });
    setEditingCourseId(null);
  };

  // Open Edit Modal with Course Data prefilled
  const handleOpenEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      title: course.title,
      headline: course.headline,
      category: course.category,
      level: course.level,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      previewVideoUrl: course.previewVideoUrl,
      sectionTitle: course.sections[0]?.title || 'Section 1: Fundamentals',
      lessonTitle: course.sections[0]?.lessons[0]?.title || 'Lecture 1: Introduction',
      lessonVideoUrl: course.sections[0]?.lessons[0]?.videoUrl || 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
      lessonDuration: course.sections[0]?.lessons[0]?.duration || '15:00',
    });
    setIsEditModalOpen(true);
  };

  // Handle Save Course (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);

    if (editingCourseId) {
      // EDIT existing course
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === editingCourseId) {
            return {
              ...c,
              title: formData.title,
              headline: formData.headline,
              category: formData.category,
              level: formData.level,
              price: Number(formData.price),
              originalPrice: Number(formData.originalPrice),
              thumbnail: formData.thumbnail,
              previewVideoUrl: formData.previewVideoUrl,
            };
          }
          return c;
        })
      );
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      resetForm();
      showToast('Course updated successfully!', 'success');
      return;
    }

    // CREATE new course
    const newCoursePayload: Course = {
      id: `course-${Date.now()}`,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: formData.title,
      headline: formData.headline || 'High-performance production masterclass.',
      description: 'Comprehensive curriculum designed for modern engineering practices.',
      category: formData.category,
      level: formData.level,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      thumbnail: formData.thumbnail,
      previewVideoUrl: formData.previewVideoUrl,
      rating: 5.0,
      reviewCount: 1,
      studentsEnrolled: 0,
      lastUpdated: 'Just now',
      durationHours: 8,
      certificateOffered: true,
      status: 'published',
      isFeatured: false,
      instructor: {
        id: user.id || 'inst-1',
        name: user.name || 'Instructor',
        role: 'Senior Engineering Instructor',
        bio: 'Industry expert teaching modern web technologies.',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        coursesCount: courses.length + 1,
        studentsCount: 34100,
        rating: 4.95,
      },
      tags: [formData.category, 'Fullstack'],
      learningOutcomes: ['Build enterprise web applications', 'Deploy to production with confidence'],
      requirements: ['Basic programming fundamentals'],
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: formData.sectionTitle || 'Section 1: Core Fundamentals',
          description: 'Master foundation principles and system architecture.',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: formData.lessonTitle || 'Lecture 1: Welcome & Setup',
              duration: formData.lessonDuration || '15:00',
              durationMinutes: 15,
              videoUrl: formData.lessonVideoUrl,
              summary: 'Comprehensive introduction and mental models.',
              description: 'In this opening lecture, we unpack the architecture and setup our environment.',
              keyTakeaways: ['Setup modern project structure', 'Run development server'],
              resources: [],
            },
          ],
        },
      ],
      reviews: [],
    };

    setCourses([newCoursePayload, ...courses]);
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    resetForm();
    showToast('New course published to catalog successfully!', 'success');
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      showToast(`Course "${courseTitle}" deleted.`, 'info');
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const newPayout: InstructorPayout = {
      id: `pay-${Date.now()}`,
      payoutRef: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      instructorId: user.id,
      instructorName: user.name,
      amount: parseFloat(payoutAmount) || 500,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      destinationAccount: bankAccount,
    };

    setPayouts([newPayout, ...payouts]);
    setIsSubmitting(false);
    setIsPayoutModalOpen(false);
    showToast('Withdrawal request submitted! Admin will process within 24h.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instructor Studio & Creator Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
            Creator Studio
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Author curriculums, track revenue payouts, and inspect student engagement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold"
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Request Payout</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="btn-primary py-2 px-4 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Available Balance</span>
            <span className="text-emerald-500 font-semibold font-mono">Ready</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-mono">$1,420.50</span>
            <span className="text-xs text-[var(--text-faint)] font-mono">USD</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Eligible for instant withdrawal</p>
        </div>

        <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Lifetime Revenue</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-mono">$48,250</span>
            <span className="text-xs text-[var(--text-faint)] font-mono">USD</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Net after 20% platform share</p>
        </div>

        <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Active Students</span>
            <span className="text-indigo-400 font-semibold font-mono">Enrolled</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-mono">34,180</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Across {courses.length} masterclasses</p>
        </div>

        <div className="app-card p-5 sm:p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Course Rating</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-current" /> 4.95
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-mono">4.95</span>
            <span className="text-xs text-[var(--text-faint)] font-mono">/ 5.0</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Ranked Top 1% of instructors</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'payouts'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-semibold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Earnings & Payouts ({payouts.length})</span>
        </button>
      </div>

      {/* TAB: COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="app-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                Course Catalog & Management
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Create new curriculums, edit content, delete, or test player preview.
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="btn-primary py-1.5 px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {courses.map((course) => {
              const lessonsCount = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

              return (
                <div
                  key={course.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                      <CourseImage
                        src={course.thumbnail}
                        alt={course.title}
                        category={course.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {course.category}
                        </span>
                        <span className="text-xs text-amber-400 font-medium flex items-center gap-1 font-mono">
                          <Star className="w-3 h-3 fill-current" /> {course.rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--text-main)] truncate mt-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                        {course.sections.length} Sections • {lessonsCount} Lessons • ${course.price} USD
                      </p>
                    </div>
                  </div>

                  {/* Actions: Preview, Edit, Delete */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewingCourse(course)}
                      className="btn-secondary py-1.5 px-2.5 text-xs"
                      title="Quick Preview Modal"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Preview</span>
                    </button>

                    {/* View Public Syllabus */}
                    <Link
                      href={`/courses/${course.id}`}
                      className="btn-secondary py-1.5 px-2.5 text-xs"
                      title="Open Public Course Page"
                    >
                      <span>Public</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Edit Course Button */}
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="btn-secondary py-1.5 px-2.5 text-xs text-amber-500 hover:text-amber-400"
                      title="Edit Course"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Course Button */}
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="app-card p-5 sm:p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                Payout History & Disbursements
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Withdrawals are processed directly to your connected bank account.
              </p>
            </div>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="btn-primary py-2 px-3.5 text-xs font-semibold"
            >
              Request Withdrawal
            </button>
          </div>

          <div className="app-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-main)]">
                <thead className="bg-[var(--bg-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] font-mono font-semibold">
                  <tr>
                    <th className="p-4">Payout Ref</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="p-4 font-mono font-semibold text-indigo-400">{p.payoutRef}</td>
                      <td className="p-4 font-medium text-[var(--text-main)]">{p.destinationAccount}</td>
                      <td className="p-4 font-bold font-mono text-[var(--text-main)]">${p.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${
                            p.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-[var(--text-muted)] font-mono">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-2xl app-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-150 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Create New Masterclass</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Author a brand-new engineering track for LearnSphere students</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Kafka Architecture"
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Headline / Summary</label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Architect high-throughput event streaming pipelines"
                  className="app-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="app-input font-mono"
                  >
                    <option value="Development">Development</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Difficulty Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="app-input font-mono"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="app-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Original Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="app-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="app-input font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Preview Video Embed URL</label>
                <input
                  type="url"
                  value={formData.previewVideoUrl}
                  onChange={(e) => setFormData({ ...formData, previewVideoUrl: e.target.value })}
                  placeholder="https://www.youtube-nocookie.com/embed/..."
                  className="app-input font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? <Spinner size="sm" /> : <span>Publish Course</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-2xl app-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-150 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Edit Course Information</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Update curriculum title, pricing, or media links</p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="app-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="app-input font-mono"
                  >
                    <option value="Development">Development</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="app-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="app-input font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? <Spinner size="sm" /> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div 
            className="w-full max-w-3xl app-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-[var(--text-main)] truncate max-w-md">
                  Student Preview: {previewingCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingCourse(null)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black w-full">
              <iframe
                src={`${previewingCourse.previewVideoUrl}?autoplay=1`}
                title="Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 bg-[var(--bg-surface)] flex items-center justify-between border-t border-[var(--border-subtle)]">
              <div>
                <p className="text-xs text-[var(--text-muted)]">{previewingCourse.headline}</p>
                <p className="text-xs font-semibold text-[var(--text-main)] mt-0.5">
                  ${previewingCourse.price} USD • {previewingCourse.durationHours} hrs • {previewingCourse.level}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/courses/${previewingCourse.id}/learn`}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Player</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-md app-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Request Revenue Withdrawal</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Available: $1,420.50 USD</p>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">
                  Withdrawal Amount ($ USD)
                </label>
                <input
                  type="number"
                  max={1420.50}
                  step="0.01"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="app-input font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-main)] mb-1">
                  Destination Account
                </label>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="app-input font-mono text-xs"
                >
                  <option value="Stripe Connect (**** 4829)">Stripe Connect (**** 4829)</option>
                  <option value="Direct ACH Bank Transfer (**** 9102)">Direct ACH Bank Transfer (**** 9102)</option>
                  <option value="Wise Multi-Currency (USD/EUR)">Wise Multi-Currency (USD/EUR)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? <Spinner size="sm" /> : <span>Confirm Payout</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
