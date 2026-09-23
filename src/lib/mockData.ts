import { Course, UserProfile, PaymentTransaction, InstructorPayout } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    slug: 'fullstack-nextjs-mern-masterclass',
    title: 'Full-Stack Next.js 15 & Modern MERN Masterclass',
    headline: 'Build production-ready, ultra-fast web apps with Next.js, React 19, Node.js, and MongoDB.',
    description: 'A deep-dive comprehensive masterclass taking you from foundational concepts to architecting scalable, enterprise-grade fullstack web applications. Learn App Router, Server Actions, Mongoose schemas, caching strategies, and zero-latency UI designs.',
    category: 'Development',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
    price: 89,
    originalPrice: 199,
    rating: 4.9,
    reviewCount: 1420,
    studentsEnrolled: 8640,
    lastUpdated: 'October 2026',
    durationHours: 24,
    certificateOffered: true,
    status: 'published',
    isFeatured: true,
    instructor: {
      id: 'inst-1',
      name: 'Dr. Elena Vance',
      role: 'Principal Staff Engineer & Open Source Core Contributor',
      bio: 'Former Tech Lead at Vercel with 12+ years of experience building web platforms serving hundreds of millions of users globally.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coursesCount: 5,
      studentsCount: 34000,
      rating: 4.95,
    },
    tags: ['Next.js', 'React 19', 'MongoDB', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    learningOutcomes: [
      'Master Next.js 15 App Router, Server Components, and Server Actions',
      'Architect robust MongoDB schemas with Mongoose and high-performance indexing',
      'Implement bulletproof JWT authentication and RBAC security',
      'Build lightning-fast fluid UI with Tailwind CSS and glassmorphism',
      'Deploy fullstack production clusters with zero downtime'
    ],
    requirements: [
      'Basic familiarity with JavaScript (ES6+) and modern React hooks',
      'Basic understanding of HTTP, REST APIs, and database fundamentals',
      'Computer with Node.js 18+ installed'
    ],
    sections: [
      {
        id: 'sec-1-1',
        title: 'Section 1: Architecture & Foundation Setup',
        description: 'Mental models of React Server Components, hydration boundaries, and project bootstrap.',
        lessons: [
          {
            id: 'les-1-1-1',
            title: 'Welcome & System Architecture Overview',
            duration: '14:20',
            durationMinutes: 14,
            videoUrl: 'https://www.youtube-nocookie.com/embed/Sklc_poXR14',
            summary: 'Understand the big picture of Next.js 15 App Router paired with modern MERN backend services.',
            description: 'In this introductory lesson, Dr. Elena Vance walks you through the production architecture we will build. We cover client vs server components, request waterfalls, and modern state hydration.',
            keyTakeaways: [
              'Server Components render on the server and send zero JavaScript bundle to the browser.',
              'Client components handle interactivity, event listeners, and browser APIs.',
              'Strategic hydration boundaries minimize time-to-interactive (TTI).'
            ],
            codeSnippet: `// Server Component by default
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductFromDB(params.id);
  return (
    <div className="p-8">
      <h1>{product.title}</h1>
      <AddToCartButton productId={product.id} />
    </div>
  );
}`,
            resources: [
              { id: 'res-1', title: 'Architecture Diagram (PDF)', type: 'pdf', url: '#', size: '2.4 MB' },
              { id: 'res-2', title: 'Starter GitHub Repository', type: 'code', url: 'https://github.com' }
            ],
            quiz: {
              id: 'quiz-1-1-1',
              title: 'Server Components & Architecture Assessment',
              passingScore: 66,
              questions: [
                {
                  id: 'q1',
                  question: 'What is the default execution environment for components in the Next.js App Router?',
                  options: [
                    'Client Component (browser-only)',
                    'React Server Component (runs on server)',
                    'Edge runtime web worker',
                    'Static HTML without hydration'
                  ],
                  correctIndex: 1,
                  explanation: 'In the Next.js App Router, components are React Server Components by default unless marked with the "use client" directive.'
                },
                {
                  id: 'q2',
                  question: 'Which directive instructs React that a component needs client-side hooks like useState and useEffect?',
                  options: [
                    '"use server"',
                    '"use browser"',
                    '"use client"',
                    '"use reactive"'
                  ],
                  correctIndex: 2,
                  explanation: 'The "use client" directive placed at the top of a file declares boundary entry points for client interactivity.'
                },
                {
                  id: 'q3',
                  question: 'Why does Next.js Server Components improve frontend performance?',
                  options: [
                    'They run directly inside GPU shaders',
                    'Their dependencies do not inflate the client JavaScript bundle size',
                    'They disable all CSS animations',
                    'They eliminate the need for any database indexing'
                  ],
                  correctIndex: 1,
                  explanation: 'Server component code and libraries (like date-fns, markdown parsers, etc.) stay on the server, reducing the bytes sent to the client browser.'
                }
              ]
            }
          },
          {
            id: 'les-1-1-2',
            title: 'Modern TypeScript & Environment Configuration',
            duration: '18:45',
            durationMinutes: 19,
            videoUrl: 'https://www.youtube-nocookie.com/embed/kqtD5dpn9C8',
            summary: 'Setting up rigorous type safety, path aliases, environment variable validation with Zod.',
            description: 'Dive deep into TypeScript strict mode configurations, creating schema-validated runtime environment configurations, and preventing production secret leakages.',
            keyTakeaways: [
              'Always validate environment variables at startup with Zod.',
              'Never prefix secret API keys with NEXT_PUBLIC_.',
              'Use path aliases for clean, decoupled modular imports.'
            ],
            resources: [
              { id: 'res-3', title: 'Environment Config Template', type: 'code', url: '#' }
            ]
          }
        ]
      },
      {
        id: 'sec-1-2',
        title: 'Section 2: MongoDB Schemas, Mongoose & Route Handlers',
        description: 'Building the data layer, connection pooling, indexes, and resilient RESTful API handlers.',
        lessons: [
          {
            id: 'les-1-2-1',
            title: 'Designing High-Performance MongoDB Data Models',
            duration: '22:15',
            durationMinutes: 22,
            videoUrl: 'https://www.youtube-nocookie.com/embed/WDrU305J1yw',
            summary: 'Modeling relational concepts in NoSQL: embedding vs referencing, compounds indexes, and pagination.',
            description: 'Master NoSQL schema design patterns. Understand when to embed subdocuments (such as lesson chapters) versus referencing distinct collections (such as user progress and reviews).',
            keyTakeaways: [
              'Embed data when read together and bounded in size.',
              'Reference documents when relationships are many-to-many or unbounded.',
              'Always add compound indexes on frequent query predicates.'
            ],
            codeSnippet: `import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });`,
            resources: [
              { id: 'res-4', title: 'Mongoose Optimization Cheat Sheet', type: 'pdf', url: '#', size: '1.1 MB' }
            ]
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aarav Patel',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2 days ago',
        comment: 'The UI of this course player is unbelievable! The lessons are crisp, practical, and the architecture breakdowns are pure gold.'
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'generative-ai-autonomous-agents',
    title: 'Generative AI & Autonomous Agent Engineering',
    headline: 'Build intelligent LLM agents, multi-agent orchestrations, tool-calling pipelines, and vector RAG systems.',
    description: 'Master autonomous reasoning loops, LangGraph, vector embeddings, semantic retrieval, and building production-ready AI assistants with Python, LangChain, and modern web interfaces.',
    category: 'AI & ML',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/bZQun8Y4L2A',
    price: 99,
    originalPrice: 220,
    rating: 4.95,
    reviewCount: 980,
    studentsEnrolled: 6120,
    lastUpdated: 'September 2026',
    durationHours: 19,
    certificateOffered: true,
    status: 'published',
    isFeatured: true,
    instructor: {
      id: 'inst-2',
      name: 'Marcus Chen',
      role: 'Head of Applied AI Research',
      bio: 'Published author, former DeepMind researcher, and founder of multi-agent intelligence startup with 15k+ daily active users.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      coursesCount: 3,
      studentsCount: 22000,
      rating: 4.98,
    },
    tags: ['LLMs', 'LangGraph', 'Vector DB', 'RAG', 'Python', 'OpenAI'],
    learningOutcomes: [
      'Build autonomous ReAct reasoning loops with tool execution',
      'Implement hybrid semantic vector search with Pinecone and pgvector'
    ],
    requirements: ['Intermediate Python or JavaScript knowledge'],
    sections: [
      {
        id: 'sec-2-1',
        title: 'Section 1: Foundations of Agentic AI',
        description: 'From static prompts to autonomous agents.',
        lessons: [
          {
            id: 'les-2-1-1',
            title: 'Deconstructing the Agent Loop',
            duration: '16:40',
            durationMinutes: 17,
            videoUrl: 'https://www.youtube-nocookie.com/embed/bZQun8Y4L2A',
            summary: 'How LLMs utilize function calling specifications to plan.',
            description: 'Learn the architectural difference between simple chat and multi-agent workflows.',
            keyTakeaways: ['Agents require persistent scratchpads.'],
            resources: []
          }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'course-3',
    slug: 'modern-ui-ux-design-systems',
    title: 'Mastering High-End UI/UX: Design Systems & Micro-Interactions',
    headline: 'Transform your web applications into premium visual experiences with Figma, glassmorphism, and tactile animations.',
    description: 'Learn the craft of elite software design. Create cohesive color tokens, typographic hierarchies, fluid responsive layouts, and delightful micro-interactions that captivate users from first glance.',
    category: 'Design & UX',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/fA5lA-7_07s',
    price: 75,
    originalPrice: 150,
    rating: 4.88,
    reviewCount: 754,
    studentsEnrolled: 4890,
    lastUpdated: 'November 2026',
    durationHours: 16,
    certificateOffered: true,
    status: 'published',
    instructor: {
      id: 'inst-3',
      name: 'Maya Lin',
      role: 'Staff Product Designer',
      bio: 'Design Systems Architect who has designed award-winning products.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      coursesCount: 4,
      studentsCount: 18500,
      rating: 4.92,
    },
    tags: ['Figma', 'UI/UX', 'Design Systems'],
    learningOutcomes: ['Design comprehensive systems in Figma'],
    requirements: ['No previous design experience required'],
    sections: [],
    reviews: []
  },
  {
    id: 'course-4',
    slug: 'cloud-devops-kubernetes-system-design',
    title: 'Distributed Microservices & Cloud Infrastructure with Docker & K8s',
    headline: 'Deploy resilient high-availability systems with Docker, Kubernetes, CI/CD pipelines, and AWS cloud services.',
    description: 'Learn real-world cloud architecture. Containerize complex distributed apps, manage Kubernetes clusters, automate zero-downtime blue-green deployments, and master monitoring with Prometheus & Grafana.',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    previewVideoUrl: 'https://www.youtube-nocookie.com/embed/X48VuDVv0do',
    price: 95,
    originalPrice: 180,
    rating: 4.91,
    reviewCount: 620,
    studentsEnrolled: 3940,
    lastUpdated: 'August 2026',
    durationHours: 21,
    certificateOffered: true,
    status: 'published',
    instructor: {
      id: 'inst-4',
      name: 'Vikram Joshi',
      role: 'Principal Cloud Architect',
      bio: 'Cloud infrastructure veteran with 15+ years managing Kubernetes fleets.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      coursesCount: 2,
      studentsCount: 14000,
      rating: 4.89,
    },
    tags: ['Kubernetes', 'Docker', 'AWS'],
    learningOutcomes: ['Master Docker builds', 'Manage K8s clusters'],
    requirements: ['Basic Linux terminal familiarity'],
    sections: [],
    reviews: []
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'user-student-1',
  name: 'Aarav Sharma',
  email: 'student@learnsphere.io',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'student',
  enrolledCourseIds: ['course-1', 'course-2'],
  bookmarkedCourseIds: ['course-3', 'course-4'],
  progress: {
    'course-1': {
      courseId: 'course-1',
      completedLessonIds: ['les-1-1-1'],
      currentLessonId: 'les-1-1-2',
      notes: {
        'les-1-1-1': 'RSCs don\'t ship JS bundle to client. Client components need "use client". Remember hydration boundaries!'
      },
      quizResults: {
        'quiz-1-1-1': {
          score: 100,
          passed: true,
          completedAt: '2026-09-22T14:30:00Z'
        }
      }
    }
  },
  streakDays: 5,
  totalHoursLearned: 18.5,
  certificatesEarned: 1,
  status: 'active',
  joinedDate: 'August 2025'
};

export const DEMO_INSTRUCTOR: UserProfile = {
  id: 'inst-1',
  name: 'Dr. Elena Vance',
  email: 'instructor@learnsphere.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'instructor',
  enrolledCourseIds: [],
  bookmarkedCourseIds: [],
  progress: {},
  streakDays: 42,
  totalHoursLearned: 120,
  certificatesEarned: 12,
  status: 'active',
  joinedDate: 'March 2024'
};

export const DEMO_ADMIN: UserProfile = {
  id: 'admin-1',
  name: 'Alexander Cross',
  email: 'admin@learnsphere.io',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  enrolledCourseIds: [],
  bookmarkedCourseIds: [],
  progress: {},
  streakDays: 95,
  totalHoursLearned: 210,
  certificatesEarned: 18,
  status: 'active',
  joinedDate: 'January 2024'
};

export const INITIAL_USERS_LIST: UserProfile[] = [
  INITIAL_USER,
  DEMO_INSTRUCTOR,
  DEMO_ADMIN,
  {
    id: 'user-student-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'student',
    enrolledCourseIds: ['course-1'],
    bookmarkedCourseIds: [],
    progress: {},
    streakDays: 12,
    totalHoursLearned: 34,
    certificatesEarned: 2,
    status: 'active',
    joinedDate: 'June 2025'
  },
  {
    id: 'user-student-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    role: 'student',
    enrolledCourseIds: ['course-4'],
    bookmarkedCourseIds: ['course-1'],
    progress: {},
    streakDays: 3,
    totalHoursLearned: 8,
    certificatesEarned: 0,
    status: 'active',
    joinedDate: 'September 2025'
  },
  {
    id: 'user-instructor-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'instructor',
    enrolledCourseIds: [],
    bookmarkedCourseIds: [],
    progress: {},
    streakDays: 24,
    totalHoursLearned: 80,
    certificatesEarned: 5,
    status: 'active',
    joinedDate: 'February 2025'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-101',
    transactionRef: 'TXN-984210',
    userId: 'user-student-1',
    userName: 'Aarav Sharma',
    userEmail: 'student@learnsphere.io',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Next.js 15 & Modern MERN Masterclass',
    amount: 89,
    platformFee: 17.80, // 20% commission
    instructorShare: 71.20,
    paymentMethod: 'Stripe',
    status: 'completed',
    date: '2026-09-23 18:42',
  },
  {
    id: 'tx-102',
    transactionRef: 'TXN-984211',
    userId: 'user-student-2',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@example.com',
    courseId: 'course-2',
    courseTitle: 'Generative AI & Autonomous Agent Engineering',
    amount: 99,
    platformFee: 19.80,
    instructorShare: 79.20,
    paymentMethod: 'Credit Card',
    status: 'completed',
    date: '2026-09-23 16:15',
  },
  {
    id: 'tx-103',
    transactionRef: 'TXN-984212',
    userId: 'user-student-3',
    userName: 'Rohan Deshmukh',
    userEmail: 'rohan.d@example.com',
    courseId: 'course-4',
    courseTitle: 'Distributed Microservices with Docker & K8s',
    amount: 95,
    platformFee: 19.00,
    instructorShare: 76.00,
    paymentMethod: 'PayPal',
    status: 'completed',
    date: '2026-09-22 11:30',
  },
  {
    id: 'tx-104',
    transactionRef: 'TXN-984213',
    userId: 'user-student-4',
    userName: 'David Miller',
    userEmail: 'david.m@example.com',
    courseId: 'course-3',
    courseTitle: 'Mastering High-End UI/UX: Design Systems',
    amount: 75,
    platformFee: 15.00,
    instructorShare: 60.00,
    paymentMethod: 'Apple Pay',
    status: 'completed',
    date: '2026-09-21 09:20',
  },
  {
    id: 'tx-105',
    transactionRef: 'TXN-984214',
    userId: 'user-student-5',
    userName: 'Elena Rostova',
    userEmail: 'elena.r@example.com',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Next.js 15 & Modern MERN Masterclass',
    amount: 89,
    platformFee: 17.80,
    instructorShare: 71.20,
    paymentMethod: 'Credit Card',
    status: 'refunded',
    date: '2026-09-20 14:10',
  },
  {
    id: 'tx-106',
    transactionRef: 'TXN-984215',
    userId: 'user-student-6',
    userName: 'Kenji Sato',
    userEmail: 'kenji.s@example.com',
    courseId: 'course-2',
    courseTitle: 'Generative AI & Autonomous Agent Engineering',
    amount: 99,
    platformFee: 19.80,
    instructorShare: 79.20,
    paymentMethod: 'Stripe',
    status: 'pending',
    date: '2026-09-23 20:05',
  }
];

export const INITIAL_PAYOUTS: InstructorPayout[] = [
  {
    id: 'pay-201',
    payoutRef: 'PAY-88210',
    instructorId: 'inst-1',
    instructorName: 'Dr. Elena Vance',
    amount: 2450.00,
    status: 'paid',
    date: '2026-09-15',
    destinationAccount: 'Stripe Connect (**** 4829)',
  },
  {
    id: 'pay-202',
    payoutRef: 'PAY-88211',
    instructorId: 'inst-2',
    instructorName: 'Marcus Chen',
    amount: 1820.00,
    status: 'paid',
    date: '2026-09-18',
    destinationAccount: 'Bank Wire (**** 9102)',
  },
  {
    id: 'pay-203',
    payoutRef: 'PAY-88212',
    instructorId: 'inst-1',
    instructorName: 'Dr. Elena Vance',
    amount: 1420.50,
    status: 'pending',
    date: '2026-09-23',
    destinationAccount: 'Stripe Connect (**** 4829)',
  }
];
