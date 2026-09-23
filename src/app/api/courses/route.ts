import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, saveNewCourse } from '@/lib/courseStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const level = searchParams.get('level') || undefined;
    const search = searchParams.get('search') || undefined;

    const courses = await getAllCourses({ category, level, search });
    return NextResponse.json({ success: true, count: courses.length, data: courses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Course title and category are required' },
        { status: 400 }
      );
    }

    const created = await saveNewCourse(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create course' },
      { status: 500 }
    );
  }
}
