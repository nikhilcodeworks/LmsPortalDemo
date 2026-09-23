'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserProgress } from '@/lib/types';
import { INITIAL_USER, DEMO_INSTRUCTOR, DEMO_ADMIN } from '@/lib/mockData';

interface AuthContextType {
  user: UserProfile;
  role: 'student' | 'instructor' | 'admin';
  isAuthenticated: boolean;
  switchRole: (role: 'student' | 'instructor' | 'admin') => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, role?: 'student' | 'instructor') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  toggleBookmark: (courseId: string) => void;
  isBookmarked: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => UserProgress | null;
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  saveLessonNote: (courseId: string, lessonId: string, note: string) => void;
  recordQuizAttempt: (courseId: string, quizId: string, score: number, passed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lms_user_state');
      const authFlag = localStorage.getItem('lms_is_authenticated');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
      if (authFlag !== null) {
        setIsAuthenticated(authFlag === 'true');
      }
    } catch (e) {
      console.error('Error loading saved user state:', e);
    }
  }, []);

  const saveUserState = (updated: UserProfile, isAuth = true) => {
    setCurrentUser(updated);
    setIsAuthenticated(isAuth);
    try {
      localStorage.setItem('lms_user_state', JSON.stringify(updated));
      localStorage.setItem('lms_is_authenticated', String(isAuth));
    } catch (e) {
      console.error('Error saving user state:', e);
    }
  };

  const switchRole = (newRole: 'student' | 'instructor' | 'admin') => {
    if (newRole === 'admin') {
      saveUserState({
        ...DEMO_ADMIN,
        progress: currentUser.progress,
      });
    } else if (newRole === 'instructor') {
      saveUserState({
        ...DEMO_INSTRUCTOR,
        progress: currentUser.progress,
      });
    } else {
      saveUserState(INITIAL_USER);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial 600ms delay to display loader beautifully
    await new Promise((r) => setTimeout(r, 600));

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'admin@learnsphere.io' && pass === 'admin123') {
      saveUserState(DEMO_ADMIN);
      return { success: true };
    }

    if (cleanEmail === 'instructor@learnsphere.io' && pass === 'instructor123') {
      saveUserState(DEMO_INSTRUCTOR);
      return { success: true };
    }

    if (cleanEmail === 'student@learnsphere.io' && pass === 'student123') {
      saveUserState(INITIAL_USER);
      return { success: true };
    }

    // Generic fallback login
    if (pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const customUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'student',
      enrolledCourseIds: ['course-1'],
      bookmarkedCourseIds: [],
      progress: {},
      streakDays: 1,
      totalHoursLearned: 0,
      certificatesEarned: 0,
      status: 'active',
      joinedDate: 'Just now',
    };

    saveUserState(customUser);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    role: 'student' | 'instructor' = 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));

    if (!name.trim() || !email.trim() || pass.length < 4) {
      return { success: false, error: 'Please fill in all fields (minimum 4 characters password).' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role,
      enrolledCourseIds: [],
      bookmarkedCourseIds: [],
      progress: {},
      streakDays: 1,
      totalHoursLearned: 0,
      certificatesEarned: 0,
      status: 'active',
      joinedDate: 'Just now',
    };

    saveUserState(newUser);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('lms_is_authenticated', 'false');
  };

  const enrollInCourse = (courseId: string) => {
    if (currentUser.enrolledCourseIds.includes(courseId)) return;
    const updated: UserProfile = {
      ...currentUser,
      enrolledCourseIds: [...currentUser.enrolledCourseIds, courseId],
      progress: {
        ...currentUser.progress,
        [courseId]: {
          courseId,
          completedLessonIds: [],
          currentLessonId: '',
          notes: {},
          quizResults: {},
        },
      },
    };
    saveUserState(updated);

    fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, courseId }),
    }).catch(console.warn);
  };

  const isEnrolled = (courseId: string) => {
    return currentUser.enrolledCourseIds.includes(courseId);
  };

  const toggleBookmark = (courseId: string) => {
    const isBookmarked = currentUser.bookmarkedCourseIds.includes(courseId);
    const updated: UserProfile = {
      ...currentUser,
      bookmarkedCourseIds: isBookmarked
        ? currentUser.bookmarkedCourseIds.filter((id) => id !== courseId)
        : [...currentUser.bookmarkedCourseIds, courseId],
    };
    saveUserState(updated);
  };

  const isBookmarked = (courseId: string) => {
    return currentUser.bookmarkedCourseIds.includes(courseId);
  };

  const getCourseProgress = (courseId: string): UserProgress | null => {
    return currentUser.progress[courseId] || null;
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    const existing = currentUser.progress[courseId] || {
      courseId,
      completedLessonIds: [],
      currentLessonId: lessonId,
      notes: {},
      quizResults: {},
    };

    const isDone = existing.completedLessonIds.includes(lessonId);
    const newCompleted = isDone
      ? existing.completedLessonIds.filter((id) => id !== lessonId)
      : [...existing.completedLessonIds, lessonId];

    const updatedProg: UserProgress = {
      ...existing,
      completedLessonIds: newCompleted,
      currentLessonId: lessonId,
    };

    if (!existing.certificateId && newCompleted.length >= 2) {
      updatedProg.completedAt = new Date().toISOString();
      updatedProg.certificateId = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const updated: UserProfile = {
      ...currentUser,
      progress: {
        ...currentUser.progress,
        [courseId]: updatedProg,
      },
      certificatesEarned: updatedProg.certificateId ? currentUser.certificatesEarned + 1 : currentUser.certificatesEarned,
    };

    saveUserState(updated);

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle-lesson',
        userId: currentUser.id,
        courseId,
        lessonId,
        completed: !isDone,
      }),
    }).catch(console.warn);
  };

  const saveLessonNote = (courseId: string, lessonId: string, note: string) => {
    const existing = currentUser.progress[courseId] || {
      courseId,
      completedLessonIds: [],
      currentLessonId: lessonId,
      notes: {},
      quizResults: {},
    };

    const updatedProg: UserProgress = {
      ...existing,
      notes: {
        ...existing.notes,
        [lessonId]: note,
      },
    };

    const updated: UserProfile = {
      ...currentUser,
      progress: {
        ...currentUser.progress,
        [courseId]: updatedProg,
      },
    };

    saveUserState(updated);

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save-note',
        userId: currentUser.id,
        courseId,
        lessonId,
        note,
      }),
    }).catch(console.warn);
  };

  const recordQuizAttempt = (courseId: string, quizId: string, score: number, passed: boolean) => {
    const existing = currentUser.progress[courseId] || {
      courseId,
      completedLessonIds: [],
      currentLessonId: '',
      notes: {},
      quizResults: {},
    };

    const updatedProg: UserProgress = {
      ...existing,
      quizResults: {
        ...existing.quizResults,
        [quizId]: {
          score,
          passed,
          completedAt: new Date().toISOString(),
        },
      },
    };

    const updated: UserProfile = {
      ...currentUser,
      progress: {
        ...currentUser.progress,
        [courseId]: updatedProg,
      },
    };

    saveUserState(updated);

    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit-quiz',
        userId: currentUser.id,
        courseId,
        quizId,
        score,
        passed,
      }),
    }).catch(console.warn);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role: currentUser.role,
        isAuthenticated,
        switchRole,
        login,
        signup,
        logout,
        enrollInCourse,
        isEnrolled,
        toggleBookmark,
        isBookmarked,
        getCourseProgress,
        toggleLessonCompletion,
        saveLessonNote,
        recordQuizAttempt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
