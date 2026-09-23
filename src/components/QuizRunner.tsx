'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';

interface QuizRunnerProps {
  quizId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizRunner({
  quizId,
  title,
  passingScore,
  questions,
  onComplete,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = calculatedScore >= passingScore;
    setScore(calculatedScore);
    setSubmitted(true);

    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onComplete(calculatedScore, passed);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined;
  const allAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="rounded-2xl glass-panel border border-white/10 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Assessment Module
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">{title}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Passing Score: </span>
          <span className="text-xs font-bold text-emerald-400">{passingScore}%</span>
        </div>
      </div>

      {!submitted ? (
        <div>
          {/* Question Stepper */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-semibold text-slate-100 mb-6 leading-relaxed">
            {currentQ.question}
          </h4>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              );
            })}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous
            </button>

            {currentIndex === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/20">
            {score >= passingScore ? (
              <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-400" />
            )}
          </div>

          <h4 className="text-2xl font-black text-white">
            {score >= passingScore ? 'Mastery Achieved! 🎉' : 'Needs Review'}
          </h4>
          <p className="text-sm text-slate-400 mt-1">
            You scored <span className="font-bold text-white">{score}%</span> (Minimum needed: {passingScore}%)
          </p>

          {/* Breakdown Review of Questions */}
          <div className="mt-8 text-left space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Explanations & Review
            </h5>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-rose-500/10 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-slate-300">Your choice:</span>{' '}
                        {q.options[userAns]}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-emerald-400 mt-0.5">
                          <span className="font-semibold">Correct answer:</span>{' '}
                          {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2 bg-black/30 p-2.5 rounded-lg border border-white/5">
                        <span className="font-semibold text-slate-300">Explanation:</span>{' '}
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
