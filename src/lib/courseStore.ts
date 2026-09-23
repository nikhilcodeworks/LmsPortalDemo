import { INITIAL_COURSES, INITIAL_USER, DEMO_INSTRUCTOR } from './mockData';
import { Course, UserProgress, UserProfile } from './types';
import { connectToDatabase } from './db';
import { CourseModel, ProgressModel } from './models';

// In-memory data store for development & zero-setup launch
let inMemoryCourses: Course[] = JSON.parse(JSON.stringify(INITIAL_COURSES));
let inMemoryUsers: { [id: string]: UserProfile } = {
  [INITIAL_USER.id]: JSON.parse(JSON.stringify(INITIAL_USER)),
  [DEMO_INSTRUCTOR.id]: JSON.parse(JSON.stringify(DEMO_INSTRUCTOR)),
};

export async function getAllCourses(query?: { category?: string; search?: string; level?: string }): Promise<Course[]> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const filter: any = {};
      if (query?.category && query.category !== 'All') {
        filter.category = query.category;
      }
      if (query?.level && query.level !== 'All') {
        filter.level = query.level;
      }
      if (query?.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { headline: { $regex: query.search, $options: 'i' } },
          { tags: { $regex: query.search, $options: 'i' } }
        ];
      }
      const courses = await CourseModel.find(filter).lean();
      if (courses && courses.length > 0) {
        return courses as unknown as Course[];
      }
    }
  } catch (err) {
    console.warn('MongoDB query failed, using in-memory store:', err);
  }

  // In-memory filtering fallback
  let list = [...inMemoryCourses];
  if (query?.category && query.category !== 'All') {
    list = list.filter((c) => c.category.toLowerCase() === query.category?.toLowerCase());
  }
  if (query?.level && query.level !== 'All') {
    list = list.filter((c) => c.level.toLowerCase() === query.level?.toLowerCase());
  }
  if (query?.search) {
    const s = query.search.toLowerCase();
    list = list.filter((c) =>
      c.title.toLowerCase().includes(s) ||
      c.headline.toLowerCase().includes(s) ||
      c.instructor.name.toLowerCase().includes(s) ||
      c.tags.some((t) => t.toLowerCase().includes(s))
    );
  }
  return list;
}

export async function getCourseById(idOrSlug: string): Promise<Course | null> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const course = await CourseModel.findOne({
        $or: [{ id: idOrSlug }, { slug: idOrSlug }]
      }).lean();
      if (course) return course as unknown as Course;
    }
  } catch (err) {
    console.warn('MongoDB find failed, checking in-memory store:', err);
  }

  const found = inMemoryCourses.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  return found || null;
}

export async function saveNewCourse(courseData: Partial<Course>): Promise<Course> {
  const newCourse: Course = {
    id: `course-${Date.now()}`,
    slug: (courseData.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: courseData.title || 'Untitled Masterclass',
    headline: courseData.headline || 'Comprehensive practical course',
    description: courseData.description || 'Master key principles in this comprehensive course.',
    category: courseData.category || 'Development',
    level: courseData.level || 'All Levels',
    thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: courseData.previewVideoUrl || 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
    price: courseData.price ?? 49,
    originalPrice: courseData.originalPrice ?? 99,
    rating: 5.0,
    reviewCount: 0,
    studentsEnrolled: 0,
    lastUpdated: 'Just now',
    durationHours: courseData.durationHours || 8,
    certificateOffered: true,
    instructor: courseData.instructor || {
      id: 'inst-1',
      name: 'Dr. Elena Vance',
      role: 'Lead Instructor',
      bio: 'Instructor and practitioner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coursesCount: 6,
      studentsCount: 34100,
      rating: 4.95,
    },
    tags: courseData.tags || ['Next.js', 'Engineering'],
    learningOutcomes: courseData.learningOutcomes || ['Build real-world applications', 'Deploy to production'],
    requirements: courseData.requirements || ['Basic computer literacy'],
    sections: courseData.sections || [
      {
        id: `sec-${Date.now()}-1`,
        title: 'Section 1: Getting Started',
        description: 'Course introduction and setup.',
        lessons: [
          {
            id: `les-${Date.now()}-1-1`,
            title: 'Welcome to the Course',
            duration: '10:00',
            durationMinutes: 10,
            videoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
            summary: 'Course introduction and key roadmap overview.',
            description: 'An overview of what we will build throughout this course.',
            keyTakeaways: ['Learn the curriculum overview', 'Setup your environment'],
            resources: []
          }
        ]
      }
    ],
    reviews: []
  };

  try {
    const db = await connectToDatabase();
    if (db) {
      await CourseModel.create(newCourse);
    }
  } catch (err) {
    console.warn('Failed to save to MongoDB, saving in-memory:', err);
  }

  inMemoryCourses.unshift(newCourse);
  return newCourse;
}

export async function getUserProgress(userId: string, courseId: string): Promise<UserProgress> {
  try {
    const db = await connectToDatabase();
    if (db) {
      const prog = await ProgressModel.findOne({ userId, courseId }).lean();
      if (prog) return prog as unknown as UserProgress;
    }
  } catch (err) {
    console.warn('MongoDB progress lookup error:', err);
  }

  const user = inMemoryUsers[userId] || inMemoryUsers[INITIAL_USER.id];
  if (user?.progress[courseId]) {
    return user.progress[courseId];
  }

  // Default empty progress
  const defaultProg: UserProgress = {
    courseId,
    completedLessonIds: [],
    currentLessonId: '',
    notes: {},
    quizResults: {}
  };
  return defaultProg;
}

export async function updateUserLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  completed: boolean
): Promise<UserProgress> {
  const user = inMemoryUsers[userId] || inMemoryUsers[INITIAL_USER.id];
  if (!user.progress[courseId]) {
    user.progress[courseId] = {
      courseId,
      completedLessonIds: [],
      currentLessonId: lessonId,
      notes: {},
      quizResults: {}
    };
  }

  const prog = user.progress[courseId];
  prog.currentLessonId = lessonId;

  if (completed) {
    if (!prog.completedLessonIds.includes(lessonId)) {
      prog.completedLessonIds.push(lessonId);
    }
  } else {
    prog.completedLessonIds = prog.completedLessonIds.filter((id) => id !== lessonId);
  }

  // Check if course has 100% completed
  const course = inMemoryCourses.find((c) => c.id === courseId);
  if (course) {
    const allLessonIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const allDone = allLessonIds.every((id) => prog.completedLessonIds.includes(id));
    if (allDone && !prog.certificateId) {
      prog.completedAt = new Date().toISOString();
      prog.certificateId = `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      user.certificatesEarned += 1;
    }
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      await ProgressModel.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            completedLessonIds: prog.completedLessonIds,
            currentLessonId: prog.currentLessonId,
            completedAt: prog.completedAt,
            certificateId: prog.certificateId
          }
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.warn('Failed to update progress in MongoDB:', err);
  }

  return prog;
}

export async function saveLessonNote(
  userId: string,
  courseId: string,
  lessonId: string,
  note: string
): Promise<UserProgress> {
  const user = inMemoryUsers[userId] || inMemoryUsers[INITIAL_USER.id];
  if (!user.progress[courseId]) {
    user.progress[courseId] = {
      courseId,
      completedLessonIds: [],
      currentLessonId: lessonId,
      notes: {},
      quizResults: {}
    };
  }
  user.progress[courseId].notes[lessonId] = note;
  return user.progress[courseId];
}

export async function recordQuizResult(
  userId: string,
  courseId: string,
  quizId: string,
  score: number,
  passed: boolean
): Promise<UserProgress> {
  const user = inMemoryUsers[userId] || inMemoryUsers[INITIAL_USER.id];
  if (!user.progress[courseId]) {
    user.progress[courseId] = {
      courseId,
      completedLessonIds: [],
      currentLessonId: '',
      notes: {},
      quizResults: {}
    };
  }
  user.progress[courseId].quizResults[quizId] = {
    score,
    passed,
    completedAt: new Date().toISOString()
  };
  return user.progress[courseId];
}

export async function enrollUserInCourse(userId: string, courseId: string): Promise<UserProfile> {
  const user = inMemoryUsers[userId] || inMemoryUsers[INITIAL_USER.id];
  if (!user.enrolledCourseIds.includes(courseId)) {
    user.enrolledCourseIds.push(courseId);
  }
  if (!user.progress[courseId]) {
    user.progress[courseId] = {
      courseId,
      completedLessonIds: [],
      currentLessonId: '',
      notes: {},
      quizResults: {}
    };
  }
  return user;
}
