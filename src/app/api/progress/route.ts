import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserProgress, 
  updateUserLessonProgress, 
  saveLessonNote, 
  recordQuizResult 
} from '@/lib/courseStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-student-1';
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
    }

    const progress = await getUserProgress(userId, courseId);
    return NextResponse.json({ success: true, data: progress });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId = 'user-student-1', courseId } = body;

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'courseId required' }, { status: 400 });
    }

    if (action === 'toggle-lesson') {
      const { lessonId, completed } = body;
      const updated = await updateUserLessonProgress(userId, courseId, lessonId, completed);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'save-note') {
      const { lessonId, note } = body;
      const updated = await saveLessonNote(userId, courseId, lessonId, note);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'submit-quiz') {
      const { quizId, score, passed } = body;
      const updated = await recordQuizResult(userId, courseId, quizId, score, passed);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed' }, { status: 500 });
  }
}
