export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'zip';
  url: string;
  size?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "12:45"
  durationMinutes: number;
  videoUrl: string; // Embed or mp4 URL
  summary: string;
  description: string;
  keyTakeaways: string[];
  codeSnippet?: string;
  resources: LessonResource[];
  quiz?: {
    id: string;
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  category: 'Development' | 'AI & ML' | 'Design & UX' | 'Cloud & DevOps' | 'System Architecture';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  thumbnail: string;
  previewVideoUrl: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  lastUpdated: string;
  durationHours: number;
  certificateOffered: boolean;
  instructor: Instructor;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  sections: Section[];
  reviews: Review[];
  status?: 'published' | 'draft' | 'under-review';
  isFeatured?: boolean;
}

export interface UserProgress {
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
  notes: { [lessonId: string]: string };
  quizResults: { [quizId: string]: { score: number; passed: boolean; completedAt: string } };
  completedAt?: string;
  certificateId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourseIds: string[];
  bookmarkedCourseIds: string[];
  progress: { [courseId: string]: UserProgress };
  streakDays: number;
  totalHoursLearned: number;
  certificatesEarned: number;
  status?: 'active' | 'suspended';
  joinedDate?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  platformFee: number;
  instructorShare: number;
  paymentMethod: 'Stripe' | 'Credit Card' | 'PayPal' | 'Apple Pay';
  status: 'completed' | 'refunded' | 'pending';
  date: string;
}

export interface InstructorPayout {
  id: string;
  payoutRef: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
  date: string;
  destinationAccount: string;
}
