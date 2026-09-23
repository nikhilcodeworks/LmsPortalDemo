'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Download, Printer, X, ShieldCheck, CheckCircle } from 'lucide-react';
import { Course } from '@/lib/types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  studentName: string;
  certificateId: string;
  issueDate?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  course,
  studentName,
  certificateId,
  issueDate = 'September 23, 2026',
}: CertificateModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#eab308'],
        });
      } catch (err) {
        console.warn('Confetti animation error:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div 
        className="w-full max-w-4xl glass-panel rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2 text-indigo-400">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white">Verified Certificate of Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-slate-900 to-slate-950 flex justify-center print:p-0">
          <div className="w-full max-w-3xl aspect-[1.414/1] relative p-8 sm:p-12 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border-4 border-amber-500/40 shadow-2xl flex flex-col justify-between text-center overflow-hidden">
            
            {/* Background luxury watermark seals */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-amber-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-amber-500/10 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Top Header */}
            <div>
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-amber-400">
                LearnSphere Institute of Technology
              </h2>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                Certificate of Completion
              </h1>
              <p className="text-xs text-slate-400 mt-1">This official certificate is proudly conferred upon</p>
            </div>

            {/* Recipient Name */}
            <div className="my-4">
              <span className="text-2xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 border-b-2 border-amber-500/30 pb-2 px-6 inline-block">
                {studentName}
              </span>
            </div>

            {/* Course Accomplishment Details */}
            <div className="max-w-xl mx-auto space-y-2">
              <p className="text-xs sm:text-sm text-slate-300">
                for successfully completing all rigorous lecture requirements, code laboratories, and master-level assessments in
              </p>
              <h3 className="text-base sm:text-xl font-bold text-indigo-300">
                {course.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Curriculum verified for {course.durationHours} Credit Hours under faculty supervision
              </p>
            </div>

            {/* Footer with Signatures & Official ID */}
            <div className="pt-6 border-t border-white/10 flex items-end justify-between text-left text-xs">
              <div>
                <p className="font-serif italic text-base sm:text-lg text-slate-200 border-b border-slate-600 pb-1">
                  {course.instructor.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Faculty Lead & Instructor
                </p>
              </div>

              {/* Gold Verification Seal */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                  <ShieldCheck className="w-7 h-7 text-slate-950" />
                </div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-mono mt-1 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="text-right">
                <p className="font-mono text-slate-300 text-xs">
                  {issueDate}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  ID: {certificateId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Dismiss */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
