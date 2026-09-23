'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Download, 
  Share2, 
  ArrowLeft, 
  Maximize2, 
  Check, 
  Copy, 
  ThumbsUp, 
  HelpCircle, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Course, Lesson } from '@/lib/types';
import { INITIAL_COURSES } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import QuizRunner from '@/components/QuizRunner';
import CertificateModal from '@/components/CertificateModal';

interface DiscussionQuestion {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  upvotes: number;
  hasUpvoted: boolean;
  reply?: string;
}

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { 
    user, 
    isEnrolled, 
    enrollInCourse, 
    getCourseProgress, 
    toggleLessonCompletion, 
    saveLessonNote, 
    recordQuizAttempt 
  } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'discussion' | 'resources' | 'quiz'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentNote, setCurrentNote] = useState('');
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Discussion state
  const [questions, setQuestions] = useState<DiscussionQuestion[]>([
    {
      id: 1,
      author: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      time: '2 hours ago',
      title: 'How should we handle caching invalidation across distributed edge nodes?',
      upvotes: 7,
      hasUpvoted: false,
      reply: 'Use revalidateTag() in Next.js Server Actions with tag-based caching for instantaneous targeted purge.',
    },
    {
      id: 2,
      author: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      time: '1 day ago',
      title: 'Can we run Mongoose connection caching in Next.js Edge runtime?',
      upvotes: 4,
      hasUpvoted: false,
      reply: 'Mongoose requires standard Node.js runtime for TCP sockets. For Edge, prefer Prisma Accelerate or MongoDB Data API.',
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  useEffect(() => {
    const found = INITIAL_COURSES.find(
      (c) => c.id === resolvedParams.id || c.slug === resolvedParams.id
    );
    if (found) {
      setCourse(found);
      // Auto enroll for preview if not enrolled
      if (!isEnrolled(found.id)) {
        enrollInCourse(found.id);
      }
      if (found.sections.length > 0 && found.sections[0].lessons.length > 0) {
        setActiveLesson(found.sections[0].lessons[0]);
      }
    }
  }, [resolvedParams.id]);

  // Load existing notes for this lesson
  useEffect(() => {
    if (course && activeLesson) {
      const progress = getCourseProgress(course.id);
      if (progress && progress.notes && progress.notes[activeLesson.id]) {
        setCurrentNote(progress.notes[activeLesson.id]);
      } else {
        setCurrentNote('');
      }
    }
  }, [course, activeLesson]);

  if (!course || !activeLesson) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-400">
        Loading Master Player...
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const completedLessonIds = progress?.completedLessonIds || [];
  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  // Calculate overall course progress
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
  const isCourseFullyCompleted = progressPercent === 100 || completedCount >= totalLessonsCount;

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  const handleToggleComplete = () => {
    toggleLessonCompletion(course.id, activeLesson.id);
  };

  const handleSaveNote = () => {
    saveLessonNote(course.id, activeLesson.id, currentNote);
    setNoteSavedAlert(true);
    setTimeout(() => setNoteSavedAlert(false), 2500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpvote = (id: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          upvotes: q.hasUpvoted ? q.upvotes - 1 : q.upvotes + 1,
          hasUpvoted: !q.hasUpvoted
        };
      }
      return q;
    }));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setQuestions([
      {
        id: Date.now(),
        author: user.name,
        avatar: user.avatar,
        time: 'Just now',
        title: newQuestionText,
        upvotes: 1,
        hasUpvoted: true,
      },
      ...questions
    ]);
    setNewQuestionText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090b] text-zinc-100 min-h-screen">
      
      {/* Player Top Navigation Bar */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Syllabus</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <span className="text-xs font-semibold text-zinc-200 truncate max-w-xs sm:max-w-md font-mono">
            {course.title}
          </span>
        </div>

        {/* Progress & Certificate Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">{progressPercent}% Done</span>
            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Certificate Trigger Button */}
          {isCourseFullyCompleted ? (
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 text-zinc-950 font-bold text-xs shadow-xs transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Claim Certificate</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 transition-colors"
              title="Preview certificate"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificate</span>
            </button>
          )}

          {/* Toggle Curriculum Drawer */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 transition-colors"
          >
            {isSidebarOpen ? 'Hide Drawer' : 'Show Drawer'}
          </button>
        </div>
      </div>

      {/* Main Layout: Video + Tabs & Curriculum Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Column: Video Stage + Interactive Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Video Stage */}
          <div className="bg-black flex items-center justify-center relative">
            <div className="w-full aspect-video max-h-[66vh] relative bg-black">
              <iframe
                src={`${activeLesson.videoUrl}?autoplay=1&rel=0`}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video Control & Action Strip */}
          <div className="p-4 sm:p-5 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Lecture {currentLessonIndex + 1} of {totalLessonsCount}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback speed selector */}
              <div className="flex items-center bg-zinc-900 rounded-md p-0.5 border border-zinc-800 font-mono text-xs">
                {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Mark Complete Button */}
              <button
                onClick={handleToggleComplete}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white hover:bg-zinc-200 text-zinc-950 shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              {/* Next Lesson Trigger */}
              {nextLesson && (
                <button
                  onClick={() => {
                    setActiveLesson(nextLesson);
                    if (!isCurrentCompleted) {
                      toggleLessonCompletion(course.id, activeLesson.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Lesson Tabs */}
          <div className="p-4 sm:p-6 flex-1">
            <div className="flex items-center gap-1 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto scrollbar-none font-mono text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>Live Notes</span>
                {currentNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'discussion'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>Q&A Discussion</span>
                <span className="text-[10px] text-zinc-500">({questions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'resources'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Resources ({activeLesson.resources?.length || 0})
              </button>

              {activeLesson.quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'quiz'
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  Assessment
                </button>
              )}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeLesson.description || activeLesson.summary}
                  </p>
                </div>

                {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Key Takeaways
                    </h4>
                    <ul className="space-y-2">
                      {activeLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeLesson.codeSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Code Example
                      </span>
                      <button
                        onClick={() => handleCopyCode(activeLesson.codeSnippet!)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 overflow-x-auto text-xs font-mono text-indigo-200">
                      <code>{activeLesson.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Your Personal Notes</h3>
                    <p className="text-xs text-slate-400">Notes are synchronized with your account & saved automatically.</p>
                  </div>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Save Notes
                  </button>
                </div>

                {noteSavedAlert && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Notes saved successfully!</span>
                  </div>
                )}

                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Capture thoughts, code snippets, or ideas for this lesson..."
                  rows={10}
                  className="w-full p-4 rounded-2xl glass-panel border border-white/15 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
                />
              </div>
            )}

            {/* Tab: Discussion */}
            {activeTab === 'discussion' && (
              <div className="max-w-4xl space-y-6">
                {/* Ask Question Box */}
                <form onSubmit={handleAddQuestion} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Ask a Question or Share an Insight
                  </h4>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Type your question for Dr. Elena Vance and fellow peers..."
                    rows={3}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newQuestionText.trim()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-40"
                    >
                      Post Question
                    </button>
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={q.avatar}
                            alt={q.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-white">{q.author}</span>
                            <span className="text-[10px] text-slate-400 block">{q.time}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUpvote(q.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            q.hasUpvoted
                              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{q.upvotes}</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 font-medium">
                        {q.title}
                      </p>

                      {q.reply && (
                        <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300">
                          <span className="font-bold text-indigo-400 block mb-1">
                            Instructor Response:
                          </span>
                          {q.reply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Resources */}
            {activeTab === 'resources' && (
              <div className="max-w-4xl space-y-3">
                {activeLesson.resources && activeLesson.resources.length > 0 ? (
                  activeLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-xs font-bold text-white">{res.title}</p>
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            {res.type} {res.size ? `• ${res.size}` : ''}
                          </span>
                        </div>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No downloadable assets for this lecture.
                  </p>
                )}
              </div>
            )}

            {/* Tab: Quiz */}
            {activeTab === 'quiz' && activeLesson.quiz && (
              <div className="max-w-3xl">
                <QuizRunner
                  quizId={activeLesson.quiz.id}
                  title={activeLesson.quiz.title}
                  passingScore={activeLesson.quiz.passingScore}
                  questions={activeLesson.quiz.questions}
                  onComplete={(score, passed) => {
                    recordQuizAttempt(course.id, activeLesson.quiz!.id, score, passed);
                    if (passed) {
                      toggleLessonCompletion(course.id, activeLesson.id);
                    }
                  }}
                />
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Collapsible Curriculum Drawer */}
        {isSidebarOpen && (
          <div className="w-full lg:w-96 glass-panel border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-auto lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 overflow-hidden">
            
            {/* Curriculum Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
              <span className="text-xs text-slate-400">
                {completedCount}/{totalLessonsCount} Completed
              </span>
            </div>

            {/* Sections & Lessons Accordion List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {course.sections.map((section, sIdx) => (
                <div key={section.id} className="p-2">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </div>

                  <div className="space-y-1">
                    {section.lessons.map((lesson) => {
                      const isActive = activeLesson.id === lesson.id;
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setActiveLesson(lesson);
                            if (activeTab === 'quiz' && !lesson.quiz) {
                              setActiveTab('overview');
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-all ${
                            isActive
                              ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-md'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span>{lesson.duration}</span>
                              {lesson.quiz && (
                                <span className="text-purple-400 font-bold">• Quiz</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        course={course}
        studentName={user.name}
        certificateId={progress?.certificateId || 'CERT-LS-78942'}
      />

    </div>
  );
}
