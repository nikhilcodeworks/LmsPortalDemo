import { NextRequest, NextResponse } from 'next/server';
import { enrollUserInCourse } from '@/lib/courseStore';

export async function POST(request: NextRequest) {
  try {
    const { userId = 'user-student-1', courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
    }

    const updatedUser = await enrollUserInCourse(userId, courseId);
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to enroll' }, { status: 500 });
  }
}
