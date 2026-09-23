import mongoose, { Schema, Model } from 'mongoose';

// Sub-schemas
const ResourceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'code', 'link', 'zip'], default: 'link' },
  url: { type: String, required: true },
  size: { type: String }
}, { _id: false });

const QuizQuestionSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const LessonSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  durationMinutes: { type: Number, default: 10 },
  videoUrl: { type: String, required: true },
  summary: { type: String },
  description: { type: String },
  keyTakeaways: [{ type: String }],
  codeSnippet: { type: String },
  resources: [ResourceSchema],
  quiz: {
    id: String,
    title: String,
    passingScore: Number,
    questions: [QuizQuestionSchema]
  }
}, { _id: false });

const SectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  lessons: [LessonSchema]
}, { _id: false });

const InstructorSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  coursesCount: { type: Number, default: 0 },
  studentsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5 }
}, { _id: false });

const ReviewSchema = new Schema({
  id: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, default: () => new Date().toISOString() },
  comment: { type: String, required: true }
}, { _id: false });

// Course Model
const CourseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Development', 'AI & ML', 'Design & UX', 'Cloud & DevOps', 'System Architecture'],
    required: true 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  thumbnail: { type: String, required: true },
  previewVideoUrl: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  studentsEnrolled: { type: Number, default: 0 },
  lastUpdated: { type: String, default: 'October 2026' },
  durationHours: { type: Number, default: 10 },
  certificateOffered: { type: Boolean, default: true },
  instructor: InstructorSchema,
  tags: [{ type: String }],
  learningOutcomes: [{ type: String }],
  requirements: [{ type: String }],
  sections: [SectionSchema],
  reviews: [ReviewSchema]
}, { timestamps: true });

// User Progress Model
const ProgressSchema = new Schema({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  completedLessonIds: [{ type: String }],
  currentLessonId: { type: String },
  notes: { type: Map, of: String, default: {} },
  quizResults: {
    type: Map,
    of: new Schema({
      score: Number,
      passed: Boolean,
      completedAt: String
    }, { _id: false }),
    default: {}
  },
  completedAt: { type: String },
  certificateId: { type: String }
}, { timestamps: true });

export const CourseModel = (mongoose.models.Course as Model<any>) || mongoose.model('Course', CourseSchema);
export const ProgressModel = (mongoose.models.Progress as Model<any>) || mongoose.model('Progress', ProgressSchema);
