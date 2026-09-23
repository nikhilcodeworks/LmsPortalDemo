import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/courseStore';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const course = await getCourseById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve course' },
      { status: 500 }
    );
  }
}
