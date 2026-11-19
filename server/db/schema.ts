import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

// ==========================================
// DRIZZLE ORM POSTGRESQL TABLES
// ==========================================

export const userRoleEnum = pgEnum('user_role', ['STUDENT', 'ADMIN', 'RESEARCHER']);

const createdAt = () => timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull();
const updatedAt = () => timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull();

export const usersTable = pgTable(
  'users',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum('role').default('STUDENT').notNull(),
    preferredLanguage: varchar('preferred_language', { length: 64 }).default('Telugu').notNull(),
    preferredDifficulty: varchar('preferred_difficulty', { length: 32 }).default('INTERMEDIATE').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

export const users = usersTable;

export const userProfilesTable = pgTable(
  'user_profiles',
  {
    userId: varchar('user_id', { length: 128 })
      .primaryKey()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    bio: text('bio'),
    currentCollege: varchar('current_college', { length: 255 }),
    yearOfStudy: varchar('year_of_study', { length: 64 }),
    specialization: varchar('specialization', { length: 255 }),
    preferredDifficulty: varchar('preferred_difficulty', { length: 32 }).default('INTERMEDIATE'),
    interests: jsonb('interests').$type<string[]>(),
    notificationPreferences: jsonb('notification_preferences').$type<any>(),
    studentId: varchar('student_id', { length: 128 }),
    department: varchar('department', { length: 255 }),
    degree: varchar('degree', { length: 128 }),
    semester: varchar('semester', { length: 64 }),
    cgpaTarget: varchar('cgpa_target', { length: 64 }),
    careerGoal: varchar('career_goal', { length: 255 }),
    preferredLanguagesCoding: jsonb('preferred_languages_coding').$type<string[]>(),
    dailyStudyGoalMinutes: integer('daily_study_goal_minutes').default(30),
    githubUsername: varchar('github_username', { length: 128 }),
    linkedinUrl: varchar('linkedin_url', { length: 255 }),
    portfolioUrl: varchar('portfolio_url', { length: 255 }),
    stateOrRegion: varchar('state_or_region', { length: 128 }),
    updatedAt: updatedAt(),
  }
);

export const conversationsTable = pgTable(
  'conversations',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    sourceLanguage: varchar('source_language', { length: 64 }).default('English').notNull(),
    targetLanguage: varchar('target_language', { length: 64 }).default('Telugu').notNull(),
    subject: varchar('subject', { length: 128 }).default('Operating Systems').notNull(),
    difficulty: varchar('difficulty', { length: 32 }).default('INTERMEDIATE').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    userIdx: index('conversations_user_idx').on(table.userId),
  })
);

export const messagesTable = pgTable(
  'messages',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    conversationId: varchar('conversation_id', { length: 128 })
      .notNull()
      .references(() => conversationsTable.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 32 }).notNull(), // 'user' | 'assistant'
    content: text('content').notNull(),
    structuredResponse: jsonb('structured_response').$type<StructuredAIResponse>(),
    sourceLanguage: varchar('source_language', { length: 64 }).default('English').notNull(),
    targetLanguage: varchar('target_language', { length: 64 }).default('Telugu').notNull(),
    subject: varchar('subject', { length: 128 }).default('Operating Systems').notNull(),
    difficulty: varchar('difficulty', { length: 32 }).default('INTERMEDIATE').notNull(),
    createdAt: createdAt(),
  },
  (table) => ({
    convIdx: index('messages_conv_idx').on(table.conversationId),
  })
);

export const terminologyTable = pgTable(
  'terminology',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    englishTerm: varchar('english_term', { length: 255 }).notNull(),
    language: varchar('language', { length: 64 }).notNull(),
    preferredTranslation: varchar('preferred_translation', { length: 255 }).notNull(),
    alternativeTranslations: jsonb('alternative_translations').$type<string[]>(),
    doNotTranslate: boolean('do_not_translate').default(true).notNull(),
    subject: varchar('subject', { length: 128 }).notNull(),
    explanation: text('explanation').notNull(),
    explanationEn: text('explanation_en'),
    technicalMeaning: text('technical_meaning'),
    technicalMeaningEn: text('technical_meaning_en'),
    technicalExample: text('technical_example'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    subjLangIdx: index('terminology_subj_lang_idx').on(table.subject, table.language),
  })
);

export const quizzesTable = pgTable(
  'quizzes',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    topic: varchar('topic', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 128 }).notNull(),
    language: varchar('language', { length: 64 }).notNull(),
    difficulty: varchar('difficulty', { length: 32 }).notNull(),
    questionCount: integer('question_count').notNull(),
    type: varchar('type', { length: 32 }).default('MCQ').notNull(),
    questions: jsonb('questions').$type<QuizQuestion[]>().notNull(),
    score: integer('score').default(0),
    createdAt: createdAt(),
  },
  (table) => ({
    userIdx: index('quizzes_user_idx').on(table.userId),
  })
);

export const quizAttemptsTable = pgTable(
  'quiz_attempts',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    quizId: varchar('quiz_id', { length: 128 })
      .notNull()
      .references(() => quizzesTable.id, { onDelete: 'cascade' }),
    topic: varchar('topic', { length: 255 }).default(''),
    subject: varchar('subject', { length: 128 }).default(''),
    language: varchar('language', { length: 64 }).default(''),
    score: integer('score').notNull(),
    totalQuestions: integer('total_questions').notNull(),
    percentage: integer('percentage').notNull(),
    answers: jsonb('answers').$type<any[]>().notNull(),
    weakTopics: jsonb('weak_topics').$type<string[]>(),
    completionStatus: varchar('completion_status', { length: 64 }).default('COMPLETED').notNull(),
    createdAt: createdAt(),
  },
  (table) => ({
    userIdx: index('quiz_attempts_user_idx').on(table.userId),
    quizIdx: index('quiz_attempts_quiz_idx').on(table.quizId),
  })
);

export const progressTable = pgTable(
  'progress',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    topic: varchar('topic', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 128 }).notNull(),
    questionsAsked: integer('questions_asked').default(0).notNull(),
    quizzesCompleted: integer('quizzes_completed').default(0).notNull(),
    correctAnswers: integer('correct_answers').default(0).notNull(),
    totalAnswers: integer('total_answers').default(0).notNull(),
    mastery: integer('mastery').default(0).notNull(),
    lastActivity: timestamp('last_activity', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('progress_user_idx').on(table.userId),
  })
);

export type ProgressRecord = typeof progressTable.$inferSelect;

export const userLearningProgressTable = pgTable('user_learning_progress', {
  userId: varchar('user_id', { length: 128 })
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  questionsAsked: integer('questions_asked').default(0).notNull(),
  topicsLearned: jsonb('topics_learned').$type<string[]>().notNull(),
  languagesUsed: jsonb('languages_used').$type<string[]>().notNull(),
  currentStreakDays: integer('current_streak_days').default(1).notNull(),
  lastActiveDate: varchar('last_active_date', { length: 32 }).notNull(),
  achievements: jsonb('achievements').$type<string[]>().notNull(),
  totalQuizzesTaken: integer('total_quizzes_taken').default(0).notNull(),
  averageQuizScore: integer('average_quiz_score').default(0).notNull(),
});

export const achievementsTable = pgTable(
  'achievements',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 }).references(() => usersTable.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    icon: varchar('icon', { length: 64 }).default('Award').notNull(),
    criteria: varchar('criteria', { length: 255 }).default(''),
    unlockedStatus: boolean('unlocked_status').default(false).notNull(),
    unlockedDate: timestamp('unlocked_date', { withTimezone: true, mode: 'string' }),
  },
  (table) => ({
    userIdx: index('achievements_user_idx').on(table.userId),
  })
);

export const evaluationCasesTable = pgTable(
  'evaluation_cases',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    subject: varchar('subject', { length: 128 }).notNull(),
    topic: varchar('topic', { length: 255 }).notNull(),
    sourceLanguage: varchar('source_language', { length: 64 }).default('English').notNull(),
    targetLanguage: varchar('target_language', { length: 64 }).notNull(),
    question: text('question').notNull(),
    referenceAnswer: text('reference_answer').notNull(),
    directTranslation: text('direct_translation').notNull(),
    contextAwareResponse: text('context_aware_response').notNull(),
    expectedTerms: jsonb('expected_terms').$type<string[]>(),
    createdAt: createdAt(),
  },
  (table) => ({
    subjLangIdx: index('eval_cases_subj_lang_idx').on(table.subject, table.targetLanguage),
  })
);

export const evaluationReviewsTable = pgTable(
  'evaluation_reviews',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    caseId: varchar('case_id', { length: 128 })
      .notNull()
      .references(() => evaluationCasesTable.id, { onDelete: 'cascade' }),
    evaluatorId: varchar('evaluator_id', { length: 128 }).notNull(),
    evaluatorName: varchar('evaluator_name', { length: 255 }).notNull(),
    method: varchar('method', { length: 64 }).default('COMPARISON').notNull(),
    directSemanticScore: integer('direct_semantic_score').notNull(),
    directTechnicalScore: integer('direct_technical_score').notNull(),
    directTerminologyScore: integer('direct_terminology_score').notNull(),
    directFluencyScore: integer('direct_fluency_score').notNull(),
    directQualityScore: integer('direct_quality_score').notNull(),
    contextSemanticScore: integer('context_semantic_score').notNull(),
    contextTechnicalScore: integer('context_technical_score').notNull(),
    contextTerminologyScore: integer('context_terminology_score').notNull(),
    contextFluencyScore: integer('context_fluency_score').notNull(),
    contextQualityScore: integer('context_quality_score').notNull(),
    flags: jsonb('flags').$type<{
      ambiguousTranslation: boolean;
      technicalError: boolean;
      meaningLoss: boolean;
      terminologyError: boolean;
      complexityMismatch: boolean;
    }>(),
    notes: text('notes'),
    createdAt: createdAt(),
  },
  (table) => ({
    caseIdx: index('eval_reviews_case_idx').on(table.caseId),
  })
);

export const auditLogsTable = pgTable(
  'audit_logs',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 128 }).notNull(),
    action: varchar('action', { length: 255 }).notNull(),
    details: text('details'),
    ipAddress: varchar('ip_address', { length: 128 }).default('127.0.0.1'),
    createdAt: createdAt(),
  },
  (table) => ({
    userIdx: index('audit_logs_user_idx').on(table.userId),
  })
);

export const fewShotExamplesTable = pgTable(
  'few_shot_examples',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    sourceLanguage: varchar('source_language', { length: 64 }).default('English').notNull(),
    targetLanguage: varchar('target_language', { length: 64 }).notNull(),
    subject: varchar('subject', { length: 128 }).notNull(),
    difficulty: varchar('difficulty', { length: 32 }).default('INTERMEDIATE').notNull(),
    question: text('question').notNull(),
    expectedStyle: text('expected_style').notNull(),
    terminologyGuidance: text('terminology_guidance').notNull(),
    responseSnippet: text('response_snippet').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    createdAt: createdAt(),
  }
);

// ==========================================
// TYPESCRIPT DOMAIN INTERFACES
// ==========================================

export type UserRole = 'STUDENT' | 'ADMIN' | 'RESEARCHER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  preferredLanguage: string;
  preferredDifficulty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  currentCollege?: string;
  yearOfStudy?: string;
  specialization?: string;
  preferredDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  interests: string[];
  studentId?: string;
  department?: string;
  degree?: string;
  semester?: string;
  cgpaTarget?: string;
  careerGoal?: string;
  preferredLanguagesCoding?: string[];
  dailyStudyGoalMinutes?: number;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  stateOrRegion?: string;
  notificationPreferences?: any;
  updatedAt?: string;
}

export interface Terminology {
  id: string;
  englishTerm: string;
  language: string;
  preferredTranslation: string;
  alternativeTranslations: string[];
  doNotTranslate: boolean;
  subject: string;
  explanation: string;
  explanationEn?: string;
  technicalMeaning?: string;
  technicalMeaningEn?: string;
  technicalExample?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FewShotExample {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  subject: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  question: string;
  expectedStyle: string;
  terminologyGuidance: string;
  responseSnippet: string;
  enabled: boolean;
  createdAt: string;
}

export interface StructuredAIResponse {
  definition: string;
  quickAnswer: string;
  explanation: string;
  analogy: string;
  example: string;
  stepByStep: string[];
  keyPoints: string[];
  technicalTerms: Array<{
    term: string;
    translation: string;
    explanation: string;
  }>;
  preservedTerms: string[];
  misconceptions: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  content: string;
  structuredResponse?: StructuredAIResponse;
  sourceLanguage: string;
  targetLanguage: string;
  subject: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  subject: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface Quiz {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  language: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionCount: number;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MIXED';
  questions: QuizQuestion[];
  score?: number | null;
  createdAt: string;
}

export interface QuizAnswerSubmission {
  questionId: string;
  userAnswer: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  topic: string;
  subject: string;
  language: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  weakTopics: string[];
  completionStatus?: string;
  createdAt: string;
}

export interface EvaluationCase {
  id: string;
  subject: string;
  topic: string;
  sourceLanguage: string;
  targetLanguage: string;
  question: string;
  referenceAnswer: string;
  directTranslation: string; // Method A
  contextAwareResponse: string; // Method B
  expectedTerms: string[];
  createdAt: string;
}

export interface EvaluationReview {
  id: string;
  caseId: string;
  reviewerId: string;
  reviewerName: string;
  method?: string;
  // Method A (Direct Translation) Scores (1-5)
  directSemanticScore: number;
  directTechnicalScore: number;
  directTerminologyScore: number;
  directFluencyScore: number;
  directQualityScore: number;
  // Method B (Context-Aware) Scores (1-5)
  contextSemanticScore: number;
  contextTechnicalScore: number;
  contextTerminologyScore: number;
  contextFluencyScore: number;
  contextQualityScore: number;
  // Error flags
  flags: {
    ambiguousTranslation: boolean;
    technicalError: boolean;
    meaningLoss: boolean;
    terminologyError: boolean;
    complexityMismatch: boolean;
  };
  notes: string;
  createdAt: string;
}

export interface LearningProgress {
  userId: string;
  questionsAsked: number;
  topicsLearned: string[];
  languagesUsed: string[];
  currentStreakDays: number;
  lastActiveDate: string;
  achievements: string[];
  totalQuizzesTaken: number;
  averageQuizScore: number;
}

export interface Achievement {
  id: string;
  userId?: string | null;
  title: string;
  description: string;
  icon: string;
  criteria: string;
  category?: 'TUTOR' | 'QUIZ' | 'ACCURACY' | 'MULTILINGUAL' | 'TOPICS' | 'STREAK';
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  xpReward?: number;
  targetVal?: number;
  currentVal?: number;
  unit?: string;
  unlockedStatus?: boolean;
  unlockedDate?: string;
  progressPercent?: number;
}

export interface MilestoneStage {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  perks: string[];
  icon: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  xp: number;
  completed: boolean;
  completedAt?: string;
}

export interface MilestonesData {
  totalXp: number;
  level: number;
  levelTitle: string;
  currentLevelMinXp: number;
  nextLevelXp: number;
  levelProgressPercent: number;
  perks: string[];
  nextPerk: string;
  achievements: Achievement[];
  milestones: MilestoneItem[];
  stats: {
    totalUnlocked: number;
    totalBadges: number;
    completionRate: number;
    totalXpEarned: number;
    claimedMilestones: number;
    totalMilestones: number;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}
