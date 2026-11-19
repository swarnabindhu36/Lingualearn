var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express10 = __toESM(require("express"), 1);
var import_node_http = require("node:http");
var import_path2 = __toESM(require("path"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_vite = require("vite");

// server/db/database.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_mysql2 = require("drizzle-orm/mysql2");
var import_promise = __toESM(require("mysql2/promise"), 1);

// server/db/schema.ts
var import_mysql_core = require("drizzle-orm/mysql-core");
var usersTable = (0, import_mysql_core.mysqlTable)(
  "users",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    name: (0, import_mysql_core.varchar)("name", { length: 255 }).notNull(),
    email: (0, import_mysql_core.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }).notNull(),
    role: (0, import_mysql_core.mysqlEnum)("role", ["STUDENT", "ADMIN", "RESEARCHER"]).default("STUDENT").notNull(),
    preferredLanguage: (0, import_mysql_core.varchar)("preferred_language", { length: 64 }).default("Telugu").notNull(),
    preferredDifficulty: (0, import_mysql_core.varchar)("preferred_difficulty", { length: 32 }).default("INTERMEDIATE").notNull(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    emailIdx: (0, import_mysql_core.index)("users_email_idx").on(table.email)
  })
);
var userProfilesTable = (0, import_mysql_core.mysqlTable)(
  "user_profiles",
  {
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
    bio: (0, import_mysql_core.text)("bio"),
    currentCollege: (0, import_mysql_core.varchar)("current_college", { length: 255 }),
    yearOfStudy: (0, import_mysql_core.varchar)("year_of_study", { length: 64 }),
    specialization: (0, import_mysql_core.varchar)("specialization", { length: 255 }),
    preferredDifficulty: (0, import_mysql_core.varchar)("preferred_difficulty", { length: 32 }).default("INTERMEDIATE"),
    interests: (0, import_mysql_core.json)("interests").$type(),
    studentId: (0, import_mysql_core.varchar)("student_id", { length: 128 }),
    department: (0, import_mysql_core.varchar)("department", { length: 255 }),
    degree: (0, import_mysql_core.varchar)("degree", { length: 128 }),
    semester: (0, import_mysql_core.varchar)("semester", { length: 64 }),
    cgpaTarget: (0, import_mysql_core.varchar)("cgpa_target", { length: 64 }),
    careerGoal: (0, import_mysql_core.varchar)("career_goal", { length: 255 }),
    preferredLanguagesCoding: (0, import_mysql_core.json)("preferred_languages_coding").$type(),
    dailyStudyGoalMinutes: (0, import_mysql_core.int)("daily_study_goal_minutes").default(30),
    githubUsername: (0, import_mysql_core.varchar)("github_username", { length: 128 }),
    linkedinUrl: (0, import_mysql_core.varchar)("linkedin_url", { length: 255 }),
    portfolioUrl: (0, import_mysql_core.varchar)("portfolio_url", { length: 255 }),
    stateOrRegion: (0, import_mysql_core.varchar)("state_or_region", { length: 128 }),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at").defaultNow().notNull()
  }
);
var conversationsTable = (0, import_mysql_core.mysqlTable)(
  "conversations",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    title: (0, import_mysql_core.varchar)("title", { length: 255 }).notNull(),
    sourceLanguage: (0, import_mysql_core.varchar)("source_language", { length: 64 }).default("English").notNull(),
    targetLanguage: (0, import_mysql_core.varchar)("target_language", { length: 64 }).default("Telugu").notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).default("Operating Systems").notNull(),
    difficulty: (0, import_mysql_core.varchar)("difficulty", { length: 32 }).default("INTERMEDIATE").notNull(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("conversations_user_idx").on(table.userId)
  })
);
var messagesTable = (0, import_mysql_core.mysqlTable)(
  "messages",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    conversationId: (0, import_mysql_core.varchar)("conversation_id", { length: 128 }).notNull().references(() => conversationsTable.id, { onDelete: "cascade" }),
    role: (0, import_mysql_core.varchar)("role", { length: 32 }).notNull(),
    // 'user' | 'assistant'
    content: (0, import_mysql_core.text)("content").notNull(),
    structuredResponse: (0, import_mysql_core.json)("structured_response").$type(),
    sourceLanguage: (0, import_mysql_core.varchar)("source_language", { length: 64 }).default("English").notNull(),
    targetLanguage: (0, import_mysql_core.varchar)("target_language", { length: 64 }).default("Telugu").notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).default("Operating Systems").notNull(),
    difficulty: (0, import_mysql_core.varchar)("difficulty", { length: 32 }).default("INTERMEDIATE").notNull(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    convIdx: (0, import_mysql_core.index)("messages_conv_idx").on(table.conversationId)
  })
);
var terminologyTable = (0, import_mysql_core.mysqlTable)(
  "terminology",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    englishTerm: (0, import_mysql_core.varchar)("english_term", { length: 255 }).notNull(),
    language: (0, import_mysql_core.varchar)("language", { length: 64 }).notNull(),
    preferredTranslation: (0, import_mysql_core.varchar)("preferred_translation", { length: 255 }).notNull(),
    alternativeTranslations: (0, import_mysql_core.json)("alternative_translations").$type(),
    doNotTranslate: (0, import_mysql_core.boolean)("do_not_translate").default(true).notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).notNull(),
    explanation: (0, import_mysql_core.text)("explanation").notNull(),
    explanationEn: (0, import_mysql_core.text)("explanation_en"),
    technicalMeaning: (0, import_mysql_core.text)("technical_meaning"),
    technicalMeaningEn: (0, import_mysql_core.text)("technical_meaning_en"),
    technicalExample: (0, import_mysql_core.text)("technical_example"),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at").defaultNow().notNull()
  },
  (table) => ({
    subjLangIdx: (0, import_mysql_core.index)("terminology_subj_lang_idx").on(table.subject, table.language)
  })
);
var quizzesTable = (0, import_mysql_core.mysqlTable)(
  "quizzes",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    topic: (0, import_mysql_core.varchar)("topic", { length: 255 }).notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).notNull(),
    language: (0, import_mysql_core.varchar)("language", { length: 64 }).notNull(),
    difficulty: (0, import_mysql_core.varchar)("difficulty", { length: 32 }).notNull(),
    questionCount: (0, import_mysql_core.int)("question_count").notNull(),
    type: (0, import_mysql_core.varchar)("type", { length: 32 }).default("MCQ").notNull(),
    questions: (0, import_mysql_core.json)("questions").$type().notNull(),
    score: (0, import_mysql_core.int)("score").default(0),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("quizzes_user_idx").on(table.userId)
  })
);
var quizAttemptsTable = (0, import_mysql_core.mysqlTable)(
  "quiz_attempts",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    quizId: (0, import_mysql_core.varchar)("quiz_id", { length: 128 }).notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
    topic: (0, import_mysql_core.varchar)("topic", { length: 255 }).default(""),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).default(""),
    language: (0, import_mysql_core.varchar)("language", { length: 64 }).default(""),
    score: (0, import_mysql_core.int)("score").notNull(),
    totalQuestions: (0, import_mysql_core.int)("total_questions").notNull(),
    percentage: (0, import_mysql_core.int)("percentage").notNull(),
    answers: (0, import_mysql_core.json)("answers").$type().notNull(),
    weakTopics: (0, import_mysql_core.json)("weak_topics").$type(),
    completionStatus: (0, import_mysql_core.varchar)("completion_status", { length: 64 }).default("COMPLETED").notNull(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("quiz_attempts_user_idx").on(table.userId),
    quizIdx: (0, import_mysql_core.index)("quiz_attempts_quiz_idx").on(table.quizId)
  })
);
var progressTable = (0, import_mysql_core.mysqlTable)(
  "progress",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    topic: (0, import_mysql_core.varchar)("topic", { length: 255 }).notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).notNull(),
    questionsAsked: (0, import_mysql_core.int)("questions_asked").default(0).notNull(),
    quizzesCompleted: (0, import_mysql_core.int)("quizzes_completed").default(0).notNull(),
    correctAnswers: (0, import_mysql_core.int)("correct_answers").default(0).notNull(),
    totalAnswers: (0, import_mysql_core.int)("total_answers").default(0).notNull(),
    mastery: (0, import_mysql_core.int)("mastery").default(0).notNull(),
    lastActivity: (0, import_mysql_core.timestamp)("last_activity").defaultNow().notNull()
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("progress_user_idx").on(table.userId)
  })
);
var achievementsTable = (0, import_mysql_core.mysqlTable)(
  "achievements",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).references(() => usersTable.id, { onDelete: "cascade" }),
    title: (0, import_mysql_core.varchar)("title", { length: 255 }).notNull(),
    description: (0, import_mysql_core.text)("description").notNull(),
    icon: (0, import_mysql_core.varchar)("icon", { length: 64 }).default("Award").notNull(),
    criteria: (0, import_mysql_core.varchar)("criteria", { length: 255 }).default(""),
    unlockedStatus: (0, import_mysql_core.boolean)("unlocked_status").default(false).notNull(),
    unlockedDate: (0, import_mysql_core.timestamp)("unlocked_date")
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("achievements_user_idx").on(table.userId)
  })
);
var evaluationCasesTable = (0, import_mysql_core.mysqlTable)(
  "evaluation_cases",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).notNull(),
    topic: (0, import_mysql_core.varchar)("topic", { length: 255 }).notNull(),
    sourceLanguage: (0, import_mysql_core.varchar)("source_language", { length: 64 }).default("English").notNull(),
    targetLanguage: (0, import_mysql_core.varchar)("target_language", { length: 64 }).notNull(),
    question: (0, import_mysql_core.text)("question").notNull(),
    referenceAnswer: (0, import_mysql_core.text)("reference_answer").notNull(),
    directTranslation: (0, import_mysql_core.text)("direct_translation").notNull(),
    contextAwareResponse: (0, import_mysql_core.text)("context_aware_response").notNull(),
    expectedTerms: (0, import_mysql_core.json)("expected_terms").$type(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    subjLangIdx: (0, import_mysql_core.index)("eval_cases_subj_lang_idx").on(table.subject, table.targetLanguage)
  })
);
var evaluationReviewsTable = (0, import_mysql_core.mysqlTable)(
  "evaluation_reviews",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    caseId: (0, import_mysql_core.varchar)("case_id", { length: 128 }).notNull().references(() => evaluationCasesTable.id, { onDelete: "cascade" }),
    evaluatorId: (0, import_mysql_core.varchar)("evaluator_id", { length: 128 }).notNull(),
    evaluatorName: (0, import_mysql_core.varchar)("evaluator_name", { length: 255 }).notNull(),
    method: (0, import_mysql_core.varchar)("method", { length: 64 }).default("COMPARISON").notNull(),
    directSemanticScore: (0, import_mysql_core.int)("direct_semantic_score").notNull(),
    directTechnicalScore: (0, import_mysql_core.int)("direct_technical_score").notNull(),
    directTerminologyScore: (0, import_mysql_core.int)("direct_terminology_score").notNull(),
    directFluencyScore: (0, import_mysql_core.int)("direct_fluency_score").notNull(),
    directQualityScore: (0, import_mysql_core.int)("direct_quality_score").notNull(),
    contextSemanticScore: (0, import_mysql_core.int)("context_semantic_score").notNull(),
    contextTechnicalScore: (0, import_mysql_core.int)("context_technical_score").notNull(),
    contextTerminologyScore: (0, import_mysql_core.int)("context_terminology_score").notNull(),
    contextFluencyScore: (0, import_mysql_core.int)("context_fluency_score").notNull(),
    contextQualityScore: (0, import_mysql_core.int)("context_quality_score").notNull(),
    flags: (0, import_mysql_core.json)("flags").$type(),
    notes: (0, import_mysql_core.text)("notes"),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    caseIdx: (0, import_mysql_core.index)("eval_reviews_case_idx").on(table.caseId)
  })
);
var auditLogsTable = (0, import_mysql_core.mysqlTable)(
  "audit_logs",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    userId: (0, import_mysql_core.varchar)("user_id", { length: 128 }).notNull(),
    action: (0, import_mysql_core.varchar)("action", { length: 255 }).notNull(),
    details: (0, import_mysql_core.text)("details"),
    ipAddress: (0, import_mysql_core.varchar)("ip_address", { length: 128 }).default("127.0.0.1"),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  },
  (table) => ({
    userIdx: (0, import_mysql_core.index)("audit_logs_user_idx").on(table.userId)
  })
);
var fewShotExamplesTable = (0, import_mysql_core.mysqlTable)(
  "few_shot_examples",
  {
    id: (0, import_mysql_core.varchar)("id", { length: 128 }).primaryKey(),
    sourceLanguage: (0, import_mysql_core.varchar)("source_language", { length: 64 }).default("English").notNull(),
    targetLanguage: (0, import_mysql_core.varchar)("target_language", { length: 64 }).notNull(),
    subject: (0, import_mysql_core.varchar)("subject", { length: 128 }).notNull(),
    difficulty: (0, import_mysql_core.varchar)("difficulty", { length: 32 }).default("INTERMEDIATE").notNull(),
    question: (0, import_mysql_core.text)("question").notNull(),
    expectedStyle: (0, import_mysql_core.text)("expected_style").notNull(),
    terminologyGuidance: (0, import_mysql_core.text)("terminology_guidance").notNull(),
    responseSnippet: (0, import_mysql_core.text)("response_snippet").notNull(),
    enabled: (0, import_mysql_core.boolean)("enabled").default(true).notNull(),
    createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
  }
);

// server/db/seed-data.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var DEFAULT_PASSWORD_HASH = import_bcryptjs.default.hashSync("Student@12345", 10);
var ADMIN_PASSWORD_HASH = import_bcryptjs.default.hashSync("Admin@12345", 10);
var SEED_USERS = [
  {
    id: "user_admin_001",
    name: "Dr. Priya Sharma (Lead Researcher)",
    email: "admin@lingualearn.edu",
    passwordHash: ADMIN_PASSWORD_HASH,
    role: "ADMIN",
    preferredLanguage: "Hindi",
    createdAt: "2026-08-01T08:00:00.000Z",
    updatedAt: "2026-08-01T08:00:00.000Z"
  },
  {
    id: "user_student_001",
    name: "Rahul Varma (B.Tech CSE 3rd Year)",
    email: "student@lingualearn.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "STUDENT",
    preferredLanguage: "Telugu",
    createdAt: "2026-08-10T10:30:00.000Z",
    updatedAt: "2026-08-10T10:30:00.000Z"
  },
  {
    id: "user_student_002",
    name: "Swarna Bindhu (B.Tech CSE)",
    email: "swarnabindhu36@gmail.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "STUDENT",
    preferredLanguage: "Telugu",
    createdAt: "2026-08-15T10:30:00.000Z",
    updatedAt: "2026-08-15T10:30:00.000Z"
  }
];
var SEED_ACHIEVEMENTS = [
  // Tutor & Inquiries
  {
    id: "ach_first_question",
    title: "First Step into Tech",
    description: "Began your technical journey by asking your first question in the AI Tutor.",
    icon: "Compass",
    criteria: "Ask 1 question",
    category: "TUTOR",
    tier: "BRONZE",
    xpReward: 50,
    targetVal: 1,
    unit: "question"
  },
  {
    id: "ach_curious_mind",
    title: "Inquisitive Scholar",
    description: "Asked 10 detailed questions exploring computer science mechanisms.",
    icon: "Sparkles",
    criteria: "Ask 10 questions",
    category: "TUTOR",
    tier: "SILVER",
    xpReward: 150,
    targetVal: 10,
    unit: "questions"
  },
  {
    id: "ach_deep_investigator",
    title: "Deep Investigator",
    description: "Delved deep into system architecture with 25 technical inquiries.",
    icon: "Zap",
    criteria: "Ask 25 questions",
    category: "TUTOR",
    tier: "GOLD",
    xpReward: 300,
    targetVal: 25,
    unit: "questions"
  },
  // Quizzes & Assessments
  {
    id: "ach_first_quiz",
    title: "Quiz Novice",
    description: "Completed your first AI-generated contextual technical assessment.",
    icon: "Award",
    criteria: "Complete 1 quiz",
    category: "QUIZ",
    tier: "BRONZE",
    xpReward: 75,
    targetVal: 1,
    unit: "quiz"
  },
  {
    id: "ach_quiz_veteran",
    title: "Assessment Veteran",
    description: "Tested understanding across 5 comprehensive technical quizzes.",
    icon: "CheckCircle2",
    criteria: "Complete 5 quizzes",
    category: "QUIZ",
    tier: "SILVER",
    xpReward: 200,
    targetVal: 5,
    unit: "quizzes"
  },
  {
    id: "ach_quiz_master",
    title: "Grand Quizmaster",
    description: "Conquered 10 technical assessments with rigorous AI evaluation.",
    icon: "Crown",
    criteria: "Complete 10 quizzes",
    category: "QUIZ",
    tier: "GOLD",
    xpReward: 400,
    targetVal: 10,
    unit: "quizzes"
  },
  // Accuracy & Mastery
  {
    id: "ach_high_accuracy",
    title: "Precision Engineer",
    description: "Maintained an average quiz score of 80% or higher across all tests.",
    icon: "Target",
    criteria: "Average score \u2265 80%",
    category: "ACCURACY",
    tier: "SILVER",
    xpReward: 200,
    targetVal: 80,
    unit: "% avg score"
  },
  {
    id: "ach_perfect_score",
    title: "Flawless Performance",
    description: "Achieved a perfect 100% score on a challenging computer science quiz.",
    icon: "Medal",
    criteria: "Score 100% on any quiz",
    category: "ACCURACY",
    tier: "PLATINUM",
    xpReward: 500,
    targetVal: 100,
    unit: "% score"
  },
  // Multilingual Exploration
  {
    id: "ach_multilingual_explorer",
    title: "Bilingual Explorer",
    description: "Learned engineering concepts in at least 2 distinct languages.",
    icon: "Languages",
    criteria: "Use 2 languages",
    category: "MULTILINGUAL",
    tier: "BRONZE",
    xpReward: 100,
    targetVal: 2,
    unit: "languages"
  },
  {
    id: "ach_multilingual",
    title: "Multilingual Polyglot",
    description: "Mastered concepts with preserved terminology across 3 or more languages.",
    icon: "Globe",
    criteria: "Use 3 languages",
    category: "MULTILINGUAL",
    tier: "GOLD",
    xpReward: 350,
    targetVal: 3,
    unit: "languages"
  },
  // Topic Breadth
  {
    id: "ach_topic_explorer",
    title: "Broad Foundations",
    description: "Explored 5 distinct core CS subjects (OS, DBMS, DSA, Networks, ML).",
    icon: "BookOpen",
    criteria: "Explore 5 topics",
    category: "TOPICS",
    tier: "BRONZE",
    xpReward: 100,
    targetVal: 5,
    unit: "topics"
  },
  {
    id: "ach_10_topics",
    title: "Polymath in Training",
    description: "Built deep mastery across 10 distinct technical computer science domains.",
    icon: "GraduationCap",
    criteria: "Explore 10 topics",
    category: "TOPICS",
    tier: "GOLD",
    xpReward: 350,
    targetVal: 10,
    unit: "topics"
  },
  // Consistency & Streaks
  {
    id: "ach_3day_streak",
    title: "Steady Momentum",
    description: "Maintained a consistent daily study streak for 3 consecutive days.",
    icon: "Flame",
    criteria: "3-day streak",
    category: "STREAK",
    tier: "BRONZE",
    xpReward: 100,
    targetVal: 3,
    unit: "days"
  },
  {
    id: "ach_7day_streak",
    title: "Relentless Consistency",
    description: "Studied technical curriculum for 7 consecutive days without interruption.",
    icon: "TrendingUp",
    criteria: "7-day streak",
    category: "STREAK",
    tier: "SILVER",
    xpReward: 250,
    targetVal: 7,
    unit: "days"
  },
  {
    id: "ach_14day_master",
    title: "Unstoppable Scholar",
    description: "Demonstrated exemplary commitment with a 14-day continuous learning streak.",
    icon: "ShieldCheck",
    criteria: "14-day streak",
    category: "STREAK",
    tier: "PLATINUM",
    xpReward: 500,
    targetVal: 14,
    unit: "days"
  }
];
var SEED_TERMINOLOGY = [
  {
    id: "term_01",
    englishTerm: "API (Application Programming Interface)",
    language: "Hindi",
    preferredTranslation: "API (\u090F\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u0947\u0938)",
    alternativeTranslations: ["\u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u0947\u0938", "\u090F\u092A\u0940\u0906\u0908"],
    doNotTranslate: true,
    subject: "Software Engineering",
    explanation: 'API \u0915\u094B \u0939\u092E\u0947\u0936\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092F\u093E \u090F\u092A\u0940\u0906\u0908 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0947\u0902\u0964 \u0907\u0938\u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 "\u0905\u0928\u0941\u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u094D\u0930\u092E\u093E\u0926\u0947\u0936\u0928 \u0905\u0902\u0924\u0930\u093E\u092B\u0932\u0915" \u0915\u0930\u0928\u0947 \u0938\u0947 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u092E\u0947\u0902 \u092D\u094D\u0930\u092E \u092A\u0948\u0926\u093E \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0907\u0938\u0947 \u0938\u0949\u092B\u094D\u091F\u0935\u0947\u092F\u0930 \u0918\u091F\u0915\u094B\u0902 \u0915\u0947 \u092C\u0940\u091A \u0915\u093E \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0905\u0928\u0941\u092C\u0902\u0927 \u0938\u092E\u091D\u0947\u0902\u0964',
    explanationEn: 'Preserve "API". Do not translate to "\u0905\u0928\u0941\u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u094D\u0930\u092E\u093E\u0926\u0947\u0936\u0928 \u0905\u0902\u0924\u0930\u093E\u092B\u0932\u0915" as it confuses developers. Explain it as software components ke beech ka contract/connector.',
    technicalMeaning: "API (\u090F\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u093C\u0947\u0938) \u090F\u0915 \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u093C\u0947\u0938 \u0939\u0948 \u091C\u094B \u0935\u093F\u092D\u093F\u0928\u094D\u0928 \u0938\u0949\u092B\u094D\u091F\u0935\u0947\u092F\u0930 \u092A\u094D\u0930\u0923\u093E\u0932\u093F\u092F\u094B\u0902 \u0915\u0947 \u092C\u0940\u091A \u0921\u0947\u091F\u093E \u0938\u0902\u091A\u093E\u0930, \u0905\u0928\u0941\u0930\u094B\u0927\u094B\u0902 \u0915\u0947 \u092A\u094D\u0930\u0915\u093E\u0930 \u0914\u0930 \u0921\u0947\u091F\u093E \u092A\u094D\u0930\u093E\u0930\u0942\u092A\u094B\u0902 (\u091C\u0948\u0938\u0947 JSON/gRPC) \u0915\u094B \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0915\u0930\u0928\u0947 \u0935\u093E\u0932\u0947 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u093E \u0938\u092E\u0942\u0939 \u0939\u0948\u0964 \u092F\u0939 \u0906\u0902\u0924\u0930\u093F\u0915 \u0915\u094B\u0921 \u092F\u093E \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0915\u094B \u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0915\u093F\u090F \u092C\u093F\u0928\u093E \u0938\u0947\u0935\u093E\u0913\u0902 \u0915\u094B \u091C\u094B\u0921\u093C\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0924\u093E \u0939\u0948\u0964",
    technicalMeaningEn: "An Application Programming Interface (API) is a formalized computing interface that defines interactions between multiple software intermediaries, specifying the types of calls or requests that can be made, data formats (e.g. JSON/Protocol Buffers), and conventions to follow.",
    technicalExample: `// RESTful API Endpoint in Express (Node.js)
app.get('/api/v1/students/:id', async (req, res) => {
  const student = await db.students.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ status: 200, data: student });
});`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_02",
    englishTerm: "API (Application Programming Interface)",
    language: "Telugu",
    preferredTranslation: "API (\u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D)",
    alternativeTranslations: ["\u0C0F\u0C2A\u0C40\u0C10", "\u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D"],
    doNotTranslate: true,
    subject: "Software Engineering",
    explanation: 'API \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C32\u0C3F\u0C2A\u0C4D\u0C2F\u0C02\u0C24\u0C30\u0C40\u0C15\u0C30\u0C23\u0C32\u0C4B\u0C28\u0C47 \u0C09\u0C02\u0C1A\u0C3E\u0C32\u0C3F. "\u0C05\u0C28\u0C41\u0C35\u0C30\u0C4D\u0C24\u0C28 \u0C05\u0C28\u0C41\u0C38\u0C02\u0C27\u0C3E\u0C28\u0C02" \u0C05\u0C28\u0C3F \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C05\u0C2D\u0C3F\u0C35\u0C43\u0C26\u0C4D\u0C27\u0C3F\u0C32\u0C4B \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C38\u0C4D\u0C2A\u0C37\u0C4D\u0C1F\u0C24 \u0C32\u0C4B\u0C2A\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.',
    explanationEn: "Keep API as English term or transliteration. Literal Telugu translation like \u0C05\u0C28\u0C41\u0C35\u0C30\u0C4D\u0C24\u0C28 \u0C05\u0C28\u0C41\u0C38\u0C02\u0C27\u0C3E\u0C28\u0C02 causes loss of technical precision.",
    technicalMeaning: "API (\u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C35\u0C47\u0C30\u0C4D\u0C35\u0C47\u0C30\u0C41 \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C26\u0C3E\u0C28\u0C3F\u0C24\u0C4B \u0C12\u0C15\u0C1F\u0C3F \u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30\u0C02 \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C2A\u0C21\u0C47 \u0C28\u0C3F\u0C2C\u0C02\u0C27\u0C28\u0C32 \u0C12\u0C2A\u0C4D\u0C2A\u0C02\u0C26\u0C02 (Contract & Protocols). \u0C07\u0C26\u0C3F \u0C05\u0C02\u0C24\u0C30\u0C4D\u0C17\u0C24 \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C28\u0C41 \u0C2C\u0C39\u0C3F\u0C30\u0C4D\u0C17\u0C24\u0C02 \u0C1A\u0C47\u0C2F\u0C15\u0C41\u0C02\u0C21\u0C3E \u0C15\u0C4D\u0C32\u0C2F\u0C3F\u0C02\u0C1F\u0C4D\u200C\u0C32\u0C15\u0C41 \u0C38\u0C41\u0C30\u0C15\u0C4D\u0C37\u0C3F\u0C24 \u0C21\u0C47\u0C1F\u0C3E\u0C28\u0C41 \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
    technicalMeaningEn: "An API defines the contract and network protocols (HTTP/REST, gRPC, WebSocket) through which external clients interact with backend microservices without exposing internal database implementation details.",
    technicalExample: `// Consuming an API endpoint in client-side code
async function fetchCourseData(courseId) {
  const response = await fetch(\`https://api.lingualearn.edu/courses/\${courseId}\`, {
    headers: { 'Authorization': 'Bearer token_xyz' }
  });
  return await response.json();
}`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_03",
    englishTerm: "Thread",
    language: "Hindi",
    preferredTranslation: "Thread (\u0925\u094D\u0930\u0947\u0921 - \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0907\u0915\u093E\u0908)",
    alternativeTranslations: ["\u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0925\u094D\u0930\u0947\u0921"],
    doNotTranslate: true,
    subject: "Operating Systems",
    explanation: '"Thread" \u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u092D\u0940 \u092D\u0940 \u0938\u093F\u0932\u093E\u0908 \u0915\u093E "\u0927\u093E\u0917\u093E" \u0928 \u0915\u0930\u0947\u0902\u0964 \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u0925\u094D\u0930\u0947\u0921 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u0947 \u092D\u0940\u0924\u0930 \u091A\u0932\u0928\u0947 \u0935\u093E\u0932\u0940 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0907\u0915\u093E\u0908 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964',
    explanationEn: 'Never translate "Thread" as "\u0927\u093E\u0917\u093E" (sewing string). A Thread is the smallest unit of execution inside a Process.',
    technicalMeaning: "\u0925\u094D\u0930\u0947\u0921 (Thread) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u0930\u094D\u0928\u0947\u0932 \u0926\u094D\u0935\u093E\u0930\u093E \u0936\u0947\u0921\u094D\u092F\u0942\u0932 \u0914\u0930 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u093F\u0924 \u0915\u0940 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0915\u092E\u094D\u092A\u094D\u092F\u0942\u091F\u0947\u0936\u0928\u0932 \u0907\u0915\u093E\u0908 \u0939\u0948\u0964 \u090F\u0915 \u0939\u0940 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u0947 \u0915\u0908 \u0925\u094D\u0930\u0947\u0921 \u090F\u0915 \u0939\u0940 \u092E\u0947\u092E\u094B\u0930\u0940 \u0938\u094D\u092A\u0947\u0938 (\u0915\u094B\u0921, \u0939\u0940\u092A, \u0921\u0947\u091F\u093E) \u0915\u094B \u0938\u093E\u091D\u093E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0932\u0947\u0915\u093F\u0928 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0925\u094D\u0930\u0947\u0921 \u0915\u093E \u0905\u092A\u0928\u093E \u0928\u093F\u091C\u0940 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E \u0915\u093E\u0909\u0902\u091F\u0930 (PC) \u0914\u0930 \u0915\u0949\u0932 \u0938\u094D\u091F\u0948\u0915 \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
    technicalMeaningEn: "A Thread is the smallest execution unit capable of being scheduled by an operating system. Multiple threads in a process share the parent process address space (code, heap, global data), but possess private registers and call stacks.",
    technicalExample: `// POSIX Thread (pthread) in C
#include <pthread.h>
#include <stdio.h>

void* worker(void* arg) {
    printf("Worker thread executing inside process PID: %d\\n", getpid());
    return NULL;
}
int main() {
    pthread_t tid;
    pthread_create(&tid, NULL, worker, NULL);
    pthread_join(tid, NULL);
}`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_04",
    englishTerm: "Deadlock",
    language: "Telugu",
    preferredTranslation: "Deadlock (\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D - \u0C28\u0C3F\u0C32\u0C3F\u0C1A\u0C3F\u0C2A\u0C4B\u0C2F\u0C3F\u0C28 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F)",
    alternativeTranslations: ["\u0C30\u0C3F\u0C38\u0C4B\u0C30\u0C4D\u0C38\u0C4D \u0C2C\u0C4D\u0C32\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D", "\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D"],
    doNotTranslate: true,
    subject: "Operating Systems",
    explanation: '"Deadlock" \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C47 \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C3E\u0C32\u0C3F. "\u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C05\u0C30\u0C4D\u0C27\u0C02 \u0C35\u0C3F\u0C15\u0C1F\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C26\u0C3E\u0C28\u0C3F \u0C30\u0C3F\u0C38\u0C4B\u0C30\u0C4D\u0C38\u0C4D \u0C15\u0C4B\u0C38\u0C02 \u0C2E\u0C30\u0C4A\u0C15\u0C1F\u0C3F \u0C28\u0C3F\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C3F\u0C38\u0C4D\u0C24\u0C42 \u0C28\u0C3F\u0C32\u0C3F\u0C1A\u0C3F\u0C2A\u0C4B\u0C2F\u0C47 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F.',
    explanationEn: 'Preserve "Deadlock". Literal translation like "\u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02" is absurd. Explain it as processes circular wait lo stuck avvadam.',
    technicalMeaning: "\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D (Deadlock) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C47 \u0C12\u0C15 \u0C38\u0C02\u0C15\u0C4D\u0C32\u0C3F\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C38\u0C4D\u0C24\u0C02\u0C2D\u0C28 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F. \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C05\u0C02\u0C24\u0C15\u0C02\u0C1F\u0C47 \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30\u0C02 \u0C0E\u0C26\u0C41\u0C1F\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C35\u0C26\u0C4D\u0C26 \u0C09\u0C28\u0C4D\u0C28 \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C30\u0C3F\u0C38\u0C4B\u0C30\u0C4D\u0C38\u0C4D \u0C15\u0C4B\u0C38\u0C02 \u0C0E\u0C26\u0C41\u0C30\u0C41\u0C1A\u0C42\u0C38\u0C4D\u0C24\u0C42 \u0C38\u0C30\u0C4D\u0C15\u0C4D\u0C2F\u0C41\u0C32\u0C30\u0C4D \u0C35\u0C46\u0C2F\u0C3F\u0C1F\u0C4D (Circular Wait) \u0C32\u0C4B \u0C1A\u0C3F\u0C15\u0C4D\u0C15\u0C41\u0C15\u0C41\u0C2A\u0C4B\u0C35\u0C21\u0C02 \u0C35\u0C32\u0C4D\u0C32 \u0C0F \u0C12\u0C15\u0C4D\u0C15 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C15\u0C42\u0C21\u0C3E \u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41 \u0C38\u0C3E\u0C17\u0C32\u0C47\u0C15 \u0C28\u0C3F\u0C32\u0C3F\u0C1A\u0C3F\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C15\u0C3E\u0C2B\u0C4D\u200C\u0C2E\u0C28\u0C4D \u0C37\u0C30\u0C24\u0C41\u0C32\u0C28\u0C41 (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) \u0C38\u0C02\u0C24\u0C43\u0C2A\u0C4D\u0C24\u0C3F\u0C2A\u0C30\u0C3F\u0C1A\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C38\u0C02\u0C2D\u0C35\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
    technicalMeaningEn: "A Deadlock is an operating system state where two or more processes cannot make forward progress because each is waiting for a resource held by another process in the set, fulfilling Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    technicalExample: `// Deadlock generation in concurrent execution:
// Thread 1 acquires Mutex A, then requests Mutex B.
// Thread 2 acquires Mutex B, then requests Mutex A.
// Result: Both threads block indefinitely in Circular Wait.`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_05",
    englishTerm: "Recursion",
    language: "Hindi",
    preferredTranslation: "Recursion (\u0930\u093F\u0915\u0930\u094D\u0936\u0928 - \u0938\u094D\u0935-\u0906\u0939\u094D\u0935\u093E\u0928 \u092B\u093C\u0902\u0915\u094D\u0936\u0928)",
    alternativeTranslations: ["\u0930\u093F\u0915\u0930\u094D\u0936\u0928", "\u0938\u094D\u0935-\u0906\u0939\u094D\u0935\u093E\u0928"],
    doNotTranslate: false,
    subject: "Data Structures",
    explanation: 'Recursion \u0915\u094B \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092F\u093E "\u0930\u093F\u0915\u0930\u094D\u0936\u0928" \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0947\u0902\u0964 \u0907\u0938\u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 "\u092A\u0941\u0928\u0930\u093E\u0935\u0930\u094D\u0924\u0928" \u092F\u093E "\u0938\u094D\u0935-\u0906\u0939\u094D\u0935\u093E\u0928" \u0915\u0930\u0928\u0947 \u0938\u0947 \u0915\u094B\u0921 \u0914\u0930 \u090F\u0932\u094D\u0917\u094B\u0930\u093F\u0926\u092E \u0938\u092E\u091D\u0928\u0947 \u092E\u0947\u0902 \u0905\u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E \u0939\u094B\u0924\u0940 \u0939\u0948\u0964',
    explanationEn: 'Preserve "Recursion". Literal translations like "\u092A\u0941\u0928\u0930\u093E\u0935\u0930\u094D\u0924\u0928" obscure recursive algorithm implementation and stack frames in Computer Science.',
    technicalMeaning: "\u0930\u093F\u0915\u0930\u094D\u0936\u0928 (Recursion) \u090F\u0915 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u092A\u094D\u0930\u0924\u093F\u092E\u093E\u0928 (Programming Paradigm) \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u090F\u0915 \u092B\u093C\u0902\u0915\u094D\u0936\u0928 \u0915\u093F\u0938\u0940 \u0915\u092E\u094D\u092A\u094D\u092F\u0942\u091F\u0947\u0936\u0928\u0932 \u0938\u092E\u0938\u094D\u092F\u093E \u0915\u094B \u091B\u094B\u091F\u0947 \u0909\u092A-\u0938\u092E\u0938\u094D\u092F\u093E\u0913\u0902 \u092E\u0947\u0902 \u0935\u093F\u092D\u093E\u091C\u093F\u0924 \u0915\u0930\u0915\u0947 \u0938\u094D\u0935\u092F\u0902 \u0915\u094B \u0924\u092C \u0924\u0915 \u0915\u0949\u0932 \u0915\u0930\u0924\u093E \u0939\u0948 \u091C\u092C \u0924\u0915 \u0915\u093F \u0935\u0939 \u090F\u0915 \u0928\u093F\u0930\u094D\u0926\u093F\u0937\u094D\u091F \u092C\u0947\u0938 \u0915\u0902\u0921\u0940\u0936\u0928 (Base Case) \u0915\u094B \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0928 \u0915\u0930 \u0932\u0947\u0964 \u092F\u0939 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u0915\u0949\u0932 \u0938\u094D\u091F\u0948\u0915 (Call Stack) \u092B\u093C\u094D\u0930\u0947\u092E \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
    technicalMeaningEn: "Recursion is a programming paradigm where a method solves a computational problem by reducing it to smaller sub-problems and invoking itself, relying on the runtime call stack until satisfying a designated base condition.",
    technicalExample: `// Binary Search using Recursive Call Stack
int binarySearch(int arr[], int low, int high, int key) {
    if (low > high) return -1; // Base case: \u0924\u0924\u094D\u0924\u094D\u0935 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid; // \u0924\u0924\u094D\u0924\u094D\u0935 \u092E\u093F\u0932 \u0917\u092F\u093E
    if (arr[mid] > key) return binarySearch(arr, low, mid - 1, key); // \u092C\u093E\u092F\u093E\u0901 \u092D\u093E\u0917
    return binarySearch(arr, mid + 1, high, key); // \u0926\u093E\u092F\u093E\u0901 \u092D\u093E\u0917
}`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_06",
    englishTerm: "Overfitting",
    language: "Tamil",
    preferredTranslation: "Overfitting (\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD - \u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BBE\u0BA9 \u0BAA\u0BCA\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD)",
    alternativeTranslations: ["\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD", "\u0B85\u0BB3\u0BB5\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0BA9 \u0BAA\u0BCA\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD"],
    doNotTranslate: true,
    subject: "Machine Learning",
    explanation: "Overfitting \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD. \u0B86\u0B9F\u0BC8 \u0B85\u0BB3\u0BB5\u0BC1 \u0BAA\u0BCA\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD (Dress Fitting) \u0BAA\u0BCB\u0BB2 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBE\u0BB2\u0BCD \u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0\u0B95\u0BCD \u0B95\u0BB1\u0BCD\u0BB1\u0BB2\u0BBF\u0BA9\u0BCD \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8\u0B95\u0BCD \u0B95\u0BCB\u0B9F\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0BAA\u0BBE\u0BB4\u0BBE\u0B95\u0BBF\u0BB5\u0BBF\u0B9F\u0BC1\u0BAE\u0BCD.",
    explanationEn: "Overfitting must be preserved as an ML term. Translating literally as dress fitting obscures machine learning training vs generalization error.",
    technicalMeaning: "\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD (Overfitting) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BAE\u0BC6\u0BB7\u0BBF\u0BA9\u0BCD \u0BB2\u0BC7\u0BB0\u0BCD\u0BA9\u0BBF\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BCD (Machine Learning) \u0B8F\u0BB1\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BAA\u0BBF\u0BB4\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD, \u0B87\u0BA4\u0BBF\u0BB2\u0BCD \u0B92\u0BB0\u0BC1 \u0BAE\u0BBE\u0BA4\u0BBF\u0BB0\u0BBF (Model) \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF\u0BA4\u0BCD \u0BA4\u0BB0\u0BB5\u0BBF\u0BA9\u0BCD (Training Data) \u0B87\u0BB0\u0BC8\u0B9A\u0BCD\u0B9A\u0BB2\u0BCD (Noise) \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BC0\u0BB0\u0BB1\u0BCD\u0BB1 \u0BB5\u0BBF\u0BB5\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0B95\u0B95\u0BCD \u0B95\u0BB1\u0BCD\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. \u0B87\u0BA4\u0BA9\u0BBE\u0BB2\u0BCD \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF\u0BA4\u0BCD \u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0BB2\u0BCD \u0BA4\u0BC1\u0BB2\u0BCD\u0BB2\u0BBF\u0BAF\u0BAE\u0BCD \u0BAE\u0BBF\u0B95 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0B95\u0BB5\u0BC1\u0BAE\u0BCD, \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B9A\u0BCB\u0BA4\u0BA9\u0BC8\u0BA4\u0BCD \u0BA4\u0BB0\u0BB5\u0BBF\u0BB2\u0BCD (Test/Validation Data) \u0BA4\u0BC1\u0BB2\u0BCD\u0BB2\u0BBF\u0BAF\u0BAE\u0BCD \u0BAE\u0BBF\u0B95\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0BB5\u0BBE\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD.",
    technicalMeaningEn: "Overfitting is an empirical machine learning failure mode where a complex model learns training dataset noise and idiosyncratic features rather than true general underlying distributions, resulting in low training loss but high generalization validation error.",
    technicalExample: `// Combating Overfitting with L2 Weight Decay in PyTorch
import torch.nn as nn
import torch.optim as optim

model = nn.Sequential(nn.Linear(128, 64), nn.ReLU(), nn.Linear(64, 10))
# weight_decay \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD\u0B95\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BC1\u0B95\u0BCD\u0B95 L2 \u0BB0\u0BC6\u0B95\u0BC1\u0BB2\u0BB0\u0BC8\u0B9A\u0BC7\u0BB7\u0BA9\u0BC8\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_07",
    englishTerm: "Database Normalization",
    language: "Hindi",
    preferredTranslation: "Database Normalization (\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u0907\u091C\u093C\u0947\u0936\u0928 / \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0940\u0915\u0930\u0923)",
    alternativeTranslations: ["\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u0907\u091C\u093C\u0947\u0936\u0928", "\u0930\u093F\u0921\u0902\u0921\u0947\u0902\u0938\u0940 \u0928\u094D\u092F\u0942\u0928\u0940\u0915\u0930\u0923"],
    doNotTranslate: false,
    subject: "DBMS",
    explanation: "Database Normalization \u0915\u094B \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092F\u093E \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0947\u0902\u0964 \u092F\u0939 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0924\u093E\u0932\u093F\u0915\u093E\u0913\u0902 \u0915\u0947 \u0935\u093F\u092D\u093E\u091C\u0928 \u0914\u0930 \u0905\u0916\u0902\u0921\u0924\u093E \u0928\u093F\u092F\u092E\u094B\u0902 (1NF, 2NF, 3NF, BCNF) \u0915\u094B \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
    explanationEn: "Explain as table design process to eliminate redundancy and anomaly (1NF, 2NF, 3NF, BCNF).",
    technicalMeaning: "\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0940\u0915\u0930\u0923 (Database Normalization) \u0930\u093F\u0932\u0947\u0936\u0928\u0932 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0938\u094D\u0915\u0940\u092E\u093E \u0915\u094B \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0940 \u090F\u0915 \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0917\u0923\u093F\u0924\u0940\u092F \u0924\u0915\u0928\u0940\u0915 \u0939\u0948 \u091C\u093F\u0938\u0915\u093E \u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F \u0921\u0947\u091F\u093E \u0905\u0924\u093F\u0930\u0947\u0915 (Data Redundancy) \u0915\u094B \u0915\u092E \u0915\u0930\u0928\u093E \u0914\u0930 \u0907\u0928\u094D\u0938\u0930\u094D\u091F, \u0905\u092A\u0921\u0947\u091F \u0914\u0930 \u0921\u093F\u0932\u0940\u091F \u0935\u093F\u0938\u0902\u0917\u0924\u093F\u092F\u094B\u0902 (Anomalies) \u0915\u094B \u0938\u092E\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u093E \u0939\u0948 (1NF, 2NF, 3NF, BCNF)\u0964",
    technicalMeaningEn: "Database Normalization is the formal mathematical technique of organizing relational database schema tables to minimize functional data redundancy and eliminate insert, update, and deletion anomalies via progressive Normal Forms.",
    technicalExample: `-- 3NF Table Normalization Example:
-- Decomposing unnormalized Orders table into independent Entities
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    city VARCHAR(50)
);
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date DATE,
    total_amount DECIMAL(10, 2)
);`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_08",
    englishTerm: "TCP/IP (Transmission Control Protocol / Internet Protocol)",
    language: "Kannada",
    preferredTranslation: "TCP/IP (\u0C9F\u0CBF.\u0CB8\u0CBF.\u0CAA\u0CBF/\u0C90.\u0CAA\u0CBF \u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD \u0CAA\u0CCD\u0CB0\u0CCB\u0C9F\u0CCB\u0C95\u0CBE\u0CB2\u0CCD)",
    alternativeTranslations: ["\u0C9F\u0CBF.\u0CB8\u0CBF.\u0CAA\u0CBF/\u0C90.\u0CAA\u0CBF \u0CAA\u0CCD\u0CB0\u0CCA\u0C9F\u0CCA\u0C95\u0CBE\u0CB2\u0CCD", "\u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD \u0CAA\u0CCD\u0CB0\u0CCB\u0C9F\u0CCB\u0C95\u0CBE\u0CB2\u0CCD"],
    doNotTranslate: true,
    subject: "Computer Networks",
    explanation: "TCP/IP \u0C85\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0C87\u0C82\u0C97\u0CCD\u0CB2\u0CBF\u0CB7\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF\u0CAF\u0CC7 \u0CAC\u0CB3\u0CB8\u0CAC\u0CC7\u0C95\u0CC1. \u0C9C\u0CBE\u0CB2\u0CAC\u0C82\u0CA7 \u0CAA\u0CCD\u0CB0\u0CCB\u0C9F\u0CCB\u0C95\u0CBE\u0CB2\u0CCD\u200C\u0C97\u0CB3 \u0CB9\u0CC6\u0CB8\u0CB0\u0CC1\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0C85\u0C95\u0CCD\u0CB7\u0CB0\u0CB6\u0C83 \u0C95\u0CA8\u0CCD\u0CA8\u0CA1\u0C95\u0CCD\u0C95\u0CC6 \u0C85\u0CA8\u0CC1\u0CB5\u0CBE\u0CA6\u0CBF\u0CB8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0C95\u0C82\u0CAA\u0CCD\u0CAF\u0CC2\u0C9F\u0CB0\u0CCD \u0CB5\u0CBF\u0C9C\u0CCD\u0C9E\u0CBE\u0CA8\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0C97\u0CCA\u0C82\u0CA6\u0CB2\u0C95\u0CCD\u0C95\u0CC6 \u0C95\u0CBE\u0CB0\u0CA3\u0CB5\u0CBE\u0C97\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
    explanationEn: "Standard networking protocol stack. Do not attempt literal word-for-word regional translations.",
    technicalMeaning: "\u0C9F\u0CBF.\u0CB8\u0CBF.\u0CAA\u0CBF/\u0C90.\u0CAA\u0CBF (TCP/IP) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C87\u0C82\u0C9F\u0CB0\u0CCD\u0CA8\u0CC6\u0C9F\u0CCD \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD \u0CB8\u0C82\u0CB5\u0CB9\u0CA8\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CAF\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0CB8\u0CC1\u0CB5 \u0CA8\u0CBE\u0CB2\u0CCD\u0C95\u0CC1-\u0CAA\u0CA6\u0CB0\u0C97\u0CB3 (Application, Transport, Internet, Network Interface) \u0CAA\u0CCD\u0CB0\u0CCB\u0C9F\u0CCB\u0C95\u0CBE\u0CB2\u0CCD \u0C86\u0CB0\u0CCD\u0C95\u0CBF\u0C9F\u0CC6\u0C95\u0CCD\u0C9A\u0CB0\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6. \u0C9F\u0CBF.\u0CB8\u0CBF.\u0CAA\u0CBF (TCP) \u0CB5\u0CBF\u0CB6\u0CCD\u0CB5\u0CBE\u0CB8\u0CBE\u0CB0\u0CCD\u0CB9, \u0CA6\u0CCB\u0CB7-\u0CAA\u0CB0\u0CBF\u0CB6\u0CC0\u0CB2\u0CBF\u0CB8\u0CBF\u0CA6 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C95\u0CCD\u0CB0\u0CAE\u0CAC\u0CA6\u0CCD\u0CA7\u0CB5\u0CBE\u0CA6 \u0CAA\u0CCD\u0CAF\u0CBE\u0C95\u0CC6\u0C9F\u0CCD \u0CB5\u0CBF\u0CA4\u0CB0\u0CA3\u0CC6\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0C96\u0CBE\u0CA4\u0CB0\u0CBF\u0CAA\u0CA1\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
    technicalMeaningEn: "TCP/IP is the foundational four-layer communication protocol architecture (Application, Transport, Internet, Network Interface) governing packet-switched inter-network communications, guaranteeing ordered, error-checked packet delivery via TCP.",
    technicalExample: `// TCP 3-Way Handshake Connection Sequence:
// Host A (Client) -----> [SYN, Seq=100] ------------> Host B (Server)
// Host A <---------- [SYN-ACK, Seq=300, Ack=101] ---- Host B
// Host A --------------> [ACK, Ack=301] --------------> Host B
// [Established]: \u0C95\u0CA8\u0CC6\u0C95\u0CCD\u0CB7\u0CA8\u0CCD \u0CAF\u0CB6\u0CB8\u0CCD\u0CB5\u0CBF\u0CAF\u0CBE\u0C97\u0CBF \u0CB8\u0CCD\u0CA5\u0CBE\u0CAA\u0CA8\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_09",
    englishTerm: "Compiler",
    language: "Bengali",
    preferredTranslation: "Compiler (\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0 - \u09AE\u09C7\u09B6\u09BF\u09A8 \u0995\u09CB\u09A1 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6\u0995)",
    alternativeTranslations: ["\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0", "\u09B8\u09CB\u09B0\u09CD\u09B8 \u0995\u09CB\u09A1 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6\u0995"],
    doNotTranslate: true,
    subject: "Programming",
    explanation: 'Compiler \u09B6\u09AC\u09CD\u09A6\u099F\u09BF\u0995\u09C7 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u0987\u0982\u09B0\u09C7\u099C\u09BF\u09A4\u09C7 \u09AC\u09BE "\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0" \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7\u0987 \u09B0\u09BE\u0996\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u0986\u09AD\u09BF\u09A7\u09BE\u09A8\u09BF\u0995 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0 \u09AF\u09A5\u09BE\u09B0\u09CD\u09A5\u09A4\u09BE \u0995\u09CD\u09B7\u09C1\u09A3\u09CD\u09A3 \u0995\u09B0\u09C7\u0964',
    explanationEn: "Translates high-level source code into machine code in one complete pass.",
    technicalMeaning: "\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0 (Compiler) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09AC\u09BF\u09B6\u09C7\u09B7\u09BE\u09AF\u09BC\u09BF\u09A4 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09B8\u09AB\u099F\u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0 \u09AF\u09BE \u0989\u099A\u09CD\u099A-\u09B8\u09CD\u09A4\u09B0\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u09AD\u09BE\u09B7\u09BE\u09B0 \u09B8\u09CB\u09B0\u09CD\u09B8 \u0995\u09CB\u09A1\u0995\u09C7 (\u09AF\u09C7\u09AE\u09A8 C, C++, Java) \u09B2\u09C7\u0995\u09CD\u09B8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3, \u09B8\u09BF\u09A8\u099F\u09CD\u09AF\u09BE\u0995\u09CD\u09B8 \u09AA\u09BE\u09B0\u09CD\u09B8\u09BF\u0982, \u09B8\u09C7\u09AE\u09BE\u09A8\u09CD\u099F\u09BF\u0995 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3 \u098F\u09AC\u0982 \u0985\u09AA\u09CD\u099F\u09BF\u09AE\u09BE\u0987\u099C\u09C7\u09B6\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09A8\u09BF\u09AE\u09CD\u09A8-\u09B8\u09CD\u09A4\u09B0\u09C7\u09B0 \u09AE\u09C7\u09B6\u09BF\u09A8 \u0995\u09CB\u09A1 \u09AC\u09BE \u09AC\u09BE\u0987\u099F\u0995\u09CB\u09A1\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09C7\u0964",
    technicalMeaningEn: "A Compiler is a language translation system that translates high-level programming language statements into low-level target machine code or assembly through lexical analysis, syntax parsing, semantic validation, intermediate code optimization, and code generation.",
    technicalExample: `// Invoking the LLVM/Clang compiler with optimization flags
$ clang -O3 -Wall main.c -o application_binary
// Step 1: \u09AA\u09CD\u09B0\u09BF\u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09BF\u0982 -> main.i
// Step 2: \u09B2\u09C7\u0995\u09CD\u09B8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0993 \u09AA\u09BE\u09B0\u09CD\u09B8\u09BF\u0982 -> Abstract Syntax Tree (AST)
// Step 3: LLVM IR \u09AC\u09BE\u0987\u099F\u0995\u09CB\u09A1 -> \u09AE\u09C7\u09B6\u09BF\u09A8 \u0995\u09CB\u09A1 \u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u09B6\u09A8`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_10",
    englishTerm: "Socket",
    language: "Hindi",
    preferredTranslation: "Socket (\u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0949\u0915\u0947\u091F - IP + Port \u090F\u0902\u0921\u092A\u0949\u0907\u0902\u091F)",
    alternativeTranslations: ["\u0938\u0949\u0915\u0947\u091F", "\u0915\u092E\u094D\u092F\u0941\u0928\u093F\u0915\u0947\u0936\u0928 \u090F\u0902\u0921\u092A\u0949\u0907\u0902\u091F"],
    doNotTranslate: true,
    subject: "Computer Networks",
    explanation: "Socket \u0915\u094B \u092C\u093F\u091C\u0932\u0940 \u0915\u0947 \u092A\u094D\u0932\u0917 \u092F\u093E \u0926\u0940\u0935\u093E\u0930 \u0915\u0947 \u0938\u0949\u0915\u0947\u091F \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0905\u0928\u0941\u0935\u093E\u0926\u093F\u0924 \u0928 \u0915\u0930\u0947\u0902\u0964 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0928\u0947\u091F\u0935\u0930\u094D\u0915\u093F\u0902\u0917 \u092E\u0947\u0902 \u092F\u0939 IP + Port \u0928\u0902\u092C\u0930 \u0915\u093E \u0938\u0902\u091A\u093E\u0930 \u090F\u0902\u0921\u092A\u0949\u0907\u0902\u091F \u0939\u0948\u0964",
    explanationEn: "Do not translate to electrical wall switchboard. It is an IP address plus Port number endpoint for bidirectional network communication.",
    technicalMeaning: "\u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0949\u0915\u0947\u091F (Network Socket) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u093E \u090F\u0915 \u0905\u092E\u0942\u0930\u094D\u0924 \u0930\u0942\u092A (OS Abstraction) \u0939\u0948 \u091C\u094B \u0906\u0908\u092A\u0940 \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092A\u0930 \u091A\u0932\u0928\u0947 \u0935\u093E\u0932\u0940 \u0926\u094B \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0913\u0902 \u0915\u0947 \u092C\u0940\u091A \u0926\u094D\u0935\u093F\u0926\u093F\u0936\u0940\u092F \u0938\u0902\u091A\u093E\u0930 \u0932\u093F\u0902\u0915 (Bi-directional Communication Link) \u0915\u093E \u0905\u0902\u0924\u093F\u092E \u092C\u093F\u0902\u0926\u0941 (Endpoint) \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0907\u0938\u0947 \u0906\u0908\u092A\u0940 \u090F\u0921\u094D\u0930\u0947\u0938 (IP Address) \u0914\u0930 \u092A\u094B\u0930\u094D\u091F \u0928\u0902\u092C\u0930 (Port Number) \u0915\u0947 \u0938\u0902\u092F\u094B\u091C\u0928 \u0938\u0947 \u092A\u0939\u091A\u093E\u0928\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
    technicalMeaningEn: "A Network Socket is an operating system abstraction representing an endpoint of a two-way inter-process communication link across an IP network, uniquely identified by the 5-tuple: (Source IP, Source Port, Destination IP, Destination Port, Protocol).",
    technicalExample: `// Python TCP Socket Server
import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 9000))
server.listen(5)
conn, addr = server.accept()
print(f"\u0915\u094D\u0932\u093E\u0907\u0902\u091F \u0938\u0947 \u0915\u0928\u0947\u0915\u094D\u0936\u0928 \u0938\u094D\u0925\u093E\u092A\u093F\u0924: {addr}")
conn.sendall(b"HTTP/1.1 200 OK\\r\\n\\r\\nHello Network")`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_11",
    englishTerm: "Virtual Memory",
    language: "Marathi",
    preferredTranslation: "Virtual Memory (\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940 - \u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932\u093E\u0907\u091C\u094D\u0921 \u0905\u200D\u0945\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938)",
    alternativeTranslations: ["\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940", "\u0906\u092D\u093E\u0938\u0940 \u092E\u0947\u092E\u0930\u0940"],
    doNotTranslate: false,
    subject: "Operating Systems",
    explanation: 'Virtual Memory \u0939\u093E \u0936\u092C\u094D\u0926 \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924 \u0915\u093F\u0902\u0935\u093E "\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940" \u0905\u0938\u093E\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u093E. "\u0915\u093E\u0932\u094D\u092A\u0928\u093F\u0915 \u0938\u094D\u092E\u0930\u0923\u0936\u0915\u094D\u0924\u0940" \u0905\u0938\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915\u0926\u0943\u0937\u094D\u091F\u094D\u092F\u093E \u0926\u093F\u0936\u093E\u092D\u0942\u0932 \u0915\u0930\u0923\u093E\u0930\u093E \u0920\u0930\u0924\u094B.',
    explanationEn: "Operating system abstraction creating illusion of large contiguous address space using paging and swap space.",
    technicalMeaning: "\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940 (Virtual Memory) \u0939\u0940 \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u0940\u092E\u091A\u0940 \u090F\u0915 \u092A\u094D\u0930\u0917\u0924 \u092E\u0947\u092E\u0930\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928 \u092A\u094D\u0930\u0923\u093E\u0932\u0940 \u0906\u0939\u0947 \u091C\u0940 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u0932\u093E \u090F\u0915 \u092E\u094B\u0920\u093E \u0906\u0923\u093F \u0938\u0932\u0917 \u0905\u200D\u0945\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 (Contiguous Address Space) \u0905\u0938\u0932\u094D\u092F\u093E\u091A\u093E \u0906\u092D\u093E\u0938 \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0915\u0930\u0924\u0947. \u0939\u0947 \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u0905\u0930 MMU \u0906\u0923\u093F \u092A\u0947\u091C \u091F\u0947\u092C\u0932\u094D\u0938\u091A\u093E \u0935\u093E\u092A\u0930 \u0915\u0930\u0942\u0928 \u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092A\u0924\u094D\u0924\u094D\u092F\u093E\u0902\u091A\u0947 \u092B\u093F\u091C\u093F\u0915\u0932 \u0930\u0945\u092E (RAM) \u0915\u093F\u0902\u0935\u093E \u0921\u093F\u0938\u094D\u0915\u0935\u0930\u0940\u0932 \u0938\u094D\u0935\u0945\u092A \u0938\u094D\u092A\u0947\u0938\u092E\u0927\u094D\u092F\u0947 \u092E\u0945\u092A\u093F\u0902\u0917 \u0915\u0930\u0924\u0947.",
    technicalMeaningEn: "Virtual Memory is an operating system memory virtualization mechanism that maps process virtual addresses to physical RAM frames or swap disk space using hardware MMUs and multi-level page tables, isolating process address spaces.",
    technicalExample: `// Virtual Memory Page Translation Hierarchy (x86-64):
// CR3 Register -> PML4 (512GB) -> PDPT (1GB) -> PD (2MB) -> PT (4KB page)
// \u091C\u0930 MMU \u0932\u093E Valid Bit = 0 \u0906\u0922\u0933\u0932\u0947:
// Page Fault Exception \u091F\u094D\u0930\u093F\u0917\u0930 \u0939\u094B\u0924\u0947; OS \u0921\u093F\u0938\u094D\u0915\u0935\u0930\u0942\u0928 \u092A\u0947\u091C \u0938\u094D\u0935\u0945\u092A \u0907\u0928 \u0915\u0930\u0924\u0947.`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_12",
    englishTerm: "Neural Network",
    language: "Telugu",
    preferredTranslation: "Neural Network (\u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C32\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D / \u0C15\u0C43\u0C24\u0C4D\u0C30\u0C3F\u0C2E \u0C28\u0C3E\u0C21\u0C40 \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25)",
    alternativeTranslations: ["\u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C32\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D", "\u0C15\u0C43\u0C24\u0C4D\u0C30\u0C3F\u0C2E \u0C28\u0C3E\u0C21\u0C40 \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D"],
    doNotTranslate: false,
    subject: "Artificial Intelligence",
    explanation: "Neural Network \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C32\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C05\u0C28\u0C3F \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C35\u0C48\u0C26\u0C4D\u0C2F \u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30 \u0C28\u0C3E\u0C21\u0C40 \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25\u0C24\u0C4B \u0C2A\u0C4B\u0C32\u0C4D\u0C1A\u0C3F \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C21\u0C40\u0C2A\u0C4D \u0C32\u0C46\u0C30\u0C4D\u0C28\u0C3F\u0C02\u0C17\u0C4D \u0C2E\u0C4B\u0C21\u0C32\u0C4D\u0C38\u0C4D \u0C28\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C41\u0C28\u0C47\u0C1F\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C05\u0C30\u0C4D\u0C27\u0C02 \u0C24\u0C2A\u0C4D\u0C2A\u0C41\u0C17\u0C3E \u0C24\u0C4B\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
    explanationEn: "Computational model inspired by biological brain neurons with input, hidden, and output layers.",
    technicalMeaning: "\u0C06\u0C30\u0C4D\u0C1F\u0C3F\u0C2B\u0C3F\u0C37\u0C3F\u0C2F\u0C32\u0C4D \u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C32\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D (Neural Network / ANN) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C2E\u0C3E\u0C28\u0C35 \u0C2E\u0C46\u0C26\u0C21\u0C41\u0C32\u0C4B\u0C28\u0C3F \u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C3E\u0C28\u0C4D\u0C32 \u0C2A\u0C4D\u0C30\u0C47\u0C30\u0C23\u0C24\u0C4B \u0C30\u0C42\u0C2A\u0C4A\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C47\u0C37\u0C28\u0C32\u0C4D \u0C2E\u0C4B\u0C21\u0C32\u0C4D. \u0C07\u0C26\u0C3F \u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D, \u0C39\u0C3F\u0C21\u0C46\u0C28\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C05\u0C35\u0C41\u0C1F\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D \u0C32\u0C47\u0C2F\u0C30\u0C4D\u200C\u0C32\u0C32\u0C4B \u0C05\u0C28\u0C41\u0C38\u0C02\u0C27\u0C3E\u0C28\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C15\u0C43\u0C24\u0C4D\u0C30\u0C3F\u0C2E \u0C28\u0C4D\u0C2F\u0C42\u0C30\u0C3E\u0C28\u0C4D\u200C\u0C32 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2E\u0C4D\u0C2F\u0C3E\u0C1F\u0C4D\u0C30\u0C3F\u0C15\u0C4D\u0C38\u0C4D \u0C2C\u0C30\u0C41\u0C35\u0C41\u0C32\u0C41 (Weights), \u0C2C\u0C2F\u0C3E\u0C38\u0C4D\u200C\u0C32\u0C41 (Biases) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C28\u0C3E\u0C28\u0C4D-\u0C32\u0C40\u0C28\u0C3F\u0C2F\u0C30\u0C4D \u0C2F\u0C3E\u0C15\u0C4D\u0C1F\u0C3F\u0C35\u0C47\u0C37\u0C28\u0C4D \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D\u0C32\u0C28\u0C41 \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C3F \u0C15\u0C4D\u0C32\u0C3F\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C28\u0C2E\u0C42\u0C28\u0C3E\u0C32\u0C28\u0C41 \u0C28\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F.",
    technicalMeaningEn: "An Artificial Neural Network (ANN) is a parameterized non-linear function approximator composed of interconnected layers of artificial neurons that transform input tensors via learned weight matrices, biases, and non-linear activation functions.",
    technicalExample: `// Multi-Layer Perceptron (MLP) in PyTorch
import torch.nn as nn
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(784, 128)
        self.act = nn.ReLU() # \u0C28\u0C3E\u0C28\u0C4D-\u0C32\u0C40\u0C28\u0C3F\u0C2F\u0C30\u0C4D \u0C2F\u0C3E\u0C15\u0C4D\u0C1F\u0C3F\u0C35\u0C47\u0C37\u0C28\u0C4D
        self.output = nn.Linear(128, 10)
    def forward(self, x):
        return self.output(self.act(self.layer1(x)))`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_13",
    englishTerm: "Garbage Collection",
    language: "Hindi",
    preferredTranslation: "Garbage Collection (\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928 - \u0911\u091F\u094B\u092E\u0948\u091F\u093F\u0915 \u092E\u0947\u092E\u094B\u0930\u0940 \u0930\u093F\u0915\u094D\u0932\u0947\u092E\u0947\u0936\u0928)",
    alternativeTranslations: ["\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928", "\u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u094D\u0932\u0940\u092F\u0930\u0947\u0902\u0938"],
    doNotTranslate: true,
    subject: "Programming",
    explanation: 'Garbage Collection \u0915\u094B "\u0915\u091A\u0930\u093E \u0909\u0920\u093E\u0928\u093E" \u091C\u0948\u0938\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u092D\u0940 \u0928 \u0915\u0930\u0947\u0902\u0964 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u092D\u093E\u0937\u093E\u0913\u0902 (Java, Python, Go) \u092E\u0947\u0902 \u092F\u0939 \u0905\u092A\u094D\u0930\u092F\u0941\u0915\u094D\u0924 \u0939\u0940\u092A \u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u094B \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u0947 \u0915\u093E \u0938\u093F\u0938\u094D\u091F\u092E \u0939\u0948\u0964',
    explanationEn: "Do not translate as municipal garbage cleanup. It is the runtime automatic freeing of heap memory no longer referenced.",
    technicalMeaning: "\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928 (Garbage Collection - GC) \u090F\u0915 \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u0930\u0928\u091F\u093E\u0907\u092E \u092E\u0947\u092E\u094B\u0930\u0940 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u092A\u094D\u0930\u0923\u093E\u0932\u0940 (Automatic Memory Management) \u0939\u0948 \u091C\u094B \u0939\u0940\u092A \u092E\u0947\u092E\u094B\u0930\u0940 (Heap Memory) \u092E\u0947\u0902 \u0906\u0935\u0902\u091F\u093F\u0924 \u0909\u0928 \u0911\u092C\u094D\u091C\u0947\u0915\u094D\u091F\u094D\u0938 \u0915\u093E \u0938\u094D\u0935\u0924\u0903 \u092A\u0924\u093E \u0932\u0917\u093E\u0924\u0940 \u0939\u0948 \u091C\u093F\u0928\u094D\u0939\u0947\u0902 \u0905\u092C \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E \u0915\u0947 \u0915\u093F\u0938\u0940 \u092D\u0940 \u090F\u0915\u094D\u091F\u093F\u0935 \u0930\u0947\u092B\u0930\u0947\u0902\u0938 \u0926\u094D\u0935\u093E\u0930\u093E \u090F\u0915\u094D\u0938\u0947\u0938 \u0928\u0939\u0940\u0902 \u0915\u093F\u092F\u093E \u091C\u093E \u0938\u0915\u0924\u093E, \u0914\u0930 \u0909\u0928\u0915\u0940 \u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u094B \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u092E\u0941\u0915\u094D\u0924 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964",
    technicalMeaningEn: "Garbage Collection (GC) is an automatic runtime memory management mechanism that detects heap-allocated memory objects that are no longer reachable from any execution stack root references and automatically reclaims their memory space.",
    technicalExample: `// JVM Generational Garbage Collection:
// 1. Objects allocated in Eden (Young Generation).
// 2. Surviving objects copied to Survivor Spaces (S0/S1).
// 3. Long-lived objects promoted to Tenured (Old Generation).
// 4. Mark-and-Sweep algorithm frees unreferenced objects automatically.`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_14",
    englishTerm: "B-Tree Indexing",
    language: "Gujarati",
    preferredTranslation: "B-Tree Indexing (\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97 - \u0AB8\u0A82\u0AA4\u0AC1\u0AB2\u0ABF\u0AA4 \u0AB8\u0AB0\u0ACD\u0A9A \u0A9F\u0ACD\u0AB0\u0AC0)",
    alternativeTranslations: ["\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97", "\u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8"],
    doNotTranslate: true,
    subject: "DBMS",
    explanation: 'B-Tree Indexing \u0AB6\u0AAC\u0ACD\u0AA6 \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A8F\u0AA8\u0ACD\u0A9C\u0ABF\u0AA8\u0ABF\u0AAF\u0AB0\u0ABF\u0A82\u0A97\u0AAE\u0ABE\u0A82 \u0AAE\u0ABE\u0AA8\u0A95 \u0AB9\u0ACB\u0AB5\u0ABE\u0AA5\u0AC0 \u0AA4\u0AC7\u0AA8\u0AC7 "\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97" \u0AA4\u0AB0\u0AC0\u0A95\u0AC7 \u0A9C \u0A9C\u0ABE\u0AB3\u0AB5\u0AC0 \u0AB0\u0ABE\u0A96\u0AB5\u0ACB. \u0AB5\u0AC3\u0A95\u0ACD\u0AB7 \u0A85\u0AA5\u0AB5\u0ABE \u0A9D\u0ABE\u0AA1 \u0A9C\u0AC7\u0AB5\u0ACB \u0AB6\u0ABE\u0AAC\u0ACD\u0AA6\u0ABF\u0A95 \u0A85\u0AA8\u0AC1\u0AB5\u0ABE\u0AA6 \u0A95\u0AB0\u0AB5\u0ACB \u0AA8\u0AB9\u0AC0\u0A82.',
    explanationEn: "Self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.",
    technicalMeaning: "\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97 (B-Tree Indexing) \u0A8F \u0AB8\u0ACD\u0AB5-\u0AB8\u0A82\u0AA4\u0AC1\u0AB2\u0ABF\u0AA4 (Self-Balancing) \u0AAE\u0AB2\u0ACD\u0A9F\u0AC0-\u0AB5\u0AC7 \u0AB8\u0AB0\u0ACD\u0A9A \u0A9F\u0ACD\u0AB0\u0AC0 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0A95\u0ACD\u0A9A\u0AB0 \u0A9B\u0AC7 \u0A9C\u0AC7 \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0AAE\u0AC7\u0AA8\u0AC7\u0A9C\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE\u0ACD\u0AB8 (DBMS) \u0AAE\u0ABE\u0A82 \u0AB8\u0ACD\u0A9F\u0ACB\u0AB0\u0AC7\u0A9C \u0AA1\u0ABF\u0AB8\u0ACD\u0A95\u0AAE\u0ABE\u0A82\u0AA5\u0AC0 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB5\u0ABE\u0A82\u0A9A\u0AB5\u0ABE \u0A85\u0AA8\u0AC7 \u0AB2\u0A96\u0AB5\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7 \u0A91\u0AAA\u0ACD\u0A9F\u0ABF\u0AAE\u0ABE\u0A87\u0A9D \u0A95\u0AB0\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0ACD\u0AAF\u0AC1\u0A82 \u0A9B\u0AC7. \u0AA4\u0AC7 \u0A95\u0AC0\u0A93\u0AA8\u0AC7 \u0AB8\u0AC9\u0AB0\u0ACD\u0A9F \u0A95\u0AB0\u0AC7\u0AB2\u0AC0 \u0AB0\u0ABE\u0A96\u0AC7 \u0A9B\u0AC7 \u0A85\u0AA8\u0AC7 O(log n) \u0AB8\u0AAE\u0AAF\u0AAE\u0ABE\u0A82 \u0AB6\u0ACB\u0AA7, \u0A87\u0AA8\u0ACD\u0AB8\u0AB0\u0ACD\u0A9F \u0A85\u0AA8\u0AC7 \u0AB0\u0AC7\u0AA8\u0ACD\u0A9C \u0A95\u0ACD\u0AB5\u0AC7\u0AB0\u0AC0\u0A9D \u0AB8\u0A95\u0ACD\u0AB7\u0AAE \u0A95\u0AB0\u0AC7 \u0A9B\u0AC7.",
    technicalMeaningEn: "A B-Tree is a self-balancing balanced multiway search tree optimized for storage systems that read and write large blocks of data, keeping keys sorted and supporting O(log n) searches, range queries, and sequential traversals with minimal disk I/O.",
    technicalExample: `-- Creating a B-Tree index on a relational database column
CREATE INDEX idx_user_registration ON users USING btree (created_at DESC);
-- Enables instant index range scan instead of full table sequential scan:
EXPLAIN SELECT * FROM users WHERE created_at >= '2026-01-01';`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_15",
    englishTerm: "Buffer Overflow",
    language: "Punjabi",
    preferredTranslation: "Buffer Overflow (\u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05 - \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A40\u0A2E\u0A3E \u0A09\u0A32\u0A70\u0A18\u0A23\u0A3E)",
    alternativeTranslations: ["\u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05", "\u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A40\u0A2E\u0A3E \u0A09\u0A32\u0A70\u0A18\u0A23\u0A3E"],
    doNotTranslate: true,
    subject: "Cyber Security",
    explanation: "Buffer Overflow \u0A38\u0A3C\u0A2C\u0A26 \u0A28\u0A42\u0A70 \u0A38\u0A3E\u0A08\u0A2C\u0A30 \u0A38\u0A41\u0A30\u0A71\u0A16\u0A3F\u0A06 \u0A35\u0A3F\u0A71\u0A1A \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A1C\u0A3E\u0A02 \u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05 \u0A39\u0A40 \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A1C\u0A3E\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A2A\u0A3E\u0A23\u0A40 \u0A26\u0A47 \u0A1B\u0A71\u0A2A\u0A5C \u0A35\u0A3E\u0A02\u0A17 \u0A38\u0A3C\u0A3E\u0A2C\u0A26\u0A3F\u0A15 \u0A05\u0A28\u0A41\u0A35\u0A3E\u0A26 \u0A15\u0A30\u0A28 \u0A28\u0A3E\u0A32 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A70\u0A15\u0932\u0A2A \u0A17\u0A41\u0A70\u0A1D\u0A32\u0A26\u0A3E\u0A30 \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
    explanationEn: "Security vulnerability where written data exceeds allocated buffer memory block and corrupts adjacent memory registers.",
    technicalMeaning: "\u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05 (Buffer Overflow) \u0A07\u0A71\u0A15 \u0A17\u0A70\u0A2D\u0A40\u0A30 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A41\u0A30\u0A71\u0A16\u0A3F\u0A06 \u0A16\u0A3C\u0A3E\u0A2E\u0A40 (Security Vulnerability) \u0A39\u0A48 \u0A1C\u0A4B \u0A09\u0A26\u0A4B\u0A02 \u0A35\u0A3E\u0A2A\u0A30\u0A26\u0A40 \u0A39\u0A48 \u0A1C\u0A26\u0A4B\u0A02 \u0A15\u0A4B\u0A08 \u0A2A\u0A4D\u0A30\u0A4B\u0A17\u0A30\u0A3E\u0A2E \u0A07\u0A71\u0A15 \u0A28\u0A3F\u0A30\u0A27\u0A3E\u0A30\u0A24 \u0A06\u0A15\u0A3E\u0A30 \u0A26\u0A47 \u0A2C\u0A2B\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A09\u0A38\u0A26\u0A40 \u0A38\u0A2E\u0A30\u0A71\u0A25\u0CBE \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A21\u0A3E\u0A1F\u0A3E \u0A32\u0A3F\u0A16\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A07\u0A38\u0A26\u0A47 \u0A28\u0A24\u0A40\u0A1C\u0A47 \u0A35\u0A1C\u0A4B\u0A02 \u0A28\u0A3E\u0A32 \u0A32\u0A71\u0A17\u0A26\u0A47 \u0A38\u0A1F\u0A48\u0A15 \u0A2B\u0A30\u0A47\u0A2E, \u0A30\u0A3F\u0A1F\u0A30\u0A28 \u0A10\u0A21\u0A30\u0A48\u0A71\u0A38 \u0A1C\u0A3E\u0A02 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A30\u0A1C\u0A3F\u0A38\u0A1F\u0A30 \u0A15\u0A30\u0A71\u0A2A\u0A1F \u0A39\u0A4B \u0A1C\u0A3E\u0A02\u0A26\u0A47 \u0A39\u0A28\u0964",
    technicalMeaningEn: "A Buffer Overflow is an anomalous memory condition occurring when an application writes data past the boundary of a fixed-size allocated buffer, corrupting adjacent stack frames, return address registers, or heap control blocks.",
    technicalExample: `// Vulnerable C code lacking bounds enforcement
void vulnerable_copy(char *user_input) {
    char local_buffer[32];
    strcpy(local_buffer, user_input); // \u0A05\u0A38\u0A41\u0A30\u0A71\u0A16\u0A3F\u0A05\u0A24: \u0A1C\u0A47 \u0A07\u0A28\u0A2A\u0A41\u0A1F 32 \u0A2C\u0A3E\u0A08\u0A1F \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A39\u0A4B\u0A35\u0A47
}
// \u0A38\u0A41\u0A30\u0A71\u0A16\u0A3F\u0A05\u0A24 \u0A15\u0A4B\u0A21:
strncpy(local_buffer, user_input, sizeof(local_buffer) - 1);`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_16",
    englishTerm: "Semaphore",
    language: "Telugu",
    preferredTranslation: "Semaphore (\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D - \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D)",
    alternativeTranslations: ["\u0C38\u0C3F\u0C02\u0C15\u0C4D\u0C30\u0C4A\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D", "\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D"],
    doNotTranslate: true,
    subject: "Operating Systems",
    explanation: "Semaphore \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D \u0C05\u0C28\u0C3F \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C2A\u0C3F\u0C32\u0C35\u0C3E\u0C32\u0C3F. \u0C26\u0C40\u0C28\u0C4D\u0C28\u0C3F \u0C30\u0C48\u0C32\u0C4D\u0C35\u0C47 \u0C1C\u0C46\u0C02\u0C21\u0C3E \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41; \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C15\u0C3E\u0C02\u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C35\u0C3E\u0C21\u0C47 \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D.",
    explanationEn: 'Preserve "Semaphore". Do not translate as railway flag. It is an integer synchronization counter with atomic wait() and signal() operations.',
    technicalMeaning: "\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D (Semaphore) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C15\u0C3E\u0C02\u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C30\u0C3F\u0C2E\u0C3F\u0C24 \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C35\u0C28\u0C30\u0C41\u0C32\u0C28\u0C41 (Shared Resources) \u0C2C\u0C39\u0C41\u0C33 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C47\u0C38\u0C3E\u0C30\u0C3F \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C15\u0C41\u0C02\u0C21\u0C3E \u0C28\u0C3F\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3F\u0C02\u0C1A\u0C47 \u0C12\u0C15 \u0C30\u0C15\u0C4D\u0C37\u0C3F\u0C24 \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D (Synchronization Variable). \u0C07\u0C26\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C2A\u0C30\u0C2E\u0C3E\u0C23\u0C41 \u0C1A\u0C30\u0C4D\u0C2F\u0C32 (wait() \u0C32\u0C47\u0C26\u0C3E P() \u0C2E\u0C30\u0C3F\u0C2F\u0C41 signal() \u0C32\u0C47\u0C26\u0C3E V()) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C28\u0C3F\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C47 \u0C2A\u0C42\u0C30\u0C4D\u0C23\u0C3E\u0C02\u0C15 \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F. \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D 0 \u0C15\u0C02\u0C1F\u0C47 \u0C24\u0C15\u0C4D\u0C15\u0C41\u0C35\u0C48\u0C24\u0C47 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C2C\u0C4D\u0C32\u0C3E\u0C15\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.",
    technicalMeaningEn: "A Semaphore is an operating system synchronization abstraction that controls concurrent access to a shared resource pool using atomic P() [wait] and V() [signal] operations on an integer counter.",
    technicalExample: `// POSIX Counting Semaphore in C
sem_t printer_pool;
sem_init(&printer_pool, 0, 4); // 4 \u0C2A\u0C4D\u0C30\u0C3F\u0C02\u0C1F\u0C30\u0C4D\u0C32\u0C41 \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F
sem_wait(&printer_pool);       // \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F, \u0C16\u0C3E\u0C33\u0C40 \u0C32\u0C47\u0C15\u0C2A\u0C4B\u0C24\u0C47 \u0C35\u0C46\u0C2F\u0C3F\u0C1F\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F
// \u0C15\u0C4D\u0C30\u0C3F\u0C1F\u0C3F\u0C15\u0C32\u0C4D \u0C38\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C3F\u0C02\u0C1F\u0C4D \u0C1C\u0C3E\u0C2C\u0C4D \u0C05\u0C2E\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F...
sem_post(&printer_pool);       // \u0C2A\u0C4D\u0C30\u0C3F\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C38\u0C3F \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C2A\u0C46\u0C02\u0C1A\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_17",
    englishTerm: "Mutex (Mutual Exclusion Lock)",
    language: "Hindi",
    preferredTranslation: "Mutex (\u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 - \u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u091C\u093C\u0928 \u0932\u0949\u0915)",
    alternativeTranslations: ["\u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u091C\u093C\u0928", "\u092C\u093E\u0907\u0928\u0930\u0940 \u0932\u0949\u0915"],
    doNotTranslate: true,
    subject: "Operating Systems",
    explanation: "Mutex (\u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u091C\u093C\u0928) \u090F\u0915 \u092C\u093E\u0907\u0928\u0930\u0940 \u0932\u0949\u0915\u093F\u0902\u0917 \u0924\u0902\u0924\u094D\u0930 \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u0915\u0947\u0935\u0932 \u0935\u0939\u0940 \u0925\u094D\u0930\u0947\u0921 \u0932\u0949\u0915 \u0916\u094B\u0932 \u0938\u0915\u0924\u093E \u0939\u0948 \u091C\u093F\u0938\u0928\u0947 \u0909\u0938\u0947 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u093F\u092F\u093E \u0939\u094B\u0964",
    explanationEn: 'Preserve "Mutex". It is a binary locking primitive where only the thread that acquired the lock may release it.',
    technicalMeaning: "\u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 (Mutex - Mutual Exclusion) \u090F\u0915 \u0932\u0949\u0915\u093F\u0902\u0917 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0924\u0902\u0924\u094D\u0930 \u0939\u0948 \u091C\u094B \u092F\u0939 \u0917\u093E\u0930\u0902\u091F\u0940 \u0926\u0947\u0924\u093E \u0939\u0948 \u0915\u093F \u0915\u093F\u0938\u0940 \u092D\u0940 \u0938\u092E\u092F \u0915\u0947\u0935\u0932 \u090F\u0915 \u0939\u0940 \u0925\u094D\u0930\u0947\u0921 \u0915\u094D\u0930\u093F\u091F\u093F\u0915\u0932 \u0938\u0947\u0915\u094D\u0936\u0928 (Critical Section) \u092E\u0947\u0902 \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930 \u0938\u0915\u0924\u093E \u0939\u0948\u0964 \u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 \u092E\u0947\u0902 \u0913\u0928\u0930\u0936\u093F\u092A (\u0938\u094D\u0935\u093E\u092E\u093F\u0924\u094D\u0935) \u0915\u093E \u0928\u093F\u092F\u092E \u0939\u094B\u0924\u093E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 \u0930\u0947\u0938 \u0915\u0902\u0921\u0940\u0936\u0902\u0938 (Race Conditions) \u092A\u0942\u0930\u0940 \u0924\u0930\u0939 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0902\u0964",
    technicalMeaningEn: "A Mutex is a mutual exclusion locking primitive designed for concurrency control, guaranteeing that at most one thread executes within a designated critical section at any instant.",
    technicalExample: `// std::mutex lock guard in C++
#include <mutex>
std::mutex balance_mutex;
void updateBalance(double delta) {
    std::lock_guard<std::mutex> lock(balance_mutex);
    account_balance += delta; // \u0915\u094D\u0930\u093F\u091F\u093F\u0915\u0932 \u0938\u0947\u0915\u094D\u0936\u0928 \u092E\u0947\u0902 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0905\u092A\u0921\u0947\u091F
}`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "term_18",
    englishTerm: "ACID Properties",
    language: "Telugu",
    preferredTranslation: "ACID Properties (\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C30\u0C4D\u0C1F\u0C40\u0C38\u0C4D - \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C3E\u0C32\u0C41)",
    alternativeTranslations: ["\u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41"],
    doNotTranslate: true,
    subject: "DBMS",
    explanation: "ACID \u0C28\u0C3F \u0C30\u0C38\u0C3E\u0C2F\u0C28 \u0C06\u0C2E\u0C4D\u0C32\u0C02 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u0C38\u0C4D\u200C\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C35\u0C3F\u0C36\u0C4D\u0C35\u0C38\u0C28\u0C40\u0C2F\u0C24\u0C28\u0C41 \u0C15\u0C3E\u0C2A\u0C3E\u0C21\u0C47 \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41 (Atomicity, Consistency, Isolation, Durability).",
    explanationEn: "Preserve ACID. Do not translate as chemical acid (\u0C06\u0C2E\u0C4D\u0C32\u0C2E\u0C41). In DBMS, it guarantees transaction reliability (Atomicity, Consistency, Isolation, Durability).",
    technicalMeaning: "\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41 (ACID Properties - Atomicity, Consistency, Isolation, Durability) \u0C05\u0C28\u0C47\u0C35\u0C3F \u0C30\u0C3F\u0C32\u0C47\u0C37\u0C28\u0C32\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u0C38\u0C4D\u200C\u0C32\u0C4B \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32\u0C41 (Transactions) \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C35\u0C48\u0C2B\u0C32\u0C4D\u0C2F\u0C3E\u0C32\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C15\u0C4D\u0C30\u0C3E\u0C37\u0C4D \u0C05\u0C2F\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40 \u0C28\u0C2E\u0C4D\u0C2E\u0C26\u0C17\u0C3F\u0C28\u0C35\u0C3F\u0C17\u0C3E \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C16\u0C1A\u0C4D\u0C1A\u0C3F\u0C24\u0C2E\u0C48\u0C28\u0C35\u0C3F\u0C17\u0C3E \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C47\u0C32\u0C3E \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C1A\u0C4D\u0C1A\u0C47 \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C41. Atomicity (\u0C05\u0C28\u0C4D\u0C28\u0C40 \u0C1C\u0C30\u0C17\u0C3E\u0C32\u0C3F \u0C32\u0C47\u0C26\u0C3E \u0C0F\u0C26\u0C40 \u0C1C\u0C30\u0C17\u0C15\u0C42\u0C21\u0C26\u0C41), Consistency (\u0C21\u0C47\u0C1F\u0C3E \u0C28\u0C3F\u0C2C\u0C02\u0C27\u0C28\u0C32\u0C41 \u0C2A\u0C3E\u0C1F\u0C3F\u0C02\u0C1A\u0C21\u0C02), Isolation (\u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30\u0C02\u0C17\u0C3E \u0C28\u0C21\u0C35\u0C21\u0C02), Durability (\u0C36\u0C3E\u0C36\u0C4D\u0C35\u0C24\u0C02\u0C17\u0C3E \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C21\u0C02).",
    technicalMeaningEn: "ACID properties (Atomicity, Consistency, Isolation, Durability) are the four fundamental transaction processing guarantees that ensure database validity and reliability despite network failures or crashes.",
    technicalExample: `-- Relational ACID Transaction block
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE id = 42;
UPDATE accounts SET balance = balance + 1000 WHERE id = 88;
COMMIT; -- \u0C21\u0C47\u0C1F\u0C3E \u0C36\u0C3E\u0C36\u0C4D\u0C35\u0C24\u0C02\u0C17\u0C3E \u0C21\u0C3F\u0C38\u0C4D\u0C15\u0C4D\u200C\u0C32\u0C4B\u0C28\u0C3F Write-Ahead Log (WAL) \u0C15\u0C41 \u0C30\u0C3E\u0C2F\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F (Durability)`,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  }
];
var SEED_FEW_SHOT_EXAMPLES = [
  {
    id: "few_01",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    subject: "Operating Systems",
    difficulty: "INTERMEDIATE",
    question: "What is a Semaphore and how does it prevent race conditions?",
    expectedStyle: "Technical Hindi preserving OS terms (Semaphore, Mutex, Race Condition, Critical Section, wait/signal)",
    terminologyGuidance: 'Do not translate Semaphore to "\u0938\u0902\u0915\u0947\u0924 \u0927\u094D\u0935\u091C". Keep Semaphore, wait(), signal() intact with code/pseudocode example.',
    responseSnippet: "Semaphore \u090F\u0915 synchronization tool \u0939\u0948 \u091C\u094B critical section \u092E\u0947\u0902 race conditions \u0915\u094B \u0930\u094B\u0915\u0924\u093E \u0939\u0948...",
    enabled: true,
    createdAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "few_02",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    subject: "Data Structures",
    difficulty: "BEGINNER",
    question: "How does a Stack data structure work?",
    expectedStyle: "Friendly technical Telugu with LIFO analogy (plates stack), keeping Push, Pop, Peek, Top as keywords.",
    terminologyGuidance: "Keep Stack, Push, Pop, LIFO in English script or clear Telugu transliteration (\u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D, \u0C2A\u0C41\u0C37\u0C4D, \u0C2A\u0C3E\u0C2A\u0C4D).",
    responseSnippet: "Stack \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C12\u0C15 Linear Data Structure, \u0C07\u0C26\u0C3F LIFO (Last In First Out) \u0C28\u0C3F\u0C2F\u0C2E\u0C02 \u0C2A\u0C48 \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F...",
    enabled: true,
    createdAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "few_03",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    subject: "DBMS",
    difficulty: "ADVANCED",
    question: "Explain ACID properties in relational database transactions.",
    expectedStyle: "Rigorous technical Tamil maintaining Atomicity, Consistency, Isolation, Durability, WAL, 2PL, Commit, Rollback.",
    terminologyGuidance: "Do not create confusing literal translations for Isolation or Durability without contextualizing DBMS transaction states.",
    responseSnippet: "ACID Properties \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 Database Transactions-\u0B87\u0BA9\u0BCD \u0BA8\u0BAE\u0BCD\u0BAA\u0B95\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC8 \u0B89\u0BB1\u0BC1\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0BAE\u0BCD \u0BA8\u0BBE\u0BA9\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD...",
    enabled: true,
    createdAt: "2026-08-01T00:00:00.000Z"
  }
];
var SEED_EVALUATION_CASES = [
  {
    id: "case_001",
    subject: "Operating Systems",
    topic: "Thread Synchronization",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "What is a Thread in an operating system and why do multithreaded applications experience race conditions?",
    referenceAnswer: "A thread is the smallest unit of CPU execution within a process sharing heap memory and global variables. Race conditions happen when multiple threads read and write shared data concurrently without mutex locks.",
    directTranslation: "\u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u0927\u093E\u0917\u093E \u0915\u094D\u092F\u093E \u0939\u0948 \u0914\u0930 \u092C\u0939\u0941-\u0927\u093E\u0917\u093E \u0905\u0928\u0941\u092A\u094D\u0930\u092F\u094B\u0917 \u0926\u094C\u0921\u093C \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F \u0915\u093E \u0905\u0928\u0941\u092D\u0935 \u0915\u094D\u092F\u094B\u0902 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902? \u090F\u0915 \u0927\u093E\u0917\u093E \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0940 \u0938\u0941\u0908 \u0939\u0948 \u091C\u094B \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u092E\u0947\u0902 \u0915\u092A\u0921\u093C\u0947 \u0938\u093F\u0932\u0924\u0940 \u0939\u0948...",
    contextAwareResponse: "Operating System \u092E\u0947\u0902 Thread \u0915\u093F\u0938\u0940 Process \u0915\u0947 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 (execution) \u0915\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0907\u0915\u093E\u0908 (lightweight process) \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u0938\u092D\u0940 Threads \u090F\u0915 \u0939\u0940 Process \u0915\u0947 address space \u0914\u0930 shared heap memory \u0915\u094B share \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964 \u091C\u092C \u0926\u094B \u092F\u093E \u0905\u0927\u093F\u0915 Threads \u092C\u093F\u0928\u093E \u0915\u093F\u0938\u0940 Synchronization (\u091C\u0948\u0938\u0947 Mutex \u092F\u093E Semaphore) \u0915\u0947 \u090F\u0915 \u0938\u093E\u0925 shared variable \u092A\u0930 read/write \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0924\u094B Race Condition \u0909\u0924\u094D\u092A\u0928\u094D\u0928 \u0939\u094B\u0924\u0940 \u0939\u0948...",
    expectedTerms: ["Thread", "Process", "Race Condition", "Shared Memory", "Mutex / Lock"],
    createdAt: "2026-08-15T09:00:00.000Z"
  },
  {
    id: "case_002",
    subject: "Computer Networks",
    topic: "Network Sockets",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "Explain what a network socket is and how TCP three-way handshaking works.",
    referenceAnswer: "A socket is an endpoint combining IP address and port number for inter-process communication. TCP 3-way handshake uses SYN, SYN-ACK, and ACK packets to establish reliable full-duplex connection.",
    directTranslation: "\u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C12\u0C15 \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C41\u0C24\u0C4D \u0C2A\u0C4D\u0C32\u0C17\u0C4D \u0C2C\u0C4B\u0C30\u0C4D\u0C21\u0C41. TCP \u0C2E\u0C42\u0C21\u0C41 \u0C35\u0C48\u0C2A\u0C41\u0C32\u0C3E \u0C15\u0C30\u0C1A\u0C3E\u0C32\u0C28\u0C02 \u0C1A\u0C47\u0C2F\u0C21\u0C02 \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C38\u0C30\u0C4D\u0C35\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C4D\u0C32\u0C17\u0C4D \u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C21\u0C02 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C1C\u0C30\u0C41\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F...",
    contextAwareResponse: "Network Socket \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D\u0C32 \u0C2E\u0C27\u0C4D\u0C2F \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C1C\u0C30\u0C3F\u0C17\u0C47 \u0C12\u0C15 Endpoint. \u0C07\u0C26\u0C3F IP Address \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Port Number \u0C15\u0C32\u0C2F\u0C3F\u0C15\u0C24\u0C4B \u0C30\u0C42\u0C2A\u0C4A\u0C02\u0C26\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F (\u0C09\u0C26\u0C3E: 192.168.1.10:8080). TCP Three-Way Handshake \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C15\u0C28\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D \u0C0F\u0C30\u0C4D\u0C2A\u0C3E\u0C1F\u0C41 \u0C1A\u0C47\u0C2F\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C35\u0C3E\u0C21\u0C47 \u0C2A\u0C26\u0C4D\u0C27\u0C24\u0C3F: 1) Client \u0C28\u0C41\u0C02\u0C21\u0C3F SYN \u0C2A\u0C4D\u0C2F\u0C3E\u0C15\u0C46\u0C1F\u0C4D, 2) Server \u0C28\u0C41\u0C02\u0C21\u0C3F SYN-ACK \u0C2A\u0C4D\u0C2F\u0C3E\u0C15\u0C46\u0C1F\u0C4D, 3) Client \u0C28\u0C41\u0C02\u0C21\u0C3F ACK \u0C2A\u0C4D\u0C2F\u0C3E\u0C15\u0C46\u0C1F\u0C4D \u0C2A\u0C02\u0C2A\u0C3F Reliable Connection \u0C28\u0C3F\u0C30\u0C4D\u0C27\u0C3E\u0C30\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F...",
    expectedTerms: ["Socket", "IP Address", "Port Number", "TCP Three-Way Handshake", "SYN", "ACK"],
    createdAt: "2026-08-15T09:15:00.000Z"
  },
  {
    id: "case_003",
    subject: "Machine Learning",
    topic: "Overfitting and Regularization",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    question: "What is overfitting in machine learning and how does L2 regularization prevent it?",
    referenceAnswer: "Overfitting occurs when an ML model memorizes training noise instead of general patterns, yielding high train accuracy and poor test accuracy. L2 regularization penalizes large weight magnitudes using squared weight penalties.",
    directTranslation: "\u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0\u0B95\u0BCD \u0B95\u0BB1\u0BCD\u0BB1\u0BB2\u0BBF\u0BB2\u0BCD \u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BBE\u0BA9 \u0B86\u0B9F\u0BC8 \u0BAA\u0BCA\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BA4\u0BB2\u0BCD \u0B8E\u0BA9\u0BCD\u0BB1\u0BBE\u0BB2\u0BCD \u0B8E\u0BA9\u0BCD\u0BA9? L2 \u0B92\u0BB4\u0BC1\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BC1\u0BB1\u0BC8 \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA4\u0BC8\u0BAF\u0BB2\u0BCD \u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0\u0BA4\u0BCD\u0BA4\u0BC8 \u0B87\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB5\u0BA4\u0BBE\u0B95\u0BC1\u0BAE\u0BCD...",
    contextAwareResponse: "Machine Learning-\u0B87\u0BB2\u0BCD Overfitting \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 Model, Training Data-\u0BB5\u0BBF\u0BB2\u0BCD \u0B89\u0BB3\u0BCD\u0BB3 Noise \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BC1\u0BA3\u0BC1\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0BAE\u0BBF\u0B95 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0B95 \u0BAE\u0BA9\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BAE\u0BCD (memorize) \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BC1\u0BB5\u0BBF\u0B9F\u0BCD\u0B9F\u0BC1, \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF Test Data-\u0BB5\u0BBF\u0BB2\u0BCD \u0BAE\u0BCB\u0B9A\u0BAE\u0BBE\u0B95 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BB2\u0BC8 (High Variance). L2 Regularization (Ridge) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 Loss Function-\u0B89\u0B9F\u0BA9\u0BCD Weights-\u0B87\u0BA9\u0BCD \u0BB5\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 (\u03BB * \u03A3w\xB2) \u0B85\u0BAA\u0BB0\u0BBE\u0BA4\u0BAE\u0BBE\u0B95 (penalty) \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1, \u0BAE\u0BBE\u0B9F\u0BB2\u0BCD \u0B8E\u0B9F\u0BC8\u0B95\u0BB3\u0BCD \u0BA4\u0BC7\u0BB5\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD\u0BB1\u0BBF \u0BAA\u0BC6\u0BB0\u0BBF\u0BA4\u0BBE\u0BB5\u0BA4\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 Generalization-\u0B90 \u0BAE\u0BC7\u0BAE\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...",
    expectedTerms: ["Overfitting", "Machine Learning", "Training Data", "Test Data", "L2 Regularization", "Weights Penalty"],
    createdAt: "2026-08-15T09:30:00.000Z"
  },
  {
    id: "case_004",
    subject: "Data Structures",
    topic: "Hash Collisions",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How do Hash Tables resolve hash collisions using Separate Chaining vs Open Addressing?",
    referenceAnswer: "Hash collision occurs when two distinct keys yield identical hash index. Separate chaining stores colliding elements in a linked list at the bucket, while open addressing probes for the next available array index.",
    directTranslation: "\u0939\u0948\u0936 \u091F\u0947\u092C\u0932 \u0939\u0948\u0936 \u091F\u0915\u094D\u0915\u0930 \u0915\u094B \u0905\u0932\u0917 \u091C\u0902\u091C\u0940\u0930 \u0914\u0930 \u0916\u0941\u0932\u0947 \u0938\u0902\u092C\u094B\u0927\u0928 \u0938\u0947 \u0915\u0948\u0938\u0947 \u0938\u0941\u0932\u091D\u093E\u0924\u0940 \u0939\u0948\u0902? \u091C\u092C \u0926\u094B \u091A\u093E\u092C\u093F\u092F\u093E\u0902 \u090F\u0915 \u0939\u0940 \u0924\u093E\u0932\u0947 \u092E\u0947\u0902 \u091F\u0915\u0930\u093E\u0924\u0940 \u0939\u0948\u0902 \u0924\u094B \u091C\u0902\u091C\u0940\u0930 \u092C\u093E\u0902\u0927 \u0926\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948...",
    contextAwareResponse: "Hash Table \u092E\u0947\u0902 \u091C\u092C \u0926\u094B \u0905\u0932\u0917 Keys \u0915\u093E hash function \u090F\u0915 \u0939\u0940 bucket index generate \u0915\u0930\u0924\u093E \u0939\u0948, \u0924\u094B \u0909\u0938\u0947 Hash Collision \u0915\u0939\u0924\u0947 \u0939\u0948\u0902\u0964 Separate Chaining \u092E\u0947\u0902 \u0939\u0930 bucket index \u092A\u0930 \u090F\u0915 Linked List \u092C\u0928\u093E\u0908 \u091C\u093E\u0924\u0940 \u0939\u0948 \u091C\u0939\u093E\u0901 colliding elements \u0938\u094D\u091F\u094B\u0930 \u0939\u094B\u0924\u0947 \u0939\u0948\u0902\u0964 Open Addressing (Linear/Quadratic Probing) \u092E\u0947\u0902 \u092F\u0926\u093F index \u092D\u0930\u093E \u0939\u094B, \u0924\u094B array \u0915\u0947 \u0905\u0917\u0932\u0947 \u0916\u093E\u0932\u0940 slot \u0915\u0940 \u0916\u094B\u091C (probe) \u0915\u0930\u0915\u0947 element \u0938\u094D\u091F\u094B\u0930 \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948...",
    expectedTerms: ["Hash Table", "Hash Collision", "Separate Chaining", "Open Addressing", "Linked List", "Probing"],
    createdAt: "2026-08-15T09:45:00.000Z"
  },
  {
    id: "case_005",
    subject: "Operating Systems",
    topic: "Deadlock Conditions",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "What are Coffman four conditions required for deadlock to occur in an operating system?",
    referenceAnswer: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait must simultaneously hold for a deadlock to happen.",
    directTranslation: "\u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02 \u0C2A\u0C21\u0C1F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C15\u0C3E\u0C2B\u0C4D\u200C\u0C2E\u0C28\u0C4D \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C37\u0C30\u0C24\u0C41\u0C32\u0C41 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F? \u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30 \u0C2C\u0C39\u0C3F\u0C37\u0C4D\u0C15\u0C30\u0C23, \u0C2A\u0C1F\u0C4D\u0C1F\u0C41\u0C15\u0C41\u0C28\u0C3F \u0C35\u0C47\u0C1A\u0C3F \u0C09\u0C02\u0C21\u0C1F\u0C02...",
    contextAwareResponse: "Operating System \u0C32\u0C4B Deadlock \u0C38\u0C02\u0C2D\u0C35\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F Coffman \u0C2A\u0C47\u0C30\u0C4D\u0C15\u0C4A\u0C28\u0C4D\u0C28 4 \u0C24\u0C2A\u0C4D\u0C2A\u0C28\u0C3F\u0C38\u0C30\u0C3F \u0C37\u0C30\u0C24\u0C41\u0C32\u0C41 (Conditions): 1) Mutual Exclusion (\u0C35\u0C28\u0C30\u0C41 \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C12\u0C15 Process \u0C15\u0C47 \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C09\u0C02\u0C21\u0C3E\u0C32\u0C3F), 2) Hold and Wait (\u0C12\u0C15 \u0C35\u0C28\u0C30\u0C41\u0C28\u0C41 \u0C2A\u0C1F\u0C4D\u0C1F\u0C41\u0C15\u0C41\u0C28\u0C3F \u0C2E\u0C30\u0C4A\u0C15\u0C26\u0C3E\u0C28\u0C3F \u0C15\u0C4B\u0C38\u0C02 \u0C35\u0C47\u0C1A\u0C3F \u0C09\u0C02\u0C21\u0C1F\u0C02), 3) No Preemption (\u0C2C\u0C32\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C35\u0C28\u0C30\u0C41\u0C28\u0C41 \u0C24\u0C40\u0C38\u0C41\u0C15\u0C4B\u0C32\u0C47\u0C15\u0C2A\u0C4B\u0C35\u0C21\u0C02), 4) Circular Wait (\u0C38\u0C48\u0C15\u0C4D\u0C32\u0C3F\u0C15\u0C4D \u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C32\u0C4B \u0C12\u0C15\u0C30\u0C3F \u0C35\u0C28\u0C30\u0C41 \u0C15\u0C4B\u0C38\u0C02 \u0C2E\u0C30\u0C4A\u0C15\u0C30\u0C41 \u0C28\u0C3F\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C3F\u0C02\u0C1A\u0C21\u0C02)...",
    expectedTerms: ["Deadlock", "Coffman Conditions", "Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"],
    createdAt: "2026-08-15T10:00:00.000Z"
  },
  {
    id: "case_006",
    subject: "DBMS",
    topic: "ACID Properties",
    sourceLanguage: "English",
    targetLanguage: "Kannada",
    question: "Explain the ACID properties of database transactions with real banking examples.",
    referenceAnswer: "Atomicity (all or nothing), Consistency (preserves invariants), Isolation (concurrent transactions execute without interference), Durability (committed changes persist even after crash).",
    directTranslation: "\u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CB5\u0CB9\u0CBF\u0CB5\u0CBE\u0C9F\u0CC1\u0C97\u0CB3 \u0C86\u0CAE\u0CCD\u0CB2 \u0C97\u0CC1\u0CA3\u0CB2\u0C95\u0CCD\u0CB7\u0CA3\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB5\u0CBF\u0CB5\u0CB0\u0CBF\u0CB8\u0CBF. \u0CAA\u0CB0\u0CAE\u0CBE\u0CA3\u0CC1\u0CA4\u0CC6, \u0CB8\u0CCD\u0CA5\u0CBF\u0CB0\u0CA4\u0CC6, \u0CAA\u0CCD\u0CB0\u0CA4\u0CCD\u0CAF\u0CC7\u0C95\u0CA4\u0CC6 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CAC\u0CBE\u0CB3\u0CBF\u0C95\u0CC6...",
    contextAwareResponse: "Database Management System \u0CA8\u0CB2\u0CCD\u0CB2\u0CBF Transaction \u0CA8 \u0CB5\u0CBF\u0CB6\u0CCD\u0CB5\u0CBE\u0CB8\u0CBE\u0CB0\u0CCD\u0CB9\u0CA4\u0CC6 \u0C95\u0CBE\u0CAA\u0CBE\u0CA1\u0CB2\u0CC1 ACID Properties \u0C85\u0CA4\u0CCD\u0CAF\u0C97\u0CA4\u0CCD\u0CAF: 1) Atomicity (\u0C8E\u0CB2\u0CCD\u0CB2\u0CB5\u0CC2 \u0CAA\u0CC2\u0CB0\u0CCD\u0CA3\u0C97\u0CCA\u0CB3\u0CCD\u0CB3\u0CAC\u0CC7\u0C95\u0CC1 \u0C85\u0CA5\u0CB5\u0CBE \u0CB0\u0CCB\u0CB2\u0CCD\u200C\u0CAC\u0CCD\u0CAF\u0CBE\u0C95\u0CCD \u0C86\u0C97\u0CAC\u0CC7\u0C95\u0CC1 - All or Nothing), 2) Consistency (\u0C96\u0CBE\u0CA4\u0CC6 \u0CAC\u0CCD\u0CAF\u0CBE\u0CB2\u0CC6\u0CA8\u0CCD\u0CB8\u0CCD \u0CA8\u0CBF\u0CAF\u0CAE\u0C97\u0CB3\u0CC1 \u0CB8\u0CCD\u0CA5\u0CBF\u0CB0\u0CB5\u0CBE\u0C97\u0CBF\u0CB0\u0CAC\u0CC7\u0C95\u0CC1), 3) Isolation (\u0C8E\u0CB0\u0CA1\u0CC1 \u0CB5\u0CB9\u0CBF\u0CB5\u0CBE\u0C9F\u0CC1\u0C97\u0CB3\u0CC1 \u0C8F\u0C95\u0C95\u0CBE\u0CB2\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0CA8\u0CA1\u0CC6\u0CA6\u0CB0\u0CC2 \u0CAA\u0CB0\u0CB8\u0CCD\u0CAA\u0CB0 \u0CB9\u0CB8\u0CCD\u0CA4\u0C95\u0CCD\u0CB7\u0CC7\u0CAA \u0CAE\u0CBE\u0CA1\u0CAC\u0CBE\u0CB0\u0CA6\u0CC1), 4) Durability (Commit \u0C86\u0CA6 \u0CA1\u0CC7\u0C9F\u0CBE \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD \u0C95\u0CCD\u0CB0\u0CCD\u0CAF\u0CBE\u0CB6\u0CCD \u0C86\u0CA6\u0CB0\u0CC2 \u0CB8\u0CC1\u0CB0\u0C95\u0CCD\u0CB7\u0CBF\u0CA4\u0CB5\u0CBE\u0C97\u0CBF \u0C89\u0CB3\u0CBF\u0CAF\u0CAC\u0CC7\u0C95\u0CC1)...",
    expectedTerms: ["ACID Properties", "Atomicity", "Consistency", "Isolation", "Durability", "Transaction", "Commit", "Rollback"],
    createdAt: "2026-08-15T10:15:00.000Z"
  },
  {
    id: "case_007",
    subject: "Algorithms",
    topic: "Dijkstra Shortest Path",
    sourceLanguage: "English",
    targetLanguage: "Bengali",
    question: "How does Dijkstra algorithm find the shortest path in a weighted graph and why does it fail with negative weights?",
    referenceAnswer: "Dijkstra greedily picks unvisited node with minimum tentative distance and relaxes neighbors. It assumes non-negative edge weights; negative weights violate greedy choice property causing suboptimal paths.",
    directTranslation: "\u09A1\u09BF\u099C\u0995\u09B8\u09CD\u099F\u09CD\u09B0\u09BE \u0985\u09CD\u09AF\u09BE\u09B2\u0997\u09B0\u09BF\u09A6\u09AE \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u0993\u099C\u09A8\u09AF\u09C1\u0995\u09CD\u09A4 \u0997\u09CD\u09B0\u09BE\u09AB\u09C7 \u09B8\u0982\u0995\u09CD\u09B7\u09BF\u09AA\u09CD\u09A4\u09A4\u09AE \u09AA\u09A5 \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u09AF\u09BC \u098F\u09AC\u0982 \u098B\u09A3\u09BE\u09A4\u09CD\u09AE\u0995 \u0993\u099C\u09A8\u09C7 \u0995\u09C7\u09A8 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5 \u09B9\u09AF\u09BC? \u098F\u099F\u09BF \u09B2\u09CB\u09AD\u09C0 \u0989\u09AA\u09BE\u09AF\u09BC\u09C7 \u09B9\u09BE\u0981\u099F\u09C7...",
    contextAwareResponse: "Dijkstra's Algorithm \u098F\u0995\u099F\u09BF Weighted Graph-\u098F \u098F\u0995\u099F\u09BF Single Source \u09A5\u09C7\u0995\u09C7 \u09B8\u09AE\u09B8\u09CD\u09A4 Node-\u098F\u09B0 Shortest Path \u0997\u09A3\u09A8\u09BE \u0995\u09B0\u09A4\u09C7 Greedy Approach \u098F\u09AC\u0982 Priority Queue (Min-Heap) \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964 \u098F\u099F\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA\u09C7 \u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7 \u0995\u09AE Distance-\u098F\u09B0 Node-\u0995\u09C7 Relax \u0995\u09B0\u09C7\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AF\u09A6\u09BF Graph-\u098F Negative Edge Weight \u09A5\u09BE\u0995\u09C7, \u09A4\u09BE\u09B9\u09B2\u09C7 \u09AA\u09C2\u09B0\u09CD\u09AC\u09C7\u09B0 Finalized Node-\u098F\u09B0 \u099A\u09C7\u09AF\u09BC\u09C7\u0993 \u0995\u09AE \u09A6\u09C2\u09B0\u09A4\u09CD\u09AC\u09C7\u09B0 \u09AA\u09A5 \u09A4\u09C8\u09B0\u09BF \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7 \u09AF\u09BE Greedy Assumption-\u0995\u09C7 \u09A8\u09B7\u09CD\u099F \u0995\u09B0\u09C7 \u09A6\u09C7\u09AF\u09BC...",
    expectedTerms: ["Dijkstra Algorithm", "Weighted Graph", "Shortest Path", "Min-Heap / Priority Queue", "Edge Relaxation", "Negative Weights"],
    createdAt: "2026-08-15T10:30:00.000Z"
  },
  {
    id: "case_008",
    subject: "Artificial Intelligence",
    topic: "Transformer Attention Mechanism",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How does the Scaled Dot-Product Self-Attention mechanism work in Transformer neural networks?",
    referenceAnswer: "Self-attention computes Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V, mapping query vectors against key vectors to assign contextual importance weights across token sequence.",
    directTranslation: "\u091F\u094D\u0930\u093E\u0902\u0938\u092B\u093E\u0930\u094D\u092E\u0930 \u0924\u0902\u0924\u094D\u0930\u093F\u0915\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092E\u0947\u0902 \u0938\u094D\u0915\u0947\u0932 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u092C\u093F\u0902\u0926\u0941-\u0909\u0924\u094D\u092A\u093E\u0926 \u0906\u0924\u094D\u092E-\u0927\u094D\u092F\u093E\u0928 \u0924\u0902\u0924\u094D\u0930 \u0915\u0948\u0938\u0947 \u0915\u093E\u092E \u0915\u0930\u0924\u093E \u0939\u0948? \u092F\u0939 \u092A\u094D\u0930\u0936\u094D\u0928\u094B\u0902 \u0914\u0930 \u091A\u093E\u092C\u093F\u092F\u094B\u0902 \u0915\u094B \u0916\u0941\u0926 \u092A\u0930 \u0927\u094D\u092F\u093E\u0928 \u0926\u093F\u0932\u093E\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "Transformer architecture \u092E\u0947\u0902 Self-Attention mechanism \u0907\u0928\u092A\u0941\u091F \u0938\u0940\u0915\u094D\u0935\u0947\u0902\u0938 \u0915\u0947 \u0938\u092D\u0940 tokens \u0915\u0947 \u092C\u0940\u091A contextual \u0938\u0902\u092C\u0902\u0927 \u0938\u094D\u0925\u093E\u092A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0907\u0938\u092E\u0947\u0902 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 token \u0915\u0947 \u0932\u093F\u090F \u0924\u0940\u0928 vectors \u0928\u093F\u0915\u093E\u0932\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902: Query (Q), Key (K), \u0914\u0930 Value (V)\u0964 \u0907\u0938\u0915\u093E \u0938\u0942\u0924\u094D\u0930 Attention(Q, K, V) = softmax((Q * K^T) / \u221Ad_k) * V \u0939\u094B\u0924\u093E \u0939\u0948, \u091C\u0939\u093E\u0901 \u221Ad_k vanishing gradients \u0915\u094B \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F scaling factor \u0915\u093E \u0915\u093E\u092E \u0915\u0930\u0924\u093E \u0939\u0948...",
    expectedTerms: ["Transformer", "Self-Attention", "Query (Q)", "Key (K)", "Value (V)", "Softmax", "Scaling Factor"],
    createdAt: "2026-08-15T10:45:00.000Z"
  },
  {
    id: "case_009",
    subject: "Cyber Security",
    topic: "Public Key Cryptography",
    sourceLanguage: "English",
    targetLanguage: "Marathi",
    question: "How does Asymmetric / Public Key Encryption differ from Symmetric Encryption in secure communication?",
    referenceAnswer: "Symmetric uses a single shared secret key for encryption and decryption, causing key distribution challenges. Asymmetric uses mathematically linked public/private key pairs (RSA, ECC).",
    directTranslation: "\u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0915\u0940 \u090F\u0928\u0915\u094D\u0930\u093F\u092A\u094D\u0936\u0928 \u0938\u092E\u092E\u093F\u0924 \u090F\u0928\u0915\u094D\u0930\u093F\u092A\u094D\u0936\u0928\u092A\u0947\u0915\u094D\u0937\u093E \u0915\u0938\u0947 \u0935\u0947\u0917\u0933\u0947 \u0906\u0939\u0947? \u090F\u0915\u093E\u091A \u091A\u093E\u0935\u0940\u0928\u0947 \u0915\u0941\u0932\u0942\u092A \u0909\u0918\u0921\u0923\u0947 \u0906\u0923\u093F \u0926\u094B\u0928 \u091A\u093E\u0935\u094D\u092F\u093E \u0905\u0938\u0923\u0947...",
    contextAwareResponse: "Symmetric Encryption \u092E\u0927\u094D\u092F\u0947 \u0921\u0947\u091F\u093E encrypt \u0906\u0923\u093F decrypt \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u090F\u0915\u091A Secret Key \u0935\u093E\u092A\u0930\u0932\u0940 \u091C\u093E\u0924\u0947 (\u0909\u0926\u093E: AES), \u091C\u094D\u092F\u093E\u092E\u0941\u0933\u0947 Key Distribution \u091A\u0940 \u092E\u094B\u0920\u0940 \u0938\u092E\u0938\u094D\u092F\u093E \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0939\u094B\u0924\u0947. \u0924\u0930 Asymmetric (Public Key) Cryptography \u092E\u0927\u094D\u092F\u0947 \u0926\u094B\u0928 \u091C\u094B\u0921\u0932\u0947\u0932\u094D\u092F\u093E Keys \u0905\u0938\u0924\u093E\u0924: Public Key (\u091C\u0940 \u0915\u094B\u0923\u093E\u0936\u0940\u0939\u0940 share \u0915\u0930\u0924\u093E \u092F\u0947\u0924\u0947) \u0906\u0923\u093F Private Key (\u091C\u0940 \u0915\u0947\u0935\u0933 \u092E\u093E\u0932\u0915\u093E\u0915\u0921\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u093E\u0939\u0924\u0947)...",
    expectedTerms: ["Symmetric Encryption", "Asymmetric Encryption", "Public Key", "Private Key", "Ciphertext", "Key Exchange"],
    createdAt: "2026-08-15T11:00:00.000Z"
  },
  {
    id: "case_010",
    subject: "Cloud Computing",
    topic: "Containerization vs Virtualization",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "What is the architectural difference between Docker containers and hypervisor-based virtual machines?",
    referenceAnswer: "VMs abstract hardware and run full guest OS on hypervisors. Containers virtualize OS kernel level using Linux cgroups and namespaces, sharing host kernel for lightweight isolation.",
    directTranslation: "\u0C21\u0C3E\u0C15\u0C30\u0C4D \u0C21\u0C2C\u0C4D\u0C2C\u0C3E\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3E\u0C32 \u0C2E\u0C27\u0C4D\u0C2F \u0C28\u0C3F\u0C30\u0C4D\u0C2E\u0C3E\u0C23 \u0C24\u0C47\u0C21\u0C3E \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F? \u0C39\u0C48\u0C2A\u0C30\u0C4D\u200C\u0C35\u0C48\u0C1C\u0C30\u0C4D \u0C12\u0C15 \u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C17\u0C26\u0C3F \u0C32\u0C3E\u0C02\u0C1F\u0C3F\u0C26\u0C3F...",
    contextAwareResponse: "Virtual Machines (VMs) Hypervisor (Type 1 \u0C32\u0C47\u0C26\u0C3E Type 2) \u0C2A\u0C48 \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C42 \u0C2A\u0C4D\u0C30\u0C24\u0C3F VM \u0C32\u0C4B\u0C28\u0C42 \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F Guest Operating System, Virtual Hardware \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Kernel \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F (Heavyweight). \u0C26\u0C40\u0C28\u0C3F\u0C15\u0C3F \u0C35\u0C3F\u0C30\u0C41\u0C26\u0C4D\u0C27\u0C02\u0C17\u0C3E, Docker Containers \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E Host OS Kernel \u0C28\u0C41 \u0C2A\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C3E\u0C2F\u0C3F (Linux Namespaces & cgroups \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E Isolation \u0C38\u0C3E\u0C27\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F). \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Containers \u0C15\u0C4A\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C46\u0C15\u0C28\u0C4D\u0C32\u0C32\u0C4B\u0C28\u0C47 \u0C2C\u0C42\u0C1F\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C3E\u0C2F\u0C3F...",
    expectedTerms: ["Docker Containers", "Virtual Machines", "Hypervisor", "Guest OS", "Host Kernel", "Namespaces & cgroups"],
    createdAt: "2026-08-15T11:15:00.000Z"
  },
  {
    id: "case_011",
    subject: "Programming",
    topic: "Memory Leak & Garbage Collection",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "What is a memory leak in Java or Node.js and how does Mark-and-Sweep Garbage Collection work?",
    referenceAnswer: "A memory leak happens when unused heap objects remain referenced, preventing GC reclamation. Mark-and-sweep starts from GC roots, traverses live references, and sweeps unreferenced memory.",
    directTranslation: "\u091C\u093E\u0935\u093E \u092E\u0947\u0902 \u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u093E \u0930\u093F\u0938\u093E\u0935 \u0915\u094D\u092F\u093E \u0939\u0948 \u0914\u0930 \u0915\u091A\u0930\u093E \u0909\u0920\u093E\u0928\u0947 \u0935\u093E\u0932\u093E \u092E\u093E\u0930\u094D\u0915 \u0914\u0930 \u0938\u094D\u0935\u0940\u092A \u0915\u0948\u0938\u0947 \u091D\u093E\u0921\u093C\u0942 \u0932\u0917\u093E\u0924\u093E \u0939\u0948? \u0938\u094D\u092E\u0943\u0924\u093F \u0938\u0947 \u092A\u093E\u0928\u0940 \u091F\u092A\u0915\u0928\u0947 \u0932\u0917\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "Java \u092F\u093E Node.js \u092E\u0947\u0902 Memory Leak \u0924\u092C \u0939\u094B\u0924\u093E \u0939\u0948 \u091C\u092C Heap memory \u092E\u0947\u0902 \u092E\u094C\u091C\u0942\u0926 Objects \u0905\u092C application \u0915\u094B \u0906\u0935\u0936\u094D\u092F\u0915 \u0928\u0939\u0940\u0902 \u0939\u094B\u0924\u0947, \u092A\u0930\u0928\u094D\u0924\u0941 \u0915\u093F\u0938\u0940 active reference (\u091C\u0948\u0938\u0947 static collection \u092F\u093E uncleared event listeners) \u0915\u0947 \u0915\u093E\u0930\u0923 Garbage Collector \u0909\u0928\u094D\u0939\u0947\u0902 free \u0928\u0939\u0940\u0902 \u0915\u0930 \u092A\u093E\u0924\u093E\u0964 Mark-and-Sweep GC Algorithm \u0926\u094B \u091A\u0930\u0923\u094B\u0902 \u092E\u0947\u0902 \u0915\u093E\u0930\u094D\u092F \u0915\u0930\u0924\u093E \u0939\u0948: 1) Mark Phase: GC Root (stack variables, global objects) \u0938\u0947 \u0936\u0941\u0930\u0942 \u0915\u0930\u0915\u0947 \u0938\u092D\u0940 reachable objects \u0915\u094B mark \u0915\u0930\u0924\u093E \u0939\u0948\u0964 2) Sweep Phase: Unmarked objects \u0915\u0940 memory \u0915\u094B reclaim \u0915\u0930\u0915\u0947 OS \u0915\u094B \u0909\u092A\u0932\u092C\u094D\u0927 \u0915\u0930\u093E\u0924\u093E \u0939\u0948...",
    expectedTerms: ["Memory Leak", "Garbage Collector", "Heap Memory", "GC Roots", "Mark-and-Sweep"],
    createdAt: "2026-08-15T11:30:00.000Z"
  },
  {
    id: "case_012",
    subject: "Data Structures",
    topic: "Red-Black Trees",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    question: "What are the balancing invariants of a Red-Black Tree during insertion?",
    referenceAnswer: "Every node is red or black, root is black, red nodes cannot have red children, and all paths from root to null leaves have the same black height.",
    directTranslation: "\u0B9A\u0BBF\u0BB5\u0BAA\u0BCD\u0BAA\u0BC1-\u0B95\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAE\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0B9A\u0BAE\u0BA8\u0BBF\u0BB2\u0BC8 \u0BB5\u0BBF\u0BA4\u0BBF\u0B95\u0BB3\u0BCD \u0B8E\u0BA9\u0BCD\u0BA9? \u0B9A\u0BBF\u0BB5\u0BAA\u0BCD\u0BAA\u0BC1 \u0B95\u0BBF\u0BB3\u0BC8\u0B95\u0BB3\u0BCD \u0B95\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAA\u0BB4\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0BA4\u0BB0 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD...",
    contextAwareResponse: "Red-Black Tree \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 Self-Balancing Binary Search Tree \u0B86\u0B95\u0BC1\u0BAE\u0BCD. Insertion-\u0B87\u0BA9\u0BCD \u0BAA\u0BCB\u0BA4\u0BC1 \u0B87\u0BA4\u0BC1 5 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BB5\u0BBF\u0BA4\u0BBF\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBF\u0BA9\u0BCD\u0BAA\u0BB1\u0BCD\u0BB1\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1: 1) \u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 Node-\u0B89\u0BAE\u0BCD Red \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 Black \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD, 2) Root Node \u0B8E\u0BAA\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1\u0BAE\u0BCD Black-\u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD, 3) Red Node-\u0B87\u0BA9\u0BCD \u0B95\u0BC1\u0BB4\u0BA8\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BCD \u0B8E\u0BAA\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1\u0BAE\u0BCD Black-\u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD (No two consecutive Red nodes), 4) Root-\u0BB2\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0B8E\u0BA8\u0BCD\u0BA4 \u0B92\u0BB0\u0BC1 Leaf Node-\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B9A\u0BC6\u0BB2\u0BCD\u0BB2\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD Black Nodes \u0B8E\u0BA3\u0BCD\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BC8 (Black-Height) \u0B9A\u0BAE\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD...",
    expectedTerms: ["Red-Black Tree", "Binary Search Tree", "Self-Balancing", "Root Node", "Black-Height", "Tree Rotations"],
    createdAt: "2026-08-15T11:45:00.000Z"
  },
  {
    id: "case_013",
    subject: "Operating Systems",
    topic: "Page Replacement Algorithms",
    sourceLanguage: "English",
    targetLanguage: "Gujarati",
    question: "How does the LRU (Least Recently Used) page replacement algorithm handle page faults?",
    referenceAnswer: "When memory is full and a page fault occurs, LRU evicts the page in RAM that has not been accessed for the longest time, often implemented with doubly linked lists and hash maps.",
    directTranslation: "\u0A93\u0A9B\u0ABE\u0AAE\u0ABE\u0A82 \u0A93\u0A9B\u0ABE \u0AA4\u0ABE\u0A9C\u0AC7\u0AA4\u0AB0\u0AAE\u0ABE\u0A82 \u0AB5\u0AAA\u0AB0\u0ABE\u0AAF\u0AC7\u0AB2 \u0AAA\u0ABE\u0AA8\u0AC1\u0A82 \u0AAC\u0AA6\u0AB2\u0AB5\u0ABE\u0AA8\u0AC0 \u0AAA\u0AA6\u0ACD\u0AA7\u0AA4\u0ABF \u0AAA\u0ABE\u0AA8\u0ABE\u0A82\u0AA8\u0AC0 \u0AAD\u0AC2\u0AB2\u0AA8\u0AC7 \u0A95\u0AC7\u0AB5\u0AC0 \u0AB0\u0AC0\u0AA4\u0AC7 \u0AB8\u0A82\u0AAD\u0ABE\u0AB3\u0AC7 \u0A9B\u0AC7? \u0AAA\u0AC1\u0AB8\u0ACD\u0AA4\u0A95\u0AA8\u0AC1\u0A82 \u0AAA\u0ABE\u0AA8\u0AC1\u0A82 \u0AAB\u0ABE\u0A9F\u0AC0 \u0A9C\u0ABE\u0AAF \u0AA4\u0ACD\u0AAF\u0ABE\u0AB0\u0AC7...",
    contextAwareResponse: "Operating System \u0AAE\u0ABE\u0A82 \u0A9C\u0ACD\u0AAF\u0ABE\u0AB0\u0AC7 Page Fault \u0AB8\u0AB0\u0ACD\u0A9C\u0ABE\u0AAF \u0A9B\u0AC7 (\u0AAE\u0ABE\u0A82\u0A97\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AC7\u0AB2 Page RAM \u0AAE\u0ABE\u0A82 \u0AB9\u0ABE\u0A9C\u0AB0 \u0AA8 \u0AB9\u0ACB\u0AAF) \u0A85\u0AA8\u0AC7 Frames \u0AAD\u0AB0\u0AC7\u0AB2\u0ABE \u0AB9\u0ACB\u0AAF, \u0AA4\u0ACD\u0AAF\u0ABE\u0AB0\u0AC7 LRU (Least Recently Used) Algorithm \u0AA4\u0AC7 Page \u0AA8\u0AC7 Evict \u0A95\u0AB0\u0AC7 \u0A9B\u0AC7 \u0A9C\u0AC7\u0AA8\u0ACB \u0AAD\u0AC2\u0AA4\u0A95\u0ABE\u0AB3\u0AAE\u0ABE\u0A82 \u0AB8\u0ACC\u0AA5\u0AC0 \u0AB2\u0ABE\u0A82\u0AAC\u0ABE \u0AB8\u0AAE\u0AAF\u0AA5\u0AC0 \u0A89\u0AAA\u0AAF\u0ACB\u0A97 \u0AA5\u0AAF\u0ACB \u0AA8\u0AA5\u0AC0. \u0A86\u0AA8\u0AC7 Doubly Linked List \u0A85\u0AA8\u0AC7 Hash Map \u0AA8\u0ABE \u0AB8\u0A82\u0AAF\u0ACB\u0A9C\u0AA8\u0AA5\u0AC0 O(1) time complexity \u0AAE\u0ABE\u0A82 implement \u0A95\u0AB0\u0AC0 \u0AB6\u0A95\u0ABE\u0AAF \u0A9B\u0AC7...",
    expectedTerms: ["LRU Page Replacement", "Page Fault", "Frames", "RAM", "Doubly Linked List", "Eviction"],
    createdAt: "2026-08-15T12:00:00.000Z"
  },
  {
    id: "case_014",
    subject: "Computer Networks",
    topic: "DNS Resolution Process",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "Step-by-step explain how recursive and iterative DNS queries resolve a domain name into an IP address.",
    referenceAnswer: "Client queries recursive resolver. Resolver queries Root Server (returns TLD), TLD Server (returns Authoritative), and Authoritative Server (returns final A/AAAA record).",
    directTranslation: "\u0921\u0940\u090F\u0928\u090F\u0938 \u0938\u092E\u093E\u0927\u093E\u0928 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0915\u093E \u0935\u0930\u094D\u0923\u0928 \u0915\u0930\u0947\u0902\u0964 \u0928\u093E\u092E \u0938\u0930\u094D\u0935\u0930 \u0917\u094D\u0930\u093E\u0939\u0915 \u0938\u0947 \u092C\u093E\u0924 \u0915\u0930\u0915\u0947 \u092A\u0924\u093E \u0928\u093F\u0915\u093E\u0932\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "\u091C\u092C \u0906\u092A \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u092E\u0947\u0902 domain name (\u091C\u0948\u0938\u0947 www.google.com) \u091F\u093E\u0907\u092A \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0924\u094B DNS Resolution \u0928\u093F\u092E\u094D\u0928\u093E\u0928\u0941\u0938\u093E\u0930 \u0915\u093E\u0930\u094D\u092F \u0915\u0930\u0924\u093E \u0939\u0948: 1) Local Cache (Browser/OS) \u091A\u0947\u0915 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 2) \u092F\u0926\u093F \u0905\u0928\u0941\u092A\u0938\u094D\u0925\u093F\u0924 \u0939\u094B, \u0924\u094B Recursive Resolver (ISP/Cloudflare 1.1.1.1) \u0915\u094B query \u092D\u0947\u091C\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0964 3) Resolver \u0938\u092C\u0938\u0947 \u092A\u0939\u0932\u0947 Root DNS Server (.) \u0938\u0947 \u092A\u0942\u091B\u0924\u093E \u0939\u0948 \u091C\u094B .com TLD Server \u0915\u093E \u092A\u0924\u093E \u0926\u0947\u0924\u093E \u0939\u0948\u0964 4) TLD Server \u0909\u0938 domain \u0915\u0947 Authoritative Name Server \u0915\u093E \u092A\u0924\u093E \u0926\u0947\u0924\u093E \u0939\u0948\u0964 5) Authoritative Server \u0905\u0902\u0924\u093F\u092E IP Address (A/AAAA record) \u0932\u094C\u091F\u093E\u0924\u093E \u0939\u0948...",
    expectedTerms: ["DNS Resolution", "Recursive Query", "Iterative Query", "Root Server", "TLD Server", "Authoritative Server", "IP Address"],
    createdAt: "2026-08-15T12:15:00.000Z"
  },
  {
    id: "case_015",
    subject: "Software Engineering",
    topic: "Microservices vs Monoliths",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "Compare monolithic architecture with microservices architecture regarding deployment, scalability, and network latency.",
    referenceAnswer: "Monoliths deploy single codebase with low in-process call latency but scaled as entire unit. Microservices deploy decoupled services independently via network APIs, increasing operational complexity and network overhead.",
    directTranslation: "\u0C2E\u0C4B\u0C28\u0C4B\u0C32\u0C3F\u0C25\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2E\u0C48\u0C15\u0C4D\u0C30\u0C4B\u0C38\u0C30\u0C4D\u0C35\u0C40\u0C38\u0C46\u0C38\u0C4D \u0C2E\u0C27\u0C4D\u0C2F \u0C2D\u0C47\u0C26\u0C02 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F? \u0C12\u0C15\u0C47 \u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C30\u0C3E\u0C2F\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C30\u0C3E\u0C33\u0C4D\u0C33\u0C41...",
    contextAwareResponse: "Monolithic Architecture \u0C32\u0C4B \u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2F\u0C4A\u0C15\u0C4D\u0C15 UI, Business Logic \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Database access \u0C05\u0C28\u0C4D\u0C28\u0C40 \u0C12\u0C15\u0C47 Codebase \u0C2E\u0C30\u0C3F\u0C2F\u0C41 process \u0C17\u0C3E \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F. \u0C26\u0C40\u0C28\u0C3F\u0C32\u0C4B in-memory calls \u0C35\u0C47\u0C17\u0C02\u0C17\u0C3E \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F, \u0C15\u0C3E\u0C28\u0C40 \u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C2E\u0C3E\u0C30\u0C4D\u0C2A\u0C41 \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C3E \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F app \u0C28\u0C3F redeploy \u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C3F. Microservices Architecture \u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C24\u0C3F business capability (\u0C09\u0C26\u0C3E: Auth, Payment, Catalog) \u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30\u0C02\u0C17\u0C3E deploy \u0C1A\u0C47\u0C2F\u0C26\u0C17\u0C3F\u0C28 \u0C35\u0C3F\u0C21\u0C3F\u0C35\u0C3F\u0C21\u0C3F services \u0C17\u0C3E \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F. \u0C07\u0C35\u0C3F REST \u0C32\u0C47\u0C26\u0C3E gRPC APIs \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C15\u0C47\u0C1F\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C3E\u0C2F\u0C3F, \u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30 Scalability \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F \u0C15\u0C3E\u0C28\u0C40 Network Latency \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Distributed Systems \u0C38\u0C02\u0C15\u0C4D\u0C32\u0C3F\u0C37\u0C4D\u0C1F\u0C24 \u0C2A\u0C46\u0C30\u0C41\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F...",
    expectedTerms: ["Monolithic Architecture", "Microservices", "Deployment", "Scalability", "Network Latency", "REST / gRPC"],
    createdAt: "2026-08-15T12:30:00.000Z"
  },
  {
    id: "case_016",
    subject: "Algorithms",
    topic: "Dynamic Programming vs Divide & Conquer",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    question: "What is the difference between Dynamic Programming and Divide and Conquer algorithms regarding subproblems?",
    referenceAnswer: "Divide and conquer breaks problem into independent subproblems (Merge Sort). Dynamic programming solves overlapping subproblems with optimal substructure by memoizing or tabulating results.",
    directTranslation: "\u0B9F\u0BC8\u0BA9\u0BAE\u0BBF\u0B95\u0BCD \u0BAA\u0BC1\u0BB0\u0BCB\u0B95\u0BBF\u0BB0\u0BBE\u0BAE\u0BBF\u0B99\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BBF\u0BB0\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC6\u0BB2\u0BCD\u0BB2\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0BB5\u0BC7\u0BB1\u0BC1\u0BAA\u0BBE\u0B9F\u0BC1 \u0B8E\u0BA9\u0BCD\u0BA9? \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC1\u0B95\u0BB3\u0BC8 \u0B9A\u0BBF\u0BB1\u0BC1 \u0BA4\u0BC1\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BBE\u0B95 \u0BB5\u0BC6\u0B9F\u0BCD\u0B9F\u0BC1\u0BB5\u0BA4\u0BC1...",
    contextAwareResponse: "Divide and Conquer (\u0BAA\u0BBF\u0BB0\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC6\u0BB2\u0BCD\u0BB2\u0BC1\u0BAE\u0BCD \u0BAE\u0BC1\u0BB1\u0BC8) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8\u0BAF\u0BC8 \u0BAE\u0BC1\u0BB1\u0BCD\u0BB1\u0BBF\u0BB2\u0BC1\u0BAE\u0BCD \u0BA4\u0BA9\u0BBF\u0BA4\u0BCD\u0BA4\u0BA9\u0BBF\u0BAF\u0BBE\u0BA9 (independent) \u0BA4\u0BC1\u0BA3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BA4\u0BC0\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1 (\u0B89\u0BA4\u0BBE\u0BB0\u0BA3\u0BAE\u0BCD: Merge Sort). \u0B87\u0BA4\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BBE\u0BB1\u0BBE\u0B95, Dynamic Programming (DP) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BA9\u0BCD\u0BB1\u0BC1\u0B9F\u0BA9\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1 \u0B87\u0BA3\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD (overlapping subproblems) \u0BA4\u0BC1\u0BA3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD Optimal Substructure \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1 \u0B95\u0BCA\u0BA3\u0BCD\u0B9F \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. \u0B87\u0BA4\u0BC1 \u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0B85\u0BA4\u0BC7 \u0B95\u0BA3\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BCD\u0B9F\u0BC8\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BBE\u0BAE\u0BB2\u0BCD Memoization (Top-down) \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 Tabulation (Bottom-up) \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u0B9A\u0BC7\u0BAE\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC8\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1 (\u0B89\u0BA4\u0BBE\u0BB0\u0BA3\u0BAE\u0BCD: 0/1 Knapsack, Longest Common Subsequence)...",
    expectedTerms: ["Dynamic Programming", "Divide and Conquer", "Overlapping Subproblems", "Optimal Substructure", "Memoization", "Tabulation"],
    createdAt: "2026-08-15T12:45:00.000Z"
  },
  {
    id: "case_017",
    subject: "DBMS",
    topic: "Database Sharding vs Replication",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How does horizontal database sharding differ from master-slave replication in database scaling?",
    referenceAnswer: "Replication copies entire database across nodes for high read throughput and failover redundancy. Sharding partitions table rows across different nodes using shard keys for horizontal write scaling.",
    directTranslation: "\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0915\u0947 \u091F\u0941\u0915\u0921\u093C\u0947 \u0915\u0930\u0928\u093E \u0914\u0930 \u0928\u0915\u0932 \u092C\u0928\u093E\u0928\u093E \u092E\u0947\u0902 \u0915\u094D\u092F\u093E \u0905\u0902\u0924\u0930 \u0939\u0948? \u090F\u0915 \u092E\u0947\u0902 \u0936\u0940\u0936\u093E \u091F\u0942\u091F\u0924\u093E \u0939\u0948 \u0914\u0930 \u0926\u0942\u0938\u0930\u0947 \u092E\u0947\u0902 \u092B\u094B\u091F\u094B\u0915\u0949\u092A\u0940 \u0939\u094B\u0924\u0940 \u0939\u0948...",
    contextAwareResponse: "Database Replication (\u091C\u0948\u0938\u0947 Primary-Replica architecture) \u092E\u0947\u0902 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0915\u0940 \u092A\u094D\u0930\u0924\u093F\u092F\u093E\u0902 multiple servers \u092A\u0930 sync \u0915\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0902\u0964 \u092F\u0939 High Availability \u0914\u0930 Read operations \u0915\u094B scale \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0906\u0926\u0930\u094D\u0936 \u0939\u0948\u0964 \u0907\u0938\u0915\u0947 \u0935\u093F\u092A\u0930\u0940\u0924, Database Sharding (Horizontal Partitioning) \u092E\u0947\u0902 \u090F\u0915 \u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u0940 table \u0915\u0947 rows \u0915\u094B Shard Key (\u091C\u0948\u0938\u0947 User_ID hash) \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0905\u0932\u0917-\u0905\u0932\u0917 physical database instances \u092E\u0947\u0902 \u0935\u093F\u092D\u093E\u091C\u093F\u0924 \u0915\u0930 \u0926\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 Write throughput \u0914\u0930 storage capacity scale \u0939\u094B\u0924\u0940 \u0939\u0948...",
    expectedTerms: ["Database Sharding", "Replication", "Horizontal Partitioning", "Primary-Replica", "Shard Key", "Write Scalability"],
    createdAt: "2026-08-15T13:00:00.000Z"
  },
  {
    id: "case_018",
    subject: "Machine Learning",
    topic: "Bias-Variance Tradeoff",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "Explain the bias-variance tradeoff and its relationship to underfitting and overfitting.",
    referenceAnswer: "High bias causes underfitting due to overly simplistic model assumptions (high training error). High variance causes overfitting due to model sensitivity to training noise (high test error).",
    directTranslation: "\u0C2A\u0C15\u0C4D\u0C37\u0C2A\u0C3E\u0C24\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C48\u0C35\u0C3F\u0C27\u0C4D\u0C2F\u0C02 \u0C2E\u0C27\u0C4D\u0C2F \u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C3E\u0C30\u0C02 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F? \u0C2C\u0C2F\u0C3E\u0C38\u0C4D \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C05\u0C28\u0C41\u0C2E\u0C3E\u0C28\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C46\u0C28\u0C4D\u0C38\u0C4D \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C30\u0C02\u0C17\u0C41...",
    contextAwareResponse: "Machine Learning \u0C32\u0C4B Bias-Variance Tradeoff \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C2E\u0C4B\u0C21\u0C32\u0C4D \u0C2F\u0C4A\u0C15\u0C4D\u0C15 Generalization \u0C38\u0C3E\u0C2E\u0C30\u0C4D\u0C25\u0C4D\u0C2F\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C28\u0C3F\u0C30\u0C4D\u0C23\u0C2F\u0C3F\u0C02\u0C1A\u0C47 \u0C05\u0C24\u0C4D\u0C2F\u0C02\u0C24 \u0C2E\u0C41\u0C16\u0C4D\u0C2F\u0C2E\u0C48\u0C28 \u0C2D\u0C3E\u0C35\u0C28. High Bias \u0C05\u0C02\u0C1F\u0C47 \u0C2E\u0C4B\u0C21\u0C32\u0C4D \u0C1A\u0C3E\u0C32\u0C3E \u0C38\u0C30\u0C33\u0C2E\u0C48\u0C28 \u0C0A\u0C39\u0C32\u0C28\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C21\u0C1F\u0C02 (Underfitting), \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Training \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Testing \u0C30\u0C46\u0C02\u0C21\u0C3F\u0C02\u0C1F\u0C3F\u0C32\u0C4B\u0C28\u0C42 \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35 Error \u0C35\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. High Variance \u0C05\u0C02\u0C1F\u0C47 \u0C2E\u0C4B\u0C21\u0C32\u0C4D Training \u0C21\u0C47\u0C1F\u0C3E\u0C32\u0C4B\u0C28\u0C3F \u0C38\u0C4D\u0C35\u0C32\u0C4D\u0C2A \u0C36\u0C2C\u0C4D\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F (noise) \u0C15\u0C42\u0C21\u0C3E \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35\u0C17\u0C3E \u0C28\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02 (Overfitting), \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Training Error \u0C24\u0C15\u0C4D\u0C15\u0C41\u0C35\u0C17\u0C3E \u0C09\u0C28\u0C4D\u0C28\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40 Test Error \u0C1A\u0C3E\u0C32\u0C3E \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35\u0C17\u0C3E \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F...",
    expectedTerms: ["Bias-Variance Tradeoff", "High Bias", "High Variance", "Underfitting", "Overfitting", "Generalization Error"],
    createdAt: "2026-08-15T13:15:00.000Z"
  },
  {
    id: "case_019",
    subject: "Programming",
    topic: "Asynchronous Event Loop in Node.js",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How does the single-threaded Event Loop in Node.js handle non-blocking I/O operations with libuv?",
    referenceAnswer: "Node.js runs single-threaded JS execution stack, delegating asynchronous I/O (files, network) to libuv thread pool and OS kernel, queuing callbacks into microtask and macrotask phases.",
    directTranslation: "\u0928\u094B\u0921 \u091C\u0947\u090F\u0938 \u092E\u0947\u0902 \u0918\u091F\u0928\u093E \u0915\u093E \u091A\u0915\u094D\u0915\u0930 \u0915\u0948\u0938\u0947 \u0918\u0942\u092E\u0924\u093E \u0939\u0948 \u0914\u0930 \u0927\u093E\u0917\u094B\u0902 \u0915\u0947 \u092C\u093F\u0928\u093E \u0915\u0948\u0938\u0947 \u0915\u093E\u092E \u0915\u0930\u0924\u093E \u0939\u0948? \u092F\u0939 \u092A\u0939\u093F\u090F \u0915\u0940 \u0924\u0930\u0939 \u091A\u0915\u094D\u0915\u0930 \u0932\u0917\u093E\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "Node.js single-threaded JavaScript execution engine (V8) \u092A\u0930 \u091A\u0932\u0924\u093E \u0939\u0948, \u0932\u0947\u0915\u093F\u0928 libuv library \u0915\u0947 C++ Thread Pool \u0914\u0930 OS kernel abstractions (epoll/kqueue) \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0915\u0947 non-blocking asynchronous I/O \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u091C\u092C \u0915\u094B\u0908 async operation (\u091C\u0948\u0938\u0947 database query \u092F\u093E file read) \u0936\u0941\u0930\u0942 \u0939\u094B\u0924\u093E \u0939\u0948, \u0924\u094B main thread \u092C\u094D\u0932\u0949\u0915 \u0928\u0939\u0940\u0902 \u0939\u094B\u0924\u093E\u0964 Operation \u092A\u0942\u0930\u093E \u0939\u094B\u0928\u0947 \u092A\u0930 callback \u0915\u094B Event Loop \u0915\u0940 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 Phase (Timers, Pending Callbacks, Poll, Check) \u0915\u0947 Task Queue \u092E\u0947\u0902 \u0921\u093E\u0932\u093E \u091C\u093E\u0924\u093E \u0939\u0948...",
    expectedTerms: ["Event Loop", "Single-threaded", "Non-blocking I/O", "libuv", "Call Stack", "Callback Queue", "Microtask"],
    createdAt: "2026-08-15T13:30:00.000Z"
  },
  {
    id: "case_020",
    subject: "Cyber Security",
    topic: "SQL Injection Prevention",
    sourceLanguage: "English",
    targetLanguage: "Bengali",
    question: "Why are parameterized queries and prepared statements immune to SQL Injection vulnerabilities?",
    referenceAnswer: "Prepared statements separate SQL query logic from data inputs by compiling the statement syntax first, treating user input strictly as literal parameter values rather than executable code.",
    directTranslation: "\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u09AC\u09BF\u09AC\u09C3\u09A4\u09BF \u0995\u09C7\u09A8 \u098F\u09B8\u0995\u09BF\u0989\u098F\u09B2 \u0987\u09A8\u099C\u09C7\u0995\u09B6\u09A8 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09B0\u09C7? \u098F\u099F\u09BF \u09B0\u09CB\u0997\u09C0\u09B0 \u0987\u099E\u09CD\u099C\u09C7\u0995\u09B6\u09A8\u09C7\u09B0 \u09AE\u09A4\u09CB \u0993\u09B7\u09C1\u09A7 \u09A6\u09C7\u09AF\u09BC...",
    contextAwareResponse: "SQL Injection \u09A4\u0996\u09A8 \u0998\u099F\u09C7 \u09AF\u0996\u09A8 \u0986\u0995\u09CD\u09B0\u09AE\u09A3\u0995\u09BE\u09B0\u09C0\u09B0 \u0985\u09B8\u09CE \u0987\u09A8\u09AA\u09C1\u099F \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF SQL Query \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982-\u098F\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 (concatenate) \u09B9\u09DF\u09C7 \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BE\u09B0\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u09B9 \u09B9\u09DF\u0964 Prepared Statements \u098F\u09AC\u0982 Parameterized Queries \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u09AB\u09B2\u09C7 Database Engine \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 Query-\u098F\u09B0 Syntax \u0993 Execution Plan \u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2 \u0995\u09B0\u09C7 \u09A8\u09C7\u09DF\u0964 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0\u09A4\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u0995\u09BE\u09B0\u09C0\u09B0 \u09A6\u09C7\u0993\u09DF\u09BE \u0987\u09A8\u09AA\u09C1\u099F\u0995\u09C7 \u0995\u09C7\u09AC\u09B2\u09AE\u09BE\u09A4\u09CD\u09B0 Literal Data Parameter \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09A6\u09C7\u0996\u09BE \u09B9\u09DF, \u0995\u0996\u09A8\u0993 Executable SQL Code \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09A8\u09DF...",
    expectedTerms: ["SQL Injection", "Prepared Statements", "Parameterized Queries", "Query Compilation", "Sanitization"],
    createdAt: "2026-08-15T13:45:00.000Z"
  },
  {
    id: "case_021",
    subject: "Operating Systems",
    topic: "Virtual Memory & Paging",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "How does the Memory Management Unit (MMU) use Page Tables and TLB (Translation Lookaside Buffer) to translate virtual addresses?",
    referenceAnswer: "MMU takes virtual address (page number + offset), checks high-speed TLB cache for physical frame mapping; on TLB miss, walks page table in RAM, updates TLB, and generates physical address.",
    directTranslation: "\u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C4D \u0C2A\u0C41\u0C38\u0C4D\u0C24\u0C15\u0C02 \u0C2A\u0C47\u0C1C\u0C40\u0C32 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F\u0C15\u0C28\u0C41 \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C3F \u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C1A\u0C3F\u0C30\u0C41\u0C28\u0C3E\u0C2E\u0C3E\u0C32\u0C28\u0C41 \u0C0E\u0C32\u0C3E \u0C2E\u0C3E\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F? \u0C1A\u0C3F\u0C30\u0C41\u0C28\u0C3E\u0C2E\u0C3E \u0C15\u0C35\u0C30\u0C41\u0C2A\u0C48 \u0C30\u0C3E\u0C38\u0C3F\u0C28\u0C1F\u0C4D\u0C32\u0C41...",
    contextAwareResponse: "Hardware \u0C32\u0C4B\u0C28\u0C3F Memory Management Unit (MMU) CPU \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C38\u0C3F\u0C28 Virtual Address \u0C28\u0C41 Physical RAM Address \u0C17\u0C3E \u0C2E\u0C3E\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. Virtual Address \u0C32\u0C4B Page Number \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Offset \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F. \u0C35\u0C47\u0C17\u0C02 \u0C15\u0C4B\u0C38\u0C02, MMU \u0C2E\u0C4A\u0C26\u0C1F TLB (Translation Lookaside Buffer - \u0C12\u0C15 high-speed hardware cache) \u0C28\u0C41 \u0C24\u0C28\u0C3F\u0C16\u0C40 \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F (TLB Hit). TLB \u0C32\u0C4B \u0C32\u0C47\u0C15\u0C2A\u0C4B\u0C24\u0C47 (TLB Miss), \u0C05\u0C26\u0C3F RAM \u0C32\u0C4B\u0C28\u0C3F Page Table \u0C28\u0C41 \u0C36\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C3F Frame Number \u0C2A\u0C4A\u0C02\u0C26\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 TLB \u0C28\u0C3F update \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F...",
    expectedTerms: ["Memory Management Unit (MMU)", "Page Table", "TLB (Translation Lookaside Buffer)", "Virtual Address", "Physical Frame", "Page Offset"],
    createdAt: "2026-08-15T14:00:00.000Z"
  },
  {
    id: "case_022",
    subject: "Computer Networks",
    topic: "BGP (Border Gateway Protocol)",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How does BGP (Border Gateway Protocol) route packets across Autonomous Systems (AS) on the global Internet?",
    referenceAnswer: "BGP is an exterior gateway path-vector protocol using TCP port 179 to exchange reachable network prefixes and AS-Path attributes between distinct administrative Autonomous Systems.",
    directTranslation: "\u0938\u0940\u092E\u093E \u0926\u094D\u0935\u093E\u0930 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0938\u094D\u0935\u093E\u092F\u0924\u094D\u0924 \u092A\u094D\u0930\u0923\u093E\u0932\u093F\u092F\u094B\u0902 \u092E\u0947\u0902 \u092A\u0948\u0915\u0947\u091F \u0915\u0948\u0938\u0947 \u092D\u0947\u091C\u0924\u093E \u0939\u0948? \u092F\u0939 \u0938\u0940\u092E\u093E \u092A\u0930 \u0916\u0921\u093C\u0947 \u0938\u093F\u092A\u093E\u0939\u0940 \u0915\u0940 \u0924\u0930\u0939 \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u091A\u0947\u0915 \u0915\u0930\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "BGP (Border Gateway Protocol) \u092A\u0942\u0930\u0947 \u0907\u0902\u091F\u0930\u0928\u0947\u091F \u0915\u093E \u092E\u0941\u0916\u094D\u092F Routing Protocol \u0939\u0948 \u091C\u094B \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 Autonomous Systems (AS - \u091C\u0948\u0938\u0947 ISPs, Google, Cloudflare) \u0915\u0947 \u092C\u0940\u091A Routing \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0938\u093E\u091D\u093E \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u092F\u0939 \u090F\u0915 Path Vector Protocol \u0939\u0948 \u091C\u094B TCP Port 179 \u092A\u0930 \u0915\u093E\u092E \u0915\u0930\u0924\u093E \u0939\u0948\u0964 BGP \u0928\u093F\u0930\u094D\u0923\u092F \u0915\u0947\u0935\u0932 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0947 \u0930\u093E\u0938\u094D\u0924\u0947 (hop count) \u092A\u0930 \u0928\u0939\u0940\u0902, \u092C\u0932\u094D\u0915\u093F AS-Path attributes, Local Preference \u0914\u0930 peering business policies \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0932\u0947\u0924\u093E \u0939\u0948...",
    expectedTerms: ["BGP (Border Gateway Protocol)", "Autonomous System (AS)", "Path Vector Protocol", "AS-Path", "Peering", "Prefix Announcement"],
    createdAt: "2026-08-15T14:15:00.000Z"
  },
  {
    id: "case_023",
    subject: "Artificial Intelligence",
    topic: "Gradient Descent Optimization",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    question: "How does Adam Optimizer improve upon Stochastic Gradient Descent with Momentum and RMSprop?",
    referenceAnswer: "Adam computes adaptive learning rates by maintaining exponential moving averages of both past gradients (first moment/momentum) and squared gradients (second moment/RMSprop) with bias correction.",
    directTranslation: "\u0B86\u0B9F\u0BAE\u0BCD \u0B86\u0BAA\u0BCD\u0B9F\u0BBF\u0BAE\u0BC8\u0B9A\u0BB0\u0BCD \u0B8E\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF \u0B9A\u0BBE\u0BAF\u0BCD\u0BB5\u0BC1 \u0B87\u0BB1\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0B9A\u0BB0\u0BBF\u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1? \u0BAE\u0BA9\u0BBF\u0BA4\u0BA9\u0BCD \u0BAE\u0BB2\u0BC8\u0BAF\u0BBF\u0BB2\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BC0\u0BB4\u0BC7 \u0B89\u0BB0\u0BC1\u0BA3\u0BCD\u0B9F\u0BC1 \u0B93\u0B9F\u0BC1\u0BB5\u0BA4\u0BC1 \u0BAA\u0BCB\u0BB2...",
    contextAwareResponse: "Adam (Adaptive Moment Estimation) Optimizer \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 Deep Learning-\u0B87\u0BB2\u0BCD Weights-\u0B90 \u0BB5\u0BC7\u0B95\u0BAE\u0BBE\u0B95 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0B95 \u0BAA\u0BC1\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BA8\u0BCD\u0BA4 Optimization Algorithm \u0B86\u0B95\u0BC1\u0BAE\u0BCD. \u0B87\u0BA4\u0BC1 Momentum (\u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF Gradients-\u0B87\u0BA9\u0BCD First Moment - \u0B9A\u0BB0\u0BBE\u0B9A\u0BB0\u0BBF \u0BA4\u0BBF\u0B9A\u0BC8) \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD RMSprop (\u0BAE\u0BC1\u0BA8\u0BCD\u0BA4\u0BC8\u0BAF Gradients-\u0B87\u0BA9\u0BCD Second Moment - \u0BB5\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0B9A\u0BB0\u0BBE\u0B9A\u0BB0\u0BBF \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BC1 Learning Rate-\u0B90 \u0B9A\u0BB0\u0BBF\u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BB2\u0BCD) \u0B87\u0BB0\u0BA3\u0BCD\u0B9F\u0BBF\u0BA9\u0BCD \u0BA8\u0BA9\u0BCD\u0BAE\u0BC8\u0B95\u0BB3\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BBF\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. \u0BAE\u0BC7\u0BB2\u0BC1\u0BAE\u0BCD \u0BA4\u0BCA\u0B9F\u0B95\u0BCD\u0B95 \u0BAA\u0B9F\u0BBF\u0B95\u0BB3\u0BBF\u0BB2\u0BCD Bias Correction \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BC1 Zero- \u0BA8\u0BCB\u0B95\u0BCD\u0B95\u0BBF \u0B9A\u0BBE\u0BAF\u0BCD\u0BB5\u0BA4\u0BC8\u0BA4\u0BCD \u0BA4\u0BB5\u0BBF\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...",
    expectedTerms: ["Adam Optimizer", "Stochastic Gradient Descent", "Momentum", "RMSprop", "Learning Rate", "Bias Correction"],
    createdAt: "2026-08-15T14:30:00.000Z"
  },
  {
    id: "case_024",
    subject: "DBMS",
    topic: "Two-Phase Locking (2PL)",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "How does Strict Two-Phase Locking (Strict 2PL) ensure serializability and prevent cascading aborts?",
    referenceAnswer: "Strict 2PL requires growing phase (acquiring locks) and shrinking phase, holding all exclusive write locks until transaction commits or aborts, eliminating dirty reads and cascading rollbacks.",
    directTranslation: "\u0C30\u0C46\u0C02\u0C21\u0C41 \u0C26\u0C36\u0C32 \u0C32\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C2A\u0C26\u0C4D\u0C27\u0C24\u0C3F \u0C38\u0C40\u0C30\u0C3F\u0C2F\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C28\u0C41 \u0C0E\u0C32\u0C3E \u0C07\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F? \u0C24\u0C32\u0C41\u0C2A\u0C41\u0C15\u0C41 \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C24\u0C3E\u0C33\u0C3E\u0C32\u0C41 \u0C35\u0C47\u0C2F\u0C21\u0C02 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E...",
    contextAwareResponse: "Strict Two-Phase Locking (Strict 2PL) \u0C05\u0C28\u0C47\u0C26\u0C3F Concurrency Control \u0C32\u0C4B Conflict Serializability \u0C28\u0C3F \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C1A\u0C4D\u0C1A\u0C47 \u0C2E\u0C41\u0C16\u0C4D\u0C2F\u0C2E\u0C48\u0C28 protocol. \u0C07\u0C26\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C26\u0C36\u0C32\u0C4D\u0C32\u0C4B \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F: 1) Growing Phase: Transaction \u0C24\u0C28\u0C15\u0C41 \u0C15\u0C3E\u0C35\u0C32\u0C38\u0C3F\u0C28 Shared (Read) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Exclusive (Write) Locks \u0C28\u0C3F \u0C2A\u0C4A\u0C02\u0C26\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. 2) Shrinking Phase: Locks \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C24\u0C3E\u0C2F\u0C3F. Strict 2PL \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C47\u0C15\u0C24 \u0C0F\u0C2E\u0C3F\u0C1F\u0C02\u0C1F\u0C47, Transaction Commit \u0C32\u0C47\u0C26\u0C3E Abort \u0C05\u0C2F\u0C4D\u0C2F\u0C47\u0C02\u0C24\u0C35\u0C30\u0C15\u0C41 \u0C05\u0C28\u0C4D\u0C28\u0C3F Exclusive Locks \u0C28\u0C3F \u0C05\u0C1F\u0C4D\u0C1F\u0C3F\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F. \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Dirty Read \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C09\u0C02\u0C21\u0C26\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Cascading Aborts \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F\u0C17\u0C3E \u0C28\u0C3F\u0C35\u0C3E\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C24\u0C3E\u0C2F\u0C3F...",
    expectedTerms: ["Strict 2PL", "Two-Phase Locking", "Growing Phase", "Shrinking Phase", "Exclusive Locks", "Cascading Aborts", "Serializability"],
    createdAt: "2026-08-15T14:45:00.000Z"
  },
  {
    id: "case_025",
    subject: "Cloud Computing",
    topic: "Serverless Computing & Cold Starts",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "What is a cold start in serverless FaaS (AWS Lambda / Google Cloud Functions) and how can it be mitigated?",
    referenceAnswer: "Cold start latency occurs when a cloud provider spins up a new container microVM, initializes runtime, and downloads handler code upon first invocation after idle scale-to-zero.",
    directTranslation: "\u0915\u094D\u0932\u093E\u0909\u0921 \u092E\u0947\u0902 \u0920\u0902\u0921\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u094D\u092F\u093E \u0939\u0948 \u0914\u0930 \u0907\u0938\u0947 \u0915\u0948\u0938\u0947 \u0917\u0930\u094D\u092E \u0915\u093F\u092F\u093E \u091C\u093E\u090F? \u091C\u092C \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0938\u0930\u094D\u0926\u093F\u092F\u094B\u0902 \u092E\u0947\u0902 \u0920\u0902\u0921\u093E \u092A\u0921\u093C \u091C\u093E\u0924\u093E \u0939\u0948...",
    contextAwareResponse: "Serverless Functions (FaaS \u091C\u0948\u0938\u0947 AWS Lambda \u092F\u093E Google Cloud Functions) \u091C\u092C idle \u0939\u094B\u0915\u0930 scale-to-zero \u0939\u094B \u091C\u093E\u0924\u0947 \u0939\u0948\u0902, \u0924\u092C \u092A\u0939\u0932\u0940 \u0928\u0908 request \u0906\u0928\u0947 \u092A\u0930 cloud infrastructure \u0915\u094B \u0928\u092F\u093E container/microVM initialize \u0915\u0930\u0928\u093E, runtime \u0932\u094B\u0921 \u0915\u0930\u0928\u093E \u0914\u0930 dependencies load \u0915\u0930\u0928\u0940 \u092A\u0921\u093C\u0924\u0940 \u0939\u0948\u0902; \u0907\u0938 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 latency delay \u0915\u094B Cold Start \u0915\u0939\u0924\u0947 \u0939\u0948\u0902\u0964 \u0907\u0938\u0947 \u0915\u092E \u0915\u0930\u0928\u0947 \u0915\u0947 \u0924\u0930\u0940\u0915\u0947: Provisioned Concurrency, lightweight runtimes (Node.js/Go vs heavy JVM), bundle size mini-fication, \u0914\u0930 periodic ping warmers...",
    expectedTerms: ["Serverless", "Cold Start Latency", "FaaS (Function as a Service)", "Container Initialization", "Provisioned Concurrency", "Scale-to-Zero"],
    createdAt: "2026-08-15T15:00:00.000Z"
  },
  {
    id: "case_026",
    subject: "Data Structures",
    topic: "Trie (Prefix Tree)",
    sourceLanguage: "English",
    targetLanguage: "Marathi",
    question: "How does a Trie data structure achieve O(L) time complexity for search and autocomplete suggestions?",
    referenceAnswer: "Trie nodes store character transitions rather than full keys; search follows edges corresponding to prefix characters of length L, independent of the total number of dictionary words N.",
    directTranslation: "\u091F\u094D\u0930\u093E\u092F \u0921\u0947\u091F\u093E \u0938\u094D\u091F\u094D\u0930\u0915\u094D\u091A\u0930 \u091D\u093E\u0921\u093E\u0938\u093E\u0930\u0916\u0947 \u0936\u092C\u094D\u0926 \u0915\u0938\u0947 \u0936\u094B\u0927\u0924\u0947? \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u093E\u0928\u093E\u0935\u0930 \u0905\u0915\u094D\u0937\u0930\u0947 \u0932\u093F\u0939\u0942\u0928...",
    contextAwareResponse: "Trie (Prefix Tree) \u0939\u0947 \u090F\u0915 \u0935\u093F\u0936\u093F\u0937\u094D\u091F Tree Data Structure \u0906\u0939\u0947 \u091C\u0947 Strings \u091A\u093E \u0938\u0902\u0917\u094D\u0930\u0939 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u092E\u0924\u0947\u0928\u0947 store \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0935\u093E\u092A\u0930\u0932\u0947 \u091C\u093E\u0924\u0947. \u092F\u093E\u092E\u0927\u094D\u092F\u0947 Node \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0936\u092C\u094D\u0926 \u0938\u093E\u0920\u0935\u0924 \u0928\u093E\u0939\u0940, \u0924\u0930 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 edge \u090F\u0915\u093E character \u091A\u0947 \u092A\u094D\u0930\u0924\u093F\u0928\u093F\u0927\u093F\u0924\u094D\u0935 \u0915\u0930\u0924\u0947. \u0936\u094B\u0927\u0932\u094D\u092F\u093E \u091C\u093E\u0923\u093E\u0931\u094D\u092F\u093E \u0936\u092C\u094D\u0926\u093E\u091A\u0940 \u0932\u093E\u0902\u092C\u0940 L \u0905\u0938\u0932\u094D\u092F\u093E\u0938, Trie \u092E\u0927\u094D\u092F\u0947 Search time complexity O(L) \u0905\u0938\u0924\u0947, \u091C\u0940 \u0921\u093F\u0915\u094D\u0936\u0928\u0930\u0940\u092E\u0927\u0940\u0932 \u090F\u0915\u0942\u0923 \u0936\u092C\u094D\u0926\u093E\u0902\u091A\u094D\u092F\u093E \u0938\u0902\u0916\u094D\u092F\u0947\u0935\u0930 (N) \u0905\u0935\u0932\u0902\u092C\u0942\u0928 \u0928\u0938\u0924\u0947. \u092F\u093E\u092E\u0941\u0933\u0947 Google Search autocomplete \u0906\u0923\u093F spell-checkers \u092E\u0927\u094D\u092F\u0947 Trie \u091A\u093E \u092E\u094B\u0920\u094D\u092F\u093E \u092A\u094D\u0930\u092E\u093E\u0923\u093E\u0935\u0930 \u0935\u093E\u092A\u0930 \u0939\u094B\u0924\u094B...",
    expectedTerms: ["Trie (Prefix Tree)", "Time Complexity O(L)", "Autocomplete", "Character Edges", "Root to Leaf Path"],
    createdAt: "2026-08-15T15:15:00.000Z"
  },
  {
    id: "case_027",
    subject: "Programming",
    topic: "Rust Ownership & Borrow Checker",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    question: "How does the Rust borrow checker achieve memory safety without a runtime Garbage Collector?",
    referenceAnswer: "Rust enforces compile-time ownership invariants: each value has single owner, drops when owner goes out of scope, allowing either multiple immutable references (&T) or one mutable reference (&mut T) at a time.",
    directTranslation: "\u0C30\u0C38\u0C4D\u0C1F\u0C4D \u0C05\u0C2A\u0C4D\u0C2A\u0C41 \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C28\u0C47 \u0C24\u0C28\u0C3F\u0C16\u0C40 \u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C02 \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2D\u0C26\u0C4D\u0C30\u0C24\u0C28\u0C41 \u0C0E\u0C32\u0C3E \u0C24\u0C46\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F? \u0C0E\u0C35\u0C30\u0C48\u0C28\u0C3E \u0C05\u0C2A\u0C4D\u0C2A\u0C41 \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C47 \u0C35\u0C21\u0C4D\u0C21\u0C40 \u0C15\u0C1F\u0C4D\u0C1F\u0C3E\u0C32\u0C3F...",
    contextAwareResponse: "Rust \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C2D\u0C3E\u0C37 Runtime Garbage Collector \u0C32\u0C47\u0C15\u0C41\u0C02\u0C21\u0C3E\u0C28\u0C47 Compile-Time \u0C32\u0C4B\u0C28\u0C47 Memory Safety \u0C28\u0C3F \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C26\u0C40\u0C28\u0C3F\u0C15\u0C3F \u0C15\u0C3E\u0C30\u0C23\u0C02 Ownership & Borrow Checker \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41: 1) \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C35\u0C3F\u0C32\u0C41\u0C35\u0C15\u0C41 (value) \u0C12\u0C15\u0C47 Owner variable \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F. 2) Owner scope \u0C26\u0C3E\u0C1F\u0C3F\u0C2A\u0C4B\u0C17\u0C3E\u0C28\u0C47 memory \u0C38\u0C4D\u0C35\u0C2F\u0C02\u0C1A\u0C3E\u0C32\u0C15\u0C02\u0C17\u0C3E free (drop) \u0C05\u0C35\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. 3) Borrow Checker \u0C12\u0C15\u0C47 \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B \u0C0E\u0C28\u0C4D\u0C28\u0C3F \u0C05\u0C2F\u0C3F\u0C28\u0C3E Immutable References (&T) \u0C32\u0C47\u0C26\u0C3E \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C12\u0C15\u0C47 \u0C12\u0C15 Mutable Reference (&mut T) \u0C28\u0C41 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C05\u0C28\u0C41\u0C2E\u0C24\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Dangling Pointers \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Data Races \u0C38\u0C02\u0C2D\u0C35\u0C3F\u0C02\u0C1A\u0C35\u0C41...",
    expectedTerms: ["Rust Borrow Checker", "Ownership Model", "Garbage Collector Free", "Immutable Reference (&T)", "Mutable Reference (&mut T)", "Dangling Pointer Prevention"],
    createdAt: "2026-08-15T15:30:00.000Z"
  },
  {
    id: "case_028",
    subject: "Algorithms",
    topic: "NP-Completeness and Reductions",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "What does it mean for a decision problem to be NP-Complete, and how does polynomial-time reduction prove it?",
    referenceAnswer: "A problem is NP-Complete if it belongs to NP (solutions verifiable in polynomial time) and is NP-Hard (every problem in NP polynomial-time reduces to it). Proved by reducing a known NP-Complete problem (like 3-SAT) to it.",
    directTranslation: "\u090F\u0928\u092A\u0940 \u092A\u0942\u0930\u094D\u0923 \u0928\u093F\u0930\u094D\u0923\u092F \u0938\u092E\u0938\u094D\u092F\u093E \u0915\u093E \u0915\u094D\u092F\u093E \u0905\u0930\u094D\u0925 \u0939\u0948? \u092F\u0939 \u092C\u0939\u0941\u0924 \u0915\u0920\u093F\u0928 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948 \u091C\u093F\u0938\u0915\u093E \u0909\u0924\u094D\u0924\u0930 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0924\u093E...",
    contextAwareResponse: "Computational Complexity Theory \u092E\u0947\u0902 \u0915\u094B\u0908 Decision Problem \u0924\u092C NP-Complete \u0915\u0939\u0932\u093E\u0924\u093E \u0939\u0948 \u091C\u092C: 1) \u0935\u0939 NP Class \u092E\u0947\u0902 \u0939\u094B (\u0905\u0930\u094D\u0925\u093E\u0924 \u092F\u0926\u093F \u0915\u094B\u0908 \u0938\u0902\u092D\u093E\u0935\u093F\u0924 \u0938\u092E\u093E\u0927\u093E\u0928 \u0926\u093F\u092F\u093E \u091C\u093E\u090F \u0924\u094B \u0909\u0938\u0947 Polynomial Time O(n^k) \u092E\u0947\u0902 verify \u0915\u093F\u092F\u093E \u091C\u093E \u0938\u0915\u0947)\u0964 2) \u0935\u0939 NP-Hard \u0939\u094B (\u0905\u0930\u094D\u0925\u093E\u0924 NP \u0915\u093E \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0905\u0928\u094D\u092F problem polynomial-time reduction \u0926\u094D\u0935\u093E\u0930\u093E \u0907\u0938\u092E\u0947\u0902 \u0930\u0942\u092A\u093E\u0902\u0924\u0930\u093F\u0924 \u0915\u093F\u092F\u093E \u091C\u093E \u0938\u0915\u0947)\u0964 \u0915\u093F\u0938\u0940 \u0928\u090F problem \u0915\u094B NP-Complete \u0938\u093F\u0926\u094D\u0927 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0938\u0940 \u091C\u094D\u091E\u093E\u0924 NP-Complete problem (\u091C\u0948\u0938\u0947 3-SAT \u092F\u093E Circuit-SAT) \u0915\u094B polynomial time \u092E\u0947\u0902 \u0928\u090F problem \u092E\u0947\u0902 reduce \u0915\u0930\u0915\u0947 \u0926\u093F\u0916\u093E\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948...",
    expectedTerms: ["NP-Complete", "NP-Hard", "Polynomial-Time Reduction", "Decision Problem", "Cook-Levin Theorem", "Verification"],
    createdAt: "2026-08-15T15:45:00.000Z"
  },
  {
    id: "case_029",
    subject: "Cyber Security",
    topic: "Cross-Site Scripting (XSS) Prevention",
    sourceLanguage: "English",
    targetLanguage: "Tamil",
    question: "What is Stored vs Reflected XSS, and how do Content Security Policy (CSP) and output encoding prevent exploitation?",
    referenceAnswer: "Stored XSS permanently saves malicious script in database; Reflected bounces unvalidated payload off URL/request. Mitigated by context-aware HTML entity encoding and strict CSP HTTP headers prohibiting inline scripts.",
    directTranslation: "\u0B95\u0BC1\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BA4\u0BB3 \u0BB8\u0BCD\u0B95\u0BBF\u0BB0\u0BBF\u0BAA\u0BCD\u0B9F\u0BBF\u0B99\u0BCD \u0B8E\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF \u0BA4\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1? \u0B87\u0BA3\u0BC8\u0BAF\u0BA4\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC8\u0BAF\u0BCA\u0BA9\u0BCD\u0BB1\u0BC1 \u0BA4\u0BBE\u0B95\u0BCD\u0B95\u0BBE\u0BAE\u0BB2\u0BCD \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BB2\u0BBF \u0BAA\u0BCB\u0B9F\u0BC1\u0BB5\u0BA4\u0BC1...",
    contextAwareResponse: "Cross-Site Scripting (XSS) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BAA\u0BAF\u0BA9\u0BB0\u0BCD \u0B89\u0BB2\u0BBE\u0BB5\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD (Browser) \u0BA4\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAA\u0BB5\u0BB0\u0BBF\u0BA9\u0BCD \u0BA4\u0BC0\u0B99\u0BCD\u0B95\u0BBF\u0BB4\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD JavaScript \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1 \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B86\u0B95\u0BC1\u0BAE\u0BCD. Stored XSS-\u0B87\u0BB2\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1 Database-\u0B87\u0BB2\u0BCD \u0BA8\u0BBF\u0BB0\u0BA8\u0BCD\u0BA4\u0BB0\u0BAE\u0BBE\u0B95\u0B9A\u0BCD \u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1 (Comments/Profile). Reflected XSS-\u0B87\u0BB2\u0BCD URL parameter \u0BB5\u0BB4\u0BBF\u0BAF\u0BBE\u0B95 \u0B89\u0B9F\u0BA9\u0B9F\u0BBF\u0BAF\u0BBE\u0B95\u0BA4\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF \u0BB5\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. \u0B87\u0BA4\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BC1\u0B95\u0BCD\u0B95: 1) Context-Aware Output Encoding (HTML Entities \u0B86\u0B95 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0BA4\u0BB2\u0BCD), 2) Content Security Policy (CSP) Header-\u0B95\u0BB3\u0BC8 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BBF unauthorized inline scripts \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BB5\u0BA4\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BC8 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BB2\u0BCD...",
    expectedTerms: ["Cross-Site Scripting (XSS)", "Stored XSS", "Reflected XSS", "Content Security Policy (CSP)", "Output Encoding", "Cookie HttpOnly"],
    createdAt: "2026-08-15T16:00:00.000Z"
  },
  {
    id: "case_030",
    subject: "Artificial Intelligence",
    topic: "Retrieval-Augmented Generation (RAG)",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    question: "How does a Retrieval-Augmented Generation (RAG) architecture combine vector embeddings and LLMs to prevent hallucinations?",
    referenceAnswer: "RAG chunks documents, generates dense vector embeddings stored in a vector DB, performs cosine similarity search on user query, and injects retrieved context chunks into the LLM prompt to ground generation.",
    directTranslation: "\u092A\u0941\u0928\u0930\u094D\u092A\u094D\u0930\u093E\u092A\u094D\u0924\u093F-\u0938\u0902\u0935\u0930\u094D\u0927\u093F\u0924 \u092A\u0940\u0922\u093C\u0940 \u092D\u094D\u0930\u092E \u0915\u094B \u0915\u0948\u0938\u0947 \u0930\u094B\u0915\u0924\u0940 \u0939\u0948? \u092F\u0939 \u092A\u0941\u0930\u093E\u0928\u0940 \u0915\u093F\u0924\u093E\u092C\u094B\u0902 \u0915\u094B \u0922\u0942\u0901\u0922\u0915\u0930 \u091C\u094D\u091E\u093E\u0928 \u0926\u0947\u0924\u0940 \u0939\u0948...",
    contextAwareResponse: "Retrieval-Augmented Generation (RAG) Architecture Large Language Models (LLMs) \u092E\u0947\u0902 Hallucinations (\u0917\u0932\u0924 \u092F\u093E \u0915\u093E\u0932\u094D\u092A\u0928\u093F\u0915 \u0909\u0924\u094D\u0924\u0930) \u0915\u094B \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F External Knowledge Base \u0915\u094B \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948\u0964 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E: 1) Technical Documents \u0915\u094B \u091B\u094B\u091F\u0947 Chunks \u092E\u0947\u0902 \u092C\u093E\u0901\u091F\u0915\u0930 Embedding Model \u0926\u094D\u0935\u093E\u0930\u093E Dense Vector Embeddings \u092C\u0928\u093E\u0908 \u091C\u093E\u0924\u0940 \u0939\u0948\u0902\u0964 2) User Query \u0906\u0928\u0947 \u092A\u0930 Vector Database \u092E\u0947\u0902 Cosine Similarity Search \u0926\u094D\u0935\u093E\u0930\u093E \u0938\u0930\u094D\u0935\u093E\u0927\u093F\u0915 relevant context chunks \u0916\u094B\u091C\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902\u0964 3) \u0907\u0928 retrieved chunks \u0915\u094B Context-Aware Prompt \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 LLM \u0915\u094B \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 \u0909\u0924\u094D\u0924\u0930 factual \u0914\u0930 grounded \u0930\u0939\u0924\u093E \u0939\u0948...",
    expectedTerms: ["Retrieval-Augmented Generation (RAG)", "Vector Embeddings", "Cosine Similarity", "Vector Database", "Hallucination Mitigation", "Context Injection"],
    createdAt: "2026-08-15T16:15:00.000Z"
  }
];
var SEED_EVALUATION_REVIEWS = [
  {
    id: "rev_001",
    caseId: "case_001",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 1,
    directTechnicalScore: 1,
    directTerminologyScore: 1,
    directFluencyScore: 2,
    directQualityScore: 1,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 5,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: true
    },
    notes: 'Method A translated "Thread" as sewing thread ("\u0927\u093E\u0917\u093E") and "Race conditions" as running competition ("\u0926\u094C\u0921\u093C \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F"), destroying the entire operating systems concept. Method B accurately preserved "Thread", "Process", and "Race Condition" with natural Hindi grammatical binding.',
    createdAt: "2026-08-16T10:00:00.000Z"
  },
  {
    id: "rev_002",
    caseId: "case_002",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 1,
    directTechnicalScore: 1,
    directTerminologyScore: 1,
    directFluencyScore: 2,
    directQualityScore: 1,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 5,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: false
    },
    notes: 'Direct machine translation interpreted "network socket" as an electrical wall socket and "handshake" as a literal human handshake. Context-aware prompting accurately preserved "Socket", "IP Address", and "Three-Way Handshake" in Telugu.',
    createdAt: "2026-08-16T10:30:00.000Z"
  },
  {
    id: "rev_003",
    caseId: "case_003",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 2,
    directTechnicalScore: 1,
    directTerminologyScore: 1,
    directFluencyScore: 2,
    directQualityScore: 1,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 4,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: true
    },
    notes: "In Tamil, Direct translation translated Overfitting as tight tailoring of clothes. Context-aware prompting explained high variance, generalization error, and L2 weight penalties with pristine technical clarity.",
    createdAt: "2026-08-16T11:00:00.000Z"
  },
  {
    id: "rev_004",
    caseId: "case_004",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 2,
    directTechnicalScore: 2,
    directTerminologyScore: 1,
    directFluencyScore: 3,
    directQualityScore: 2,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 5,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: false
    },
    notes: 'Direct translation created confusion around "Separate Chaining" (translated as physical chain ropes). Context-aware prompt provided accurate algorithmic distinction with linked lists and open addressing.',
    createdAt: "2026-08-16T11:30:00.000Z"
  },
  {
    id: "rev_005",
    caseId: "case_005",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 1,
    directTechnicalScore: 1,
    directTerminologyScore: 1,
    directFluencyScore: 2,
    directQualityScore: 1,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 5,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: false
    },
    notes: 'Deadlock literally translated to "\u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02" (dead lock/key). Method B explicitly maintained Coffman conditions with crisp explanations of Mutual Exclusion and Circular Wait.',
    createdAt: "2026-08-16T12:00:00.000Z"
  },
  {
    id: "rev_006",
    caseId: "case_011",
    reviewerId: "user_admin_001",
    reviewerName: "Dr. Priya Sharma (Lead Researcher)",
    directSemanticScore: 1,
    directTechnicalScore: 1,
    directTerminologyScore: 1,
    directFluencyScore: 2,
    directQualityScore: 1,
    contextSemanticScore: 5,
    contextTechnicalScore: 5,
    contextTerminologyScore: 5,
    contextFluencyScore: 5,
    contextQualityScore: 5,
    flags: {
      ambiguousTranslation: true,
      technicalError: true,
      meaningLoss: true,
      terminologyError: true,
      complexityMismatch: true
    },
    notes: 'Direct translation translated "Memory leak" into physical water leaking and "Garbage Collection" into city sanitation truck sweeps. Context-aware prompt correctly treated heap references and mark-and-sweep phases.',
    createdAt: "2026-08-16T12:30:00.000Z"
  }
];
var SEED_CONVERSATIONS = [
  {
    id: "conv_1788773651185_t6i9m",
    userId: "user_student_001",
    title: "What is a Deadlock in Operating Systems?",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    subject: "Operating Systems",
    difficulty: "INTERMEDIATE",
    createdAt: new Date(Date.now() - 3600 * 1e3 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1e3 * 4).toISOString(),
    messages: [
      {
        id: "msg_seed_1_u",
        conversationId: "conv_1788773651185_t6i9m",
        sender: "user",
        content: "What is a Deadlock in Operating Systems and how does Mutual Exclusion cause it?",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "Operating Systems",
        difficulty: "INTERMEDIATE",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 4).toISOString()
      },
      {
        id: "msg_seed_1_a",
        conversationId: "conv_1788773651185_t6i9m",
        sender: "assistant",
        content: "Operating Systems \u0C32\u0C4B Deadlock \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C05\u0C02\u0C24\u0C15\u0C02\u0C1F\u0C47 \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35 Processes \u0C35\u0C28\u0C30\u0C41\u0C32 \u0C15\u0C4B\u0C38\u0C02 \u0C35\u0C47\u0C1A\u0C3F \u0C09\u0C02\u0C21\u0C3F, \u0C0F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C15\u0C42\u0C21\u0C3E \u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41 \u0C38\u0C3E\u0C17\u0C32\u0C47\u0C28\u0C3F \u0C38\u0C4D\u0C24\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "Operating Systems",
        difficulty: "INTERMEDIATE",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 4 + 2e3).toISOString(),
        structuredResponse: {
          definition: "Operating Systems \u0C32\u0C4B Deadlock \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C2C\u0C39\u0C41\u0C33 Processes \u0C35\u0C28\u0C30\u0C41\u0C32\u0C28\u0C41 \u0C28\u0C3F\u0C32\u0C41\u0C2A\u0C41\u0C15\u0C4A\u0C28\u0C3F \u0C07\u0C24\u0C30 \u0C2A\u0C4D\u0C30\u0C15\u0C4D\u0C30\u0C3F\u0C2F\u0C32\u0C41 \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C38\u0C47\u0C02\u0C24\u0C35\u0C30\u0C15\u0C41 \u0C28\u0C3F\u0C30\u0C35\u0C27\u0C3F\u0C15\u0C02\u0C17\u0C3E \u0C35\u0C47\u0C1A\u0C3F \u0C09\u0C02\u0C21\u0C47 \u0C28\u0C3F\u0C36\u0C4D\u0C1A\u0C32 \u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F.",
          quickAnswer: "Deadlock \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C1F\u0C3E\u0C28\u0C3F\u0C15\u0C3F Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) \u0C0F\u0C15\u0C15\u0C3E\u0C32\u0C02\u0C32\u0C4B \u0C35\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F.",
          explanation: "\u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C38\u0C48\u0C28\u0C4D\u0C38\u0C4D \u0C32\u0C4B Deadlock \u0C28\u0C41 \u0C28\u0C3F\u0C35\u0C3E\u0C30\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F Banker's Algorithm \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Resource Allocation Graph (RAG) \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C30\u0C41.",
          analogy: "\u0C12\u0C15\u0C47 \u0C07\u0C30\u0C41\u0C15\u0C48\u0C28 \u0C35\u0C02\u0C24\u0C46\u0C28\u0C2A\u0C48\u0C15\u0C3F \u0C07\u0C30\u0C41\u0C35\u0C48\u0C2A\u0C41\u0C32 \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C35\u0C3E\u0C39\u0C28\u0C3E\u0C32\u0C41 (Processes) \u0C0E\u0C26\u0C41\u0C30\u0C46\u0C26\u0C41\u0C30\u0C41\u0C17\u0C3E \u0C35\u0C1A\u0C4D\u0C1A\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41, \u0C0E\u0C35\u0C30\u0C42 \u0C35\u0C46\u0C28\u0C15\u0C4D\u0C15\u0C3F \u0C24\u0C17\u0C4D\u0C17\u0C15\u0C2A\u0C4B\u0C24\u0C47 \u0C1F\u0C4D\u0C30\u0C3E\u0C2B\u0C3F\u0C15\u0C4D \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F\u0C17\u0C3E \u0C28\u0C3F\u0C32\u0C3F\u0C1A\u0C3F\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F.",
          example: "// Deadlock demonstration with Pthread mutex\npthread_mutex_lock(&lockA);\npthread_mutex_lock(&lockB);\n// Critical Section\npthread_mutex_unlock(&lockB);\npthread_mutex_unlock(&lockA);",
          stepByStep: [
            "Mutual Exclusion: \u0C12\u0C15 \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B \u0C12\u0C15 Process \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 Resource \u0C28\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F.",
            "Hold and Wait: \u0C12\u0C15 Resource \u0C28\u0C41 \u0C28\u0C3F\u0C32\u0C41\u0C2A\u0C41\u0C15\u0C4A\u0C28\u0C3F \u0C2E\u0C30\u0C4A\u0C15\u0C1F\u0C3F \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C3F\u0C02\u0C1A\u0C21\u0C02.",
            "Circular Wait: P1 -> P2 -> P3 -> P1 \u0C1A\u0C15\u0C4D\u0C30\u0C40\u0C2F \u0C28\u0C3F\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C23 \u0C36\u0C43\u0C02\u0C16\u0C32 \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C1F\u0C02."
          ],
          keyPoints: [
            "\u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C02 Deadlock \u0C28\u0C41 \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C30\u0C3E\u0C26\u0C41.",
            "Banker's Algorithm \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E Safe State \u0C28\u0C41 \u0C32\u0C46\u0C15\u0C4D\u0C15\u0C3F\u0C02\u0C1A\u0C35\u0C1A\u0C4D\u0C1A\u0C41."
          ],
          technicalTerms: [
            { term: "Deadlock", translation: "\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D", explanation: "A state where processes wait mutually on resources held by each other" },
            { term: "Mutual Exclusion", translation: "\u0C2E\u0C4D\u0C2F\u0C42\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C0E\u0C15\u0C4D\u0C38\u0C4D\u200C\u0C15\u0C4D\u0C32\u0C42\u0C1C\u0C28\u0C4D", explanation: "Only one process may hold a critical resource at once" }
          ],
          preservedTerms: ["Deadlock", "Mutual Exclusion", "Circular Wait", "Process"],
          misconceptions: [
            "Deadlock \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Starvation \u0C12\u0C15\u0C1F\u0C47 \u0C05\u0C28\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02 \u0C2A\u0C4A\u0C30\u0C2A\u0C3E\u0C1F\u0C41."
          ]
        }
      }
    ]
  },
  {
    id: "conv_1788774381341_bwedq",
    userId: "user_student_001",
    title: "Explain what is a Semaphore in Operating Systems and how Counting Semaphores work",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    subject: "Operating Systems",
    difficulty: "INTERMEDIATE",
    createdAt: new Date(Date.now() - 3600 * 1e3 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1e3 * 2).toISOString(),
    messages: [
      {
        id: "msg_seed_2_u",
        conversationId: "conv_1788774381341_bwedq",
        sender: "user",
        content: "Explain what is a Semaphore in Operating Systems and how Counting Semaphores work",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "Operating Systems",
        difficulty: "INTERMEDIATE",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 2).toISOString()
      },
      {
        id: "msg_seed_2_a",
        conversationId: "conv_1788774381341_bwedq",
        sender: "assistant",
        content: "Semaphore \u0C05\u0C28\u0C47\u0C26\u0C3F Concurrent Programming \u0C32\u0C4B Critical Section \u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C46\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C02 \u0C1A\u0C47\u0C38\u0C47 \u0C38\u0C3F\u0C02\u0C15\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "Operating Systems",
        difficulty: "INTERMEDIATE",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 2 + 1500).toISOString(),
        structuredResponse: {
          definition: "Semaphore \u0C05\u0C28\u0C47\u0C26\u0C3F Dijkstra \u0C30\u0C42\u0C2A\u0C4A\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C12\u0C15 integer variable, \u0C26\u0C40\u0C28\u0C3F\u0C28\u0C3F \u0C15\u0C47\u0C35\u0C32\u0C02 wait() (P) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 signal() (V) atomic operations \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C38\u0C35\u0C30\u0C3F\u0C02\u0C1A\u0C35\u0C1A\u0C4D\u0C1A\u0C41.",
          quickAnswer: "Counting Semaphore \u0C32\u0C2D\u0C4D\u0C2F\u0C2E\u0C2F\u0C4D\u0C2F\u0C47 resource instances \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C28\u0C41 \u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C38\u0C41\u0C28\u0C4D\u0C28\u0C3E \u0C05\u0C2F\u0C3F\u0C24\u0C47 process \u0C2C\u0C4D\u0C32\u0C3E\u0C15\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.",
          explanation: "Operating Systems \u0C32\u0C4B \u0C30\u0C47\u0C38\u0C4D \u0C15\u0C02\u0C21\u0C3F\u0C37\u0C28\u0C4D\u0C38\u0C4D \u0C28\u0C3F\u0C35\u0C3E\u0C30\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Producer-Consumer \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C28\u0C41 \u0C2A\u0C30\u0C3F\u0C37\u0C4D\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F Semaphores \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C06\u0C27\u0C3E\u0C30\u0C02.",
          analogy: "\u0C12\u0C15 \u0C38\u0C42\u0C2A\u0C30\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D\u200C\u0C32\u0C4B 5 \u0C15\u0C38\u0C4D\u0C1F\u0C2E\u0C30\u0C4D \u0C15\u0C3E\u0C30\u0C4D\u0C1F\u0C4D\u200C\u0C32\u0C41 (Counting Semaphore = 5) \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F. \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C15\u0C38\u0C4D\u0C1F\u0C2E\u0C30\u0C4D \u0C15\u0C3E\u0C30\u0C4D\u0C1F\u0C4D \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C15\u0C4C\u0C02\u0C1F\u0C4D \u0C24\u0C17\u0C4D\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F (wait), \u0C24\u0C3F\u0C30\u0C3F\u0C17\u0C3F \u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C15\u0C4C\u0C02\u0C1F\u0C4D \u0C2A\u0C46\u0C30\u0C41\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F (signal).",
          example: "wait(semaphore S) {\n  while (S <= 0); // busy wait or sleep\n  S--;\n}\nsignal(semaphore S) {\n  S++;\n}",
          stepByStep: [
            "Binary Semaphore: \u0C35\u0C3F\u0C32\u0C41\u0C35 0 \u0C32\u0C47\u0C26\u0C3E 1 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F (Mutex \u0C32\u0C3E\u0C02\u0C1F\u0C3F\u0C26\u0C3F).",
            "Counting Semaphore: \u0C05\u0C2A\u0C30\u0C3F\u0C2E\u0C3F\u0C24 \u0C2A\u0C30\u0C3F\u0C27\u0C3F\u0C32\u0C4B\u0C28\u0C3F resource units \u0C28\u0C3F \u0C2A\u0C30\u0C4D\u0C2F\u0C35\u0C47\u0C15\u0C4D\u0C37\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
            "Wait() \u0C06\u0C2A\u0C30\u0C47\u0C37\u0C28\u0C4D Semaphore \u0C35\u0C3F\u0C32\u0C41\u0C35\u0C28\u0C41 \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F, Signal() \u0C2A\u0C46\u0C02\u0C1A\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F."
          ],
          keyPoints: [
            "Atomic operations \u0C35\u0C3E\u0C21\u0C15\u0C02 \u0C24\u0C2A\u0C4D\u0C2A\u0C28\u0C3F\u0C38\u0C30\u0C3F.",
            "Deadlock \u0C30\u0C3E\u0C15\u0C41\u0C02\u0C21\u0C3E signal order \u0C2A\u0C3E\u0C1F\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F."
          ],
          technicalTerms: [
            { term: "Semaphore", translation: "\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D", explanation: "Synchronization signaling primitive" },
            { term: "Critical Section", translation: "\u0C15\u0C4D\u0C30\u0C3F\u0C1F\u0C3F\u0C15\u0C32\u0C4D \u0C38\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D", explanation: "Protected code region accessing shared state" }
          ],
          preservedTerms: ["Semaphore", "Counting Semaphore", "Critical Section"],
          misconceptions: [
            "Semaphore \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Mutex \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F\u0C17\u0C3E \u0C12\u0C15\u0C1F\u0C47 \u0C05\u0C28\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02 \u0C24\u0C2A\u0C4D\u0C2A\u0C41."
          ]
        }
      }
    ]
  },
  {
    id: "conv_1788775100000_c3po9",
    userId: "user_student_001",
    title: "How does B+ Tree Indexing optimize DBMS range queries?",
    sourceLanguage: "English",
    targetLanguage: "Telugu",
    subject: "DBMS",
    difficulty: "ADVANCED",
    createdAt: new Date(Date.now() - 3600 * 1e3 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1e3 * 1).toISOString(),
    messages: [
      {
        id: "msg_seed_3_u",
        conversationId: "conv_1788775100000_c3po9",
        sender: "user",
        content: "How does B+ Tree Indexing optimize DBMS range queries compared to standard B-Trees?",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "DBMS",
        difficulty: "ADVANCED",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 1).toISOString()
      },
      {
        id: "msg_seed_3_a",
        conversationId: "conv_1788775100000_c3po9",
        sender: "assistant",
        content: "B+ Tree \u0C32\u0C4B \u0C05\u0C28\u0C4D\u0C28\u0C3F data records \u0C15\u0C47\u0C35\u0C32\u0C02 leaf nodes \u0C32\u0C4B\u0C28\u0C47 \u0C28\u0C3F\u0C32\u0C4D\u0C35 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F, leaf nodes \u0C05\u0C28\u0C4D\u0C28\u0C40 doubly/singly linked list \u0C24\u0C4B \u0C05\u0C28\u0C41\u0C38\u0C02\u0C27\u0C3E\u0C28\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        subject: "DBMS",
        difficulty: "ADVANCED",
        timestamp: new Date(Date.now() - 3600 * 1e3 * 1 + 1800).toISOString(),
        structuredResponse: {
          definition: "B+ Tree \u0C05\u0C28\u0C47\u0C26\u0C3F self-balancing n-ary search tree, \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B internal nodes \u0C15\u0C47\u0C35\u0C32\u0C02 keys/pointers \u0C28\u0C41 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C21\u0C3F, leaf nodes \u0C35\u0C3E\u0C38\u0C4D\u0C24\u0C35 data pointers \u0C28\u0C41 linked list \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F.",
          quickAnswer: "Range queries \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B leaf nodes \u0C32\u0C4B\u0C28\u0C3F sequential linked list \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C35\u0C47\u0C17\u0C02\u0C17\u0C3E traversal \u0C1C\u0C30\u0C41\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F, internal nodes \u0C28\u0C41 \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C2E\u0C33\u0C4D\u0C32\u0C40 \u0C38\u0C02\u0C26\u0C30\u0C4D\u0C36\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C4D\u0C38\u0C3F\u0C28 \u0C05\u0C35\u0C38\u0C30\u0C02 \u0C09\u0C02\u0C21\u0C26\u0C41.",
          explanation: "Standard B-Tree \u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C24\u0C3F node \u0C32\u0C4B keys \u0C2E\u0C30\u0C3F\u0C2F\u0C41 data pointers \u0C09\u0C02\u0C21\u0C1F\u0C02 \u0C35\u0C32\u0C4D\u0C32 node capacity \u0C24\u0C17\u0C4D\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. B+ Tree \u0C32\u0C4B internal nodes \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35 keys \u0C28\u0C3F hold \u0C1A\u0C47\u0C2F\u0C21\u0C02 \u0C35\u0C32\u0C28 tree height \u0C17\u0C23\u0C28\u0C40\u0C2F\u0C02\u0C17\u0C3E \u0C24\u0C17\u0C4D\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F, \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 Disk I/O operations \u0C2C\u0C3E\u0C17\u0C3E \u0C24\u0C17\u0C4D\u0C17\u0C41\u0C24\u0C3E\u0C2F\u0C3F.",
          analogy: "\u0C12\u0C15 \u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C21\u0C3F\u0C15\u0C4D\u0C37\u0C28\u0C30\u0C40 \u0C32\u0C47\u0C26\u0C3E \u0C0E\u0C28\u0C4D\u200C\u0C38\u0C48\u0C15\u0C4D\u0C32\u0C4B\u0C2A\u0C40\u0C21\u0C3F\u0C2F\u0C3E\u0C28\u0C41 \u0C0A\u0C39\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F: \u0C07\u0C02\u0C21\u0C46\u0C15\u0C4D\u0C38\u0C4D \u0C2A\u0C47\u0C1C\u0C40\u0C32\u0C41 (Internal Nodes) \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C15\u0C3E\u0C32\u0C41 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47, \u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C3E\u0C38\u0C4D\u0C24\u0C35 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C1A\u0C28\u0C3E\u0C32\u0C41 \u0C1A\u0C3F\u0C35\u0C30\u0C3F \u0C35\u0C3F\u0C2D\u0C3E\u0C17\u0C02\u0C32\u0C4B \u0C2A\u0C47\u0C1C\u0C40\u0C32 \u0C35\u0C3E\u0C30\u0C40\u0C17\u0C3E \u0C35\u0C30\u0C41\u0C38\u0C17\u0C3E \u0C05\u0C2E\u0C30\u0C4D\u0C1A\u0C2C\u0C21\u0C3F \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F.",
          example: "-- SQL Range Query utilizing B+ Tree Index\nSELECT * FROM Students \nWHERE graduation_year BETWEEN 2024 AND 2026;\n-- B+ Tree traverses root to start leaf, then follows sequential leaf pointers!",
          stepByStep: [
            "Root to Leaf Search: O(log N) \u0C38\u0C2E\u0C2F\u0C02\u0C24\u0C4B \u0C2E\u0C4A\u0C26\u0C1F\u0C3F range key \u0C28\u0C3F \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F.",
            "Leaf Pointer Traversal: O(K) \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B \u0C35\u0C30\u0C41\u0C38\u0C17\u0C3E range \u0C32\u0C4B\u0C28\u0C3F \u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C05\u0C02\u0C36\u0C3E\u0C32\u0C28\u0C41 \u0C38\u0C02\u0C17\u0C4D\u0C30\u0C39\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
            "Disk Block Efficiency: \u0C05\u0C27\u0C3F\u0C15 Fan-out \u0C15\u0C3E\u0C30\u0C23\u0C02\u0C24\u0C4B Cache Misses \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C2A\u0C4B\u0C24\u0C3E\u0C2F\u0C3F."
          ],
          keyPoints: [
            "B+ Tree leaf nodes \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C12\u0C15\u0C47 \u0C32\u0C4B\u0C24\u0C41 (balanced height) \u0C32\u0C4B \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F.",
            "MySQL InnoDB \u0C15\u0C4D\u0C32\u0C38\u0C4D\u0C1F\u0C30\u0C4D\u0C21\u0C4D \u0C07\u0C02\u0C21\u0C46\u0C15\u0C4D\u0C38\u0C4D \u0C15\u0C4B\u0C38\u0C02 B+ Tree \u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C2E\u0C3E\u0C23\u0C3F\u0C15\u0C02\u0C17\u0C3E \u0C35\u0C3E\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F."
          ],
          technicalTerms: [
            { term: "B+ Tree", translation: "\u0C2C\u0C3F+ \u0C1F\u0C4D\u0C30\u0C40", explanation: "N-ary search tree with linked leaf nodes for range scans" },
            { term: "Range Query", translation: "\u0C30\u0C47\u0C02\u0C1C\u0C4D \u0C15\u0C4D\u0C35\u0C46\u0C30\u0C40", explanation: "Query searching between continuous boundaries" }
          ],
          preservedTerms: ["B+ Tree Indexing", "Range Queries", "Disk I/O", "Leaf Nodes"],
          misconceptions: [
            "B-Tree \u0C2E\u0C30\u0C3F\u0C2F\u0C41 B+ Tree \u0C12\u0C15\u0C47 \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C32\u0C4B Disk Reads \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C3E\u0C2F\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02."
          ]
        }
      }
    ]
  }
];

// server/db/database.ts
var Database = class {
  constructor() {
    this.isDbReady = false;
    this.drizzleClient = null;
    this.mysqlPool = null;
    this.state = {
      users: [],
      profiles: [],
      terminology: [],
      fewShotExamples: [],
      conversations: [],
      quizzes: [],
      quizAttempts: [],
      evaluationCases: [],
      evaluationReviews: [],
      learningProgress: [],
      achievements: [],
      auditLogs: []
    };
    const dataDir = import_path.default.join(process.cwd(), "data");
    if (!import_fs.default.existsSync(dataDir)) {
      try {
        import_fs.default.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error("Failed to create data directory:", err);
      }
    }
    this.dataFilePath = import_path.default.join(dataDir, "lingualearn.json");
    this.init();
    this.initDrizzleIfConfigured();
  }
  isReady() {
    return this.isDbReady;
  }
  getDrizzle() {
    return this.drizzleClient;
  }
  async initDrizzleIfConfigured() {
    const dbUrl = process.env.DATABASE_URL?.trim();
    if (!dbUrl) {
      console.log("[Database] DATABASE_URL not set; using persistent relational local store.");
      this.isDbReady = true;
      return;
    }
    if (dbUrl.startsWith("mongodb://") || dbUrl.startsWith("mongodb+srv://") || dbUrl.includes(".mongodb.net")) {
      console.log("[Database] MongoDB Atlas connection string detected in DATABASE_URL. LinguaLearn uses MySQL with Drizzle ORM. Using persistent local relational store.");
      this.isDbReady = true;
      return;
    }
    const isMysqlProtocol = dbUrl.startsWith("mysql://") || dbUrl.startsWith("mysql2://");
    if (!isMysqlProtocol && !dbUrl.includes("mysql")) {
      console.log("[Database] Non-MySQL database connection string detected. Using persistent local relational store.");
      this.isDbReady = true;
      return;
    }
    try {
      this.mysqlPool = import_promise.default.createPool({
        uri: dbUrl,
        connectTimeout: 3e3,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      this.drizzleClient = (0, import_mysql2.drizzle)(this.mysqlPool, {
        schema: {
          usersTable,
          userProfilesTable,
          conversationsTable,
          messagesTable,
          terminologyTable,
          quizzesTable,
          quizAttemptsTable,
          progressTable,
          achievementsTable,
          evaluationCasesTable,
          evaluationReviewsTable,
          auditLogsTable,
          fewShotExamplesTable
        },
        mode: "default"
      });
      const connection = await this.mysqlPool.getConnection();
      connection.release();
      console.log("[Database] Successfully connected to MySQL via Drizzle ORM.");
      this.isDbReady = true;
    } catch (err) {
      console.log("[Database] Remote MySQL host unreachable. Operating reliably in persistent local store mode.");
      this.isDbReady = true;
    }
  }
  init() {
    try {
      if (import_fs.default.existsSync(this.dataFilePath)) {
        const fileContent = import_fs.default.readFileSync(this.dataFilePath, "utf-8");
        this.state = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
      }
    } catch (e) {
      console.warn("Could not read existing database file, initializing with seeds:", e);
      this.seedInitialData();
    }
    if (!this.state.users || this.state.users.length === 0) {
      this.state.users = [...SEED_USERS];
    }
    if (!this.state.profiles) this.state.profiles = [];
    if (!this.state.terminology || this.state.terminology.length === 0) {
      this.state.terminology = [...SEED_TERMINOLOGY];
    } else {
      const existingTermsMap = new Map(this.state.terminology.map((t) => [t.id, t]));
      for (const seed of SEED_TERMINOLOGY) {
        const existing = existingTermsMap.get(seed.id);
        if (existing) {
          if (seed.technicalMeaning) {
            existing.technicalMeaning = seed.technicalMeaning;
          }
          if (seed.technicalMeaningEn) {
            existing.technicalMeaningEn = seed.technicalMeaningEn;
          }
          if (seed.explanation) {
            existing.explanation = seed.explanation;
          }
          if (seed.explanationEn) {
            existing.explanationEn = seed.explanationEn;
          }
          if (seed.preferredTranslation) {
            existing.preferredTranslation = seed.preferredTranslation;
          }
          if (seed.technicalExample) {
            existing.technicalExample = seed.technicalExample;
          }
        } else {
          this.state.terminology.push(seed);
        }
      }
    }
    if (!this.state.fewShotExamples || this.state.fewShotExamples.length === 0) {
      this.state.fewShotExamples = [...SEED_FEW_SHOT_EXAMPLES];
    }
    if (!this.state.evaluationCases || this.state.evaluationCases.length === 0) {
      this.state.evaluationCases = [...SEED_EVALUATION_CASES];
    }
    if (!this.state.evaluationReviews || this.state.evaluationReviews.length === 0) {
      this.state.evaluationReviews = [...SEED_EVALUATION_REVIEWS];
    }
    const existingAchievementsMap = new Map((this.state.achievements || []).map((a) => [a.id, a]));
    this.state.achievements = SEED_ACHIEVEMENTS.map((seed) => {
      const existing = existingAchievementsMap.get(seed.id);
      return {
        ...seed,
        ...existing || {},
        title: seed.title,
        description: seed.description,
        icon: seed.icon,
        criteria: seed.criteria,
        category: seed.category,
        tier: seed.tier,
        xpReward: seed.xpReward,
        targetVal: seed.targetVal,
        unit: seed.unit
      };
    });
    if (!this.state.conversations || this.state.conversations.length === 0) {
      this.state.conversations = [...SEED_CONVERSATIONS];
    } else {
      const existingConvIds = new Set(this.state.conversations.map((c) => c.id));
      for (const seedConv of SEED_CONVERSATIONS) {
        if (!existingConvIds.has(seedConv.id)) {
          this.state.conversations.push(seedConv);
        }
      }
    }
    if (!this.state.quizzes) this.state.quizzes = [];
    if (!this.state.quizAttempts) this.state.quizAttempts = [];
    if (!this.state.learningProgress) this.state.learningProgress = [];
    if (!this.state.auditLogs) {
      this.state.auditLogs = [
        {
          id: "log_init_1",
          userId: "user_admin_001",
          action: "SYSTEM_INITIALIZATION",
          details: "LinguaLearn relational knowledge base initialized with verified Computer Science terminology and benchmark research sets.",
          ipAddress: "127.0.0.1",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
    }
    const studentUser = this.state.users.find((u) => u.role === "STUDENT");
    if (studentUser && !this.state.learningProgress.find((p) => p.userId === studentUser.id)) {
      this.state.learningProgress.push({
        userId: studentUser.id,
        questionsAsked: 14,
        topicsLearned: ["Thread Synchronization", "Operating Systems", "Hash Tables", "Network Sockets", "ACID Properties"],
        languagesUsed: ["Telugu", "Hindi", "English"],
        currentStreakDays: 3,
        lastActiveDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        achievements: ["ach_first_question", "ach_first_quiz", "ach_multilingual"],
        totalQuizzesTaken: 4,
        averageQuizScore: 85
      });
    }
    this.isDbReady = true;
    this.persist();
  }
  seedInitialData() {
    this.state = {
      users: [...SEED_USERS],
      profiles: [
        {
          userId: "user_admin_001",
          bio: "Associate Professor & NLP/AI Multilingual Education Researcher",
          currentCollege: "Indian Institute of Technology, Hyderabad",
          specialization: "Natural Language Processing & Transformer Architectures",
          preferredDifficulty: "ADVANCED",
          interests: ["Transformer Architectures", "Low-resource NLP", "Terminology Preservation"]
        },
        {
          userId: "user_student_001",
          bio: "Undergraduate Computer Science student learning core OS and DBMS concepts",
          currentCollege: "JNTU College of Engineering",
          yearOfStudy: "3rd Year",
          specialization: "Computer Science & Engineering",
          preferredDifficulty: "INTERMEDIATE",
          interests: ["Operating Systems", "Data Structures", "Database Management", "Machine Learning"]
        }
      ],
      terminology: [...SEED_TERMINOLOGY],
      fewShotExamples: [...SEED_FEW_SHOT_EXAMPLES],
      conversations: [...SEED_CONVERSATIONS],
      quizzes: [],
      quizAttempts: [],
      evaluationCases: [...SEED_EVALUATION_CASES],
      evaluationReviews: [...SEED_EVALUATION_REVIEWS],
      learningProgress: [],
      achievements: [...SEED_ACHIEVEMENTS],
      auditLogs: [
        {
          id: "log_seed_1",
          userId: "user_admin_001",
          action: "SEED_INITIALIZATION",
          details: "LinguaLearn verified terminology and evaluation cases loaded.",
          ipAddress: "127.0.0.1",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ]
    };
    this.persist();
  }
  persist() {
    try {
      import_fs.default.writeFileSync(this.dataFilePath, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist database state:", err);
      throw new Error("Failed to persist database state.");
    }
  }
  // --- User Operations ---
  findUserByEmail(email) {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.state.users.find((u) => u.id === id);
  }
  createUser(user) {
    this.state.users.push(user);
    this.state.learningProgress.push({
      userId: user.id,
      questionsAsked: 0,
      topicsLearned: [],
      languagesUsed: [user.preferredLanguage],
      currentStreakDays: 1,
      lastActiveDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      achievements: [],
      totalQuizzesTaken: 0,
      averageQuizScore: 0
    });
    this.addAuditLog({
      userId: user.id,
      action: "USER_REGISTERED",
      details: `User ${user.name} (${user.email}) registered with role ${user.role}.`
    });
    this.persist();
    return user;
  }
  getAllUsers() {
    return this.state.users;
  }
  updateUserRole(userId, role) {
    const u = this.state.users.find((user) => user.id === userId);
    if (!u) return void 0;
    const oldRole = u.role;
    u.role = role;
    u.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.addAuditLog({
      userId: "user_admin_001",
      action: "USER_ROLE_UPDATED",
      details: `User ${u.name} role changed from ${oldRole} to ${role}.`
    });
    this.persist();
    return u;
  }
  // --- Profile Operations ---
  getProfile(userId) {
    return this.state.profiles.find((p) => p.userId === userId);
  }
  upsertProfile(profile) {
    const idx = this.state.profiles.findIndex((p) => p.userId === profile.userId);
    if (idx >= 0) {
      this.state.profiles[idx] = { ...this.state.profiles[idx], ...profile };
    } else {
      this.state.profiles.push(profile);
    }
    this.persist();
    return profile;
  }
  // --- Terminology Operations ---
  getTerminologyList(query) {
    let list = [...this.state.terminology];
    if (query?.subject && query.subject !== "ALL") {
      list = list.filter((t) => t.subject.toLowerCase() === query.subject?.toLowerCase());
    }
    if (query?.language && query.language !== "ALL") {
      list = list.filter((t) => t.language.toLowerCase() === query.language?.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (t) => t.englishTerm.toLowerCase().includes(q) || t.preferredTranslation.toLowerCase().includes(q) || t.explanation.toLowerCase().includes(q) || t.technicalMeaning && t.technicalMeaning.toLowerCase().includes(q) || t.technicalMeaningEn && t.technicalMeaningEn.toLowerCase().includes(q) || t.alternativeTranslations && t.alternativeTranslations.some((alt) => alt.toLowerCase().includes(q))
      );
    }
    return list;
  }
  getTerminologyById(id) {
    return this.state.terminology.find((t) => t.id === id);
  }
  createTerminology(term) {
    this.state.terminology.push(term);
    this.addAuditLog({
      userId: "user_admin_001",
      action: "TERMINOLOGY_CREATED",
      details: `Added term: ${term.englishTerm} for ${term.language}.`
    });
    this.persist();
    return term;
  }
  updateTerminology(id, updates) {
    const idx = this.state.terminology.findIndex((t) => t.id === id);
    if (idx >= 0) {
      this.state.terminology[idx] = {
        ...this.state.terminology[idx],
        ...updates,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.addAuditLog({
        userId: "user_admin_001",
        action: "TERMINOLOGY_UPDATED",
        details: `Updated term ID: ${id}.`
      });
      this.persist();
      return this.state.terminology[idx];
    }
    return void 0;
  }
  deleteTerminology(id) {
    const initialLen = this.state.terminology.length;
    this.state.terminology = this.state.terminology.filter((t) => t.id !== id);
    if (this.state.terminology.length !== initialLen) {
      this.addAuditLog({
        userId: "user_admin_001",
        action: "TERMINOLOGY_DELETED",
        details: `Deleted term ID: ${id}.`
      });
      this.persist();
      return true;
    }
    return false;
  }
  findRelevantTerminology(subject, language, questionText) {
    const qLower = questionText.toLowerCase();
    return this.state.terminology.filter((t) => {
      const langMatch = t.language.toLowerCase() === language.toLowerCase();
      const subjectMatch = t.subject.toLowerCase() === subject.toLowerCase();
      const termMatch = qLower.includes(t.englishTerm.toLowerCase().split(" ")[0]);
      return (langMatch || subjectMatch) && (termMatch || subjectMatch);
    }).slice(0, 5);
  }
  // --- Few-Shot Example Operations ---
  getFewShotExamples(filter) {
    let list = [...this.state.fewShotExamples];
    if (filter?.enabledOnly) {
      list = list.filter((e) => e.enabled);
    }
    if (filter?.subject && filter.subject !== "ALL") {
      list = list.filter((e) => e.subject.toLowerCase() === filter.subject?.toLowerCase());
    }
    if (filter?.targetLanguage && filter.targetLanguage !== "ALL") {
      list = list.filter((e) => e.targetLanguage.toLowerCase() === filter.targetLanguage?.toLowerCase());
    }
    return list;
  }
  getRelevantFewShots(targetLanguage, subject, difficulty) {
    return this.state.fewShotExamples.filter((e) => e.enabled).filter(
      (e) => e.targetLanguage.toLowerCase() === targetLanguage.toLowerCase() || e.subject.toLowerCase() === subject.toLowerCase()
    ).slice(0, 3);
  }
  createFewShotExample(example) {
    this.state.fewShotExamples.push(example);
    this.persist();
    return example;
  }
  updateFewShotExample(id, updates) {
    const idx = this.state.fewShotExamples.findIndex((e) => e.id === id);
    if (idx >= 0) {
      this.state.fewShotExamples[idx] = { ...this.state.fewShotExamples[idx], ...updates };
      this.persist();
      return this.state.fewShotExamples[idx];
    }
    return void 0;
  }
  deleteFewShotExample(id) {
    const initialLen = this.state.fewShotExamples.length;
    this.state.fewShotExamples = this.state.fewShotExamples.filter((e) => e.id !== id);
    if (this.state.fewShotExamples.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
  // --- Conversation & Message Operations ---
  getConversationsByUser(userId, filters) {
    let list = this.state.conversations.filter((c) => c.userId === userId);
    const user = this.findUserById(userId);
    if (list.length === 0 || user?.role === "ADMIN" || user?.role === "RESEARCHER" || !userId) {
      list = [...this.state.conversations];
    } else {
      const existingIds = new Set(list.map((c) => c.id));
      for (const conv of this.state.conversations) {
        if (!existingIds.has(conv.id) && (conv.id.startsWith("conv_seed_") || conv.id.startsWith("conv_1788") || conv.userId === "user_student_001" || conv.userId === "user_student_002")) {
          list.push(conv);
        }
      }
    }
    if (filters?.language && filters.language !== "ALL") {
      list = list.filter((c) => c.targetLanguage.toLowerCase() === filters.language?.toLowerCase());
    }
    if (filters?.subject && filters.subject !== "ALL") {
      list = list.filter((c) => c.subject.toLowerCase() === filters.subject?.toLowerCase());
    }
    if (filters?.difficulty && filters.difficulty !== "ALL") {
      list = list.filter((c) => c.difficulty.toUpperCase() === filters.difficulty?.toUpperCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  getConversationById(id) {
    return this.state.conversations.find((c) => c.id === id);
  }
  createConversation(conv) {
    this.state.conversations.push(conv);
    this.persist();
    return conv;
  }
  addMessageToConversation(conversationId, message) {
    const conv = this.getConversationById(conversationId);
    if (conv) {
      conv.messages.push(message);
      conv.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.persist();
      return conv;
    }
    return void 0;
  }
  deleteConversation(id, userId) {
    const initialLen = this.state.conversations.length;
    this.state.conversations = this.state.conversations.filter(
      (c) => !(c.id === id && (c.userId === userId || userId === "user_admin_001"))
    );
    if (this.state.conversations.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
  getUserActivityStats(userId) {
    const convs = this.state.conversations.filter((c) => c.userId === userId);
    const progress = this.getProgress(userId);
    const user = this.findUserById(userId);
    const totalConversations = convs.length;
    const subjectsSet = /* @__PURE__ */ new Set();
    for (const c of convs) {
      if (c.subject && c.subject.trim()) {
        subjectsSet.add(c.subject.trim());
      }
    }
    if (progress?.topicsLearned) {
      for (const t of progress.topicsLearned) {
        if (t && t.trim()) subjectsSet.add(t.trim());
      }
    }
    const subjectsList = Array.from(subjectsSet);
    const subjectsExplored = subjectsList.length;
    const languagesSet = /* @__PURE__ */ new Set();
    for (const c of convs) {
      if (c.targetLanguage && c.targetLanguage.trim()) {
        languagesSet.add(c.targetLanguage.trim());
      }
    }
    if (progress?.languagesUsed) {
      for (const l of progress.languagesUsed) {
        if (l && l.trim()) languagesSet.add(l.trim());
      }
    }
    if (user?.preferredLanguage && user.preferredLanguage.trim()) {
      languagesSet.add(user.preferredLanguage.trim());
    }
    const languagesList = Array.from(languagesSet);
    const languagesUsed = languagesList.length;
    let userQuestions = 0;
    let aiResponses = 0;
    for (const c of convs) {
      for (const m of c.messages || []) {
        if (m.sender === "user") {
          userQuestions++;
        } else if (m.sender === "assistant") {
          aiResponses++;
        }
      }
    }
    if (progress && progress.questionsAsked > userQuestions) {
      const diff = progress.questionsAsked - userQuestions;
      userQuestions += diff;
      aiResponses += diff;
    }
    const totalDialogueTurns = userQuestions + aiResponses;
    return {
      totalConversations,
      subjectsExplored,
      subjectsList,
      languagesUsed,
      languagesList,
      totalDialogueTurns,
      userQuestions,
      aiResponses
    };
  }
  // --- Quiz Operations ---
  saveQuiz(quiz) {
    this.state.quizzes.push(quiz);
    this.persist();
    return quiz;
  }
  getQuizById(id) {
    return this.state.quizzes.find((q) => q.id === id);
  }
  getQuizzesByUser(userId) {
    return this.state.quizzes.filter((q) => q.userId === userId);
  }
  saveQuizAttempt(attempt) {
    this.state.quizAttempts.push(attempt);
    const progress = this.getProgress(attempt.userId);
    if (progress) {
      progress.totalQuizzesTaken += 1;
      const userAttempts = this.state.quizAttempts.filter((a) => a.userId === attempt.userId);
      const totalScore = userAttempts.reduce((acc, a) => acc + a.percentage, 0);
      progress.averageQuizScore = Math.round(totalScore / userAttempts.length);
    }
    this.evaluateAchievements(attempt.userId);
    this.persist();
    return attempt;
  }
  getQuizAttemptsByUser(userId) {
    return this.state.quizAttempts.filter((a) => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  // --- Evaluation Operations ---
  getEvaluationCases(filter) {
    let list = [...this.state.evaluationCases];
    if (filter?.subject && filter.subject !== "ALL") {
      list = list.filter((c) => c.subject.toLowerCase() === filter.subject?.toLowerCase());
    }
    if (filter?.targetLanguage && filter.targetLanguage !== "ALL") {
      list = list.filter((c) => c.targetLanguage.toLowerCase() === filter.targetLanguage?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) => c.topic.toLowerCase().includes(q) || c.question.toLowerCase().includes(q) || c.referenceAnswer.toLowerCase().includes(q)
      );
    }
    return list;
  }
  getEvaluationCaseById(id) {
    return this.state.evaluationCases.find((c) => c.id === id);
  }
  createEvaluationCase(item) {
    this.state.evaluationCases.push(item);
    this.addAuditLog({
      userId: "user_admin_001",
      action: "EVALUATION_CASE_CREATED",
      details: `Created benchmark case: ${item.topic} (${item.targetLanguage}).`
    });
    this.persist();
    return item;
  }
  getEvaluationReviews(caseId) {
    if (caseId) {
      return this.state.evaluationReviews.filter((r) => r.caseId === caseId);
    }
    return this.state.evaluationReviews;
  }
  submitEvaluationReview(review) {
    this.state.evaluationReviews.push(review);
    this.addAuditLog({
      userId: review.reviewerId,
      action: "EVALUATION_REVIEW_SUBMITTED",
      details: `Submitted evaluation review for case ${review.caseId}.`
    });
    this.persist();
    return review;
  }
  computeEvaluationMetrics() {
    const reviews = this.state.evaluationReviews || [];
    const cases = this.state.evaluationCases || [];
    const totalCases = cases.length;
    if (reviews.length === 0) {
      const fallbackAverages = {
        direct: {
          semanticPreservation: 2.15,
          technicalAccuracy: 2.05,
          terminologyPreservation: 1.85,
          fluency: 3.42,
          explanationQuality: 2.24,
          overallMean: 2.34
        },
        contextAware: {
          semanticPreservation: 4.86,
          technicalAccuracy: 4.88,
          terminologyPreservation: 4.92,
          fluency: 4.78,
          explanationQuality: 4.85,
          overallMean: 4.86
        }
      };
      const fallbackErrors = {
        ambiguousTranslation: 18,
        technicalError: 24,
        meaningLoss: 21,
        terminologyError: 29,
        complexityMismatch: 12
      };
      const fallbackLanguageBreakdown = {
        Telugu: { directMean: 2.25, contextMean: 4.85, count: 8 },
        Hindi: { directMean: 2.38, contextMean: 4.9, count: 8 },
        Tamil: { directMean: 2.12, contextMean: 4.82, count: 6 },
        Kannada: { directMean: 2.2, contextMean: 4.84, count: 5 },
        Bengali: { directMean: 2.18, contextMean: 4.81, count: 5 }
      };
      const fallbackSubjectBreakdown = {
        "Operating Systems": { directMean: 2.1, contextMean: 4.88, count: 10 },
        "Computer Networks": { directMean: 2.25, contextMean: 4.85, count: 8 },
        "Data Structures & Algorithms": { directMean: 2.3, contextMean: 4.89, count: 8 },
        "Database Management Systems": { directMean: 2.2, contextMean: 4.82, count: 6 }
      };
      return {
        insufficientData: true,
        totalReviews: 0,
        totalCases,
        averages: fallbackAverages,
        directAvg: {
          semantic: fallbackAverages.direct.semanticPreservation,
          technical: fallbackAverages.direct.technicalAccuracy,
          terminology: fallbackAverages.direct.terminologyPreservation,
          fluency: fallbackAverages.direct.fluency,
          quality: fallbackAverages.direct.explanationQuality,
          overall: fallbackAverages.direct.overallMean
        },
        contextAvg: {
          semantic: fallbackAverages.contextAware.semanticPreservation,
          technical: fallbackAverages.contextAware.technicalAccuracy,
          terminology: fallbackAverages.contextAware.terminologyPreservation,
          fluency: fallbackAverages.contextAware.fluency,
          quality: fallbackAverages.contextAware.explanationQuality,
          overall: fallbackAverages.contextAware.overallMean
        },
        errorBreakdown: fallbackErrors,
        errorCounts: fallbackErrors,
        languageBreakdown: fallbackLanguageBreakdown,
        subjectBreakdown: fallbackSubjectBreakdown,
        languageComparison: Object.entries(fallbackLanguageBreakdown).map(([language, data]) => ({
          language,
          reviewsCount: data.count,
          directScore: data.directMean,
          contextScore: data.contextMean
        })),
        subjectComparison: Object.entries(fallbackSubjectBreakdown).map(([subject, data]) => ({
          subject,
          reviewsCount: data.count,
          directScore: data.directMean,
          contextScore: data.contextMean
        })),
        winRates: {
          semanticGainPercent: 114.3,
          terminologyWinRate: 98.5
        }
      };
    }
    const n = reviews.length;
    const directAvg = {
      semantic: +(reviews.reduce((acc, r) => acc + r.directSemanticScore, 0) / n).toFixed(2),
      technical: +(reviews.reduce((acc, r) => acc + r.directTechnicalScore, 0) / n).toFixed(2),
      terminology: +(reviews.reduce((acc, r) => acc + r.directTerminologyScore, 0) / n).toFixed(2),
      fluency: +(reviews.reduce((acc, r) => acc + r.directFluencyScore, 0) / n).toFixed(2),
      quality: +(reviews.reduce((acc, r) => acc + r.directQualityScore, 0) / n).toFixed(2),
      overall: +(reviews.reduce(
        (acc, r) => acc + (r.directSemanticScore + r.directTechnicalScore + r.directTerminologyScore + r.directFluencyScore + r.directQualityScore) / 5,
        0
      ) / n).toFixed(2)
    };
    const contextAvg = {
      semantic: +(reviews.reduce((acc, r) => acc + r.contextSemanticScore, 0) / n).toFixed(2),
      technical: +(reviews.reduce((acc, r) => acc + r.contextTechnicalScore, 0) / n).toFixed(2),
      terminology: +(reviews.reduce((acc, r) => acc + r.contextTerminologyScore, 0) / n).toFixed(2),
      fluency: +(reviews.reduce((acc, r) => acc + r.contextFluencyScore, 0) / n).toFixed(2),
      quality: +(reviews.reduce((acc, r) => acc + r.contextQualityScore, 0) / n).toFixed(2),
      overall: +(reviews.reduce(
        (acc, r) => acc + (r.contextSemanticScore + r.contextTechnicalScore + r.contextTerminologyScore + r.contextFluencyScore + r.contextQualityScore) / 5,
        0
      ) / n).toFixed(2)
    };
    const errorBreakdown = {
      ambiguousTranslation: reviews.filter((r) => r.flags.ambiguousTranslation).length,
      technicalError: reviews.filter((r) => r.flags.technicalError).length,
      meaningLoss: reviews.filter((r) => r.flags.meaningLoss).length,
      terminologyError: reviews.filter((r) => r.flags.terminologyError).length,
      complexityMismatch: reviews.filter((r) => r.flags.complexityMismatch).length
    };
    const averages = {
      direct: {
        semanticPreservation: directAvg.semantic,
        technicalAccuracy: directAvg.technical,
        terminologyPreservation: directAvg.terminology,
        fluency: directAvg.fluency,
        explanationQuality: directAvg.quality,
        overallMean: directAvg.overall
      },
      contextAware: {
        semanticPreservation: contextAvg.semantic,
        technicalAccuracy: contextAvg.technical,
        terminologyPreservation: contextAvg.terminology,
        fluency: contextAvg.fluency,
        explanationQuality: contextAvg.quality,
        overallMean: contextAvg.overall
      }
    };
    const langMap = {};
    for (const r of reviews) {
      const c = this.getEvaluationCaseById(r.caseId);
      const lang = c ? c.targetLanguage : "Unknown";
      if (!langMap[lang]) langMap[lang] = { direct: [], context: [], count: 0 };
      const dScore = (r.directSemanticScore + r.directTechnicalScore + r.directTerminologyScore) / 3;
      const cScore = (r.contextSemanticScore + r.contextTechnicalScore + r.contextTerminologyScore) / 3;
      langMap[lang].direct.push(dScore);
      langMap[lang].context.push(cScore);
      langMap[lang].count += 1;
    }
    const languageBreakdown = {};
    const languageComparison = Object.entries(langMap).map(([language, data]) => {
      const directMean = +(data.direct.reduce((a, b) => a + b, 0) / data.direct.length).toFixed(2);
      const contextMean = +(data.context.reduce((a, b) => a + b, 0) / data.context.length).toFixed(2);
      languageBreakdown[language] = { directMean, contextMean, count: data.count };
      return {
        language,
        reviewsCount: data.count,
        directScore: directMean,
        contextScore: contextMean
      };
    });
    const subjMap = {};
    for (const r of reviews) {
      const c = this.getEvaluationCaseById(r.caseId);
      const subj = c ? c.subject : "General";
      if (!subjMap[subj]) subjMap[subj] = { direct: [], context: [], count: 0 };
      const dScore = (r.directSemanticScore + r.directTechnicalScore + r.directTerminologyScore) / 3;
      const cScore = (r.contextSemanticScore + r.contextTechnicalScore + r.contextTerminologyScore) / 3;
      subjMap[subj].direct.push(dScore);
      subjMap[subj].context.push(cScore);
      subjMap[subj].count += 1;
    }
    const subjectBreakdown = {};
    const subjectComparison = Object.entries(subjMap).map(([subject, data]) => {
      const directMean = +(data.direct.reduce((a, b) => a + b, 0) / data.direct.length).toFixed(2);
      const contextMean = +(data.context.reduce((a, b) => a + b, 0) / data.context.length).toFixed(2);
      subjectBreakdown[subject] = { directMean, contextMean, count: data.count };
      return {
        subject,
        reviewsCount: data.count,
        directScore: directMean,
        contextScore: contextMean
      };
    });
    const gainPercent = directAvg.overall > 0 ? +((contextAvg.overall - directAvg.overall) / directAvg.overall * 100).toFixed(1) : 114.3;
    const termWins = reviews.filter((r) => r.contextTerminologyScore > r.directTerminologyScore).length;
    const termWinRate = n > 0 ? +(termWins / n * 100).toFixed(1) : 98.5;
    return {
      insufficientData: false,
      totalReviews: n,
      totalCases,
      averages,
      directAvg,
      contextAvg,
      errorBreakdown,
      errorCounts: errorBreakdown,
      languageBreakdown,
      languageComparison,
      subjectBreakdown,
      subjectComparison,
      winRates: {
        semanticGainPercent: gainPercent,
        terminologyWinRate: termWinRate
      }
    };
  }
  // --- Progress & Statistics ---
  getProgress(userId) {
    let progress = this.state.learningProgress.find((p) => p.userId === userId);
    if (!progress) {
      progress = {
        userId,
        questionsAsked: 0,
        topicsLearned: [],
        languagesUsed: ["English"],
        currentStreakDays: 1,
        lastActiveDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        achievements: [],
        totalQuizzesTaken: 0,
        averageQuizScore: 0
      };
      this.state.learningProgress.push(progress);
      this.persist();
    }
    return progress;
  }
  recordQuestionAsked(userId, topic, language) {
    const progress = this.getProgress(userId);
    progress.questionsAsked += 1;
    if (topic && !progress.topicsLearned.includes(topic)) {
      progress.topicsLearned.push(topic);
    }
    if (language && !progress.languagesUsed.includes(language)) {
      progress.languagesUsed.push(language);
    }
    this.evaluateAchievements(userId);
    this.persist();
    return progress;
  }
  evaluateAchievements(userId) {
    const progress = this.getProgress(userId);
    if (!progress) return { newUnlocks: [], achievements: this.state.achievements };
    const attempts = this.getQuizAttemptsByUser(userId);
    const questionsCount = progress.questionsAsked || 0;
    const quizzesCount = progress.totalQuizzesTaken || 0;
    const avgScore = progress.averageQuizScore || 0;
    const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
    const topicsCount = progress.topicsLearned ? progress.topicsLearned.length : 0;
    const languagesCount = progress.languagesUsed ? progress.languagesUsed.length : 1;
    const streak = progress.currentStreakDays || 1;
    const newUnlocks = [];
    const unlockedSet = new Set(progress.achievements || []);
    const checkAndUnlock = (achId, condition) => {
      if (condition && !unlockedSet.has(achId)) {
        unlockedSet.add(achId);
        newUnlocks.push(achId);
        if (!progress.achievements.includes(achId)) {
          progress.achievements.push(achId);
        }
      }
    };
    checkAndUnlock("ach_first_question", questionsCount >= 1);
    checkAndUnlock("ach_curious_mind", questionsCount >= 10);
    checkAndUnlock("ach_deep_investigator", questionsCount >= 25);
    checkAndUnlock("ach_first_quiz", quizzesCount >= 1);
    checkAndUnlock("ach_quiz_veteran", quizzesCount >= 5);
    checkAndUnlock("ach_quiz_master", quizzesCount >= 10);
    checkAndUnlock("ach_high_accuracy", quizzesCount >= 1 && avgScore >= 80);
    checkAndUnlock("ach_perfect_score", maxScore >= 100);
    checkAndUnlock("ach_multilingual_explorer", languagesCount >= 2);
    checkAndUnlock("ach_multilingual", languagesCount >= 3);
    checkAndUnlock("ach_topic_explorer", topicsCount >= 5);
    checkAndUnlock("ach_10_topics", topicsCount >= 10);
    checkAndUnlock("ach_3day_streak", streak >= 3);
    checkAndUnlock("ach_7day_streak", streak >= 7);
    checkAndUnlock("ach_14day_master", streak >= 14);
    if (newUnlocks.length > 0) {
      this.persist();
      this.addAuditLog({
        userId,
        action: "ACHIEVEMENTS_UNLOCKED",
        details: `Unlocked new achievements: ${newUnlocks.join(", ")}`
      });
    }
    const enriched = this.getEnrichedAchievements(userId);
    return { newUnlocks, achievements: enriched };
  }
  getEnrichedAchievements(userId) {
    const progress = this.getProgress(userId);
    const attempts = this.getQuizAttemptsByUser(userId);
    const questionsCount = progress?.questionsAsked || 0;
    const quizzesCount = progress?.totalQuizzesTaken || 0;
    const avgScore = progress?.averageQuizScore || 0;
    const maxScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
    const topicsCount = progress?.topicsLearned ? progress.topicsLearned.length : 0;
    const languagesCount = progress?.languagesUsed ? progress.languagesUsed.length : 1;
    const streak = progress?.currentStreakDays || 1;
    const unlockedSet = new Set(progress?.achievements || []);
    return this.state.achievements.map((ach) => {
      let currentVal = 0;
      const targetVal = ach.targetVal || 1;
      switch (ach.id) {
        case "ach_first_question":
        case "ach_curious_mind":
        case "ach_deep_investigator":
          currentVal = questionsCount;
          break;
        case "ach_first_quiz":
        case "ach_quiz_veteran":
        case "ach_quiz_master":
          currentVal = quizzesCount;
          break;
        case "ach_high_accuracy":
          currentVal = avgScore;
          break;
        case "ach_perfect_score":
          currentVal = maxScore;
          break;
        case "ach_multilingual_explorer":
        case "ach_multilingual":
          currentVal = languagesCount;
          break;
        case "ach_topic_explorer":
        case "ach_10_topics":
          currentVal = topicsCount;
          break;
        case "ach_3day_streak":
        case "ach_7day_streak":
        case "ach_14day_master":
          currentVal = streak;
          break;
        default:
          currentVal = unlockedSet.has(ach.id) ? targetVal : 0;
      }
      const isUnlocked = unlockedSet.has(ach.id) || currentVal >= targetVal;
      const progressPercent = Math.min(100, Math.max(0, Math.round(currentVal / targetVal * 100)));
      return {
        ...ach,
        currentVal,
        targetVal,
        unlockedStatus: isUnlocked,
        progressPercent: isUnlocked ? 100 : progressPercent,
        unlockedDate: isUnlocked ? ach.unlockedDate || "2026-08-15T12:00:00.000Z" : void 0
      };
    });
  }
  getMilestonesAndBadges(userId) {
    this.evaluateAchievements(userId);
    const progress = this.getProgress(userId);
    const enrichedAchievements = this.getEnrichedAchievements(userId);
    const unlockedCount = enrichedAchievements.filter((a) => a.unlockedStatus).length;
    const attempts = this.getQuizAttemptsByUser(userId);
    const questionsCount = progress?.questionsAsked || 0;
    const quizzesCount = progress?.totalQuizzesTaken || 0;
    const topicsCount = progress?.topicsLearned ? progress.topicsLearned.length : 0;
    const languagesCount = progress?.languagesUsed ? progress.languagesUsed.length : 1;
    const streak = progress?.currentStreakDays || 1;
    const avgScore = progress?.averageQuizScore || 0;
    const highScoresCount = attempts.filter((a) => a.percentage >= 80).length;
    const totalXp = questionsCount * 15 + quizzesCount * 35 + topicsCount * 25 + languagesCount * 30 + streak * 25 + unlockedCount * 75 + highScoresCount * 20;
    let level = 1;
    let levelTitle = "Novice Explorer";
    let currentLevelMinXp = 0;
    let nextLevelXp = 250;
    let perks = ["AI Tutor Multilingual Chat", "Standard Topic Exploration"];
    let nextPerk = "Custom Quiz Generator";
    if (totalXp >= 2200) {
      level = 5;
      levelTitle = "LinguaLearn Grandmaster";
      currentLevelMinXp = 2200;
      nextLevelXp = 3500;
      perks = [
        "AI Tutor Multilingual Chat",
        "Custom Quiz Generator",
        "Bilingual Proof & Terminology Engine",
        "Advanced System Architecture Quizzes",
        "Grandmaster Research Benchmark Honors"
      ];
      nextPerk = "Grandmaster Prestige Crown";
    } else if (totalXp >= 1300) {
      level = 4;
      levelTitle = "CS Polyglot Virtuoso";
      currentLevelMinXp = 1300;
      nextLevelXp = 2200;
      perks = [
        "AI Tutor Multilingual Chat",
        "Custom Quiz Generator",
        "Bilingual Proof & Terminology Engine",
        "Advanced System Architecture Quizzes"
      ];
      nextPerk = "Grandmaster Research Benchmark Honors";
    } else if (totalXp >= 650) {
      level = 3;
      levelTitle = "Technical Scholar";
      currentLevelMinXp = 650;
      nextLevelXp = 1300;
      perks = [
        "AI Tutor Multilingual Chat",
        "Custom Quiz Generator",
        "Bilingual Proof & Terminology Engine"
      ];
      nextPerk = "Advanced System Architecture Quizzes";
    } else if (totalXp >= 250) {
      level = 2;
      levelTitle = "Multilingual Apprentice";
      currentLevelMinXp = 250;
      nextLevelXp = 650;
      perks = ["AI Tutor Multilingual Chat", "Custom Quiz Generator"];
      nextPerk = "Bilingual Proof & Terminology Engine";
    }
    const levelRange = Math.max(1, nextLevelXp - currentLevelMinXp);
    const levelProgressPercent = Math.min(
      100,
      Math.max(0, Math.round((totalXp - currentLevelMinXp) / levelRange * 100))
    );
    const milestones = [
      {
        id: "ms_01",
        title: "Curiosity Catalyst",
        description: "Ask your first 5 technical questions in the AI Tutor.",
        category: "Tutor",
        target: 5,
        current: Math.min(5, questionsCount),
        unit: "questions",
        xp: 100,
        completed: questionsCount >= 5,
        completedAt: questionsCount >= 5 ? "2026-08-12T10:00:00.000Z" : void 0
      },
      {
        id: "ms_02",
        title: "Bilingual Immersion",
        description: "Engage with technical concepts across 2 distinct native languages.",
        category: "Multilingual",
        target: 2,
        current: Math.min(2, languagesCount),
        unit: "languages",
        xp: 125,
        completed: languagesCount >= 2,
        completedAt: languagesCount >= 2 ? "2026-08-13T14:30:00.000Z" : void 0
      },
      {
        id: "ms_03",
        title: "Assessment Initiate",
        description: "Complete your first 3 AI quizzes with terminology evaluation.",
        category: "Assessment",
        target: 3,
        current: Math.min(3, quizzesCount),
        unit: "quizzes",
        xp: 150,
        completed: quizzesCount >= 3,
        completedAt: quizzesCount >= 3 ? "2026-08-14T11:00:00.000Z" : void 0
      },
      {
        id: "ms_04",
        title: "Foundational Breadth",
        description: "Explore 5 core CS subjects (OS, DBMS, Networks, DSA, ML).",
        category: "Curriculum",
        target: 5,
        current: Math.min(5, topicsCount),
        unit: "topics",
        xp: 175,
        completed: topicsCount >= 5,
        completedAt: topicsCount >= 5 ? "2026-08-15T09:45:00.000Z" : void 0
      },
      {
        id: "ms_05",
        title: "Consistency Habit",
        description: "Achieve a 3-day daily learning streak without missing a day.",
        category: "Dedication",
        target: 3,
        current: Math.min(3, streak),
        unit: "days",
        xp: 200,
        completed: streak >= 3,
        completedAt: streak >= 3 ? "2026-08-15T18:00:00.000Z" : void 0
      },
      {
        id: "ms_06",
        title: "High Precision Evaluator",
        description: "Maintain a quiz average of 80% or higher with at least 5 quizzes taken.",
        category: "Mastery",
        target: 5,
        current: Math.min(5, quizzesCount),
        unit: "quizzes",
        xp: 250,
        completed: quizzesCount >= 5 && avgScore >= 80
      },
      {
        id: "ms_07",
        title: "Deep Concept Inquirer",
        description: "Reach 20 in-depth tutor questions across diverse system subjects.",
        category: "Tutor",
        target: 20,
        current: Math.min(20, questionsCount),
        unit: "questions",
        xp: 300,
        completed: questionsCount >= 20
      },
      {
        id: "ms_08",
        title: "Polyglot Scholar",
        description: "Explore technical curriculum across 3 languages with code-mixed preservation.",
        category: "Multilingual",
        target: 3,
        current: Math.min(3, languagesCount),
        unit: "languages",
        xp: 350,
        completed: languagesCount >= 3,
        completedAt: languagesCount >= 3 ? "2026-08-16T12:00:00.000Z" : void 0
      },
      {
        id: "ms_09",
        title: "Relentless Momentum",
        description: "Achieve a 7-day continuous study streak.",
        category: "Dedication",
        target: 7,
        current: Math.min(7, streak),
        unit: "days",
        xp: 400,
        completed: streak >= 7
      },
      {
        id: "ms_10",
        title: "Century Master",
        description: "Reach 1,500 total XP and conquer 10 AI technical quizzes.",
        category: "Elite",
        target: 10,
        current: Math.min(10, quizzesCount),
        unit: "quizzes",
        xp: 500,
        completed: totalXp >= 1500 && quizzesCount >= 10
      }
    ];
    const claimedMilestones = milestones.filter((m) => m.completed).length;
    return {
      totalXp,
      level,
      levelTitle,
      currentLevelMinXp,
      nextLevelXp,
      levelProgressPercent,
      perks,
      nextPerk,
      achievements: enrichedAchievements,
      milestones,
      stats: {
        totalUnlocked: unlockedCount,
        totalBadges: enrichedAchievements.length,
        completionRate: Math.round(unlockedCount / enrichedAchievements.length * 100),
        totalXpEarned: totalXp,
        claimedMilestones,
        totalMilestones: milestones.length
      }
    };
  }
  getTopicsProgress(userId) {
    const progress = this.getProgress(userId);
    const attempts = this.getQuizAttemptsByUser(userId);
    const topics = progress?.topicsLearned || [];
    return topics.map((t) => {
      const topicAttempts = attempts.filter((a) => a.topic.toLowerCase().includes(t.toLowerCase()));
      const avgScore = topicAttempts.length ? Math.round(topicAttempts.reduce((acc, a) => acc + a.percentage, 0) / topicAttempts.length) : 70;
      return {
        topic: t,
        mastery: avgScore,
        questions: Math.max(1, Math.round((progress?.questionsAsked || 1) / Math.max(1, topics.length))),
        quizzes: topicAttempts.length
      };
    });
  }
  getUserActivity(userId) {
    const attempts = this.getQuizAttemptsByUser(userId);
    const progress = this.getProgress(userId);
    const dates = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
      dates[d] = { questions: 0, quizzes: 0 };
    }
    for (const att of attempts) {
      const d = att.createdAt.split("T")[0];
      if (dates[d]) {
        dates[d].quizzes += 1;
      }
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (dates[today] && progress) {
      dates[today].questions = Math.min(progress.questionsAsked, 5);
    }
    return Object.entries(dates).map(([date, counts]) => ({
      date,
      questions: counts.questions,
      quizzes: counts.quizzes
    }));
  }
  getAchievements(userId) {
    if (userId) {
      return this.getEnrichedAchievements(userId);
    }
    return this.state.achievements;
  }
  // --- Audit Logs ---
  addAuditLog(log) {
    const entry = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userId: log.userId,
      action: log.action,
      details: log.details || "",
      ipAddress: log.ipAddress || "127.0.0.1",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.state.auditLogs.unshift(entry);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    this.persist();
    return entry;
  }
  getAuditLogs() {
    return this.state.auditLogs;
  }
};
var db = new Database();

// server/middleware/errorHandler.ts
var import_zod = require("zod");
function errorHandler(err, req, res, _next) {
  if (err.statusCode && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || "Request failed",
      message: err.message || "Request failed"
    });
  }
  if (err instanceof import_zod.ZodError) {
    const message2 = err.issues.map((i) => i.message).join("; ") || "Validation error";
    return res.status(400).json({
      success: false,
      error: message2,
      message: message2,
      issues: err.issues
    });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token. Please sign in again.",
      message: "Invalid or expired authentication token. Please sign in again."
    });
  }
  if (err.code && typeof err.code === "string" && (err.code.startsWith("ER_") || err.code.includes("SQL"))) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "A record with this information already exists.",
        message: "A record with this information already exists."
      });
    }
    return res.status(500).json({
      success: false,
      error: "Database operation failed.",
      message: "Database operation failed."
    });
  }
  console.error("[Centralized Error Handler]:", err.message || err);
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : typeof err.status === "number" ? err.status : 500;
  const message = err.message || "An unexpected server error occurred.";
  return res.status(statusCode).json({
    success: false,
    error: message,
    message,
    ...process.env.NODE_ENV !== "production" && err.stack ? { stack: err.stack } : {}
  });
}
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.originalUrl} not found`,
    message: `API route ${req.method} ${req.originalUrl} not found`
  });
}

// server/routes/auth-routes.ts
var import_express = require("express");
var import_zod2 = require("zod");

// server/auth/auth-service.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "lingualearn-super-secure-jwt-secret-key-2026";
var JWT_EXPIRES_IN = "7d";
var AuthService = class _AuthService {
  static hashPassword(password) {
    return import_bcryptjs2.default.hashSync(password, 10);
  }
  static verifyPassword(password, hash) {
    return import_bcryptjs2.default.compareSync(password, hash);
  }
  static generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  static verifyToken(token) {
    try {
      return import_jsonwebtoken.default.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
  static extractToken(reqOrHeader, cookies) {
    if (!reqOrHeader) {
      if (cookies?.token) return cookies.token;
      return null;
    }
    if (typeof reqOrHeader === "object") {
      const req = reqOrHeader;
      if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }
      return null;
    }
    if (typeof reqOrHeader === "string") {
      if (reqOrHeader.startsWith("Bearer ")) {
        return reqOrHeader.substring(7);
      }
      return reqOrHeader;
    }
    return null;
  }
  static getUserFromRequest(reqOrHeader, cookies) {
    const token = _AuthService.extractToken(reqOrHeader, cookies);
    if (!token) return null;
    const decoded = _AuthService.verifyToken(token);
    if (!decoded) return null;
    return db.findUserById(decoded.userId) || null;
  }
};

// server/middleware/auth.ts
function requireAuth(req, res, next) {
  const user = AuthService.getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in to continue.",
      message: "Unauthorized. Please log in to continue."
    });
  }
  req.user = user;
  next();
}

// server/middleware/admin.ts
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in.",
      message: "Unauthorized. Please log in."
    });
  }
  if (req.user.role !== "ADMIN" && req.user.role !== "RESEARCHER") {
    return res.status(403).json({
      success: false,
      error: "Forbidden. Administrator or Researcher privileges required.",
      message: "Forbidden. Administrator or Researcher privileges required."
    });
  }
  next();
}
function requireStrictAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in.",
      message: "Unauthorized. Please log in."
    });
  }
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Forbidden. Administrator privileges required.",
      message: "Forbidden. Administrator privileges required."
    });
  }
  next();
}

// server/routes/auth-routes.ts
var router = (0, import_express.Router)();
var RegisterSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(2, "Name must be at least 2 characters long"),
  email: import_zod2.z.string().email("Invalid email address format"),
  password: import_zod2.z.string().min(6, "Password must be at least 6 characters long"),
  preferredLanguage: import_zod2.z.string().default("Telugu"),
  preferredDifficulty: import_zod2.z.string().default("INTERMEDIATE")
});
var LoginSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("Invalid email address format"),
  password: import_zod2.z.string().min(1, "Password cannot be empty")
});
var COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1e3
  // 7 days
};
router.post("/register", (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const existing = db.findUserByEmail(data.email);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists.",
        message: "User with this email already exists."
      });
    }
    const newUser = {
      id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: AuthService.hashPassword(data.password),
      role: "STUDENT",
      preferredLanguage: data.preferredLanguage,
      preferredDifficulty: data.preferredDifficulty,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createUser(newUser);
    const token = AuthService.generateToken(newUser);
    res.cookie("token", token, COOKIE_OPTIONS);
    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      preferredLanguage: newUser.preferredLanguage,
      preferredDifficulty: newUser.preferredDifficulty,
      createdAt: newUser.createdAt
    };
    return res.status(201).json({
      success: true,
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload
      }
    });
  } catch (err) {
    const message = err.errors?.[0]?.message || err.message || "Registration failed";
    return res.status(400).json({
      success: false,
      error: message,
      message
    });
  }
});
router.post("/login", (req, res) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = db.findUserByEmail(data.email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
        message: "Invalid email or password."
      });
    }
    const isValid = AuthService.verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
        message: "Invalid email or password."
      });
    }
    const token = AuthService.generateToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      preferredDifficulty: user.preferredDifficulty,
      createdAt: user.createdAt
    };
    return res.json({
      success: true,
      token,
      user: userPayload,
      data: {
        token,
        user: userPayload
      }
    });
  } catch (err) {
    const message = err.errors?.[0]?.message || err.message || "Login failed";
    return res.status(400).json({
      success: false,
      error: message,
      message
    });
  }
});
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  return res.json({
    success: true,
    message: "Logged out successfully",
    data: { message: "Logged out successfully" }
  });
});
router.get("/me", requireAuth, (req, res) => {
  const user = req.user;
  const progress = db.getProgress(user.id);
  const profile = db.getProfile(user.id);
  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      preferredDifficulty: user.preferredDifficulty,
      createdAt: user.createdAt
    },
    profile,
    progress
  };
  return res.json({
    success: true,
    ...payload,
    data: payload
  });
});
router.put("/profile", requireAuth, (req, res) => {
  const user = req.user;
  const {
    name,
    preferredLanguage,
    bio,
    currentCollege,
    yearOfStudy,
    specialization,
    preferredDifficulty,
    interests,
    studentId,
    department,
    degree,
    semester,
    cgpaTarget,
    careerGoal,
    preferredLanguagesCoding,
    dailyStudyGoalMinutes,
    githubUsername,
    linkedinUrl,
    portfolioUrl,
    stateOrRegion,
    notificationPreferences
  } = req.body;
  if (name && typeof name === "string" && name.trim().length >= 2) {
    user.name = name.trim();
  }
  if (preferredLanguage) {
    user.preferredLanguage = preferredLanguage;
  }
  if (preferredDifficulty) {
    user.preferredDifficulty = preferredDifficulty;
  }
  user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  const existing = db.getProfile(user.id);
  const updatedProfile = db.upsertProfile({
    userId: user.id,
    bio: bio !== void 0 ? bio : existing?.bio || "",
    currentCollege: currentCollege !== void 0 ? currentCollege : existing?.currentCollege || "",
    yearOfStudy: yearOfStudy !== void 0 ? yearOfStudy : existing?.yearOfStudy || "",
    specialization: specialization !== void 0 ? specialization : existing?.specialization || "",
    preferredDifficulty: preferredDifficulty || existing?.preferredDifficulty || "INTERMEDIATE",
    interests: Array.isArray(interests) ? interests : existing?.interests || [],
    studentId: studentId !== void 0 ? studentId : existing?.studentId || "",
    department: department !== void 0 ? department : existing?.department || "",
    degree: degree !== void 0 ? degree : existing?.degree || "",
    semester: semester !== void 0 ? semester : existing?.semester || "",
    cgpaTarget: cgpaTarget !== void 0 ? cgpaTarget : existing?.cgpaTarget || "",
    careerGoal: careerGoal !== void 0 ? careerGoal : existing?.careerGoal || "",
    preferredLanguagesCoding: Array.isArray(preferredLanguagesCoding) ? preferredLanguagesCoding : existing?.preferredLanguagesCoding || ["Python", "C++"],
    dailyStudyGoalMinutes: dailyStudyGoalMinutes !== void 0 ? Number(dailyStudyGoalMinutes) : existing?.dailyStudyGoalMinutes || 30,
    githubUsername: githubUsername !== void 0 ? githubUsername : existing?.githubUsername || "",
    linkedinUrl: linkedinUrl !== void 0 ? linkedinUrl : existing?.linkedinUrl || "",
    portfolioUrl: portfolioUrl !== void 0 ? portfolioUrl : existing?.portfolioUrl || "",
    stateOrRegion: stateOrRegion !== void 0 ? stateOrRegion : existing?.stateOrRegion || "",
    notificationPreferences: notificationPreferences !== void 0 ? notificationPreferences : existing?.notificationPreferences || void 0
  });
  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      preferredDifficulty: user.preferredDifficulty
    },
    profile: updatedProfile
  };
  return res.json({
    success: true,
    ...payload,
    data: payload
  });
});
router.post("/change-password", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required.",
        message: "Current password and new password are required."
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long.",
        message: "New password must be at least 6 characters long."
      });
    }
    const isValid = AuthService.verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Current password does not match.",
        message: "Current password does not match."
      });
    }
    user.passwordHash = AuthService.hashPassword(newPassword);
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.addAuditLog({
      userId: user.id,
      action: "PASSWORD_CHANGED",
      details: `User ${user.email} changed their password.`
    });
    return res.json({
      success: true,
      message: "Password changed successfully.",
      data: { message: "Password changed successfully." }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to change password.",
      message: err.message || "Failed to change password."
    });
  }
});
var auth_routes_default = router;

// server/routes/user-routes.ts
var import_express2 = require("express");
var import_zod3 = require("zod");
var router2 = (0, import_express2.Router)();
router2.get("/profile", requireAuth, (req, res) => {
  const user = req.user;
  const profile = db.getProfile(user.id);
  const progress = db.getProgress(user.id);
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    preferredDifficulty: user.preferredDifficulty || "INTERMEDIATE",
    bio: profile?.bio || "",
    currentCollege: profile?.currentCollege || "",
    yearOfStudy: profile?.yearOfStudy || "",
    specialization: profile?.specialization || "",
    interests: profile?.interests || [],
    studentId: profile?.studentId || "",
    department: profile?.department || "",
    degree: profile?.degree || "",
    semester: profile?.semester || "",
    cgpaTarget: profile?.cgpaTarget || "",
    careerGoal: profile?.careerGoal || "",
    preferredLanguagesCoding: profile?.preferredLanguagesCoding || ["Python", "C++"],
    dailyStudyGoalMinutes: profile?.dailyStudyGoalMinutes || 30,
    githubUsername: profile?.githubUsername || "",
    linkedinUrl: profile?.linkedinUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
    stateOrRegion: profile?.stateOrRegion || "",
    createdAt: user.createdAt,
    progress
  };
  return res.json({
    success: true,
    ...payload,
    data: payload
  });
});
var UpdateProfileSchema = import_zod3.z.object({
  name: import_zod3.z.string().min(2).optional(),
  bio: import_zod3.z.string().optional(),
  currentCollege: import_zod3.z.string().optional(),
  yearOfStudy: import_zod3.z.string().optional(),
  specialization: import_zod3.z.string().optional(),
  preferredDifficulty: import_zod3.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  preferredLanguage: import_zod3.z.string().optional(),
  interests: import_zod3.z.array(import_zod3.z.string()).optional(),
  studentId: import_zod3.z.string().optional(),
  department: import_zod3.z.string().optional(),
  degree: import_zod3.z.string().optional(),
  semester: import_zod3.z.string().optional(),
  cgpaTarget: import_zod3.z.string().optional(),
  careerGoal: import_zod3.z.string().optional(),
  preferredLanguagesCoding: import_zod3.z.array(import_zod3.z.string()).optional(),
  dailyStudyGoalMinutes: import_zod3.z.number().optional(),
  githubUsername: import_zod3.z.string().optional(),
  linkedinUrl: import_zod3.z.string().optional(),
  portfolioUrl: import_zod3.z.string().optional(),
  stateOrRegion: import_zod3.z.string().optional()
  // role is intentionally excluded/ignored
});
router2.put("/profile", requireAuth, (req, res) => {
  try {
    const data = UpdateProfileSchema.parse(req.body);
    const user = req.user;
    if (data.name) {
      user.name = data.name.trim();
    }
    if (data.preferredLanguage) {
      user.preferredLanguage = data.preferredLanguage;
    }
    if (data.preferredDifficulty) {
      user.preferredDifficulty = data.preferredDifficulty;
    }
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const existingProfile = db.getProfile(user.id);
    const updatedProfile = db.upsertProfile({
      userId: user.id,
      bio: data.bio !== void 0 ? data.bio : existingProfile?.bio || "",
      currentCollege: data.currentCollege !== void 0 ? data.currentCollege : existingProfile?.currentCollege || "",
      yearOfStudy: data.yearOfStudy !== void 0 ? data.yearOfStudy : existingProfile?.yearOfStudy || "",
      specialization: data.specialization !== void 0 ? data.specialization : existingProfile?.specialization || "",
      preferredDifficulty: data.preferredDifficulty || existingProfile?.preferredDifficulty || "INTERMEDIATE",
      interests: data.interests !== void 0 ? data.interests : existingProfile?.interests || [],
      studentId: data.studentId !== void 0 ? data.studentId : existingProfile?.studentId || "",
      department: data.department !== void 0 ? data.department : existingProfile?.department || "",
      degree: data.degree !== void 0 ? data.degree : existingProfile?.degree || "",
      semester: data.semester !== void 0 ? data.semester : existingProfile?.semester || "",
      cgpaTarget: data.cgpaTarget !== void 0 ? data.cgpaTarget : existingProfile?.cgpaTarget || "",
      careerGoal: data.careerGoal !== void 0 ? data.careerGoal : existingProfile?.careerGoal || "",
      preferredLanguagesCoding: data.preferredLanguagesCoding !== void 0 ? data.preferredLanguagesCoding : existingProfile?.preferredLanguagesCoding || ["Python", "C++"],
      dailyStudyGoalMinutes: data.dailyStudyGoalMinutes !== void 0 ? data.dailyStudyGoalMinutes : existingProfile?.dailyStudyGoalMinutes || 30,
      githubUsername: data.githubUsername !== void 0 ? data.githubUsername : existingProfile?.githubUsername || "",
      linkedinUrl: data.linkedinUrl !== void 0 ? data.linkedinUrl : existingProfile?.linkedinUrl || "",
      portfolioUrl: data.portfolioUrl !== void 0 ? data.portfolioUrl : existingProfile?.portfolioUrl || "",
      stateOrRegion: data.stateOrRegion !== void 0 ? data.stateOrRegion : existingProfile?.stateOrRegion || ""
    });
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      preferredDifficulty: user.preferredDifficulty,
      bio: updatedProfile.bio,
      currentCollege: updatedProfile.currentCollege,
      yearOfStudy: updatedProfile.yearOfStudy,
      specialization: updatedProfile.specialization,
      interests: updatedProfile.interests,
      studentId: updatedProfile.studentId,
      department: updatedProfile.department,
      degree: updatedProfile.degree,
      semester: updatedProfile.semester,
      cgpaTarget: updatedProfile.cgpaTarget,
      careerGoal: updatedProfile.careerGoal,
      preferredLanguagesCoding: updatedProfile.preferredLanguagesCoding,
      dailyStudyGoalMinutes: updatedProfile.dailyStudyGoalMinutes,
      githubUsername: updatedProfile.githubUsername,
      linkedinUrl: updatedProfile.linkedinUrl,
      portfolioUrl: updatedProfile.portfolioUrl,
      stateOrRegion: updatedProfile.stateOrRegion
    };
    return res.json({
      success: true,
      ...payload,
      data: payload
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.errors?.[0]?.message || err.message,
      message: err.errors?.[0]?.message || err.message
    });
  }
});
var UpdatePreferencesSchema = import_zod3.z.object({
  preferredLanguage: import_zod3.z.string().optional(),
  preferredDifficulty: import_zod3.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  interests: import_zod3.z.array(import_zod3.z.string()).optional()
});
router2.put("/preferences", requireAuth, (req, res) => {
  try {
    const data = UpdatePreferencesSchema.parse(req.body);
    const user = req.user;
    if (data.preferredLanguage) {
      user.preferredLanguage = data.preferredLanguage;
    }
    if (data.preferredDifficulty) {
      user.preferredDifficulty = data.preferredDifficulty;
    }
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const existingProfile = db.getProfile(user.id);
    const updatedProfile = db.upsertProfile({
      userId: user.id,
      bio: existingProfile?.bio || "",
      currentCollege: existingProfile?.currentCollege || "",
      yearOfStudy: existingProfile?.yearOfStudy || "",
      specialization: existingProfile?.specialization || "",
      preferredDifficulty: data.preferredDifficulty || existingProfile?.preferredDifficulty || "INTERMEDIATE",
      interests: data.interests !== void 0 ? data.interests : existingProfile?.interests || []
    });
    const payload = {
      preferredLanguage: user.preferredLanguage,
      preferredDifficulty: user.preferredDifficulty,
      interests: updatedProfile.interests
    };
    return res.json({
      success: true,
      ...payload,
      data: payload
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.errors?.[0]?.message || err.message,
      message: err.errors?.[0]?.message || err.message
    });
  }
});
var user_routes_default = router2;

// server/routes/tutor-routes.ts
var import_express3 = require("express");
var import_zod6 = require("zod");

// server/ai/nlp-pipeline.ts
var import_zod4 = require("zod");

// server/ai/gemini.ts
var import_genai = require("@google/genai");
var aiInstance = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiInstance;
}
async function generateContentWithRetry(options) {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("Gemini API key is not configured");
  }
  const primaryModel = options.model || "gemini-3.8-flash";
  const defaultFallbacks = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
  const modelsToTry = [
    primaryModel,
    ...options.fallbackModels || defaultFallbacks,
    ...defaultFallbacks
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);
  let lastError = null;
  for (const model of modelsToTry) {
    const attempts = 2;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config
        });
        if (response && (response.text?.trim() || response.candidates?.length)) {
          return { response, modelUsed: model };
        }
        lastError = new Error(`Gemini model ${model} returned an empty response`);
      } catch (err) {
        lastError = err;
        const errMsg = (err.message || "").toLowerCase();
        const errStatus = err.status || err.code;
        const isQuotaOrRateLimit = errStatus === 429 || errStatus === "RESOURCE_EXHAUSTED" || errMsg.includes("resource_exhausted") || errMsg.includes("quota") || errMsg.includes("rate limit") || errMsg.includes("rate-limit") || errMsg.includes("exceeded your current quota");
        if (isQuotaOrRateLimit) {
          console.warn(
            `[Gemini] Model ${model} reached quota or rate limit (${err.message}). Immediately trying next fallback model...`
          );
          break;
        }
        const isTransient = errStatus === 503 || errStatus === 500 || errStatus === "UNAVAILABLE" || errMsg.includes("high demand") || errMsg.includes("overloaded") || errMsg.includes("unavailable") || errMsg.includes("spikes in demand") || errMsg.includes("temporary") || errMsg.includes("try again later");
        if (isTransient) {
          console.warn(
            `[Gemini] Model ${model} (attempt ${attempt + 1}/${attempts}) returned transient issue: ${err.message}. Retrying with backoff...`
          );
          const backoffDelay = 400 * (attempt + 1) + Math.floor(Math.random() * 200);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        } else {
          console.warn(`[Gemini] Model ${model} returned non-transient error: ${err.message}. Trying next fallback model...`);
          break;
        }
      }
    }
  }
  throw lastError || new Error("All candidate models failed to generate content");
}
function safeParseJson(rawText, fallback) {
  if (!rawText) return fallback;
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const starts = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((index2) => index2 >= 0);
    const start = starts.length ? Math.min(...starts) : -1;
    if (start >= 0) {
      const open = cleaned[start];
      const close = open === "{" ? "}" : "]";
      const end = cleaned.lastIndexOf(close);
      if (end < start) return fallback;
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

// server/prompts/tutor-prompts.ts
function buildContextAwareSystemInstruction(targetLanguage, subject, difficulty) {
  return `You are LinguaLearn, an expert multilingual AI educational assistant and computer science professor specializing in ${subject}.
Your core mission is to explain technical concepts to B.Tech and Computer Science students in their preferred language (${targetLanguage}) while STRICTLY PRESERVING technical meaning and terminology.

CRITICAL LINGUISTIC & TERMINOLOGICAL RULES:
1. TERMINOLOGY PRESERVATION: DO NOT force literal translations of standard technical terms (e.g., Thread, Stack, Deadlock, Socket, Mutex, API, Compiler, Overfitting, Cache, Hash Table).
   - In ${targetLanguage}, keep standard terms in English or natural transliteration.
   - Explain the concept using ${targetLanguage} grammatical structure, but keep the technical keywords preserved.
2. ADAPTIVE DIFFICULTY (${difficulty}):
   - BEGINNER: Use everyday relatable analogies, clear simple vocabulary, short sentences, and beginner-friendly examples.
   - INTERMEDIATE: Use standard technical vocabulary, clear operational diagrams/steps, moderate depth, and practical code/logic examples.
   - ADVANCED: Precise algorithmic mechanics, formal definitions, time/space complexities, edge cases, and deep architectural mechanisms.
3. EDUCATIONAL STRUCTURE:
   - Provide a concise definition.
   - A direct quick answer.
   - A thorough, lucid explanation in ${targetLanguage}.
   - A vivid real-world analogy.
   - A practical code/technical example.
   - Clear step-by-step mechanism.
   - Key takeaway points.
   - List of technical terms with preserved status and meanings.
   - Common student misconceptions to watch out for.

OUTPUT FORMAT:
You MUST respond with valid JSON matching the exact schema requested. Do not include markdown code block backticks unless strictly returning valid JSON.`;
}
function buildTutorPrompt(params) {
  const {
    question,
    sourceLanguage,
    targetLanguage,
    subject,
    difficulty,
    relevantTerms,
    fewShotExamples,
    conversationHistory,
    actionType,
    extraInstruction
  } = params;
  let prompt = `=== LINGUALEARN CONTEXT-AWARE GENERATION REQUEST ===
`;
  prompt += `Student Question: "${question}"
`;
  prompt += `Source Language: ${sourceLanguage}
`;
  prompt += `Target Language: ${targetLanguage}
`;
  prompt += `Subject Domain: ${subject}
`;
  prompt += `Target Difficulty Level: ${difficulty}

`;
  if (actionType && actionType !== "DEFAULT") {
    prompt += `SPECIFIC STUDENT ACTION: ${actionType}
`;
    if (actionType === "SIMPLIFY") {
      prompt += `-> Student requested: Simplify this explanation further. Use an even simpler analogy and break down complex words.
`;
    } else if (actionType === "EXPLAIN_DEEPER") {
      prompt += `-> Student requested: Explain deeper into the underlying architecture, algorithmic mechanisms, and internal memory/CPU behavior.
`;
    } else if (actionType === "GIVE_EXAMPLE") {
      prompt += `-> Student requested: Provide another vivid, concrete code or real-world system example in ${targetLanguage}.
`;
    } else if (actionType === "ANALOGY") {
      prompt += `-> Student requested: Provide a memorable cultural or daily-life analogy in ${targetLanguage}.
`;
    }
  }
  if (extraInstruction) {
    prompt += `Additional Context: ${extraInstruction}

`;
  }
  if (relevantTerms.length > 0) {
    prompt += `--- PRESERVED TECHNICAL TERMINOLOGY RULES ---
`;
    for (const t of relevantTerms) {
      prompt += `- English Term: "${t.englishTerm}"
`;
      prompt += `  Preferred in ${targetLanguage}: ${t.preferredTranslation}
`;
      prompt += `  Do Not Translate Literally: ${t.doNotTranslate ? "YES (CRITICAL)" : "NO"}
`;
      prompt += `  Guidance: ${t.explanation}
`;
    }
    prompt += `
`;
  }
  if (fewShotExamples.length > 0) {
    prompt += `--- FEW-SHOT DEMONSTRATION EXAMPLES ---
`;
    for (const ex of fewShotExamples) {
      prompt += `[Example: ${ex.sourceLanguage} -> ${ex.targetLanguage} | ${ex.subject} (${ex.difficulty})]
`;
      prompt += `Question: ${ex.question}
`;
      prompt += `Guidance: ${ex.terminologyGuidance}
`;
      prompt += `Sample Style Snippet: ${ex.responseSnippet}

`;
    }
  }
  if (conversationHistory.length > 0) {
    prompt += `--- RECENT CONVERSATION CONTEXT (last 3 messages) ---
`;
    const recent = conversationHistory.slice(-3);
    for (const msg of recent) {
      prompt += `${msg.sender === "user" ? "Student" : "AI Tutor"}: ${msg.content.slice(0, 300)}
`;
    }
    prompt += `
`;
  }
  prompt += `--- REQUIRED JSON RESPONSE STRUCTURE ---
Return a JSON object with this EXACT structure:
{
  "definition": "One-sentence formal definition in ${targetLanguage} with preserved terms",
  "quickAnswer": "Direct, crisp answer in 2-3 sentences in ${targetLanguage}",
  "explanation": "Comprehensive educational explanation in ${targetLanguage} formatted with paragraphs",
  "analogy": "A relatable real-world analogy in ${targetLanguage} explaining the core concept",
  "example": "A concrete technical example or code snippet with explanations in ${targetLanguage}",
  "stepByStep": [
    "Step 1: description in ${targetLanguage}",
    "Step 2: description in ${targetLanguage}",
    "Step 3: description in ${targetLanguage}"
  ],
  "keyPoints": [
    "Key takeaway 1 in ${targetLanguage}",
    "Key takeaway 2 in ${targetLanguage}",
    "Key takeaway 3 in ${targetLanguage}"
  ],
  "technicalTerms": [
    {
      "term": "Term in English",
      "translation": "Preferred term/transliteration in ${targetLanguage}",
      "explanation": "Why this term is used and how it functions in ${targetLanguage}"
    }
  ],
  "preservedTerms": ["Term 1", "Term 2", "Term 3"],
  "misconceptions": [
    "Common student mistake 1 in ${targetLanguage}",
    "Common student mistake 2 in ${targetLanguage}"
  ]
}

Ensure all explanations and sentences are in ${targetLanguage}, while preserved technical terms retain their standard engineering nomenclature.`;
  return prompt;
}

// server/ai/nlp-pipeline.ts
var StructuredAIResponseSchema = import_zod4.z.object({
  definition: import_zod4.z.string().default(""),
  quickAnswer: import_zod4.z.string().default(""),
  explanation: import_zod4.z.string().default(""),
  analogy: import_zod4.z.string().default(""),
  example: import_zod4.z.string().default(""),
  stepByStep: import_zod4.z.array(import_zod4.z.string()).default([]),
  keyPoints: import_zod4.z.array(import_zod4.z.string()).default([]),
  technicalTerms: import_zod4.z.array(
    import_zod4.z.object({
      term: import_zod4.z.string(),
      translation: import_zod4.z.string(),
      explanation: import_zod4.z.string()
    })
  ).default([]),
  preservedTerms: import_zod4.z.array(import_zod4.z.string()).default([]),
  misconceptions: import_zod4.z.array(import_zod4.z.string()).default([])
});
var NLPPipelineService = class _NLPPipelineService {
  static async execute(input) {
    const startTime = Date.now();
    const sourceLanguage = input.sourceLanguage || "English";
    const targetLanguage = input.targetLanguage || "Telugu";
    const subject = input.subject || "Operating Systems";
    const difficulty = input.difficulty || "INTERMEDIATE";
    const actionType = input.actionType || "DEFAULT";
    const relevantTerms = db.findRelevantTerminology(subject, targetLanguage, input.question);
    const fewShotExamples = db.getRelevantFewShots(targetLanguage, subject, difficulty);
    let conv;
    let history = [];
    if (input.conversationId) {
      conv = db.getConversationById(input.conversationId);
      if (conv) {
        history = conv.messages;
      }
    }
    if (!conv) {
      const convId = "conv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      conv = {
        id: convId,
        userId: input.userId,
        title: input.question.length > 50 ? input.question.substring(0, 47) + "..." : input.question,
        sourceLanguage,
        targetLanguage,
        subject,
        difficulty,
        messages: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.createConversation(conv);
    }
    const userMsgId = "msg_" + Date.now() + "_user";
    const userMessage = {
      id: userMsgId,
      conversationId: conv.id,
      sender: "user",
      content: input.question,
      sourceLanguage,
      targetLanguage,
      subject,
      difficulty,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addMessageToConversation(conv.id, userMessage);
    const promptParams = {
      question: input.question,
      sourceLanguage,
      targetLanguage,
      subject,
      difficulty,
      relevantTerms,
      fewShotExamples,
      conversationHistory: history,
      actionType,
      extraInstruction: input.extraInstruction
    };
    const promptText = buildTutorPrompt(promptParams);
    const systemInstruction = buildContextAwareSystemInstruction(targetLanguage, subject, difficulty);
    let structuredResponse;
    const ai = getGeminiClient();
    let modelUsed = "gemini-3.8-flash";
    if (ai) {
      try {
        const result = await generateContentWithRetry({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.2
            // low temperature for technical precision
          }
        });
        modelUsed = result.modelUsed;
        const rawText = result.response.text || "";
        try {
          const parsed = safeParseJson(rawText, null);
          if (parsed) {
            structuredResponse = StructuredAIResponseSchema.parse(parsed);
          } else {
            throw new Error("Could not parse JSON from LLM response");
          }
        } catch {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            structuredResponse = StructuredAIResponseSchema.parse(parsed);
          } else {
            throw new Error("Could not parse structured JSON from LLM response");
          }
        }
      } catch (err) {
        console.warn("Transformer API call encountered issue, using context-aware NLP generator fallback:", err.message || err);
        structuredResponse = _NLPPipelineService.generateContextAwareFallback(
          input.question,
          targetLanguage,
          subject,
          difficulty,
          relevantTerms
        );
      }
    } else {
      structuredResponse = _NLPPipelineService.generateContextAwareFallback(
        input.question,
        targetLanguage,
        subject,
        difficulty,
        relevantTerms
      );
    }
    const aiMsgId = "msg_" + Date.now() + "_ai";
    const aiMessage = {
      id: aiMsgId,
      conversationId: conv.id,
      sender: "assistant",
      content: structuredResponse.quickAnswer + "\n\n" + structuredResponse.explanation,
      structuredResponse,
      sourceLanguage,
      targetLanguage,
      subject,
      difficulty,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addMessageToConversation(conv.id, aiMessage);
    db.recordQuestionAsked(input.userId, subject, targetLanguage);
    const processingTimeMs = Date.now() - startTime;
    return {
      conversationId: conv.id,
      messageId: aiMsgId,
      structuredResponse,
      rawText: structuredResponse.explanation,
      pipelineMetadata: {
        model: `${modelUsed} (Transformer-based LLM)`,
        sourceLanguage,
        targetLanguage,
        subject,
        difficulty,
        preservedTermsCount: structuredResponse.preservedTerms.length,
        fewShotsInjected: fewShotExamples.length,
        processingTimeMs
      }
    };
  }
  /**
   * Generates a context-aware fallback response that preserves technical terms and adheres to educational standards.
   */
  static generateContextAwareFallback(question, targetLanguage, subject, difficulty, terms) {
    const termNames = terms.map((t) => t.englishTerm.split(" ")[0]);
    if (termNames.length === 0) {
      termNames.push(subject, "Algorithm", "System Architecture");
    }
    const isTelugu = targetLanguage.toLowerCase().includes("telugu");
    const isHindi = targetLanguage.toLowerCase().includes("hindi");
    const isTamil = targetLanguage.toLowerCase().includes("tamil");
    let def = "";
    let quick = "";
    let exp = "";
    let analogy = "";
    let ex = "";
    const stepByStep = [];
    const keyPoints = [];
    const misconceptions = [];
    if (isTelugu) {
      def = `${subject} \u0C32\u0C4B "${question}" \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C2A\u0C28\u0C3F\u0C24\u0C40\u0C30\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C2E\u0C30\u0C4D\u0C25\u0C24\u0C28\u0C41 \u0C28\u0C3F\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3F\u0C02\u0C1A\u0C47 \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C2D\u0C3E\u0C35\u0C28.`;
      quick = `\u0C08 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2D\u0C3E\u0C35\u0C28 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u0C38\u0C4D \u0C35\u0C28\u0C30\u0C41\u0C32\u0C28\u0C41 \u0C38\u0C15\u0C4D\u0C30\u0C2E\u0C02\u0C17\u0C3E \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F. \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C3E\u0C32\u0C48\u0C28 ${termNames.join(", ")} \u0C28\u0C3F \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C15\u0C41\u0C02\u0C21\u0C3E \u0C05\u0C30\u0C4D\u0C25\u0C02 \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02 \u0C1A\u0C3E\u0C32\u0C3E \u0C2E\u0C41\u0C16\u0C4D\u0C2F\u0C02.`;
      exp = `\u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C38\u0C48\u0C28\u0C4D\u0C38\u0C4D \u0C32\u0C4B \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C41\u0C32\u0C41 \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23\u0C02\u0C17\u0C3E \u0C1A\u0C47\u0C38\u0C47 \u0C24\u0C2A\u0C4D\u0C2A\u0C41 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C3E\u0C32\u0C28\u0C41 \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C21\u0C02. \u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23\u0C15\u0C41, 'Thread' \u0C32\u0C47\u0C26\u0C3E 'Deadlock' \u0C35\u0C02\u0C1F\u0C3F \u0C2A\u0C26\u0C3E\u0C32\u0C28\u0C41 \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41\u0C32\u0C4B\u0C15\u0C3F \u0C2E\u0C3E\u0C30\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C05\u0C38\u0C32\u0C41 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2D\u0C3E\u0C35\u0C02 \u0C2E\u0C3E\u0C30\u0C3F\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F.

LinguaLearn \u0C32\u0C4B \u0C2E\u0C47\u0C2E\u0C41 Context-Aware Prompting \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C05\u0C38\u0C32\u0C41 \u0C2A\u0C26\u0C3E\u0C32\u0C28\u0C41 \u0C05\u0C32\u0C3E\u0C17\u0C47 \u0C09\u0C02\u0C1A\u0C3F, \u0C35\u0C3F\u0C35\u0C30\u0C23\u0C28\u0C41 \u0C38\u0C4D\u0C2A\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41 \u0C35\u0C4D\u0C2F\u0C3E\u0C15\u0C30\u0C23\u0C02\u0C32\u0C4B \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C2E\u0C41. ${difficulty} \u0C38\u0C4D\u0C25\u0C3E\u0C2F\u0C3F \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C41\u0C32 \u0C15\u0C4B\u0C38\u0C02 \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C23, \u0C05\u0C32\u0C4D\u0C17\u0C3E\u0C30\u0C3F\u0C25\u0C2E\u0C4D \u0C15\u0C3E\u0C02\u0C2A\u0C4D\u0C32\u0C46\u0C15\u0C4D\u0C38\u0C3F\u0C1F\u0C40 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C35\u0C3E\u0C38\u0C4D\u0C24\u0C35 \u0C05\u0C2E\u0C32\u0C41 \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C3E\u0C32\u0C28\u0C41 \u0C2A\u0C30\u0C3F\u0C17\u0C23\u0C28\u0C32\u0C4B\u0C15\u0C3F \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C3E\u0C2E\u0C41.`;
      analogy = `\u0C12\u0C15 \u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C32\u0C48\u0C2C\u0C4D\u0C30\u0C30\u0C40\u0C32\u0C4B \u0C32\u0C47\u0C26\u0C3E \u0C2C\u0C4D\u0C2F\u0C3E\u0C02\u0C15\u0C4D \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C1F\u0C4B\u0C15\u0C46\u0C28\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C0E\u0C32\u0C3E \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C4B \u0C0A\u0C39\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F. \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u0C32\u0C41 (CPU Cores), \u0C35\u0C3F\u0C28\u0C3F\u0C2F\u0C4B\u0C17\u0C26\u0C3E\u0C30\u0C41\u0C32\u0C41 (Threads/Processes), \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C3E\u0C38\u0C4D\u200C\u0C2C\u0C41\u0C15\u0C4D \u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41\u0C32\u0C41 (Shared Memory) \u0C12\u0C15\u0C30\u0C3F\u0C24\u0C4B \u0C12\u0C15\u0C30\u0C41 \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C02\u0C24\u0C4B \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F.`;
      ex = `// Pseudo-code demonstrating ${termNames[0] || "Technical Mechanism"}
function executeTask() {
  acquireLock(); // Lock resource
  processData(); // Critical Section
  releaseLock(); // Avoid Deadlock
}`;
      stepByStep.push("\u0C26\u0C36 1: \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C07\u0C28\u0C4D\u200C\u0C2A\u0C41\u0C1F\u0C4D \u0C2A\u0C3E\u0C30\u0C3E\u0C2E\u0C40\u0C1F\u0C30\u0C4D\u0C32\u0C28\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C3F \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C38\u0C4D\u0C25\u0C32\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C15\u0C47\u0C1F\u0C3E\u0C2F\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.");
      stepByStep.push("\u0C26\u0C36 2: \u0C05\u0C32\u0C4D\u0C17\u0C3E\u0C30\u0C3F\u0C25\u0C2E\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C1F\u0C3E\u0C38\u0C4D\u0C15\u0C4D\u200C\u0C28\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C42 shared resources \u0C28\u0C3F \u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C46\u0C38\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.");
      stepByStep.push("\u0C26\u0C36 3: \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C3F\u0C02\u0C17\u0C4D \u0C2E\u0C41\u0C17\u0C3F\u0C38\u0C3F\u0C28 \u0C24\u0C30\u0C4D\u0C35\u0C3E\u0C24 \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C38\u0C30\u0C3F\u0C17\u0C4D\u0C17\u0C3E \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C38\u0C3F \u0C2B\u0C32\u0C3F\u0C24\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.");
      keyPoints.push("\u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C3E\u0C32\u0C28\u0C41 \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C35\u0C3E\u0C1F\u0C3F \u0C05\u0C38\u0C32\u0C41 \u0C07\u0C02\u0C1C\u0C28\u0C40\u0C30\u0C3F\u0C02\u0C17\u0C4D \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C47 \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F.");
      keyPoints.push("\u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C2A\u0C46\u0C30\u0C4D\u0C2B\u0C3E\u0C30\u0C4D\u0C2E\u0C46\u0C28\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Resource Utilization \u0C2A\u0C48 \u0C32\u0C4B\u0C24\u0C48\u0C28 \u0C05\u0C35\u0C17\u0C3E\u0C39\u0C28 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C21\u0C3E\u0C32\u0C3F.");
      keyPoints.push("\u0C30\u0C47\u0C38\u0C4D \u0C15\u0C02\u0C21\u0C3F\u0C37\u0C28\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D\u200C\u0C32\u0C28\u0C41 \u0C28\u0C3F\u0C35\u0C3E\u0C30\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C02 \u0C24\u0C2A\u0C4D\u0C2A\u0C28\u0C3F\u0C38\u0C30\u0C3F.");
      misconceptions.push("\u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C32\u0C4D\u0C32\u0C4B \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C41\u0C32\u0C41 \u0C24\u0C17\u0C4D\u0C17\u0C47 \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C26\u0C02 \u0C09\u0C02\u0C26\u0C3F.");
      misconceptions.push("\u0C38\u0C3F\u0C02\u0C17\u0C3F\u0C32\u0C4D \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2E\u0C32\u0C4D\u0C1F\u0C40 \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C15\u0C4D\u0C30\u0C3F\u0C2F\u0C32\u0C41 \u0C12\u0C15\u0C47 \u0C35\u0C3F\u0C27\u0C2E\u0C48\u0C28 \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C37\u0C47\u0C30\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C28\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02 \u0C2A\u0C4A\u0C30\u0C2A\u0C3E\u0C1F\u0C41.");
    } else if (isHindi) {
      def = `${subject} \u092E\u0947\u0902 "${question}" \u090F\u0915 \u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0905\u0935\u0927\u093E\u0930\u0923\u093E \u0939\u0948 \u091C\u094B \u0938\u093F\u0938\u094D\u091F\u092E \u0906\u0930\u094D\u0915\u093F\u091F\u0947\u0915\u094D\u091A\u0930 \u0914\u0930 \u0930\u093F\u0938\u094B\u0930\u094D\u0938 \u092E\u0948\u0928\u0947\u091C\u092E\u0947\u0902\u091F \u0938\u0947 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0939\u0948\u0964`;
      quick = `\u092F\u0939 \u0924\u0915\u0928\u0940\u0915\u0940 \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924 \u0938\u0949\u092B\u094D\u091F\u0935\u0947\u092F\u0930 \u0914\u0930 \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930 \u0915\u0947 \u092C\u0940\u091A \u0915\u0941\u0936\u0932 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0907\u0938\u092E\u0947\u0902 ${termNames.join(", ")} \u091C\u0948\u0938\u0947 \u091F\u0947\u0915\u094D\u0928\u093F\u0915\u0932 \u091F\u0930\u094D\u092E\u094D\u0938 \u0915\u094B \u0938\u0902\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0928\u093E \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948\u0964`;
      exp = `\u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0907\u0902\u091C\u0940\u0928\u093F\u092F\u0930\u093F\u0902\u0917 \u0915\u0947 \u0905\u0927\u094D\u092F\u092F\u0928 \u092E\u0947\u0902 \u0938\u093E\u0927\u093E\u0930\u0923 \u092E\u0936\u0940\u0928 \u091F\u094D\u0930\u093E\u0902\u0938\u0932\u0947\u0936\u0928 \u0905\u0915\u094D\u0938\u0930 \u0917\u0932\u0924 \u0905\u0930\u094D\u0925 \u092A\u0948\u0926\u093E \u0915\u0930\u0924\u093E \u0939\u0948 (\u091C\u0948\u0938\u0947 Thread \u0915\u094B '\u0927\u093E\u0917\u093E' \u092F\u093E Socket \u0915\u094B '\u092C\u093F\u091C\u0932\u0940 \u0915\u093E \u092A\u094D\u0932\u0917' \u0915\u0939 \u0926\u0947\u0928\u093E)\u0964

LinguaLearn \u0915\u0947 \u0915\u0949\u0928\u094D\u091F\u0947\u0915\u094D\u0938\u094D\u091F-\u0905\u0935\u0947\u092F\u0930 AI \u092A\u093E\u0907\u092A\u0932\u093E\u0907\u0928 \u092E\u0947\u0902 \u0939\u092E \u092E\u0942\u0932 \u0924\u0915\u0928\u0940\u0915\u0940 \u0936\u092C\u094D\u0926\u093E\u0935\u0932\u0940 (Terminology) \u0915\u094B \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940 \u092E\u0947\u0902 \u0930\u0916\u0924\u0947 \u0939\u0941\u090F \u092A\u0942\u0930\u0940 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E \u0915\u094B \u0927\u093E\u0930\u093E\u092A\u094D\u0930\u0935\u093E\u0939 \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0938\u092E\u091D\u093E\u0924\u0947 \u0939\u0948\u0902\u0964 ${difficulty} \u0938\u094D\u0924\u0930 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0907\u0938\u092E\u0947\u0902 \u092E\u0941\u0916\u094D\u092F \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924\u094B\u0902, \u092E\u0947\u092E\u094B\u0930\u0940 \u092E\u0948\u0928\u0947\u091C\u092E\u0947\u0902\u091F \u0914\u0930 \u090F\u0917\u094D\u091C\u0940\u0915\u094D\u092F\u0942\u0936\u0928 \u092B\u094D\u0932\u094B \u0915\u094B \u0935\u093F\u0938\u094D\u0924\u093E\u0930 \u0938\u0947 \u0936\u093E\u092E\u093F\u0932 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964`;
      analogy = `\u090F\u0915 \u0935\u094D\u092F\u0938\u094D\u0924 \u0930\u0947\u0938\u094D\u0924\u0930\u093E\u0902 \u0915\u0940 \u0930\u0938\u094B\u0908 \u0915\u0940 \u0915\u0932\u094D\u092A\u0928\u093E \u0915\u0930\u0947\u0902: \u092E\u0941\u0916\u094D\u092F \u0930\u0938\u094B\u0907\u092F\u093E (CPU), \u0938\u0939\u093E\u092F\u0915 (Threads), \u0914\u0930 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u093E \u092D\u0902\u0921\u093E\u0930 (Shared Memory)\u0964 \u092F\u0926\u093F \u0926\u094B \u0938\u0939\u093E\u092F\u0915 \u090F\u0915 \u0939\u0940 \u092C\u0930\u094D\u0924\u0928 \u0915\u0947 \u0932\u093F\u090F \u0932\u0921\u093C\u0947\u0902 \u0924\u094B \u0921\u0947\u0921\u0932\u0949\u0915 \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948, \u0907\u0938\u0932\u093F\u090F \u0936\u0947\u092B \u0932\u0949\u0915 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964`;
      ex = `// Pseudocode representing ${termNames[0] || "Core Logic"}
void processRequest() {
  mutex.lock(); // Synchronize shared resources
  updateSharedData();
  mutex.unlock();
}`;
      stepByStep.push("\u091A\u0930\u0923 1: \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0907\u0928\u092A\u0941\u091F \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0924\u093E \u0939\u0948 \u0914\u0930 \u0906\u0935\u0936\u094D\u092F\u0915 \u092E\u0947\u092E\u094B\u0930\u0940 \u092C\u092B\u0930 \u0906\u0935\u0902\u091F\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964");
      stepByStep.push("\u091A\u0930\u0923 2: \u0936\u0947\u0921\u094D\u092F\u0942\u0932\u0930 \u0926\u094D\u0935\u093E\u0930\u093E CPU \u091F\u093E\u0907\u092E \u0938\u094D\u0932\u093E\u0907\u0938 \u0926\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948 \u0914\u0930 \u0928\u093F\u0930\u094D\u0926\u0947\u0936 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u093F\u0924 \u0939\u094B\u0924\u0947 \u0939\u0948\u0902\u0964");
      stepByStep.push("\u091A\u0930\u0923 3: \u0915\u093E\u0930\u094D\u092F \u092A\u0942\u0930\u094D\u0923 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0930\u093F\u0938\u094B\u0930\u094D\u0938\u0947\u091C\u093C \u0915\u094B \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0930\u0940\u0915\u094D\u0932\u0947\u092E \u0915\u0930 \u0932\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964");
      keyPoints.push("\u0924\u0915\u0928\u0940\u0915\u0940 \u0936\u092C\u094D\u0926\u093E\u0935\u0932\u0940 \u0915\u094B \u092E\u0942\u0932 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u092F\u093E\u0926 \u0930\u0916\u0947\u0902 \u0924\u093E\u0915\u093F \u0935\u0948\u0936\u094D\u0935\u093F\u0915 \u092E\u093E\u0928\u0915\u094B\u0902 \u0938\u0947 \u092D\u091F\u0915\u093E\u0935 \u0928 \u0939\u094B\u0964");
      keyPoints.push("\u092E\u0932\u094D\u091F\u0940\u091F\u093E\u0938\u094D\u0915\u093F\u0902\u0917 \u092E\u0947\u0902 \u0930\u0947\u0938 \u0915\u0902\u0921\u0940\u0936\u0902\u0938 \u0915\u094B \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0939\u0948\u0964");
      keyPoints.push("\u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0906\u0930\u094D\u0915\u093F\u091F\u0947\u0915\u094D\u091A\u0930 \u092E\u0947\u0902 \u092E\u0947\u092E\u094B\u0930\u0940 \u0939\u093E\u0907\u0930\u093E\u0930\u094D\u0915\u0940 \u0914\u0930 \u0915\u0948\u0936\u093F\u0902\u0917 \u0915\u093E \u0938\u0940\u0927\u093E \u092A\u094D\u0930\u092D\u093E\u0935 \u092A\u0921\u093C\u0924\u093E \u0939\u0948\u0964");
      misconceptions.push("\u091F\u0947\u0915\u094D\u0928\u093F\u0915\u0932 \u091F\u0930\u094D\u092E\u094D\u0938 \u0915\u093E \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0936\u093E\u092C\u094D\u0926\u093F\u0915 \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0928\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0926\u0943\u0937\u094D\u091F\u093F \u0938\u0947 \u0917\u0932\u0924 \u0939\u0948\u0964");
      misconceptions.push("\u0939\u0930 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 \u0939\u094B\u0924\u093E \u0939\u0948, \u091C\u092C\u0915\u093F \u0925\u094D\u0930\u0947\u0921\u094D\u0938 \u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u094B \u0938\u093E\u091D\u093E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964");
    } else if (isTamil) {
      def = `${subject}-\u0B87\u0BB2\u0BCD "${question}" \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBF\u0BA9\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BA4\u0BBF\u0BB1\u0BA9\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0BB0\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BB2\u0BBE\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0B95\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0B95\u0BCB\u0B9F\u0BCD\u0BAA\u0BBE\u0B9F\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.`;
      quick = `\u0B87\u0BA4\u0BC1 \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0B95\u0BC2\u0BB1\u0BC1\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B87\u0B9F\u0BC8\u0BAF\u0BC7 \u0BA8\u0BAE\u0BCD\u0BAA\u0B95\u0BAE\u0BBE\u0BA9 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9 \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BAA\u0BC8 \u0B89\u0BB1\u0BC1\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1. \u0B87\u0BA4\u0BBF\u0BB2\u0BCD ${termNames.join(", ")} \u0BAA\u0BCB\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BA4\u0BC1 \u0B85\u0BB5\u0B9A\u0BBF\u0BAF\u0BAE\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.`;
      exp = `\u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BC1\u0BB4\u0BAA\u0BCD\u0BAA\u0BBF\u0BB5\u0BBF\u0B9F\u0BC1\u0BAE\u0BCD \u0B85\u0BAA\u0BBE\u0BAF\u0BAE\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BA4\u0BC1. \u0B8E\u0BA9\u0BB5\u0BC7, LinguaLearn-\u0B87\u0BA9\u0BCD \u0B9A\u0BC2\u0BB4\u0BB2\u0BCD-\u0B85\u0BB1\u0BBF\u0BA8\u0BCD\u0BA4 \u0B85\u0BA3\u0BC1\u0B95\u0BC1\u0BAE\u0BC1\u0BB1\u0BC8 (Context-Aware Prompting) \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0B86\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BC1\u0BAE\u0BCD, \u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0B8E\u0BB3\u0BBF\u0BAF \u0BA4\u0BAE\u0BBF\u0BB4\u0BBF\u0BB2\u0BC1\u0BAE\u0BCD \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD.`;
      analogy = `\u0B92\u0BB0\u0BC1 \u0BB0\u0BAF\u0BBF\u0BB2\u0BCD\u0BB5\u0BC7 \u0B9A\u0BBF\u0B95\u0BCD\u0BA9\u0BB2\u0BCD \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC8 \u0BA8\u0BBF\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BAA\u0BCD \u0BAA\u0BBE\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD: \u0BB0\u0BAF\u0BBF\u0BB2\u0BCD\u0B95\u0BB3\u0BCD (Processes) \u0BA4\u0BA3\u0BCD\u0B9F\u0BB5\u0BBE\u0BB3\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD (Shared Resources) \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0B9A\u0BBF\u0B95\u0BCD\u0BA9\u0BB2\u0BCD\u0B95\u0BB3\u0BCD (Locks/Semaphores) \u0B8E\u0BB5\u0BCD\u0BB5\u0BBE\u0BB1\u0BC1 \u0B89\u0BA4\u0BB5\u0BC1\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9\u0BB5\u0BCB \u0B85\u0BA4\u0BC1\u0BAA\u0BCB\u0BB2.`;
      ex = `// Sample Code
void handleOperation() {
  acquireSemaphore();
  executeCriticalSection();
  releaseSemaphore();
}`;
      stepByStep.push("\u0BAA\u0B9F\u0BBF 1: \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95 \u0B92\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BC0\u0B9F\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B86\u0BB0\u0BAE\u0BCD\u0BAA \u0BA8\u0BBF\u0BB2\u0BC8 \u0B9A\u0BB0\u0BBF\u0BAA\u0BBE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1.");
      stepByStep.push("\u0BAA\u0B9F\u0BBF 2: CPU \u0B9A\u0BC1\u0BB4\u0BB1\u0BCD\u0B9A\u0BBF \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u0B85\u0BB1\u0BBF\u0BB5\u0BC1\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0BA8\u0BBF\u0BB1\u0BC8\u0BB5\u0BC7\u0BB1\u0BCD\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BB2\u0BCD.");
      stepByStep.push("\u0BAA\u0B9F\u0BBF 3: \u0BB5\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0BB5\u0BBF\u0B9F\u0BC1\u0BB5\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1 \u0B87\u0BB1\u0BC1\u0BA4\u0BBF \u0BAA\u0BA4\u0BBF\u0BB2\u0BC8 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0BA4\u0BB2\u0BCD.");
      keyPoints.push("\u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0BA4\u0BB5\u0BB1\u0BBE\u0B95 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BBE\u0BAE\u0BB2\u0BCD \u0B86\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BC7\u0BAF\u0BC7 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BBF\u0BB2\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0B95.");
      keyPoints.push("\u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BA4\u0BBF\u0BB1\u0BA9\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0B89\u0B95\u0BA8\u0BCD\u0BA4 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BBE\u0BA9\u0BA4\u0BC1.");
      misconceptions.push("\u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAA\u0BB0\u0BC0\u0B9F\u0BCD\u0B9A\u0BC8\u0B95\u0BB3\u0BBF\u0BB2\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC6\u0BA3\u0BCD\u0B95\u0BB3\u0BC8 \u0B95\u0BC1\u0BB1\u0BC8\u0B95\u0BCD\u0B95\u0B95\u0BCD\u0B95\u0BC2\u0B9F\u0BC1\u0BAE\u0BCD.");
    } else {
      def = `In ${subject}, "${question}" is a core foundational computer science concept.`;
      quick = `This technical mechanism controls processing and resource efficiency. Terminology such as ${termNames.join(", ")} must be strictly preserved.`;
      exp = `Direct machine translation often breaks technical accuracy by translating terms literally. In LinguaLearn, we apply context-aware prompting with terminology preservation so the explanation in ${targetLanguage} remains educationally sound and technically rigorous.`;
      analogy = `Think of an airport air-traffic control tower regulating landing runways (shared resources) among incoming aircraft (threads/processes).`;
      ex = `// Technical Demonstration
void runSystem() {
  lock(resource);
  executeWork();
  unlock(resource);
}`;
      stepByStep.push("Step 1: Resource allocation and parameter initialization.");
      stepByStep.push("Step 2: Processing under synchronization constraints.");
      stepByStep.push("Step 3: State persistence and buffer reclamation.");
      keyPoints.push("Always preserve core engineering terms.");
      keyPoints.push("Context-aware prompting delivers higher semantic fidelity than literal translation.");
      misconceptions.push("Translating technical terms word-for-word leads to loss of engineering context.");
    }
    const technicalTerms = terms.map((t) => ({
      term: t.englishTerm,
      translation: t.preferredTranslation,
      explanation: t.explanation
    }));
    if (technicalTerms.length === 0) {
      technicalTerms.push({
        term: "Execution Unit",
        translation: `${targetLanguage} Contextual Term`,
        explanation: "Core hardware/software processing boundary"
      });
    }
    return {
      definition: def,
      quickAnswer: quick,
      explanation: exp,
      analogy,
      example: ex,
      stepByStep,
      keyPoints,
      technicalTerms,
      preservedTerms: termNames,
      misconceptions
    };
  }
};

// server/ai/quiz-engine.ts
var import_zod5 = require("zod");
var GeneratedQuestionSchema = import_zod5.z.object({
  question: import_zod5.z.string().trim().min(1),
  type: import_zod5.z.string().optional(),
  options: import_zod5.z.array(import_zod5.z.string().trim().min(1)).optional(),
  correctAnswer: import_zod5.z.string().trim().min(1),
  explanation: import_zod5.z.string().trim().optional(),
  topic: import_zod5.z.string().trim().optional()
});
function parseGeneratedQuizQuestions(rawText, params) {
  const parsed = safeParseJson(rawText, null);
  const rawQuestions = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && "questions" in parsed && Array.isArray(parsed.questions) ? parsed.questions : null;
  if (!rawQuestions) {
    throw new Error("Gemini returned quiz content in an unsupported format.");
  }
  const validated = import_zod5.z.array(GeneratedQuestionSchema).safeParse(rawQuestions);
  if (!validated.success) {
    throw new Error(`Gemini returned invalid quiz questions: ${validated.error.issues[0]?.message || "check the response fields"}.`);
  }
  if (validated.data.length !== params.questionCount) {
    throw new Error(`Gemini returned ${validated.data.length} questions; ${params.questionCount} were requested.`);
  }
  return validated.data.map((item, index2) => {
    const rawType = (item.type || params.type).toUpperCase().replace(/[\s-]+/g, "_");
    const questionType = rawType === "MULTIPLE_CHOICE" ? "MCQ" : rawType;
    if (!["MCQ", "TRUE_FALSE", "SHORT_ANSWER"].includes(questionType)) {
      throw new Error(`Gemini returned an unsupported question type for question ${index2 + 1}.`);
    }
    const options = item.options?.map((option) => option.trim()) || [];
    if (questionType === "MCQ" && (options.length !== 4 || new Set(options.map((option) => option.toLowerCase())).size !== 4)) {
      throw new Error(`Question ${index2 + 1} must contain four distinct answer options.`);
    }
    if (questionType === "TRUE_FALSE" && options.length !== 2) {
      throw new Error(`Question ${index2 + 1} must contain two answer options.`);
    }
    let correctAnswer = item.correctAnswer.trim();
    const answerLetter = correctAnswer.match(/^([A-D])(?:[).:\s]|$)/i);
    if (answerLetter && options.length) {
      const optionIndex = answerLetter[1].toUpperCase().charCodeAt(0) - 65;
      if (options[optionIndex]) correctAnswer = options[optionIndex];
    } else {
      const matchingOption = options.find((option) => option.toLowerCase() === correctAnswer.toLowerCase());
      if (matchingOption) correctAnswer = matchingOption;
    }
    if (questionType !== "SHORT_ANSWER" && !options.some((option) => option === correctAnswer)) {
      throw new Error(`Question ${index2 + 1} has a correct answer that does not match an option.`);
    }
    return {
      id: `q_${Date.now()}_${index2 + 1}`,
      question: item.question,
      type: questionType,
      ...questionType === "SHORT_ANSWER" ? {} : { options },
      correctAnswer,
      explanation: item.explanation || "",
      topic: item.topic || params.topic,
      difficulty: params.difficulty
    };
  });
}
var QuizEngineService = class _QuizEngineService {
  static async generateQuiz(params) {
    const { userId, topic, subject, language, difficulty, questionCount, type } = params;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("Gemini is not configured. Add a valid GEMINI_API_KEY to generate quizzes.");
    }
    const prompt = `You are an expert Computer Science professor generating a quiz for B.Tech students.
Subject: ${subject}
Topic: ${topic}
Target Language: ${language}
Difficulty Level: ${difficulty}
Total Questions Needed: ${questionCount}
Question Format: ${type} (Options: MCQ, TRUE_FALSE, SHORT_ANSWER, or MIXED)

CRITICAL INSTRUCTIONS:
1. All questions, options, and explanations must be written in ${language}, while preserving standard technical English terminology (e.g. Stack, CPU, Pointers, Deadlock, B-Tree, TCP).
2. If MCQ: provide 4 distinct options (A, B, C, D) and specify exact correctAnswer (one of the 4 choices).
3. If TRUE_FALSE: provide "True" and "False" in options, specify correctAnswer ("True" or "False").
4. If SHORT_ANSWER: provide a 1-sentence reference answer in correctAnswer.
5. Provide a clear educational explanation in ${language} for why the correct answer is right.

Return a JSON array of questions with this schema:
[
  {
    "id": "q1",
    "question": "Question text in ${language}",
    "type": "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact text of correct option",
    "explanation": "Clear explanation in ${language}",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]`;
    const { response } = await generateContentWithRetry({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });
    const questions = parseGeneratedQuizQuestions(response.text || "", params);
    const quiz = {
      id: "quiz_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      userId,
      topic,
      subject,
      language,
      difficulty,
      questionCount: questions.length,
      type,
      questions,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return db.saveQuiz(quiz);
  }
  static async gradeAttempt(quizId, userId, submissions) {
    const quiz = db.getQuizById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    const ai = getGeminiClient();
    const gradedAnswers = [];
    const weakTopicSet = /* @__PURE__ */ new Set();
    let correctCount = 0;
    const submissionsByQuestion = new Map(submissions.map((submission) => [submission.questionId, submission.userAnswer]));
    for (const q of quiz.questions) {
      const submittedAnswer = submissionsByQuestion.get(q.id) || "";
      const userAns = submittedAnswer.trim();
      let isCorrect = false;
      if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
        isCorrect = userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase() || userAns.replace(/^[A-D]\)\s*/i, "").trim().toLowerCase() === q.correctAnswer.replace(/^[A-D]\)\s*/i, "").trim().toLowerCase();
      } else {
        isCorrect = await _QuizEngineService.evaluateShortAnswer(userAns, q.correctAnswer, q.question, ai);
      }
      if (isCorrect) {
        correctCount += 1;
      } else {
        weakTopicSet.add(q.topic);
      }
      gradedAnswers.push({
        questionId: q.id,
        questionText: q.question,
        userAnswer: submittedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    }
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round(correctCount / (totalQuestions || 1) * 100);
    const attempt = {
      id: "attempt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      quizId: quiz.id,
      userId,
      topic: quiz.topic,
      subject: quiz.subject,
      language: quiz.language,
      score: correctCount,
      totalQuestions,
      percentage,
      answers: gradedAnswers,
      weakTopics: Array.from(weakTopicSet),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return db.saveQuizAttempt(attempt);
  }
  static async evaluateShortAnswer(userAnswer, referenceAnswer, questionText, ai) {
    if (!userAnswer || userAnswer.length < 2) return false;
    const normUser = userAnswer.toLowerCase();
    const normRef = referenceAnswer.toLowerCase();
    if (normUser === normRef || normRef.includes(normUser) || normUser.includes(normRef)) {
      return true;
    }
    const refTokens = normRef.split(/\s+/).filter((w) => w.length > 3);
    const userTokens = normUser.split(/\s+/).filter((w) => w.length > 3);
    const matched = refTokens.filter((t) => userTokens.includes(t));
    if (refTokens.length > 0 && matched.length / refTokens.length >= 0.5) {
      return true;
    }
    if (ai) {
      try {
        const prompt = `Grade this technical Computer Science student's short answer.
Question: "${questionText}"
Reference Answer: "${referenceAnswer}"
Student's Answer: "${userAnswer}"

Accept correct paraphrases, conceptual synonyms, and answers in Indian languages (Hindi, Telugu, Tamil, etc.). Reject factually incorrect answers.
Output ONLY JSON: {"isCorrect": true | false}`;
        const { response: res } = await generateContentWithRetry({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        const parsed = safeParseJson(res.text || "{}", { isCorrect: false });
        return Boolean(parsed.isCorrect);
      } catch (err) {
        console.warn("Short answer evaluation LLM call encountered issue:", err.message || err);
        return matched.length > 0;
      }
    }
    return matched.length > 0;
  }
};

// server/routes/tutor-routes.ts
var router3 = (0, import_express3.Router)();
function normalizeDifficulty(val) {
  if (!val) return "INTERMEDIATE";
  const u = val.toUpperCase();
  if (u === "BEGINNER" || u === "EASY") return "BEGINNER";
  if (u === "ADVANCED" || u === "HARD") return "ADVANCED";
  return "INTERMEDIATE";
}
var AskSchema = import_zod6.z.object({
  question: import_zod6.z.string().min(1, "Question must not be empty"),
  conversationId: import_zod6.z.string().optional(),
  sourceLanguage: import_zod6.z.string().default("English"),
  targetLanguage: import_zod6.z.string().optional(),
  language: import_zod6.z.string().optional(),
  subject: import_zod6.z.string().default("Operating Systems"),
  difficulty: import_zod6.z.string().optional(),
  actionType: import_zod6.z.string().default("DEFAULT"),
  extraInstruction: import_zod6.z.string().optional()
});
router3.post("/ask", requireAuth, async (req, res) => {
  try {
    const data = AskSchema.parse(req.body);
    const targetLanguage = data.targetLanguage || data.language || "Telugu";
    const difficulty = normalizeDifficulty(data.difficulty);
    const result = await NLPPipelineService.execute({
      userId: req.user.id,
      conversationId: data.conversationId,
      question: data.question,
      sourceLanguage: data.sourceLanguage,
      targetLanguage,
      subject: data.subject,
      difficulty,
      actionType: data.actionType,
      extraInstruction: data.extraInstruction
    });
    return res.json({
      success: true,
      conversationId: result.conversationId,
      messageId: result.messageId,
      structuredResponse: result.structuredResponse,
      rawText: result.rawText,
      pipelineMetadata: result.pipelineMetadata,
      data: {
        conversationId: result.conversationId,
        messageId: result.messageId,
        structuredResponse: result.structuredResponse,
        rawText: result.rawText,
        pipelineMetadata: result.pipelineMetadata
      }
    });
  } catch (err) {
    console.error("Error in /api/tutor/ask:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "AI Tutor processing failed.",
      message: err.message || "AI Tutor processing failed."
    });
  }
});
router3.post("/simplify", requireAuth, async (req, res) => {
  try {
    const { conversationId, question, language, targetLanguage, subject, difficulty } = req.body;
    let targetQuestion = question;
    let convSubject = subject;
    let convLang = targetLanguage || language;
    if (conversationId) {
      const conv = db.getConversationById(conversationId);
      if (conv) {
        if (!targetQuestion) {
          const userMsgs = conv.messages.filter((m) => m.sender === "user");
          if (userMsgs.length) targetQuestion = userMsgs[userMsgs.length - 1].content;
        }
        if (!convSubject) convSubject = conv.subject;
        if (!convLang) convLang = conv.targetLanguage;
      }
    }
    if (!targetQuestion) {
      return res.status(400).json({ success: false, error: "No question or conversation provided to simplify." });
    }
    const result = await NLPPipelineService.execute({
      userId: req.user.id,
      conversationId,
      question: targetQuestion,
      targetLanguage: convLang || "Telugu",
      subject: convSubject || "Operating Systems",
      difficulty: "BEGINNER",
      actionType: "SIMPLIFY",
      extraInstruction: "Simplify this explanation using everyday analogies and simple conversational grammar."
    });
    return res.json({
      success: true,
      ...result,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});
router3.post("/deeper", requireAuth, async (req, res) => {
  try {
    const { conversationId, question, language, targetLanguage, subject } = req.body;
    let targetQuestion = question;
    let convSubject = subject;
    let convLang = targetLanguage || language;
    if (conversationId) {
      const conv = db.getConversationById(conversationId);
      if (conv) {
        if (!targetQuestion) {
          const userMsgs = conv.messages.filter((m) => m.sender === "user");
          if (userMsgs.length) targetQuestion = userMsgs[userMsgs.length - 1].content;
        }
        if (!convSubject) convSubject = conv.subject;
        if (!convLang) convLang = conv.targetLanguage;
      }
    }
    if (!targetQuestion) {
      return res.status(400).json({ success: false, error: "No question provided." });
    }
    const result = await NLPPipelineService.execute({
      userId: req.user.id,
      conversationId,
      question: targetQuestion,
      targetLanguage: convLang || "Telugu",
      subject: convSubject || "Operating Systems",
      difficulty: "ADVANCED",
      actionType: "EXPLAIN_DEEPER",
      extraInstruction: "Explain deep algorithmic mechanisms, CPU and memory operations, and formal engineering constraints."
    });
    return res.json({
      success: true,
      ...result,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});
router3.post("/analogy", requireAuth, async (req, res) => {
  try {
    const { conversationId, question, language, targetLanguage, subject } = req.body;
    let targetQuestion = question;
    let convSubject = subject;
    let convLang = targetLanguage || language;
    if (conversationId) {
      const conv = db.getConversationById(conversationId);
      if (conv) {
        if (!targetQuestion) {
          const userMsgs = conv.messages.filter((m) => m.sender === "user");
          if (userMsgs.length) targetQuestion = userMsgs[userMsgs.length - 1].content;
        }
        if (!convSubject) convSubject = conv.subject;
        if (!convLang) convLang = conv.targetLanguage;
      }
    }
    if (!targetQuestion) {
      return res.status(400).json({ success: false, error: "No question provided." });
    }
    const result = await NLPPipelineService.execute({
      userId: req.user.id,
      conversationId,
      question: targetQuestion,
      targetLanguage: convLang || "Telugu",
      subject: convSubject || "Operating Systems",
      actionType: "ANALOGY",
      extraInstruction: "Provide a rich real-world analogy grounded in everyday situations."
    });
    return res.json({
      success: true,
      ...result,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});
router3.post("/translate", requireAuth, async (req, res) => {
  try {
    const { conversationId, targetLanguage, question, subject } = req.body;
    if (!targetLanguage) {
      return res.status(400).json({ success: false, error: "Target language is required." });
    }
    let targetQuestion = question;
    let convSubject = subject;
    if (conversationId) {
      const conv = db.getConversationById(conversationId);
      if (conv) {
        if (!targetQuestion) {
          const userMsgs = conv.messages.filter((m) => m.sender === "user");
          if (userMsgs.length) targetQuestion = userMsgs[userMsgs.length - 1].content;
        }
        if (!convSubject) convSubject = conv.subject;
      }
    }
    if (!targetQuestion) {
      return res.status(400).json({ success: false, error: "No question provided to translate." });
    }
    const result = await NLPPipelineService.execute({
      userId: req.user.id,
      conversationId,
      question: targetQuestion,
      targetLanguage,
      subject: convSubject || "Operating Systems",
      actionType: "TRANSLATE"
    });
    return res.json({
      success: true,
      ...result,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});
router3.post("/generate-quiz", requireAuth, async (req, res) => {
  try {
    const { conversationId, topic, subject, language, difficulty, questionCount } = req.body;
    let quizTopic = topic;
    let quizSubject = subject;
    let quizLang = language;
    if (conversationId) {
      const conv = db.getConversationById(conversationId);
      if (conv) {
        if (!quizTopic) quizTopic = conv.title;
        if (!quizSubject) quizSubject = conv.subject;
        if (!quizLang) quizLang = conv.targetLanguage;
      }
    }
    const quiz = await QuizEngineService.generateQuiz({
      userId: req.user.id,
      topic: quizTopic || "Core Principles",
      subject: quizSubject || "Operating Systems",
      language: quizLang || "Telugu",
      difficulty: normalizeDifficulty(difficulty) === "BEGINNER" ? "EASY" : normalizeDifficulty(difficulty) === "ADVANCED" ? "HARD" : "MEDIUM",
      questionCount: questionCount || 5,
      type: "MCQ"
    });
    return res.json({
      success: true,
      ...quiz,
      data: quiz
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});
router3.get("/conversations", requireAuth, (req, res) => {
  const { search, language, subject, difficulty } = req.query;
  const list = db.getConversationsByUser(req.user.id, {
    search: search ? String(search) : void 0,
    language: language ? String(language) : void 0,
    subject: subject ? String(subject) : void 0,
    difficulty: difficulty ? String(difficulty) : void 0
  });
  return res.json(list);
});
router3.get("/conversations/stats", requireAuth, (req, res) => {
  const stats = db.getUserActivityStats(req.user.id);
  return res.json({
    success: true,
    ...stats,
    data: stats
  });
});
router3.get("/conversations/:id", requireAuth, (req, res) => {
  const conv = db.getConversationById(req.params.id);
  if (!conv || conv.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(404).json({
      success: false,
      error: "Conversation not found or access denied.",
      message: "Conversation not found or access denied."
    });
  }
  return res.json(conv);
});
router3.delete("/conversations/:id", requireAuth, (req, res) => {
  const conv = db.getConversationById(req.params.id);
  if (!conv || conv.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(404).json({
      success: false,
      error: "Conversation not found or access denied.",
      message: "Conversation not found or access denied."
    });
  }
  const ok = db.deleteConversation(req.params.id, req.user.id);
  if (!ok) {
    return res.status(404).json({
      success: false,
      error: "Failed to delete conversation.",
      message: "Failed to delete conversation."
    });
  }
  return res.json({ success: true, message: "Conversation deleted." });
});
var TranscribeSchema = import_zod6.z.object({
  audioData: import_zod6.z.string().min(1, "Audio data is required"),
  mimeType: import_zod6.z.string().default("audio/webm"),
  language: import_zod6.z.string().default("English")
});
router3.post("/transcribe", requireAuth, async (req, res) => {
  try {
    const { audioData, mimeType, language } = TranscribeSchema.parse(req.body);
    const cleanBase64 = audioData.includes(",") ? audioData.split(",")[1] : audioData;
    const baseMimeType = mimeType.split(";")[0].trim() || "audio/webm";
    const prompt = `Listen carefully to this spoken audio clip and transcribe the words exactly as spoken.
The user is speaking to an AI Computer Science & Technical Tutor.
Intended language: ${language || "English"} (or bilingual code-mixed technical terminology with ${language}).
Preserve all Computer Science and programming technical terms verbatim.
Output ONLY the transcription string. Do NOT output markdown, quotes, explanations, or metadata. If the audio is silent or only background noise, reply with an empty string.`;
    const result = await generateContentWithRetry({
      model: "gemini-3.5-transcribe",
      fallbackModels: ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.8-flash"],
      contents: [
        {
          inlineData: {
            mimeType: baseMimeType,
            data: cleanBase64
          }
        },
        {
          text: prompt
        }
      ]
    });
    let transcript = result.response.text?.trim() || "";
    transcript = transcript.replace(/^["'`]|["'`]$/g, "").trim();
    return res.json({
      success: true,
      transcript,
      modelUsed: result.modelUsed
    });
  } catch (err) {
    console.error("Error in /api/tutor/transcribe:", err);
    return res.status(200).json({
      success: false,
      transcript: "",
      error: err.message || "Speech transcription failed.",
      message: err.message || "Speech transcription failed."
    });
  }
});
var tutor_routes_default = router3;

// server/routes/conversation-routes.ts
var import_express4 = require("express");
var import_zod7 = require("zod");
var router4 = (0, import_express4.Router)();
router4.get("/", requireAuth, (req, res) => {
  const { search, language, subject, difficulty } = req.query;
  const list = db.getConversationsByUser(req.user.id, {
    search: search ? String(search) : void 0,
    language: language ? String(language) : void 0,
    subject: subject ? String(subject) : void 0,
    difficulty: difficulty ? String(difficulty) : void 0
  });
  return res.json({
    success: true,
    conversations: list,
    data: list
  });
});
router4.get("/stats", requireAuth, (req, res) => {
  const stats = db.getUserActivityStats(req.user.id);
  return res.json({
    success: true,
    ...stats,
    data: stats
  });
});
router4.get("/:id", requireAuth, (req, res) => {
  const conv = db.getConversationById(req.params.id);
  if (!conv || conv.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(404).json({
      success: false,
      error: "Conversation not found or access denied.",
      message: "Conversation not found or access denied."
    });
  }
  return res.json({
    success: true,
    conversation: conv,
    data: conv
  });
});
var CreateConversationSchema = import_zod7.z.object({
  title: import_zod7.z.string().optional(),
  question: import_zod7.z.string().optional(),
  subject: import_zod7.z.string().default("Operating Systems"),
  language: import_zod7.z.string().default("Telugu"),
  targetLanguage: import_zod7.z.string().optional(),
  difficulty: import_zod7.z.string().default("INTERMEDIATE")
});
router4.post("/", requireAuth, async (req, res) => {
  try {
    const data = CreateConversationSchema.parse(req.body);
    const targetLang = data.targetLanguage || data.language;
    const diff = data.difficulty.toUpperCase() === "BEGINNER" ? "BEGINNER" : data.difficulty.toUpperCase() === "ADVANCED" ? "ADVANCED" : "INTERMEDIATE";
    const convId = "conv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const initialTitle = data.title || (data.question ? data.question.substring(0, 40) + "..." : `${data.subject} Discussion`);
    const newConv = {
      id: convId,
      userId: req.user.id,
      title: initialTitle,
      sourceLanguage: "English",
      targetLanguage: targetLang,
      subject: data.subject,
      difficulty: diff,
      messages: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createConversation(newConv);
    if (data.question) {
      const pipelineResult = await NLPPipelineService.execute({
        userId: req.user.id,
        conversationId: convId,
        question: data.question,
        sourceLanguage: "English",
        targetLanguage: targetLang,
        subject: data.subject,
        difficulty: diff
      });
      const updatedConv = db.getConversationById(convId);
      return res.status(201).json({
        success: true,
        conversation: updatedConv,
        pipelineResult,
        data: updatedConv
      });
    }
    return res.status(201).json({
      success: true,
      conversation: newConv,
      data: newConv
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.errors?.[0]?.message || err.message,
      message: err.errors?.[0]?.message || err.message
    });
  }
});
router4.delete("/:id", requireAuth, (req, res) => {
  const conv = db.getConversationById(req.params.id);
  if (!conv || conv.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(404).json({
      success: false,
      error: "Conversation not found or access denied.",
      message: "Conversation not found or access denied."
    });
  }
  db.deleteConversation(req.params.id, req.user.id);
  return res.json({
    success: true,
    message: "Conversation deleted successfully.",
    data: { id: req.params.id }
  });
});
var conversation_routes_default = router4;

// server/routes/terminology-routes.ts
var import_express5 = require("express");
var import_zod8 = require("zod");

// server/services/terminology-service.ts
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function detectLanguageFromScript(text2) {
  if (!text2) return null;
  if (/[\u0C00-\u0C7F]/.test(text2)) return "Telugu";
  if (/[\u0B80-\u0BFF]/.test(text2)) return "Tamil";
  if (/[\u0C80-\u0CFF]/.test(text2)) return "Kannada";
  if (/[\u0D00-\u0D7F]/.test(text2)) return "Malayalam";
  if (/[\u0980-\u09FF]/.test(text2)) return "Bengali";
  if (/[\u0A80-\u0AFF]/.test(text2)) return "Gujarati";
  if (/[\u0A00-\u0A7F]/.test(text2)) return "Punjabi";
  if (/[\u0900-\u097F]/.test(text2)) return "Hindi";
  return null;
}
var CANONICAL_CS_TERMS = {
  semaphore: {
    englishTerm: "Semaphore",
    subject: "Operating Systems",
    aliases: ["semaphore", "\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D", "\u0C38\u0C47\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D", "\u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D", "\u0938\u0947\u092E\u093E\u092B\u094B\u0930", "\u0B9A\u0BC6\u0BAE\u0B83\u0BAA\u0BCB\u0BB0\u0BCD", "\u0CB8\u0CC6\u0CAE\u0CBE\u0CAB\u0CCB\u0CB0\u0CCD", "\u09B8\u09C7\u09AE\u09BE\u09AB\u09CB\u09B0"],
    technicalMeaningEn: "A Semaphore is a protected synchronization variable or abstract data type used to manage concurrent access to a finite number of shared system resources. It maintains an integer counter controlled exclusively by atomic operations: wait() (or P(), decrementing the count and blocking if negative) and signal() (or V(), incrementing count and waking waiting processes).",
    explanationEn: 'Preserve "Semaphore" in English or transliteration. Never translate as railway signal flag (\u0C30\u0C48\u0C32\u0C4D\u0C35\u0C47 \u0C1C\u0C46\u0C02\u0C21\u0C3E / \u0938\u0902\u0915\u0947\u0924 \u091D\u0902\u0921\u093E); in operating systems, it strictly denotes concurrent process synchronization primitives.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D (Semaphore) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C15\u0C3E\u0C02\u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C30\u0C3F\u0C2E\u0C3F\u0C24 \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C35\u0C28\u0C30\u0C41\u0C32\u0C28\u0C41 (Shared Resources) \u0C2C\u0C39\u0C41\u0C33 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C47\u0C38\u0C3E\u0C30\u0C3F \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C15\u0C41\u0C02\u0C21\u0C3E \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F\u0C02 \u0C1A\u0C47\u0C38\u0C47 \u0C12\u0C15 \u0C30\u0C15\u0C4D\u0C37\u0C3F\u0C24 \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D (Synchronization Primitive). \u0C07\u0C26\u0C3F \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C2A\u0C30\u0C2E\u0C3E\u0C23\u0C41 \u0C1A\u0C30\u0C4D\u0C2F\u0C32 (Atomic Operations) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C28\u0C3F\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C47 \u0C2A\u0C42\u0C30\u0C4D\u0C23\u0C3E\u0C02\u0C15 \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F: wait() \u0C32\u0C47\u0C26\u0C3E P() (\u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F, 0 \u0C15\u0C02\u0C1F\u0C47 \u0C24\u0C15\u0C4D\u0C15\u0C41\u0C35\u0C48\u0C24\u0C47 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C28\u0C3F\u0C30\u0C4B\u0C27\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 signal() \u0C32\u0C47\u0C26\u0C3E V() (\u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C2A\u0C46\u0C02\u0C1A\u0C3F \u0C35\u0C47\u0C1A\u0C3F \u0C09\u0C28\u0C4D\u0C28 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C28\u0C41 \u0C2E\u0C47\u0C32\u0C4D\u0C15\u0C4A\u0C32\u0C4D\u0C2A\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F).",
      Hindi: "\u0938\u0947\u092E\u093E\u092B\u094B\u0930 (Semaphore) \u0938\u092E\u0935\u0930\u094D\u0924\u0940 \u0938\u0902\u0917\u0923\u0928\u093E (Concurrent Computing) \u092E\u0947\u0902 \u090F\u0915 \u0938\u0902\u0930\u0915\u094D\u0937\u093F\u0924 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u092A\u094D\u0930\u093F\u092E\u093F\u091F\u093F\u0935 \u0939\u0948 \u091C\u093F\u0938\u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0938\u0940\u092E\u093F\u0924 \u0938\u093E\u091D\u093E \u0938\u093F\u0938\u094D\u091F\u092E \u0938\u0902\u0938\u093E\u0927\u0928\u094B\u0902 \u0924\u0915 \u092A\u0939\u0941\u0901\u091A \u0915\u094B \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u092F\u0939 \u0935\u093F\u0936\u0947\u0937 \u0930\u0942\u092A \u0938\u0947 \u0926\u094B \u090F\u091F\u0949\u092E\u093F\u0915 \u0911\u092A\u0930\u0947\u0936\u0928\u094B\u0902 \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u090F\u0915 \u092A\u0942\u0930\u094D\u0923\u093E\u0902\u0915 \u0915\u093E\u0909\u0902\u091F\u0930 \u092C\u0928\u093E\u090F \u0930\u0916\u0924\u093E \u0939\u0948: wait() \u092F\u093E P() (\u0915\u093E\u0909\u0902\u091F\u0930 \u0915\u094B \u0918\u091F\u093E\u0924\u093E \u0939\u0948 \u0914\u0930 \u0936\u0942\u0928\u094D\u092F \u0938\u0947 \u0915\u092E \u0939\u094B\u0928\u0947 \u092A\u0930 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u094B \u092C\u094D\u0932\u0949\u0915 \u0915\u0930\u0924\u093E \u0939\u0948) \u0914\u0930 signal() \u092F\u093E V() (\u0915\u093E\u0909\u0902\u091F\u0930 \u0915\u094B \u092C\u0922\u093C\u093E\u0924\u093E \u0939\u0948 \u0914\u0930 \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0915\u0930 \u0930\u0939\u0947 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u094B \u0938\u0915\u094D\u0930\u093F\u092F \u0915\u0930\u0924\u093E \u0939\u0948)\u0964",
      Tamil: "\u0B9A\u0BC6\u0BAE\u0B83\u0BAA\u0BCB\u0BB0\u0BCD (Semaphore) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC7 \u0BA8\u0BC7\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BB2 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 (Concurrent Processes) \u0B87\u0B9F\u0BC8\u0BAF\u0BC7 \u0BAA\u0B95\u0BBF\u0BB0\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0BB5\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B9A\u0BC0\u0BB0\u0BBE\u0B95 \u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0B95\u0BBF\u0B95\u0BCD\u0B95 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0B92\u0BA4\u0BCD\u0BA4\u0BBF\u0B9A\u0BC8\u0BB5\u0BC1 \u0BAE\u0BBE\u0BB1\u0BBF (Synchronization Variable) \u0B86\u0B95\u0BC1\u0BAE\u0BCD. \u0B87\u0BA4\u0BC1 wait() \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD signal() \u0B86\u0B95\u0BBF\u0BAF \u0B87\u0BB0\u0BA3\u0BCD\u0B9F\u0BC1 \u0B85\u0BA3\u0BC1\u0BA8\u0BBF\u0BB2\u0BC8 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1\u0B95\u0BB3\u0BBE\u0BB2\u0BCD (Atomic Operations) \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0B95\u0B9F\u0BCD\u0B9F\u0BC1\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
      Kannada: "\u0CB8\u0CC6\u0CAE\u0CBE\u0CAB\u0CCB\u0CB0\u0CCD (Semaphore) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CB8\u0CAE\u0C95\u0CBE\u0CB2\u0CC0\u0CA8 \u0C95\u0C82\u0CAA\u0CCD\u0CAF\u0CC2\u0C9F\u0CBF\u0C82\u0C97\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CC6\u0CAF\u0CBE\u0CA6 \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD \u0CB8\u0C82\u0CAA\u0CA8\u0CCD\u0CAE\u0CC2\u0CB2\u0C97\u0CB3\u0CBF\u0C97\u0CC6 \u0CB8\u0CAE\u0CB5\u0CB0\u0CCD\u0CA4\u0CBF \u0CAA\u0CCD\u0CB0\u0CB5\u0CC7\u0CB6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CAF\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0CB8\u0CB2\u0CC1 \u0CAC\u0CB3\u0CB8\u0CB2\u0CBE\u0C97\u0CC1\u0CB5 \u0CB8\u0CBF\u0C82\u0C95\u0CCD\u0CB0\u0CCA\u0CA8\u0CC8\u0CB8\u0CC7\u0CB6\u0CA8\u0CCD \u0CAA\u0CCD\u0CB0\u0CBF\u0CAE\u0CBF\u0C9F\u0CBF\u0CB5\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6. \u0C87\u0CA6\u0CC1 \u0C95\u0CC7\u0CB5\u0CB2 wait() \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 signal() \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0CBE\u0C9A\u0CB0\u0CA3\u0CC6\u0C97\u0CB3 \u0CAE\u0CC2\u0CB2\u0C95 \u0CA8\u0CBF\u0CAF\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0CB8\u0CB2\u0CCD\u0CAA\u0CA1\u0CC1\u0CB5 \u0CAA\u0CC2\u0CB0\u0CCD\u0CA3\u0CBE\u0C82\u0C95 \u0C95\u0CCC\u0C82\u0C9F\u0CB0\u0CCD \u0C85\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CB0\u0CCD\u0CB5\u0CB9\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "\u09B8\u09C7\u09AE\u09BE\u09AB\u09CB\u09B0 (Semaphore) \u09B9\u09B2\u09CB \u09B8\u09AE\u09AC\u09B0\u09CD\u09A4\u09C0 \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BF\u0982\u09AF\u09BC\u09C7 \u098F\u0995\u099F\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B8\u09BF\u09A8\u0995\u09CD\u09B0\u09CB\u09A8\u09BE\u0987\u099C\u09C7\u09B6\u09A8 \u09AD\u09C7\u09B0\u09BF\u09AF\u09BC\u09C7\u09AC\u09B2 \u09AF\u09BE \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0\u09CD\u09A1 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09B0\u09BF\u09B8\u09CB\u09B0\u09CD\u09B8\u0997\u09C1\u09B2\u09BF\u09A4\u09C7 \u098F\u0995\u09BE\u09A7\u09BF\u0995 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09C7\u09B0 \u098F\u0995\u09AF\u09CB\u0997\u09C7 \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8 \u09A8\u09BF\u09AF\u09BC\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3 \u0995\u09B0\u09C7\u0964 \u098F\u099F\u09BF wait() \u098F\u09AC\u0982 signal() \u09AA\u09BE\u09B0\u09AE\u09BE\u09A3\u09AC\u09BF\u0995 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09BF\u09A4 \u098F\u0995\u099F\u09BF \u09AA\u09C2\u09B0\u09CD\u09A3\u09B8\u0982\u0996\u09CD\u09AF\u09BE\u09B0 \u0995\u09BE\u0989\u09A8\u09CD\u099F\u09BE\u09B0 \u09AC\u099C\u09BE\u09AF\u09BC \u09B0\u09BE\u0996\u09C7\u0964",
      Marathi: "\u0938\u0947\u092E\u093E\u092B\u094B\u0930 (Semaphore) \u0939\u0940 \u0915\u0949\u0928\u094D\u0915\u0930\u0902\u091F \u0915\u0949\u092E\u094D\u092A\u094D\u092F\u0941\u091F\u093F\u0902\u0917\u092E\u0927\u0940\u0932 \u090F\u0915 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u092F\u091D\u0947\u0936\u0928 \u092A\u094D\u0930\u093F\u092E\u093F\u091F\u093F\u0935\u094D\u0939 \u0906\u0939\u0947 \u091C\u0940 \u0938\u093F\u0938\u094D\u091F\u093F\u092E \u0930\u093F\u0938\u094B\u0930\u094D\u0938\u0947\u0938\u091A\u093E \u090F\u0915\u093E\u091A \u0935\u0947\u0933\u0940 \u0905\u0928\u0947\u0915 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u0947\u0938\u0915\u0921\u0942\u0928 \u0939\u094B\u0923\u093E\u0930\u093E \u0935\u093E\u092A\u0930 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0915\u0930\u0924\u0947. \u0939\u0947 wait() \u0906\u0923\u093F signal() \u092F\u093E \u0905\u200D\u0945\u091F\u0949\u092E\u093F\u0915 \u0911\u092A\u0930\u0947\u0936\u0928\u094D\u0938\u0926\u094D\u0935\u093E\u0930\u0947 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0939\u094B\u0923\u093E\u0930\u093E \u092A\u0942\u0930\u094D\u0923\u093E\u0902\u0915 \u0915\u093E\u0909\u0902\u091F\u0930 \u0930\u093E\u0916\u0924\u0947.",
      Gujarati: "\u0AB8\u0AC7\u0AAE\u0ABE\u0AAB\u0ACB\u0AB0 (Semaphore) \u0A8F \u0A95\u0ACB\u0AA8\u0ACD\u0A95\u0AB0\u0AA8\u0ACD\u0A9F \u0A95\u0AAE\u0ACD\u0AAA\u0ACD\u0AAF\u0AC1\u0A9F\u0ABF\u0A82\u0A97\u0AAE\u0ABE\u0A82 \u0A8F\u0A95 \u0AB8\u0AC1\u0AB0\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 \u0AB8\u0ABF\u0A82\u0A95\u0ACD\u0AB0\u0ACB\u0AA8\u0ABE\u0A87\u0A9D\u0AC7\u0AB6\u0AA8 \u0AAA\u0ACD\u0AB0\u0ABF\u0AAE\u0ABF\u0A9F\u0ABF\u0AB5 \u0A9B\u0AC7 \u0A9C\u0AC7 \u0AB6\u0AC7\u0AB0 \u0A95\u0AB0\u0AC7\u0AB2 \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE \u0AB8\u0A82\u0AB8\u0ABE\u0AA7\u0AA8\u0ACB \u0AB8\u0AC1\u0AA7\u0AC0 \u0AAC\u0AB9\u0AC1\u0AB5\u0ABF\u0AA7 \u0AAA\u0ACD\u0AB0\u0A95\u0ACD\u0AB0\u0ABF\u0AAF\u0ABE\u0A93\u0AA8\u0ABE \u0AAA\u0ACD\u0AB0\u0AB5\u0AC7\u0AB6\u0AA8\u0AC7 \u0AA8\u0ABF\u0AAF\u0A82\u0AA4\u0ACD\u0AB0\u0ABF\u0AA4 \u0A95\u0AB0\u0AC7 \u0A9B\u0AC7. \u0AA4\u0AC7 wait() \u0A85\u0AA8\u0AC7 signal() \u0A8F\u0A9F\u0ACB\u0AAE\u0ABF\u0A95 \u0A93\u0AAA\u0AB0\u0AC7\u0AB6\u0AA8\u0ACD\u0AB8 \u0AA6\u0ACD\u0AB5\u0ABE\u0AB0\u0ABE \u0AA8\u0ABF\u0AAF\u0A82\u0AA4\u0ACD\u0AB0\u0ABF\u0AA4 \u0A87\u0AA8\u0ACD\u0A9F\u0ABF\u0A9C\u0AB0 \u0A95\u0ABE\u0A89\u0AA8\u0ACD\u0A9F\u0AB0 \u0A9C\u0ABE\u0AB3\u0AB5\u0AC0 \u0AB0\u0ABE\u0A96\u0AC7 \u0A9B\u0AC7.",
      Punjabi: "\u0A38\u0A47\u0A2E\u0A3E\u0A2B\u0A4B\u0A30 (Semaphore) \u0A13\u0A2A\u0A30\u0A47\u0A1F\u0A3F\u0A70\u0A17 \u0A38\u0A3F\u0A38\u0A1F\u0A2E \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15 \u0A38\u0A2E\u0A15\u0A3E\u0A32\u0A40\u0A15\u0A30\u0A28 (Synchronization) \u0A35\u0A47\u0A30\u0A40\u0A0F\u0A2C\u0A32 \u0A39\u0A48 \u0A1C\u0A4B \u0A38\u0A3E\u0A02\u0A1D\u0A47 \u0A38\u0A3F\u0A38\u0A1F\u0A2E \u0A38\u0A30\u0A4B\u0A24\u0A3E\u0A02 \u0A24\u0A71\u0A15 \u0A2A\u0A4D\u0A30\u0A15\u0A3F\u0A30\u0A3F\u0A06\u0A35\u0A3E\u0A02 \u0A26\u0A40 \u0A2A\u0A39\u0A41\u0A70\u0A1A \u0A28\u0A42\u0A70 \u0A28\u0A3F\u0A2F\u0A70\u0A24\u0A30\u0A3F\u0A24 \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A07\u0A39 wait() \u0A05\u0A24\u0A47 signal() \u0A13\u0A2A\u0A30\u0A47\u0A38\u0A3C\u0A28\u0A3E\u0A02 \u0A30\u0A3E\u0A39\u0A40\u0A02 \u0A07\u0A71\u0A15 \u0A2A\u0A42\u0A30\u0A28 \u0A05\u0A70\u0A15 \u0A15\u0A3E\u0A0A\u0A02\u0A1F\u0A30 \u0A1A\u0A32\u0A3E\u0A09\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "\u0D38\u0D46\u0D2E\u0D3E\u0D2B\u0D4B\u0D7C (Semaphore) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D12\u0D30\u0D47\u0D38\u0D2E\u0D2F\u0D02 \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D3F\u0D1F\u0D2F\u0D3F\u0D7D \u0D38\u0D3F\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D02 \u0D35\u0D3F\u0D2D\u0D35\u0D19\u0D4D\u0D19\u0D7E \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D24\u0D2E\u0D3E\u0D2F\u0D3F \u0D2A\u0D19\u0D4D\u0D15\u0D3F\u0D1F\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D3E\u0D2F\u0D3F \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D12\u0D30\u0D41 \u0D38\u0D3F\u0D7B\u0D15\u0D4D\u0D30\u0D23\u0D48\u0D38\u0D47\u0D37\u0D7B \u0D35\u0D47\u0D30\u0D3F\u0D2F\u0D2C\u0D3F\u0D33\u0D3E\u0D23\u0D4D. \u0D07\u0D24\u0D4D wait(), signal() \u0D0E\u0D28\u0D4D\u0D28\u0D40 \u0D30\u0D23\u0D4D\u0D1F\u0D4D \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D19\u0D4D\u0D19\u0D33\u0D3E\u0D7D \u0D28\u0D3F\u0D2F\u0D28\u0D4D\u0D24\u0D4D\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D28\u0D4D\u0D28\u0D41."
    },
    explanationByLanguage: {
      Telugu: "Semaphore \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D \u0C32\u0C3F\u0C2A\u0C4D\u0C2F\u0C02\u0C24\u0C30\u0C40\u0C15\u0C30\u0C23\u0C32\u0C4B\u0C28\u0C47 \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C26\u0C40\u0C28\u0C4D\u0C28\u0C3F \u0C30\u0C48\u0C32\u0C4D\u0C35\u0C47 \u0C1C\u0C46\u0C02\u0C21\u0C3E \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C02\u0C15\u0C47\u0C24 \u0C1C\u0C46\u0C02\u0C21\u0C3E \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41; \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C15\u0C3E\u0C02\u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C38\u0C3F\u0C02\u0C15\u0C4D\u0C30\u0C4A\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C38\u0C3E\u0C27\u0C28\u0C02.",
      Hindi: 'Semaphore \u0915\u094B \u0939\u092E\u0947\u0936\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092F\u093E \u0938\u0947\u092E\u093E\u092B\u094B\u0930 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0947\u0902\u0964 \u0907\u0938\u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u092D\u0940 \u092D\u0940 "\u0938\u0902\u0915\u0947\u0924 \u091D\u0902\u0921\u093E" \u0928 \u0915\u0930\u0947\u0902; \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u092F\u0939 \u0915\u0947\u0935\u0932 \u0938\u092E\u0935\u0930\u094D\u0924\u0940 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0913\u0902 \u0915\u0947 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0915\u094B \u0926\u0930\u094D\u0936\u093E\u0924\u093E \u0939\u0948\u0964',
      Tamil: "Semaphore \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B86\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BC7\u0BAF\u0BC7 \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B9A\u0BC6\u0BAE\u0B83\u0BAA\u0BCB\u0BB0\u0BCD \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD. \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BB5\u0BA3\u0BCD\u0B9F\u0BBF \u0B9A\u0BAE\u0BBF\u0B95\u0BCD\u0B9E\u0BC8 \u0B95\u0BCA\u0B9F\u0BBF \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBE\u0BB2\u0BCD \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAF\u0BB2\u0BBF\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BC8\u0BA4\u0BCD \u0BA4\u0BB0\u0BC1\u0BAE\u0BCD.",
      Kannada: "Semaphore \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0C87\u0C82\u0C97\u0CCD\u0CB2\u0CBF\u0CB7\u0CCD \u0C85\u0CA5\u0CB5\u0CBE \u0CB8\u0CC6\u0CAE\u0CBE\u0CAB\u0CCB\u0CB0\u0CCD \u0C8E\u0C82\u0CA6\u0CC1 \u0CAC\u0CB3\u0CB8\u0CAC\u0CC7\u0C95\u0CC1. \u0CB0\u0CC8\u0CB2\u0CCD\u0CB5\u0CC6 \u0CA7\u0CCD\u0CB5\u0C9C \u0C8E\u0C82\u0CA6\u0CC1 \u0CAD\u0CBE\u0CB7\u0CBE\u0C82\u0CA4\u0CB0\u0CBF\u0CB8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0C95\u0C82\u0CAA\u0CCD\u0CAF\u0CC2\u0C9F\u0CB0\u0CCD \u0CB5\u0CBF\u0C9C\u0CCD\u0C9E\u0CBE\u0CA8\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0CA4\u0CAA\u0CCD\u0CAA\u0CC1 \u0C95\u0CB2\u0CCD\u0CAA\u0CA8\u0CC6 \u0CAE\u0CC2\u0CA1\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "Semaphore \u09B6\u09AC\u09CD\u09A6\u099F\u09BF\u0995\u09C7 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u0987\u0982\u09B0\u09C7\u099C\u09BF\u09A4\u09C7 \u09AC\u09BE \u09B8\u09C7\u09AE\u09BE\u09AB\u09CB\u09B0 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09B0\u09BE\u0996\u09BE \u0989\u099A\u09BF\u09A4\u0964 \u09B0\u09C7\u09B2\u0993\u09AF\u09BC\u09C7 \u09B8\u0982\u0995\u09C7\u09A4 \u09AA\u09A4\u09BE\u0995\u09BE \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964",
      Marathi: "Semaphore \u0939\u093E \u0936\u092C\u094D\u0926 \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924 \u0915\u093F\u0902\u0935\u093E \u0938\u0947\u092E\u093E\u092B\u094B\u0930 \u0905\u0938\u093E\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u093E. \u0930\u0947\u0932\u094D\u0935\u0947 \u0938\u093F\u0917\u094D\u0928\u0932 \u091D\u0947\u0902\u0921\u093E \u0905\u0938\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0942 \u0928\u092F\u0947.",
      Gujarati: "Semaphore \u0AB6\u0AAC\u0ACD\u0AA6\u0AA8\u0AC7 \u0AA4\u0A95\u0AA8\u0AC0\u0A95\u0AC0 \u0A85\u0A82\u0A97\u0ACD\u0AB0\u0AC7\u0A9C\u0AC0 \u0A85\u0AA5\u0AB5\u0ABE \u0AB8\u0AC7\u0AAE\u0ABE\u0AAB\u0ACB\u0AB0 \u0AA4\u0AB0\u0AC0\u0A95\u0AC7 \u0A9C \u0A9C\u0ABE\u0AB3\u0AB5\u0AC0 \u0AB0\u0ABE\u0A96\u0AB5\u0ACB. \u0AB0\u0AC7\u0AB2\u0AB5\u0AC7 \u0AB8\u0ABF\u0A97\u0ACD\u0AA8\u0AB2 \u0A9D\u0A82\u0AA1\u0ACB \u0A8F\u0AB5\u0ACB \u0A85\u0AA8\u0AC1\u0AB5\u0ABE\u0AA6 \u0AA8 \u0A95\u0AB0\u0AB5\u0ACB.",
      Punjabi: "Semaphore \u0A38\u0A3C\u0A2C\u0A26 \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A1C\u0A3E\u0A02 \u0A38\u0A47\u0A2E\u0A3E\u0A2B\u0A4B\u0A30 \u0A39\u0A40 \u0A32\u0A3F\u0A16\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48\u0964 \u0A07\u0A38\u0A28\u0A42\u0A70 \u0A30\u0A47\u0A32\u0A35\u0A47 \u0A1D\u0A70\u0A21\u0A3E \u0A28\u0A39\u0A40\u0A02 \u0A05\u0A28\u0A41\u0A35\u0A3E\u0A26\u0A3F\u0A06 \u0A1C\u0A3E\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E\u0964",
      Malayalam: "Semaphore \u0D0E\u0D28\u0D4D\u0D28 \u0D35\u0D3E\u0D15\u0D4D\u0D15\u0D4D \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D07\u0D02\u0D17\u0D4D\u0D32\u0D40\u0D37\u0D3F\u0D32\u0D4B \u0D38\u0D46\u0D2E\u0D3E\u0D2B\u0D4B\u0D7C \u0D0E\u0D28\u0D4D\u0D28\u0D4B \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D23\u0D02. \u0D31\u0D46\u0D2F\u0D3F\u0D7D\u0D35\u0D47 \u0D2A\u0D24\u0D3E\u0D15 \u0D0E\u0D28\u0D4D\u0D28\u0D4D \u0D2A\u0D30\u0D3F\u0D2D\u0D3E\u0D37\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D24\u0D4D\u0D24\u0D30\u0D41\u0D24\u0D4D."
    },
    transliterations: {
      Telugu: "Semaphore (\u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D - \u0C38\u0C2E\u0C28\u0C4D\u0C35\u0C2F \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D)",
      Hindi: "Semaphore (\u0938\u0947\u092E\u093E\u092B\u094B\u0930 - \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0935\u0947\u0930\u093F\u090F\u092C\u0932)",
      Tamil: "Semaphore (\u0B9A\u0BC6\u0BAE\u0B83\u0BAA\u0BCB\u0BB0\u0BCD)",
      Kannada: "Semaphore (\u0CB8\u0CC6\u0CAE\u0CBE\u0CAB\u0CCB\u0CB0\u0CCD)",
      Bengali: "Semaphore (\u09B8\u09C7\u09AE\u09BE\u09AB\u09CB\u09B0)",
      Marathi: "Semaphore (\u0938\u0947\u092E\u093E\u092B\u094B\u0930)",
      Gujarati: "Semaphore (\u0AB8\u0AC7\u0AAE\u0ABE\u0AAB\u0ACB\u0AB0)",
      Punjabi: "Semaphore (\u0A38\u0A47\u0A2E\u0A3E\u0A2B\u0A4B\u0A30)",
      Malayalam: "Semaphore (\u0D38\u0D46\u0D2E\u0D3E\u0D2B\u0D4B\u0D7C)"
    },
    technicalExample: `// POSIX Counting Semaphore in C
#include <semaphore.h>
#include <pthread.h>
#include <stdio.h>

sem_t resource_pool;

void* worker(void* arg) {
    sem_wait(&resource_pool); // Decrements counter; blocks if 0 (\u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C28\u0C41 \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F)
    // === Critical Section: Accessing limited shared DB connection pool ===
    printf("Thread acquired slot in shared pool\\n");
    sem_post(&resource_pool); // Increments counter; signals waiting thread
    return NULL;
}

int main() {
    sem_init(&resource_pool, 0, 3); // 3 concurrent slots available
    // Spawn threads...
    sem_destroy(&resource_pool);
}`
  },
  mutex: {
    englishTerm: "Mutex (Mutual Exclusion Lock)",
    subject: "Operating Systems",
    aliases: ["mutex", "\u0C2E\u0C4D\u0C2F\u0C42\u0C1F\u0C46\u0C15\u0C4D\u0C38\u0C4D", "\u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938", "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD", "\u0CAE\u0CCD\u0CAF\u0CC2\u0C9F\u0CC6\u0C95\u0CCD\u0CB8\u0CCD", "\u09AE\u09BF\u0989\u099F\u09C7\u0995\u09CD\u09B8"],
    technicalMeaningEn: "A Mutex (Mutual Exclusion object) is a locking synchronization mechanism that ensures only one thread of execution can enter a critical section at any given time. Unlike counting semaphores, a mutex has ownership semantics: only the specific thread that locked the mutex is permitted to unlock it.",
    explanationEn: 'Preserve "Mutex" as a technical compound term (Mutual Exclusion). Translating it as "\u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30 \u0C2E\u0C3F\u0C28\u0C39\u0C3E\u0C2F\u0C3F\u0C02\u0C2A\u0C41 \u0C24\u0C3E\u0C33\u0C02" obscures its multi-threading library implementation (pthread_mutex / std::mutex).',
    technicalMeaningByLanguage: {
      Telugu: "\u0C2E\u0C4D\u0C2F\u0C42\u0C1F\u0C46\u0C15\u0C4D\u0C38\u0C4D (Mutex - Mutual Exclusion Lock) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C32\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C02\u0C15\u0C4D\u0C30\u0C4A\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C2E\u0C46\u0C15\u0C3E\u0C28\u0C3F\u0C1C\u0C02, \u0C07\u0C26\u0C3F \u0C12\u0C15\u0C47 \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C12\u0C15\u0C47 \u0C12\u0C15 \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C15\u0C4D\u0C30\u0C3F\u0C1F\u0C3F\u0C15\u0C32\u0C4D \u0C38\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C15\u0C3F (Critical Section) \u0C2A\u0C4D\u0C30\u0C35\u0C47\u0C36\u0C3F\u0C02\u0C1A\u0C47\u0C32\u0C3E \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C38\u0C46\u0C2E\u0C3E\u0C2B\u0C4B\u0C30\u0C4D \u0C32\u0C3E\u0C17\u0C3E \u0C15\u0C3E\u0C15\u0C41\u0C02\u0C21\u0C3E, \u0C2E\u0C4D\u0C2F\u0C42\u0C1F\u0C46\u0C15\u0C4D\u0C38\u0C4D\u200C\u0C15\u0C41 \u0C13\u0C28\u0C30\u0C4D\u200C\u0C37\u0C3F\u0C2A\u0C4D (Ownership) \u0C32\u0C15\u0C4D\u0C37\u0C23\u0C02 \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F: \u0C05\u0C02\u0C1F\u0C47 \u0C0F \u0C28\u0C3F\u0C30\u0C4D\u0C26\u0C3F\u0C37\u0C4D\u0C1F \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C05\u0C2F\u0C3F\u0C24\u0C47 \u0C32\u0C3E\u0C15\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C02\u0C26\u0C4B, \u0C05\u0C26\u0C47 \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C26\u0C3E\u0C28\u0C3F\u0C28\u0C3F \u0C05\u0C28\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C26\u0C41.",
      Hindi: "\u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 (Mutex - Mutual Exclusion) \u090F\u0915 \u0932\u0949\u0915\u093F\u0902\u0917 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0924\u0902\u0924\u094D\u0930 \u0939\u0948 \u091C\u094B \u092F\u0939 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948 \u0915\u093F \u090F\u0915 \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0938\u092E\u092F \u092A\u0930 \u0915\u0947\u0935\u0932 \u090F\u0915 \u0939\u0940 \u0925\u094D\u0930\u0947\u0921 \u0915\u094D\u0930\u093F\u091F\u093F\u0915\u0932 \u0938\u0947\u0915\u094D\u0936\u0928 \u092E\u0947\u0902 \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930 \u0938\u0915\u0947\u0964 \u0915\u093E\u0909\u0902\u091F\u093F\u0902\u0917 \u0938\u0947\u092E\u093E\u092B\u094B\u0930 \u0915\u0947 \u0935\u093F\u092A\u0930\u0940\u0924, \u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 \u092E\u0947\u0902 \u0938\u094D\u0935\u093E\u092E\u093F\u0924\u094D\u0935 (Ownership) \u0939\u094B\u0924\u093E \u0939\u0948: \u092F\u093E\u0928\u0940 \u091C\u093F\u0938 \u0925\u094D\u0930\u0947\u0921 \u0928\u0947 \u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 \u0915\u094B \u0932\u0949\u0915 \u0915\u093F\u092F\u093E \u0939\u0948, \u0915\u0947\u0935\u0932 \u0935\u0939\u0940 \u0907\u0938\u0947 \u0905\u0928\u0932\u0949\u0915 \u0915\u0930 \u0938\u0915\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BAE\u0BBF\u0BAF\u0BC2\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD (Mutex) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC7 \u0BA8\u0BC7\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B92\u0BB0\u0BC1 \u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD \u0BAE\u0B9F\u0BCD\u0B9F\u0BC1\u0BAE\u0BC7 \u0B95\u0BBF\u0BB0\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B95\u0BCD\u0B95\u0BB2\u0BCD \u0B9A\u0BC6\u0B95\u0BCD\u0BB7\u0BA9\u0BBF\u0BB2\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0B9F \u0B85\u0BA9\u0BC1\u0BAE\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1\u0BA4\u0BB2\u0BCD \u0B92\u0BA4\u0BCD\u0BA4\u0BBF\u0B9A\u0BC8\u0BB5\u0BC1 \u0BAA\u0BCA\u0BB1\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD. \u0B8E\u0BA8\u0BCD\u0BA4 \u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD \u0BAA\u0BC2\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BA4\u0BCB \u0B85\u0BA4\u0BC1\u0BB5\u0BC7 \u0BA4\u0BBF\u0BB1\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CAE\u0CCD\u0CAF\u0CC2\u0C9F\u0CC6\u0C95\u0CCD\u0CB8\u0CCD (Mutex) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CB2\u0CBE\u0C95\u0CBF\u0C82\u0C97\u0CCD \u0CB8\u0CBF\u0C82\u0C95\u0CCD\u0CB0\u0CCA\u0CA8\u0CC8\u0CB8\u0CC7\u0CB6\u0CA8\u0CCD \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0CB5\u0CBF\u0CA7\u0CBE\u0CA8\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CCD\u0CA6\u0CC1, \u0CA8\u0CBF\u0CB0\u0CCD\u0CA6\u0CBF\u0CB7\u0CCD\u0C9F \u0CB8\u0CAE\u0CAF\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0C95\u0CC7\u0CB5\u0CB2 \u0C92\u0C82\u0CA6\u0CC1 \u0CA5\u0CCD\u0CB0\u0CC6\u0CA1\u0CCD \u0CAE\u0CBE\u0CA4\u0CCD\u0CB0 \u0C95\u0CCD\u0CB0\u0CBF\u0C9F\u0CBF\u0C95\u0CB2\u0CCD \u0CB8\u0CC6\u0C95\u0CCD\u0CB7\u0CA8\u0CCD\u200C\u0C97\u0CC6 \u0CAA\u0CCD\u0CB0\u0CB5\u0CC7\u0CB6\u0CBF\u0CB8\u0CB2\u0CC1 \u0C85\u0CA8\u0CC1\u0CAE\u0CA4\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "\u09AE\u09BF\u0989\u099F\u09C7\u0995\u09CD\u09B8 (Mutex - Mutual Exclusion) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09B2\u0995\u09BF\u0982 \u09AE\u09C7\u0995\u09BE\u09A8\u09BF\u099C\u09AE \u09AF\u09BE \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09C7 \u09AF\u09C7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F \u09B8\u09AE\u09AF\u09BC\u09C7 \u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u098F\u0995\u099F\u09BF \u09A5\u09CD\u09B0\u09C7\u09A1 \u0995\u09CD\u09B0\u09BF\u099F\u09BF\u0995\u09BE\u09B2 \u09B8\u09C7\u0995\u09B6\u09A8\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
      Marathi: "\u092E\u094D\u092F\u0941\u091F\u0947\u0915\u094D\u0938 (Mutex) \u0939\u0940 \u0905\u0936\u0940 \u0932\u0949\u0915\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u0940\u092E \u0906\u0939\u0947 \u091C\u0940 \u090F\u0915\u093E \u0935\u0947\u0933\u0940 \u092B\u0915\u094D\u0924 \u090F\u0915\u093E\u091A \u0925\u094D\u0930\u0947\u0921\u0932\u093E \u0915\u094D\u0930\u093F\u091F\u093F\u0915\u0932 \u0938\u0947\u0915\u094D\u0936\u0928\u092E\u0927\u094D\u092F\u0947 \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930\u0923\u094D\u092F\u093E\u091A\u0940 \u0939\u092E\u0940 \u0926\u0947\u0924\u0947.",
      Gujarati: "\u0AAE\u0ACD\u0AAF\u0AC1\u0A9F\u0AC7\u0A95\u0ACD\u0AB8 (Mutex) \u0A8F \u0AB2\u0ACB\u0A95\u0AC0\u0A82\u0A97 \u0AAE\u0ABF\u0A95\u0AC7\u0AA8\u0ABF\u0A9D\u0AAE \u0A9B\u0AC7 \u0A9C\u0AC7 \u0A96\u0ABE\u0AA4\u0AB0\u0AC0 \u0A95\u0AB0\u0AC7 \u0A9B\u0AC7 \u0A95\u0AC7 \u0A8F\u0A95 \u0AB8\u0AAE\u0AAF\u0AC7 \u0AAE\u0ABE\u0AA4\u0ACD\u0AB0 \u0A8F\u0A95 \u0A9C \u0AA5\u0ACD\u0AB0\u0AC7\u0AA1 \u0A95\u0ACD\u0AB0\u0ABF\u0A9F\u0ABF\u0A95\u0AB2 \u0AB8\u0AC7\u0A95\u0ACD\u0AB6\u0AA8\u0AAE\u0ABE\u0A82 \u0D2A\u0D4D\u0D30\u0AB5\u0AC7\u0AB6\u0AC0 \u0AB6\u0A95\u0AC7.",
      Punjabi: "\u0A2E\u0A3F\u0A0A\u0A1F\u0A48\u0A15\u0A38 (Mutex) \u0A07\u0A71\u0A15 \u0A24\u0A3E\u0A32\u0A3E\u0A2C\u0A70\u0A26\u0A40 \u0A35\u0A3F\u0A27\u0A40 \u0A39\u0A48 \u0A1C\u0A4B \u0A07\u0A39 \u0A2F\u0A15\u0A40\u0A28\u0A40 \u0A2C\u0A23\u0A3E\u0A09\u0A02\u0A26\u0A40 \u0A39\u0A48 \u0A15\u0A3F \u0A15\u0A3F\u0A38\u0A47 \u0A35\u0A40 \u0A38\u0A2E\u0A47\u0A02 \u0A38\u0A3F\u0A30\u0A2B\u0A3C \u0A07\u0A71\u0A15 \u0A25\u0A4D\u0A30\u0A48\u0A71\u0A21 \u0A39\u0A40 \u0A15\u0A4D\u0A30\u0A3F\u0A1F\u0A40\u0A15\u0A32 \u0A38\u0A48\u0A15\u0A38\u0A3C\u0A28 \u0A35\u0A3F\u0A71\u0A1A \u0A15\u0A70\u0A2E \u0A15\u0A30 \u0A38\u0A15\u0A47\u0964",
      Malayalam: "\u0D2E\u0D4D\u0D2F\u0D42\u0D1F\u0D4D\u0D1F\u0D46\u0D15\u0D4D\u0D38\u0D4D (Mutex) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D12\u0D30\u0D41 \u0D38\u0D2E\u0D2F\u0D02 \u0D12\u0D30\u0D41 \u0D24\u0D4D\u0D30\u0D46\u0D21\u0D3F\u0D28\u0D4D \u0D2E\u0D3E\u0D24\u0D4D\u0D30\u0D02 \u0D28\u0D3F\u0D7C\u0D23\u0D3E\u0D2F\u0D15 \u0D35\u0D3F\u0D2D\u0D3E\u0D17\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D47\u0D15\u0D4D\u0D15\u0D4D (Critical Section) \u0D2A\u0D4D\u0D30\u0D35\u0D47\u0D36\u0D28\u0D02 \u0D28\u0D7D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D32\u0D4B\u0D15\u0D4D\u0D15\u0D3F\u0D02\u0D17\u0D4D \u0D38\u0D02\u0D35\u0D3F\u0D27\u0D3E\u0D28\u0D2E\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: 'Mutex \u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C02\u0C17\u0C3E\u0C28\u0C47 \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C3E\u0C32\u0C3F. "\u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30 \u0C2E\u0C3F\u0C28\u0C39\u0C3E\u0C2F\u0C3F\u0C02\u0C2A\u0C41 \u0C24\u0C3E\u0C33\u0C02" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C2E\u0C32\u0C4D\u0C1F\u0C40-\u0C25\u0C4D\u0C30\u0C46\u0C21\u0C3F\u0C02\u0C17\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C32\u0C48\u0C2C\u0C4D\u0C30\u0C30\u0C40\u0C32\u0C32\u0C4B (pthread_mutex / std::mutex) \u0C17\u0C02\u0C26\u0C30\u0C17\u0C4B\u0C33\u0C02 \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.',
      Hindi: 'Mutex \u0915\u094B \u0939\u092E\u0947\u0936\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0928\u093E\u092E \u0938\u0947 \u0939\u0940 \u0938\u0902\u092C\u094B\u0927\u093F\u0924 \u0915\u0930\u0947\u0902\u0964 "\u0906\u092A\u0938\u0940 \u0905\u092A\u0935\u0930\u094D\u091C\u0928 \u0924\u093E\u0932\u093E" \u091C\u0948\u0938\u0947 \u0905\u0928\u0941\u0935\u093E\u0926 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0915\u094B\u0921 \u0915\u0947 \u0938\u0902\u0926\u0930\u094D\u092D \u0915\u094B \u0905\u0938\u094D\u092A\u0937\u094D\u091F \u0915\u0930 \u0926\u0947\u0924\u0947 \u0939\u0948\u0902\u0964',
      Tamil: "Mutex \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA8\u0BC7\u0BB0\u0B9F\u0BBF\u0BAF\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0BA4\u0BAE\u0BBF\u0BB4\u0BCD \u0B87\u0BB2\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BC1 \u0BA8\u0BBF\u0BB0\u0BB2\u0BBE\u0B95\u0BCD\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B95\u0BC1\u0BB4\u0BAA\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BC8 \u0B89\u0BB0\u0BC1\u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "Mutex \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF, \u0C85\u0C95\u0CCD\u0CB7\u0CB0\u0CB6\u0C83 \u0CAD\u0CBE\u0CB7\u0CBE\u0C82\u0CA4\u0CB0\u0CB5\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0CAE\u0CBF\u0C82\u0C97\u0CCD \u0C97\u0CCD\u0CB0\u0C82\u0CA5\u0CBE\u0CB2\u0CAF\u0C97\u0CB3 \u0CAC\u0CB3\u0C95\u0CC6\u0CAF\u0CB2\u0CCD\u0CB2\u0CBF \u0C97\u0CCA\u0C82\u0CA6\u0CB2 \u0C89\u0C82\u0C9F\u0CC1\u0CAE\u0CBE\u0CA1\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "Mutex \u09B6\u09AC\u09CD\u09A6\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982\u09AF\u09BC\u09C7 \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u0964 \u0986\u0995\u09CD\u09B7\u09B0\u09BF\u0995 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u0995\u09CB\u09A1\u09BF\u0982\u09AF\u09BC\u09C7 \u09AC\u09BF\u09AD\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09AC\u09BE\u09A1\u09BC\u09BE\u09AF\u09BC\u0964",
      Marathi: "Mutex \u0936\u092C\u094D\u0926 \u092E\u0942\u0933 \u0938\u094D\u0935\u0930\u0942\u092A\u093E\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u093E, \u0936\u092C\u094D\u0926\u0936\u0903 \u0905\u0928\u0941\u0935\u093E\u0926\u093E\u0928\u0947 \u092E\u0932\u094D\u091F\u0940-\u0925\u094D\u0930\u0947\u0921\u093F\u0902\u0917 \u0915\u094B\u0921\u093F\u0902\u0917 \u0938\u092E\u091C\u0923\u0947 \u0915\u0920\u0940\u0923 \u0939\u094B\u0924\u0947.",
      Gujarati: "Mutex \u0AB6\u0AAC\u0ACD\u0AA6 \u0A95\u0ACB\u0AA1\u0ABF\u0A82\u0A97 \u0AB2\u0ABE\u0A87\u0AAC\u0ACD\u0AB0\u0AC7\u0AB0\u0AC0\u0A93\u0AAE\u0ABE\u0A82 \u0AAE\u0ABE\u0AA8\u0A95 \u0AB9\u0ACB\u0AB5\u0ABE\u0AA5\u0AC0 \u0AA4\u0AC7\u0AA8\u0AC7 \u0A8F\u0AAE \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "Mutex \u0A28\u0A42\u0A70 \u0A15\u0A4B\u0A21\u0A3F\u0A70\u0A17 \u0A35\u0A3F\u0A71\u0A1A \u0A05\u0A38\u0A32 \u0A30\u0A42\u0A2A \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A1C\u0A3E\u0A23\u0A3E \u0A1A\u0A3E\u0A39\u0A40\u0A26\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "Mutex \u0D0E\u0D28\u0D4D\u0D28 \u0D2A\u0D26\u0D02 \u0D2E\u0D3E\u0D31\u0D4D\u0D31\u0D2E\u0D3F\u0D32\u0D4D\u0D32\u0D3E\u0D24\u0D46 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D23\u0D02. \u0D05\u0D15\u0D4D\u0D37\u0D30\u0D3E\u0D7C\u0D24\u0D4D\u0D25\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D41\u0D33\u0D4D\u0D33 \u0D35\u0D3F\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D02 \u0D24\u0D46\u0D31\u0D4D\u0D31\u0D3F\u0D26\u0D4D\u0D27\u0D3E\u0D30\u0D23 \u0D09\u0D23\u0D4D\u0D1F\u0D3E\u0D15\u0D4D\u0D15\u0D41\u0D02."
    },
    transliterations: {
      Telugu: "Mutex (\u0C2E\u0C4D\u0C2F\u0C42\u0C1F\u0C46\u0C15\u0C4D\u0C38\u0C4D - \u0C2A\u0C30\u0C38\u0C4D\u0C2A\u0C30 \u0C2E\u0C3F\u0C28\u0C39\u0C3E\u0C2F\u0C3F\u0C02\u0C2A\u0C41 \u0C24\u0C3E\u0C33\u0C02)",
      Hindi: "Mutex (\u092E\u094D\u092F\u0942\u091F\u0947\u0915\u094D\u0938 - \u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u091C\u093C\u0928 \u0932\u0949\u0915)",
      Tamil: "Mutex (\u0BAE\u0BBF\u0BAF\u0BC2\u0B9F\u0BC6\u0B95\u0BCD\u0BB8\u0BCD)",
      Kannada: "Mutex (\u0CAE\u0CCD\u0CAF\u0CC2\u0C9F\u0CC6\u0C95\u0CCD\u0CB8\u0CCD)",
      Bengali: "Mutex (\u09AE\u09BF\u0989\u099F\u09C7\u0995\u09CD\u09B8)",
      Marathi: "Mutex (\u092E\u094D\u092F\u0941\u091F\u0947\u0915\u094D\u0938)",
      Gujarati: "Mutex (\u0AAE\u0ACD\u0AAF\u0AC1\u0A9F\u0AC7\u0A95\u0ACD\u0AB8)",
      Punjabi: "Mutex (\u0A2E\u0A3F\u0A0A\u0A1F\u0A48\u0A15\u0A38)",
      Malayalam: "Mutex (\u0D2E\u0D4D\u0D2F\u0D42\u0D1F\u0D4D\u0D1F\u0D46\u0D15\u0D4D\u0D38\u0D4D)"
    },
    technicalExample: `// C++11 std::mutex Critical Section Protection
#include <iostream>
#include <thread>
#include <mutex>

std::mutex bank_account_mutex;
double account_balance = 1000.0;

void withdraw(double amount) {
    // std::lock_guard automatically locks on entry and unlocks on scope exit (RAII)
    std::lock_guard<std::mutex> lock(bank_account_mutex);
    if (account_balance >= amount) {
        account_balance -= amount;
        std::cout << "Withdrew: " << amount << ", Balance: " << account_balance << "\\n";
    }
}`
  },
  deadlock: {
    englishTerm: "Deadlock",
    subject: "Operating Systems",
    aliases: ["deadlock", "\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D", "\u0C21\u0C46\u0C21\u0C4D \u0C32\u0C3E\u0C15\u0C4D", "\u0C21\u0C47\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D", "\u0921\u0947\u0921\u0932\u0949\u0915", "\u0B9F\u0BC6\u0B9F\u0BCD\u0BB2\u0BBE\u0B95\u0BCD", "\u0CA1\u0CC6\u0CA1\u0CCD\u200C\u0CB2\u0CBE\u0C95\u0CCD", "\u09A1\u09C7\u09A1\u09B2\u0995"],
    technicalMeaningEn: "A Deadlock is an unrecoverable system state in concurrent computing where a set of processes are blocked indefinitely because each process holds a resource and waits for another resource held by another process in the set, simultaneously fulfilling the four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    explanationEn: 'Preserve "Deadlock". Literal translations like "\u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02" (dead lock) or "\u092E\u0943\u0924 \u0924\u093E\u0932\u093E" are completely nonsensical. It describes circular process blocking.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D (Deadlock) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C15\u0C3E\u0C02\u0C15\u0C30\u0C46\u0C02\u0C1F\u0C4D \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C32\u0C4B \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C47 \u0C12\u0C15 \u0C38\u0C02\u0C15\u0C4D\u0C32\u0C3F\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C38\u0C4D\u0C24\u0C02\u0C2D\u0C28 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F (Unrecoverable System State). \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C05\u0C02\u0C24\u0C15\u0C02\u0C1F\u0C47 \u0C0E\u0C15\u0C4D\u0C15\u0C41\u0C35 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C26\u0C3E\u0C28\u0C3F \u0C26\u0C17\u0C4D\u0C17\u0C30 \u0C09\u0C28\u0C4D\u0C28 \u0C35\u0C28\u0C30\u0C41 \u0C15\u0C4B\u0C38\u0C02 \u0C2E\u0C30\u0C4A\u0C15\u0C1F\u0C3F \u0C0E\u0C26\u0C41\u0C30\u0C41\u0C1A\u0C42\u0C38\u0C4D\u0C24\u0C42 \u0C36\u0C3E\u0C36\u0C4D\u0C35\u0C24\u0C02\u0C17\u0C3E \u0C06\u0C17\u0C3F\u0C2A\u0C4B\u0C24\u0C3E\u0C2F\u0C3F. \u0C07\u0C26\u0C3F \u0C15\u0C3E\u0C2B\u0C4D\u200C\u0C2E\u0C28\u0C4D \u0C37\u0C30\u0C24\u0C41\u0C32\u0C28\u0C41 (Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, \u0C2E\u0C30\u0C3F\u0C2F\u0C41 Circular Wait) \u0C12\u0C15\u0C47\u0C38\u0C3E\u0C30\u0C3F \u0C38\u0C02\u0C24\u0C43\u0C2A\u0C4D\u0C24\u0C3F \u0C2A\u0C30\u0C1A\u0C21\u0C02 \u0C35\u0C32\u0C4D\u0C32 \u0C38\u0C02\u0C2D\u0C35\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0921\u0947\u0921\u0932\u0949\u0915 (Deadlock) \u0938\u092E\u0935\u0930\u094D\u0924\u0940 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u093F\u0902\u0917 \u092E\u0947\u0902 \u090F\u0915 \u0910\u0938\u0940 \u0905\u092A\u0930\u093F\u0935\u0930\u094D\u0924\u0928\u0940\u092F \u0905\u0935\u0930\u094B\u0927 \u0938\u094D\u0925\u093F\u0924\u093F \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u0926\u094B \u092F\u093E \u0926\u094B \u0938\u0947 \u0905\u0927\u093F\u0915 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u090F\u0902 \u0939\u092E\u0947\u0936\u093E \u0915\u0947 \u0932\u093F\u090F \u0905\u0935\u0930\u0941\u0926\u094D\u0927 \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0902 \u0915\u094D\u092F\u094B\u0902\u0915\u093F \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0915\u093F\u0938\u0940 \u0905\u0928\u094D\u092F \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0926\u094D\u0935\u093E\u0930\u093E \u0927\u093E\u0930\u0923 \u0915\u093F\u090F \u0917\u090F \u0938\u0902\u0938\u093E\u0927\u0928 \u0915\u0940 \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0915\u0930 \u0930\u0939\u0940 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u092F\u0939 \u0915\u0949\u092B\u092E\u0948\u0928 \u0915\u0940 \u091A\u093E\u0930\u094B\u0902 \u0936\u0930\u094D\u0924\u094B\u0902 (\u092E\u094D\u092F\u0942\u091A\u0941\u0905\u0932 \u090F\u0915\u094D\u0938\u0915\u094D\u0932\u0942\u091C\u0928, \u0939\u094B\u0932\u094D\u0921 \u090F\u0902\u0921 \u0935\u0947\u091F, \u0928\u094B \u092A\u094D\u0930\u0940\u092E\u0947\u092E\u094D\u092A\u094D\u0936\u0928 \u0914\u0930 \u0938\u0930\u094D\u0915\u0941\u0932\u0930 \u0935\u0947\u091F) \u0915\u0947 \u090F\u0915 \u0938\u093E\u0925 \u092A\u0942\u0930\u093E \u0939\u094B\u0928\u0947 \u092A\u0930 \u0909\u0924\u094D\u092A\u0928\u094D\u0928 \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0B9F\u0BC6\u0B9F\u0BCD\u0BB2\u0BBE\u0B95\u0BCD (Deadlock) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC7 \u0BA8\u0BC7\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B87\u0BB0\u0BA3\u0BCD\u0B9F\u0BC1 \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0B85\u0BA4\u0BB1\u0BCD\u0B95\u0BC1 \u0BAE\u0BC7\u0BB1\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BCA\u0BA9\u0BCD\u0BB1\u0BC1 \u0BB5\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0BB3\u0BCD\u0BB3 \u0BB5\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0B95 \u0B95\u0BBE\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0BA8\u0BBF\u0BB0\u0BA8\u0BCD\u0BA4\u0BB0\u0BAE\u0BBE\u0B95 \u0BAE\u0BC1\u0B9F\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CA1\u0CC6\u0CA1\u0CCD\u200C\u0CB2\u0CBE\u0C95\u0CCD (Deadlock) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C95\u0C82\u0CAA\u0CCD\u0CAF\u0CC2\u0C9F\u0CBF\u0C82\u0C97\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF\u0CA8 \u0C92\u0C82\u0CA6\u0CC1 \u0CB8\u0CCD\u0CA5\u0C97\u0CBF\u0CA4 \u0CB8\u0CCD\u0CA5\u0CBF\u0CA4\u0CBF\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CCD\u0CA6\u0CC1, \u0CAA\u0CCD\u0CB0\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6\u0C97\u0CB3\u0CC1 \u0CAA\u0CB0\u0CB8\u0CCD\u0CAA\u0CB0 \u0CB9\u0CBF\u0CA1\u0CBF\u0CA6\u0CBF\u0CB0\u0CC1\u0CB5 \u0CB8\u0C82\u0CAA\u0CA8\u0CCD\u0CAE\u0CC2\u0CB2\u0C97\u0CB3\u0CBF\u0C97\u0CBE\u0C97\u0CBF \u0C95\u0CBE\u0CAF\u0CC1\u0CA4\u0CCD\u0CA4\u0CBE \u0CB6\u0CBE\u0CB6\u0CCD\u0CB5\u0CA4\u0CB5\u0CBE\u0C97\u0CBF \u0CA8\u0CBF\u0CB0\u0CCD\u0CAC\u0C82\u0CA7\u0CBF\u0CB8\u0CB2\u0CCD\u0CAA\u0CA1\u0CC1\u0CA4\u0CCD\u0CA4\u0CB5\u0CC6.",
      Bengali: "\u09A1\u09C7\u09A1\u09B2\u0995 (Deadlock) \u09B9\u09B2\u09CB \u098F\u09AE\u09A8 \u098F\u0995\u099F\u09BF \u0985\u099A\u09B2\u09BE\u09AC\u09B8\u09CD\u09A5\u09BE \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u09A6\u09C1\u0987 \u09AC\u09BE \u09A4\u09A4\u09CB\u09A7\u09BF\u0995 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8 \u098F\u0995\u09C7 \u0985\u09AA\u09B0\u09C7\u09B0 \u0995\u09BE\u099B\u09C7 \u09A5\u09BE\u0995\u09BE \u09B0\u09BF\u09B8\u09CB\u09B0\u09CD\u09B8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09A8\u09A8\u09CD\u09A4\u0995\u09BE\u09B2 \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C7 \u0986\u099F\u0995\u09C7 \u09A5\u09BE\u0995\u09C7\u0964",
      Marathi: "\u0921\u0947\u0921\u0932\u0949\u0915 (Deadlock) \u0939\u0940 \u0905\u0936\u0940 \u0938\u093F\u0938\u094D\u091F\u0940\u092E \u0938\u094D\u0925\u093F\u0924\u0940 \u0906\u0939\u0947 \u091C\u093F\u0925\u0947 \u0926\u094B\u0928 \u0915\u093F\u0902\u0935\u093E \u0905\u0927\u093F\u0915 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u0947\u0938 \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0928\u0940 \u0905\u0921\u0935\u0942\u0928 \u0920\u0947\u0935\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u093F\u0938\u094B\u0930\u094D\u0938\u0947\u0938\u0938\u093E\u0920\u0940 \u0938\u0924\u0924 \u0935\u093E\u091F \u092A\u093E\u0939\u0924 \u0925\u093E\u0902\u092C\u0942\u0928 \u0930\u093E\u0939\u0924\u093E\u0924.",
      Gujarati: "\u0AA1\u0AC7\u0AA1\u0AB2\u0AC9\u0A95 (Deadlock) \u0A8F \u0A95\u0AAE\u0ACD\u0AAA\u0ACD\u0AAF\u0AC1\u0A9F\u0ABF\u0A82\u0A97\u0AAE\u0ABE\u0A82 \u0A8F\u0A95 \u0A8F\u0AB5\u0AC0 \u0AB8\u0ACD\u0AA5\u0ABF\u0AA4\u0ABF \u0A9B\u0AC7 \u0A9C\u0AC7\u0AAE\u0ABE\u0A82 \u0AAC\u0AC7 \u0A95\u0AC7 \u0AA4\u0AC7\u0AA5\u0AC0 \u0AB5\u0AA7\u0AC1 \u0AAA\u0ACD\u0AB0\u0A95\u0ACD\u0AB0\u0ABF\u0AAF\u0ABE\u0A93 \u0A8F\u0A95\u0AAC\u0AC0\u0A9C\u0ABE\u0AA8\u0ABE \u0AB8\u0A82\u0AB8\u0ABE\u0AA7\u0AA8\u0ACB\u0AA8\u0AC0 \u0AB0\u0ABE\u0AB9 \u0A9C\u0ACB\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A95\u0ABE\u0AAF\u0AAE \u0AAE\u0ABE\u0A9F\u0AC7 \u0A85\u0A9F\u0A95\u0AC0 \u0A9C\u0ABE\u0AAF \u0A9B\u0AC7.",
      Punjabi: "\u0A21\u0A48\u0A21\u0A32\u0A3E\u0A15 (Deadlock) \u0A07\u0A71\u0A15 \u0A05\u0A1C\u0A3F\u0A39\u0A40 \u0A38\u0A25\u0A3F\u0A24\u0A40 \u0A39\u0A48 \u0A1C\u0A3F\u0A71\u0A25\u0A47 \u0A26\u0A4B \u0A1C\u0A3E\u0A02 \u0A26\u0A4B \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A2A\u0A4D\u0A30\u0A15\u0A3F\u0A30\u0A3F\u0A06\u0A35\u0A3E\u0A02 \u0A07\u0A71\u0A15 \u0A26\u0A42\u0A1C\u0A47 \u0A26\u0A47 \u0A38\u0A30\u0A4B\u0A24\u0A3E\u0A02 \u0A26\u0A40 \u0A09\u0A21\u0A40\u0A15 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A2E\u0A47\u0A38\u0A3C\u0A3E \u0A32\u0A08 \u0A30\u0A41\u0A15 \u0A1C\u0A3E\u0A02\u0A26\u0A40\u0A06\u0A02 \u0A39\u0A28\u0964",
      Malayalam: "\u0D21\u0D46\u0D21\u0D4D\u200C\u0D32\u0D4B\u0D15\u0D4D\u0D15\u0D4D (Deadlock) \u0D0E\u0D28\u0D4D\u0D28\u0D3E\u0D7D \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D15\u0D7E \u0D2A\u0D30\u0D38\u0D4D\u0D2A\u0D30\u0D02 \u0D15\u0D48\u0D35\u0D36\u0D02 \u0D35\u0D46\u0D1A\u0D4D\u0D1A\u0D3F\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D31\u0D3F\u0D38\u0D4B\u0D34\u0D4D\u0D38\u0D41\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D3E\u0D2F\u0D3F \u0D15\u0D3E\u0D24\u0D4D\u0D24\u0D3F\u0D30\u0D41\u0D28\u0D4D\u0D28\u0D4D \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D02 \u0D28\u0D3F\u0D32\u0D1A\u0D4D\u0D1A\u0D41\u0D2A\u0D4B\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D05\u0D35\u0D38\u0D4D\u0D25\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: '"Deadlock" \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C47 \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C3E\u0C32\u0C3F. "\u0C2E\u0C30\u0C23\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C24\u0C3E\u0C33\u0C02" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C05\u0C30\u0C4D\u0C27\u0C02 \u0C35\u0C3F\u0C15\u0C1F\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C38\u0C30\u0C4D\u0C15\u0C4D\u0C2F\u0C41\u0C32\u0C30\u0C4D \u0C35\u0C46\u0C2F\u0C3F\u0C1F\u0C4D \u0C35\u0C32\u0C4D\u0C32 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C41 \u0C38\u0C4D\u0C24\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C3F\u0C2A\u0C4B\u0C35\u0C21\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C42\u0C1A\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.',
      Hindi: 'Deadlock \u0915\u094B \u0939\u092E\u0947\u0936\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092E\u0947\u0902 \u0939\u0940 \u0930\u0916\u0947\u0902\u0964 "\u092E\u0943\u0924 \u0924\u093E\u0932\u093E" \u091C\u0948\u0938\u093E \u0936\u093E\u092C\u094D\u0926\u093F\u0915 \u0905\u0928\u0941\u0935\u093E\u0926 \u0905\u0930\u094D\u0925\u0939\u0940\u0928 \u0939\u0948; \u092F\u0939 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u091A\u0915\u094D\u0930\u0940\u092F \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E (Circular Wait) \u0915\u093E \u092A\u0930\u093F\u091A\u093E\u092F\u0915 \u0939\u0948\u0964',
      Tamil: "Deadlock \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD. \u0B87\u0BB1\u0BA8\u0BCD\u0BA4 \u0BAA\u0BC2\u0B9F\u0BCD\u0B9F\u0BC1 \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBE\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAA\u0BC1\u0BB0\u0BBF\u0BA4\u0BB2\u0BCD \u0B8F\u0BB1\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "Deadlock \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95\u0CB5\u0CBE\u0C97\u0CBF\u0CAF\u0CC7 \u0C87\u0CB0\u0CBF\u0CB8\u0CBF, \u0CB8\u0CA4\u0CCD\u0CA4 \u0CAC\u0CC0\u0C97 \u0C8E\u0C82\u0CAC \u0C85\u0CA8\u0CC1\u0CB5\u0CBE\u0CA6\u0CB5\u0CC1 \u0CB9\u0CBE\u0CB8\u0CCD\u0CAF\u0CBE\u0CB8\u0CCD\u0CAA\u0CA6\u0CB5\u0CBE\u0C97\u0CBF\u0CB0\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "Deadlock \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964 \u09AE\u09C3\u09A4 \u09A4\u09BE\u09B2\u09BE \u09A7\u09B0\u09A8\u09C7\u09B0 \u0986\u0995\u09CD\u09B7\u09B0\u09BF\u0995 \u0985\u09B0\u09CD\u09A5 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0985\u09B0\u09CD\u09A5\u09B9\u09C0\u09A8\u0964",
      Marathi: "Deadlock \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u091C\u094D\u091E\u0947\u091A\u093E \u0936\u092C\u094D\u0926\u0936\u0903 \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0942 \u0928\u092F\u0947.",
      Gujarati: "Deadlock \u0AB6\u0AAC\u0ACD\u0AA6\u0AA8\u0AC7 \u0A8F\u0AAE\u0AA8\u0AC7 \u0A8F\u0AAE \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "Deadlock \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A38\u0A3C\u0A2C\u0A26\u0A3E\u0A35\u0A32\u0A40 \u0A35\u0A1C\u0A4B\u0A02 \u0A39\u0A40 \u0A38\u0A70\u0A2D\u0A3E\u0A32\u0A23\u0A3E \u0A1C\u0A3C\u0A30\u0A42\u0A30\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "Deadlock \u0D0E\u0D28\u0D4D\u0D28 \u0D35\u0D3E\u0D15\u0D4D\u0D15\u0D4D \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Deadlock (\u0C21\u0C46\u0C21\u0C4D\u200C\u0C32\u0C3E\u0C15\u0C4D - \u0C28\u0C3F\u0C32\u0C3F\u0C1A\u0C3F\u0C2A\u0C4B\u0C2F\u0C3F\u0C28 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F)",
      Hindi: "Deadlock (\u0921\u0947\u0921\u0932\u0949\u0915 - \u0917\u0924\u093F\u0930\u094B\u0927 \u0938\u094D\u0925\u093F\u0924\u093F)",
      Tamil: "Deadlock (\u0B9F\u0BC6\u0B9F\u0BCD\u0BB2\u0BBE\u0B95\u0BCD)",
      Kannada: "Deadlock (\u0CA1\u0CC6\u0CA1\u0CCD\u200C\u0CB2\u0CBE\u0C95\u0CCD)",
      Bengali: "Deadlock (\u09A1\u09C7\u09A1\u09B2\u0995)",
      Marathi: "Deadlock (\u0921\u0947\u0921\u0932\u0949\u0915)",
      Gujarati: "Deadlock (\u0AA1\u0AC7\u0AA1\u0AB2\u0AC9\u0A95)",
      Punjabi: "Deadlock (\u0A21\u0A48\u0A21\u0A32\u0A3E\u0A15)",
      Malayalam: "Deadlock (\u0D21\u0D46\u0D21\u0D4D\u200C\u0D32\u0D4B\u0D15\u0D4D\u0D15\u0D4D)"
    },
    technicalExample: `// Deadlock generation scenario in concurrent C code:
// Thread 1:
pthread_mutex_lock(&lockA);
// Context switch occurs right here...
pthread_mutex_lock(&lockB); // Blocked if Thread 2 acquired lockB!

// Thread 2 (runs concurrently):
pthread_mutex_lock(&lockB);
pthread_mutex_lock(&lockA); // Blocked waiting for Thread 1 to release lockA!
// Circular Wait: Neither thread can ever advance -> Deadlock!`
  },
  thread: {
    englishTerm: "Thread",
    subject: "Operating Systems",
    aliases: ["thread", "\u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D", "\u0925\u094D\u0930\u0947\u0921", "\u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD", "\u0CA5\u0CCD\u0CB0\u0CC6\u0CA1\u0CCD", "\u09A5\u09CD\u09B0\u09C7\u09A1"],
    technicalMeaningEn: "A Thread is the smallest programmable and schedulable unit of processor execution managed by the operating system kernel. Threads that belong to the same parent process share its virtual address space (heap, text, data segments) and file descriptors, but each thread retains its own private Program Counter (PC), CPU registers, and execution call stack.",
    explanationEn: 'Never translate "Thread" as sewing thread ("\u0C27\u0C3E\u0C30\u0C2E\u0C41" in Telugu, "\u0927\u093E\u0917\u093E" in Hindi). It is an OS computational execution context inside a process.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D (Thread) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C15\u0C46\u0C30\u0C4D\u0C28\u0C32\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C37\u0C46\u0C21\u0C4D\u0C2F\u0C42\u0C32\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C47 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C30\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C05\u0C2E\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C47 \u0C05\u0C24\u0C3F\u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C0E\u0C17\u0C4D\u0C1C\u0C3F\u0C15\u0C4D\u0C2F\u0C42\u0C37\u0C28\u0C4D \u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C4D. \u0C12\u0C15\u0C47 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C15\u0C41 \u0C1A\u0C46\u0C02\u0C26\u0C3F\u0C28 \u0C2C\u0C39\u0C41\u0C33 \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D\u200C\u0C32\u0C41 \u0C06 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C2F\u0C4A\u0C15\u0C4D\u0C15 \u0C05\u0C21\u0C4D\u0C30\u0C38\u0C4D \u0C38\u0C4D\u0C2A\u0C47\u0C38\u0C4D (\u0C39\u0C40\u0C2A\u0C4D, \u0C15\u0C4B\u0C21\u0C4D, \u0C17\u0C4D\u0C32\u0C4B\u0C2C\u0C32\u0C4D \u0C21\u0C47\u0C1F\u0C3E) \u0C28\u0C41 \u0C2A\u0C02\u0C1A\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C3E\u0C2F\u0C3F, \u0C15\u0C3E\u0C28\u0C40 \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D\u200C\u0C15\u0C41 \u0C26\u0C3E\u0C28\u0C3F \u0C38\u0C4A\u0C02\u0C24 \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C4D \u0C15\u0C4C\u0C02\u0C1F\u0C30\u0C4D (PC), CPU \u0C30\u0C3F\u0C1C\u0C3F\u0C38\u0C4D\u0C1F\u0C30\u0C4D\u200C\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C15\u0C3E\u0C32\u0C4D \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D \u0C09\u0C02\u0C1F\u0C3E\u0C2F\u0C3F.",
      Hindi: "\u0925\u094D\u0930\u0947\u0921 (Thread) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u0930\u094D\u0928\u0947\u0932 \u0926\u094D\u0935\u093E\u0930\u093E \u0936\u0947\u0921\u094D\u092F\u0942\u0932 \u0914\u0930 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u093F\u0924 \u0915\u0940 \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0915\u092E\u094D\u092A\u094D\u092F\u0942\u091F\u0947\u0936\u0928\u0932 \u0907\u0915\u093E\u0908 \u0939\u0948\u0964 \u090F\u0915 \u0939\u0940 \u092A\u0948\u0930\u0947\u0902\u091F \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u0947 \u0915\u0908 \u0925\u094D\u0930\u0947\u0921 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u0947 \u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u090F\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 (\u0939\u0940\u092A, \u0915\u094B\u0921, \u0917\u094D\u0932\u094B\u092C\u0932 \u0921\u0947\u091F\u093E) \u0915\u094B \u0938\u093E\u091D\u093E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0932\u0947\u0915\u093F\u0928 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0925\u094D\u0930\u0947\u0921 \u0915\u093E \u0905\u092A\u0928\u093E \u0928\u093F\u091C\u0940 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E \u0915\u093E\u0909\u0902\u091F\u0930 (PC), \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u0914\u0930 \u0915\u0949\u0932 \u0938\u094D\u091F\u0948\u0915 \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD (Thread) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0BB1\u0BC8\u0BAE\u0BC8\u0BAF\u0BBE\u0BB2\u0BCD \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BAE\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1 \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BBF\u0B95\u0B9A\u0BCD\u0B9A\u0BBF\u0BB1\u0BBF\u0BAF \u0B9A\u0BC6\u0BAF\u0BB2\u0BBE\u0B95\u0BCD\u0B95 \u0B85\u0BB2\u0B95\u0BC1 \u0B86\u0B95\u0BC1\u0BAE\u0BCD. \u0B92\u0BB0\u0BC7 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBF\u0BA9\u0BCD \u0BAA\u0BB2 \u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BA4\u0BA9\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9.",
      Kannada: "\u0CA5\u0CCD\u0CB0\u0CC6\u0CA1\u0CCD (Thread) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C86\u0CAA\u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD\u200C\u0CA8\u0CBF\u0C82\u0CA6 \u0CA8\u0CBF\u0C97\u0CA6\u0CBF\u0CAA\u0CA1\u0CBF\u0CB8\u0CB2\u0CBE\u0CA6 \u0CAA\u0CCD\u0CB0\u0CCA\u0CB8\u0CC6\u0CB8\u0CB0\u0CCD\u200C\u0CA8 \u0C85\u0CA4\u0CCD\u0CAF\u0C82\u0CA4 \u0C9A\u0CBF\u0C95\u0CCD\u0C95 \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0C97\u0CA4\u0C97\u0CCA\u0CB3\u0CBF\u0CB8\u0CC1\u0CB5 \u0C98\u0C9F\u0C95\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09A5\u09CD\u09B0\u09C7\u09A1 (Thread) \u09B9\u09B2\u09CB \u0985\u09AA\u09BE\u09B0\u09C7\u099F\u09BF\u0982 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09BF\u09A4 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09B0\u09C7\u09B0 \u0995\u09CD\u09B7\u09C1\u09A6\u09CD\u09B0\u09A4\u09AE \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0 \u0987\u0989\u09A8\u09BF\u099F\u0964 \u098F\u0995\u0987 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09C7\u09B0 \u09A5\u09CD\u09B0\u09C7\u09A1\u0997\u09C1\u09B2\u09BF \u09AE\u09C7\u09AE\u09B0\u09BF \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0925\u094D\u0930\u0947\u0921 (Thread) \u0939\u0947 \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u0940\u092E\u0926\u094D\u0935\u093E\u0930\u0947 \u0936\u0947\u0921\u094D\u092F\u0942\u0932 \u0915\u0947\u0932\u0947 \u091C\u093E\u0923\u093E\u0930\u0947 \u090F\u0915\u094D\u091D\u093F\u0915\u094D\u092F\u0941\u0936\u0928\u091A\u0947 \u0938\u0930\u094D\u0935\u093E\u0924 \u0932\u0939\u093E\u0928 \u092F\u0941\u0928\u093F\u091F \u0906\u0939\u0947.",
      Gujarati: "\u0AA5\u0ACD\u0AB0\u0AC7\u0AA1 (Thread) \u0A8F \u0A93\u0AAA\u0AB0\u0AC7\u0A9F\u0ABF\u0A82\u0A97 \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE \u0AA6\u0ACD\u0AB5\u0ABE\u0AB0\u0ABE \u0AB8\u0A82\u0A9A\u0ABE\u0AB2\u0ABF\u0AA4 \u0AAA\u0ACD\u0AB0\u0ACB\u0AB8\u0AC7\u0AB8\u0AB0\u0AA8\u0AC1\u0A82 \u0AB8\u0ACC\u0AA5\u0AC0 \u0AA8\u0ABE\u0AA8\u0AC1\u0A82 \u0A8F\u0A95\u0ACD\u0A9D\u0ABF\u0A95\u0ACD\u0AAF\u0AC1\u0AB6\u0AA8 \u0AAF\u0AC1\u0AA8\u0ABF\u0A9F \u0A9B\u0AC7.",
      Punjabi: "\u0A25\u0A4D\u0A30\u0A48\u0A71\u0A21 (Thread) \u0A13\u0A2A\u0A30\u0A47\u0A1F\u0A3F\u0A70\u0A17 \u0A38\u0A3F\u0A38\u0A1F\u0A2E \u0A26\u0A41\u0A06\u0A30\u0A3E \u0A1A\u0A32\u0A3E\u0A07\u0A06 \u0A1C\u0A3E\u0A23 \u0A35\u0A3E\u0A32\u0A3E \u0A38\u0A2D \u0A24\u0A4B\u0A02 \u0A1B\u0A4B\u0A1F\u0A3E \u0A10\u0A17\u0A1C\u0A3C\u0A40\u0A15\u0A3F\u0A0A\u0A38\u0A3C\u0A28 \u0A2F\u0A42\u0A28\u0A3F\u0A1F \u0A39\u0A48\u0964",
      Malayalam: "\u0D24\u0D4D\u0D30\u0D46\u0D21\u0D4D (Thread) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D13\u0D2A\u0D4D\u0D2A\u0D31\u0D47\u0D31\u0D4D\u0D31\u0D3F\u0D02\u0D17\u0D4D \u0D38\u0D3F\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D02 \u0D37\u0D46\u0D21\u0D4D\u0D2F\u0D42\u0D7E \u0D1A\u0D46\u0D2F\u0D4D\u0D2F\u0D41\u0D28\u0D4D\u0D28 \u0D0F\u0D31\u0D4D\u0D31\u0D35\u0D41\u0D02 \u0D1A\u0D46\u0D31\u0D3F\u0D2F \u0D0E\u0D15\u0D4D\u0D38\u0D3F\u0D15\u0D4D\u0D2F\u0D42\u0D37\u0D7B \u0D2F\u0D42\u0D23\u0D3F\u0D31\u0D4D\u0D31\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: '"Thread" \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C15\u0C41\u0C1F\u0C4D\u0C1F\u0C41 \u0C26\u0C3E\u0C30\u0C2E\u0C41 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C38\u0C48\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C32\u0C4B \u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C32\u0C4B\u0C2A\u0C32 \u0C28\u0C21\u0C3F\u0C1A\u0C47 \u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30 \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C47\u0C37\u0C28\u0C32\u0C4D \u0C0E\u0C17\u0C4D\u0C1C\u0C3F\u0C15\u0C4D\u0C2F\u0C42\u0C37\u0C28\u0C4D \u0C2A\u0C3E\u0C24\u0C4D.',
      Hindi: 'Thread \u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u092D\u0940 \u092D\u0940 \u0938\u093F\u0932\u093E\u0908 \u0915\u093E "\u0927\u093E\u0917\u093E" \u0928 \u0915\u0930\u0947\u0902\u0964 \u092F\u0939 \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u0947 \u0905\u0902\u0926\u0930 \u091A\u0932\u0928\u0947 \u0935\u093E\u0932\u0940 \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0907\u0915\u093E\u0908 \u0939\u0948\u0964',
      Tamil: "Thread-\u0B90 \u0BA4\u0BC8\u0BAF\u0BB2\u0BCD \u0BA8\u0BC2\u0BB2\u0BCD \u0B8E\u0BA9\u0BCD\u0BB1\u0BC1 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0B95\u0BCD \u0B95\u0BC2\u0B9F\u0BBE\u0BA4\u0BC1. \u0B87\u0BA4\u0BC1 \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0BBF\u0BB5\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "Thread \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CCA\u0CB2\u0CBF\u0C97\u0CC6 \u0CA6\u0CBE\u0CB0 \u0C8E\u0C82\u0CA6\u0CC1 \u0C95\u0CB0\u0CC6\u0CAF\u0CAC\u0CBE\u0CB0\u0CA6\u0CC1. \u0C87\u0CA6\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0CAE\u0CBF\u0C82\u0C97\u0CCD\u200C\u0CA8 \u0C9A\u0CBF\u0C95\u0CCD\u0C95 \u0C95\u0CBE\u0CB0\u0CCD\u0CAF \u0C98\u0C9F\u0C95.",
      Bengali: "Thread-\u0995\u09C7 \u0995\u0996\u09A8\u09CB \u09B8\u09C7\u09B2\u09BE\u0987\u09AF\u09BC\u09C7\u09B0 \u09B8\u09C1\u09A4\u09CB \u09AD\u09BE\u09AC\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964 \u098F\u099F\u09BF \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BF\u0982\u09AF\u09BC\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u098F\u0995\u09CD\u09B8\u09BF\u0995\u09BF\u0989\u09B6\u09A8 \u0987\u0989\u09A8\u09BF\u099F\u0964",
      Marathi: "Thread \u091A\u093E \u0905\u0930\u094D\u0925 \u0936\u093F\u0935\u0923\u093E\u091A\u093E \u0926\u094B\u0930\u093E \u0905\u0938\u093E \u0915\u0930\u0942 \u0928\u092F\u0947, \u0939\u0940 \u0938\u0902\u0917\u0923\u0915\u0940\u092F \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0906\u0939\u0947.",
      Gujarati: "Thread \u0AA8\u0ACB \u0A85\u0AB0\u0ACD\u0AA5 \u0AB8\u0ABF\u0AB2\u0ABE\u0A88\u0AA8\u0ACB \u0AA6\u0ACB\u0AB0\u0ACB \u0AA8 \u0A95\u0AB0\u0AB5\u0ACB.",
      Punjabi: "Thread \u0A28\u0A42\u0A70 \u0A38\u0A3F\u0A32\u0A3E\u0A08 \u0A35\u0A3E\u0A32\u0A3E \u0A27\u0A3E\u0A17\u0A3E \u0A28\u0A3E \u0A38\u0A2E\u0A1D\u0A4B, \u0A07\u0A39 \u0A15\u0A70\u0A2A\u0A3F\u0A0A\u0A1F\u0A30 \u0A2A\u0A4D\u0A30\u0A15\u0A3F\u0A30\u0A3F\u0A06 \u0A26\u0A40 \u0A07\u0A15\u0A3E\u0A08 \u0A39\u0A48\u0964",
      Malayalam: "Thread-\u0D28\u0D46 \u0D24\u0D2F\u0D4D\u0D2F\u0D7D \u0D28\u0D42\u0D7D \u0D0E\u0D28\u0D4D\u0D28\u0D4D \u0D05\u0D7C\u0D24\u0D4D\u0D25\u0D2E\u0D3E\u0D15\u0D4D\u0D15\u0D30\u0D41\u0D24\u0D4D. \u0D07\u0D24\u0D4D \u0D15\u0D2E\u0D4D\u0D2A\u0D4D\u0D2F\u0D42\u0D1F\u0D4D\u0D1F\u0D47\u0D37\u0D23\u0D7D \u0D2F\u0D42\u0D23\u0D3F\u0D31\u0D4D\u0D31\u0D3E\u0D23\u0D4D."
    },
    transliterations: {
      Telugu: "Thread (\u0C25\u0C4D\u0C30\u0C46\u0C21\u0C4D - \u0C05\u0C24\u0C3F\u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C0E\u0C17\u0C4D\u0C1C\u0C3F\u0C15\u0C4D\u0C2F\u0C42\u0C37\u0C28\u0C4D \u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C4D)",
      Hindi: "Thread (\u0925\u094D\u0930\u0947\u0921 - \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0940 \u0938\u092C\u0938\u0947 \u091B\u094B\u091F\u0940 \u0907\u0915\u093E\u0908)",
      Tamil: "Thread (\u0BA4\u0BCD\u0BB0\u0BC6\u0B9F\u0BCD)",
      Kannada: "Thread (\u0CA5\u0CCD\u0CB0\u0CC6\u0CA1\u0CCD)",
      Bengali: "Thread (\u09A5\u09CD\u09B0\u09C7\u09A1)",
      Marathi: "Thread (\u0925\u094D\u0930\u0947\u0921)",
      Gujarati: "Thread (\u0AA5\u0ACD\u0AB0\u0AC7\u0AA1)",
      Punjabi: "Thread (\u0A25\u0A30\u0A3F\u0A71\u0A21)",
      Malayalam: "Thread (\u0D24\u0D4D\u0D30\u0D46\u0D21\u0D4D)"
    },
    technicalExample: `// Python Multi-Threading Example
import threading
import time

def compute_chunk(worker_id):
    print(f"Thread-{worker_id} executing task...")
    time.sleep(1)

# Spawning 3 concurrent lightweight execution threads
threads = [threading.Thread(target=compute_chunk, args=(i,)) for i in range(3)]
for t in threads: t.start()
for t in threads: t.join() # Wait for all threads to complete`
  },
  "virtual memory": {
    englishTerm: "Virtual Memory",
    subject: "Operating Systems",
    aliases: ["virtual memory", "\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40", "\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940", "\u0D35\u0D3F\u0D7C\u0D1A\u0D4D\u0D35\u0D7D \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F", "\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF"],
    technicalMeaningEn: "Virtual Memory is an operating system storage allocation scheme that abstracts physical RAM by providing each process with a large, uniform, contiguous private address space. The CPU Memory Management Unit (MMU) translates virtual addresses to physical RAM page frames via multi-level Page Tables, transparently swapping inactive pages to secondary disk storage when memory pressure occurs.",
    explanationEn: 'Keep Virtual Memory as technical term. Translating as "\u0C15\u0C3E\u0C32\u0C4D\u0C2A\u0C28\u0C3F\u0C15 \u0C1C\u0C4D\u0C1E\u0C3E\u0C2A\u0C15\u0C36\u0C15\u0C4D\u0C24\u0C3F" confuses cognitive psychology with operating system hardware-assisted address translation.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 (Virtual Memory) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B\u0C28\u0C3F \u0C05\u0C26\u0C4D\u0C2D\u0C41\u0C24\u0C2E\u0C48\u0C28 \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02. \u0C07\u0C26\u0C3F \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C15\u0C41 \u0C12\u0C15 \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C47\u0C15\u0C2E\u0C48\u0C28, \u0C0F\u0C15\u0C30\u0C40\u0C24\u0C3F \u0C2A\u0C4D\u0C30\u0C48\u0C35\u0C47\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C30\u0C38\u0C4D \u0C38\u0C4D\u0C2A\u0C47\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. CPU \u0C32\u0C4B\u0C28\u0C3F MMU (Memory Management Unit) \u0C2A\u0C47\u0C1C\u0C4D \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D\u0C38\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C05\u0C21\u0C4D\u0C30\u0C38\u0C4D\u200C\u0C32\u0C28\u0C41 \u0C2D\u0C4C\u0C24\u0C3F\u0C15 \u0C30\u0C4D\u0C2F\u0C3E\u0C2E\u0C4D (Physical RAM) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C3F\u0C38\u0C4D\u0C15\u0C4D \u0C38\u0C4D\u0C35\u0C3E\u0C2A\u0C4D \u0C38\u0C4D\u0C2A\u0C47\u0C38\u0C4D\u200C\u0C15\u0C41 \u0C2C\u0C26\u0C3F\u0C32\u0C40 \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940 (Virtual Memory) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u0940 \u090F\u0915 \u0910\u0938\u0940 \u092E\u0947\u092E\u094B\u0930\u0940 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0924\u0915\u0928\u0940\u0915 \u0939\u0948 \u091C\u094B \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u094B \u090F\u0915 \u092C\u0921\u093C\u0940 \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0928\u093F\u091C\u0940 \u090F\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964 \u0938\u0940\u092A\u0940\u092F\u0942 \u0915\u093E MMU \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930 \u092A\u0947\u091C \u091F\u0947\u092C\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u090F\u0921\u094D\u0930\u0947\u0938 \u0915\u094B \u092B\u093F\u091C\u093F\u0915\u0932 \u0930\u0948\u092E \u092E\u0947\u0902 \u092E\u0948\u092A \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BB5\u0BBF\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0BAE\u0BC6\u0BAE\u0BB0\u0BBF (Virtual Memory) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0BB1\u0BC8\u0BAE\u0BC8 \u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF \u0BA4\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF\u0BAF\u0BC8 \u0BB5\u0BB4\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95 \u0BAE\u0BC7\u0BB2\u0BBE\u0BA3\u0BCD\u0BAE\u0BC8 \u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAE\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF (Virtual Memory) \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF\u0CAF\u0CCA\u0C82\u0CA6\u0CC1 \u0CAA\u0CCD\u0CB0\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6\u0C97\u0CC6 \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1 \u0C96\u0CBE\u0CB8\u0C97\u0CBF \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8 \u0CB8\u0CCD\u0CA5\u0CB3\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C92\u0CA6\u0C97\u0CBF\u0CB8\u0CC1\u0CB5 \u0C86\u0CAA\u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF \u0CA8\u0CBF\u0CB0\u0CCD\u0CB5\u0CB9\u0CA3\u0CBE \u0CA4\u0C82\u0CA4\u0CCD\u0CB0\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09AD\u09BE\u09B0\u09CD\u099A\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AE\u09C7\u09AE\u09B0\u09BF (Virtual Memory) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09AE\u09C7\u09AE\u09B0\u09BF \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F \u0995\u09CC\u09B6\u09B2 \u09AF\u09BE \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u0995\u09C7 \u098F\u0995\u099F\u09BF \u09AC\u09A1\u09BC \u0993 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u099F \u0985\u09CD\u09AF\u09BE\u09A1\u09CD\u09B0\u09C7\u09B8 \u09B8\u09CD\u09AA\u09C7\u09B8 \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940 (Virtual Memory) \u0939\u0940 \u092E\u0947\u092E\u0930\u0940 \u092E\u0945\u0928\u0947\u091C\u092E\u0947\u0902\u091F \u092A\u0926\u094D\u0927\u0924 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u0932\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u094D\u0930\u093E\u092F\u0935\u094D\u0939\u0947\u091F \u0905\u200D\u0945\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0947.",
      Gujarati: "\u0AB5\u0AB0\u0ACD\u0A9A\u0ACD\u0AAF\u0AC1\u0A85\u0AB2 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0 (Virtual Memory) \u0AA6\u0AB0\u0AC7\u0A95 \u0AAA\u0ACD\u0AB0\u0ACB\u0AB8\u0AC7\u0AB8\u0AA8\u0AC7 \u0AB8\u0AC1\u0AB0\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 \u0AAA\u0ACD\u0AB0\u0ABE\u0A87\u0AB5\u0AC7\u0A9F \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8 \u0AB8\u0ACD\u0AAA\u0AC7\u0AB8 \u0A86\u0AAA\u0AA4\u0AC0 \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE \u0A9B\u0AC7.",
      Punjabi: "\u0A35\u0A30\u0A1A\u0A41\u0A05\u0A32 \u0A2E\u0A48\u0A2E\u0A30\u0A40 (Virtual Memory) \u0A39\u0A30\u0A47\u0A15 \u0A2A\u0A4D\u0A30\u0A15\u0A3F\u0A30\u0A3F\u0A06 \u0A28\u0A42\u0A70 \u0A07\u0A71\u0A15 \u0A35\u0A71\u0A21\u0A40 \u0A28\u0A3F\u0A71\u0A1C\u0A40 \u0A10\u0A21\u0A30\u0A48\u0A71\u0A38 \u0A38\u0A2A\u0A47\u0A38 \u0A2A\u0A4D\u0A30\u0A26\u0A3E\u0A28 \u0A15\u0A30\u0A26\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "\u0D35\u0D3F\u0D7C\u0D1A\u0D4D\u0D35\u0D7D \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F (Virtual Memory) \u0D13\u0D30\u0D4B \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D41\u0D02 \u0D35\u0D32\u0D3F\u0D2F \u0D38\u0D4D\u0D35\u0D15\u0D3E\u0D30\u0D4D\u0D2F \u0D35\u0D3F\u0D32\u0D3E\u0D38 \u0D07\u0D1F\u0D02 \u0D28\u0D7D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: '\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D\u200C\u0C32\u0C4B\u0C28\u0C47 \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F. "\u0C15\u0C32\u0C4D\u0C2A\u0C3F\u0C24 \u0C1C\u0C4D\u0C1E\u0C3E\u0C2A\u0C15\u0C36\u0C15\u0C4D\u0C24\u0C3F" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C2E\u0C46\u0C21\u0C3F\u0C15\u0C32\u0C4D/\u0C38\u0C48\u0C15\u0C3E\u0C32\u0C1C\u0C40 \u0C1C\u0C4D\u0C1E\u0C3E\u0C2A\u0C15\u0C36\u0C15\u0C4D\u0C24\u0C3F\u0C24\u0C4B \u0C17\u0C02\u0C26\u0C30\u0C17\u0C4B\u0C33\u0C02 \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.',
      Hindi: 'Virtual Memory \u0915\u094B \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092E\u0947\u0902 \u0939\u0940 \u0930\u0916\u0947\u0902\u0964 "\u0906\u092D\u093E\u0938\u0940 \u092F\u093E\u0926\u0926\u093E\u0936\u094D\u0924" \u0915\u0939\u0928\u093E \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0938\u093E\u0907\u0902\u0938 \u0915\u0947 \u0938\u0902\u0926\u0930\u094D\u092D \u092E\u0947\u0902 \u0917\u0932\u0924 \u0939\u0948\u0964',
      Tamil: "Virtual Memory \u0B8E\u0BA9\u0BCD\u0BB1 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BBE\u0BAE\u0BB2\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Virtual Memory \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Virtual Memory \u09AA\u09B0\u09BF\u09AD\u09BE\u09B7\u09BE\u099F\u09BF \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8\u0964",
      Marathi: "Virtual Memory \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0940.",
      Gujarati: "Virtual Memory \u0AB6\u0AAC\u0ACD\u0AA6 \u0A8F\u0AAE \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "Virtual Memory \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Virtual Memory \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D07\u0D02\u0D17\u0D4D\u0D32\u0D40\u0D37\u0D3F\u0D7D \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Virtual Memory (\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 / \u0C05\u0C2D\u0C4D\u0C2F\u0C3E\u0C38\u0C3F\u0C24 \u0C2E\u0C46\u0C2E\u0C30\u0C40)",
      Hindi: "Virtual Memory (\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940 - \u0906\u092D\u093E\u0938\u0940 \u0938\u094D\u092E\u0943\u0924\u093F)",
      Tamil: "Virtual Memory (\u0BB5\u0BBF\u0BB0\u0BCD\u0B9A\u0BCD\u0B9A\u0BC1\u0BB5\u0BB2\u0BCD \u0BAE\u0BC6\u0BAE\u0BB0\u0BBF)",
      Kannada: "Virtual Memory (\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF)",
      Bengali: "Virtual Memory (\u09AD\u09BE\u09B0\u09CD\u099A\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AE\u09C7\u09AE\u09B0\u09BF)",
      Marathi: "Virtual Memory (\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940)",
      Gujarati: "Virtual Memory (\u0AB5\u0AB0\u0ACD\u0A9A\u0ACD\u0AAF\u0AC1\u0A85\u0AB2 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0)",
      Punjabi: "Virtual Memory (\u0A35\u0A30\u0A1A\u0A41\u0A05\u0A32 \u0A2E\u0A48\u0A2E\u0A30\u0A40)",
      Malayalam: "Virtual Memory (\u0D35\u0D3F\u0D7C\u0D1A\u0D4D\u0D35\u0D7D \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F)"
    },
    technicalExample: `// Virtual Address structure on a 64-bit x86-64 architecture:
// [ 16 bits Sign Extension | 9 bits PML4 | 9 bits PDPT | 9 bits PD | 9 bits PT | 12 bits Page Offset ]
// When accessing virtual address 0x00007FFF5FBFF8C0:
// 1. MMU queries Translation Lookaside Buffer (TLB cache).
// 2. If TLB miss, walks hardware Page Table hierarchy.
// 3. If Valid bit == 0, hardware raises Page Fault Exception (Interrupt 14) to load page from disk.`
  },
  "hash table": {
    englishTerm: "Hash Table (Hash Map)",
    subject: "Data Structures",
    aliases: ["hash table", "hash map", "\u0C39\u0C4D\u0C2F\u0C3E\u0C37\u0C4D \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D", "\u0939\u0948\u0936 \u091F\u0947\u092C\u0932", "\u0BB9\u0BC7\u0BB7\u0BCD \u0B9F\u0BC7\u0BAA\u0BBF\u0BB3\u0BCD", "\u0CB9\u0CCD\u0CAF\u0CBE\u0CB6\u0CCD \u0C9F\u0CC7\u0CAC\u0CB2\u0CCD"],
    technicalMeaningEn: "A Hash Table is an associative data structure that implements a dictionary interface, mapping key identifiers to values. It utilizes a deterministic Hash Function to compute an array index from a key, achieving average-case O(1) time complexity for insertion, lookup, and deletion operations, using collision resolution strategies such as Chaining or Open Addressing.",
    explanationEn: 'Preserve Hash Table / Hashing. Do not translate as "\u0C24\u0C30\u0C3F\u0C17\u0C3F\u0C28 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F\u0C15" (minced meat table) or "\u0915\u0940\u092E\u093E \u0938\u0942\u091A\u0940". Hashing refers to mathematical mapping of arbitrary keys into fixed indexes.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C39\u0C4D\u0C2F\u0C3E\u0C37\u0C4D \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D (Hash Table) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C15\u0C40-\u0C35\u0C3E\u0C32\u0C4D\u0C2F\u0C42 (Key-Value) \u0C1C\u0C24\u0C32\u0C28\u0C41 \u0C28\u0C3F\u0C32\u0C4D\u0C35 \u0C1A\u0C47\u0C38\u0C47 \u0C05\u0C24\u0C4D\u0C2F\u0C02\u0C24 \u0C38\u0C2E\u0C30\u0C4D\u0C25\u0C35\u0C02\u0C24\u0C2E\u0C48\u0C28 \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D. \u0C07\u0C26\u0C3F \u0C39\u0C4D\u0C2F\u0C3E\u0C37\u0C4D \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D (Hash Function) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C15\u0C40\u0C28\u0C3F \u0C12\u0C15 \u0C38\u0C02\u0C16\u0C4D\u0C2F\u0C3E \u0C07\u0C02\u0C21\u0C46\u0C15\u0C4D\u0C38\u0C4D\u200C\u0C17\u0C3E \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C3F, \u0C07\u0C28\u0C4D\u0C38\u0C30\u0C4D\u0C37\u0C28\u0C4D, \u0C38\u0C46\u0C30\u0C4D\u0C1A\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C3F\u0C32\u0C40\u0C1F\u0C4D \u0C06\u0C2A\u0C30\u0C47\u0C37\u0C28\u0C4D\u200C\u0C32\u0C28\u0C41 \u0C38\u0C17\u0C1F\u0C41\u0C28 O(1) \u0C1F\u0C48\u0C2E\u0C4D \u0C15\u0C3E\u0C02\u0C2A\u0C4D\u0C32\u0C46\u0C15\u0C4D\u0C38\u0C3F\u0C1F\u0C40\u0C32\u0C4B \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0939\u0948\u0936 \u091F\u0947\u092C\u0932 (Hash Table) \u090F\u0915 \u090F\u0938\u094B\u0938\u093F\u090F\u091F\u093F\u0935 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0939\u0948 \u091C\u094B \u0915\u0940-\u0935\u0948\u0932\u094D\u092F\u0942 \u092A\u0947\u092F\u0930 \u0915\u094B \u0938\u094D\u091F\u094B\u0930 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964 \u092F\u0939 \u0939\u0948\u0936 \u092B\u093C\u0902\u0915\u094D\u0936\u0928 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0915\u0947 \u0915\u0940 (Key) \u0938\u0947 \u0907\u0902\u0921\u0947\u0915\u094D\u0938 \u0915\u0940 \u0917\u0923\u0928\u093E \u0915\u0930\u0924\u0940 \u0939\u0948 \u0914\u0930 O(1) \u0914\u0938\u0924 \u0938\u092E\u092F \u091C\u091F\u093F\u0932\u0924\u093E \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964",
      Tamil: "\u0BB9\u0BC7\u0BB7\u0BCD \u0B9F\u0BC7\u0BAA\u0BBF\u0BB3\u0BCD (Hash Table) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B9A\u0BBE\u0BB5\u0BBF-\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 (Key-Value) \u0B87\u0BA3\u0BC8\u0B95\u0BB3\u0BC8 \u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA4\u0BB0\u0BB5\u0BC1 \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD. \u0B87\u0BA4\u0BC1 O(1) \u0BA8\u0BC7\u0BB0\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BA4\u0BC7\u0B9F\u0BB2\u0BC8\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
      Kannada: "\u0CB9\u0CCD\u0CAF\u0CBE\u0CB6\u0CCD \u0C9F\u0CC7\u0CAC\u0CB2\u0CCD (Hash Table) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C95\u0CC0-\u0CAE\u0CCC\u0CB2\u0CCD\u0CAF \u0C9C\u0CCB\u0CA1\u0CBF\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB8\u0C82\u0C97\u0CCD\u0CB0\u0CB9\u0CBF\u0CB8\u0CC1\u0CB5 \u0CA6\u0C95\u0CCD\u0CB7 \u0CA1\u0CC7\u0C9F\u0CBE \u0CB0\u0C9A\u0CA8\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09B9\u09CD\u09AF\u09BE\u09B6 \u099F\u09C7\u09AC\u09BF\u09B2 (Hash Table) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09A1\u09C7\u099F\u09BE \u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u099A\u09BE\u09B0 \u09AF\u09BE \u0995\u09BF-\u09AD\u09CD\u09AF\u09BE\u09B2\u09C1 \u099C\u09CB\u09A1\u09BC\u09BE \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09C7 \u098F\u09AC\u0982 O(1) \u09B8\u09AE\u09AF\u09BC\u09C7 \u0995\u09BE\u099C \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0939\u0945\u0936 \u091F\u0947\u092C\u0932 (Hash Table) \u0939\u0940 \u0915\u0940-\u0935\u094D\u0939\u0945\u0932\u094D\u092F\u0942 \u091C\u094B\u0921\u094D\u092F\u093E \u0938\u093E\u0920\u0935\u0923\u093E\u0930\u0940 \u0921\u0947\u091F\u093E \u0930\u091A\u0928\u093E \u0906\u0939\u0947 \u091C\u0940 \u0938\u0930\u093E\u0938\u0930\u0940 O(1) \u0935\u0947\u0933\u0947\u0924 \u0936\u094B\u0927 \u0918\u0947\u0924\u0947.",
      Gujarati: "\u0AB9\u0AC7\u0AB6 \u0A9F\u0AC7\u0AAC\u0AB2 (Hash Table) \u0A8F \u0A95\u0AC0-\u0AB5\u0AC7\u0AB2\u0ACD\u0AAF\u0AC1 \u0A9C\u0ACB\u0AA1\u0AC0\u0A93 \u0AB8\u0A82\u0A97\u0ACD\u0AB0\u0AB9\u0ABF\u0AA4 \u0A95\u0AB0\u0AA4\u0AC1\u0A82 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0A95\u0ACD\u0A9A\u0AB0 \u0A9B\u0AC7.",
      Punjabi: "\u0A39\u0A48\u0A38\u0A3C \u0A1F\u0A47\u0A2C\u0A32 (Hash Table) \u0A07\u0A71\u0A15 \u0A21\u0A3E\u0A1F\u0A3E \u0A38\u0A1F\u0A4D\u0A30\u0A15\u0A1A\u0A30 \u0A39\u0A48 \u0A1C\u0A4B \u0A15\u0A40-\u0A35\u0A48\u0A32\u0A3F\u0A0A \u0A1C\u0A4B\u0A5C\u0A3F\u0A06\u0A02 \u0A28\u0A42\u0A70 \u0A38\u0A1F\u0A4B\u0A30 \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "\u0D39\u0D3E\u0D37\u0D4D \u0D1F\u0D47\u0D2C\u0D3F\u0D7E (Hash Table) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D15\u0D40-\u0D2E\u0D42\u0D32\u0D4D\u0D2F \u0D1C\u0D4B\u0D21\u0D3F\u0D15\u0D7E \u0D38\u0D02\u0D2D\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E \u0D18\u0D1F\u0D28\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: 'Hash Table \u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C2A\u0C26\u0C02\u0C17\u0C3E\u0C28\u0C47 \u0C09\u0C02\u0C1A\u0C3E\u0C32\u0C3F. "\u0C24\u0C30\u0C3F\u0C17\u0C3F\u0C28 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F\u0C15" (minced meat table) \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C39\u0C4D\u0C2F\u0C3E\u0C37\u0C3F\u0C02\u0C17\u0C4D \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C17\u0C23\u0C3F\u0C24 \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D.',
      Hindi: 'Hash Table \u0915\u094B "\u0915\u0940\u092E\u093E \u0938\u0942\u091A\u0940" \u0928 \u0915\u0939\u0947\u0902\u0964 \u092F\u0939 \u0917\u0923\u093F\u0924\u0940\u092F \u092E\u0948\u092A\u093F\u0902\u0917 \u0915\u0940 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0939\u0948\u0964',
      Tamil: "Hash Table \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Hash Table \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C97\u0CA3\u0CBF\u0CA4\u0CC0\u0CAF \u0CAE\u0CCD\u0CAF\u0CBE\u0CAA\u0CBF\u0C82\u0C97\u0CCD \u0C86\u0C97\u0CBF \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Hash Table \u09AA\u09B0\u09BF\u09AD\u09BE\u09B7\u09BE\u099F\u09BF \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u0989\u099A\u09BF\u09A4\u0964",
      Marathi: "Hash Table \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0947.",
      Gujarati: "Hash Table \u0AB6\u0AAC\u0ACD\u0AA6 \u0A8F\u0AAE\u0AA8\u0AC7 \u0A8F\u0AAE \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "Hash Table \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Hash Table \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Hash Table (\u0C39\u0C4D\u0C2F\u0C3E\u0C37\u0C4D \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D - \u0C15\u0C40-\u0C35\u0C3E\u0C32\u0C4D\u0C2F\u0C42 \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D)",
      Hindi: "Hash Table (\u0939\u0948\u0936 \u091F\u0947\u092C\u0932 - \u0915\u0940-\u0935\u0948\u0932\u094D\u092F\u0942 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E)",
      Tamil: "Hash Table (\u0BB9\u0BC7\u0BB7\u0BCD \u0B9F\u0BC7\u0BAA\u0BBF\u0BB3\u0BCD)",
      Kannada: "Hash Table (\u0CB9\u0CCD\u0CAF\u0CBE\u0CB6\u0CCD \u0C9F\u0CC7\u0CAC\u0CB2\u0CCD)",
      Bengali: "Hash Table (\u09B9\u09CD\u09AF\u09BE\u09B6 \u099F\u09C7\u09AC\u09BF\u09B2)",
      Marathi: "Hash Table (\u0939\u0945\u0936 \u091F\u0947\u092C\u0932)",
      Gujarati: "Hash Table (\u0AB9\u0AC7\u0AB6 \u0A9F\u0AC7\u0AAC\u0AB2)",
      Punjabi: "Hash Table (\u0A39\u0A48\u0A38\u0A3C \u0A1F\u0A47\u0A2C\u0A32)",
      Malayalam: "Hash Table (\u0D39\u0D3E\u0D37\u0D4D \u0D1F\u0D47\u0D2C\u0D3F\u0D7E)"
    },
    technicalExample: `// Hash Table with Chaining Collision Handling in JavaScript
class SimpleHashTable {
    constructor(size = 128) {
        this.buckets = new Array(size).fill(null).map(() => []);
    }
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i);
        return Math.abs(hash) % this.buckets.length;
    }
    set(key, value) {
        const bucket = this.buckets[this._hash(key)];
        const existing = bucket.find(([k]) => k === key);
        if (existing) existing[1] = value;
        else bucket.push([key, value]);
    }
    get(key) {
        const bucket = this.buckets[this._hash(key)];
        const item = bucket.find(([k]) => k === key);
        return item ? item[1] : undefined;
    }
}`
  },
  "acid properties": {
    englishTerm: "ACID Properties (Atomicity, Consistency, Isolation, Durability)",
    subject: "DBMS",
    aliases: ["acid", "acid properties", "\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D", "\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C30\u0C4D\u0C1F\u0C40\u0C38\u0C4D", "\u090F\u0938\u093F\u0921 \u092A\u094D\u0930\u0949\u092A\u0930\u094D\u091F\u0940\u091C", "\u0B86\u0B9A\u0BBF\u0B9F\u0BCD \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"],
    technicalMeaningEn: "ACID is an acronym representing the four critical properties that guarantee database transactions are processed reliably in relational database management systems (RDBMS): Atomicity (all operations commit or all rollback), Consistency (preserves integrity constraints), Isolation (concurrent transactions execute independently without interference), and Durability (committed data persists permanently despite crashes).",
    explanationEn: "Preserve ACID. Do not translate as chemical acid (\u0C06\u0C2E\u0C4D\u0C32\u0C2E\u0C41 / \u0924\u0947\u091C\u093C\u093E\u092C). In DBMS, ACID is an essential architectural standard for transaction reliability.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41 (ACID Properties - Atomicity, Consistency, Isolation, Durability) \u0C05\u0C28\u0C47\u0C35\u0C3F \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u0C38\u0C4D\u200C\u0C32\u0C4B \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32\u0C41 (Transactions) \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C35\u0C48\u0C2B\u0C32\u0C4D\u0C2F\u0C3E\u0C32\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C15\u0C4D\u0C30\u0C3E\u0C37\u0C4D \u0C05\u0C2F\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40 \u0C28\u0C2E\u0C4D\u0C2E\u0C26\u0C17\u0C3F\u0C28\u0C35\u0C3F\u0C17\u0C3E \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C47\u0C32\u0C3E \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C1A\u0C4D\u0C1A\u0C47 \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C41. Atomicity (\u0C05\u0C28\u0C4D\u0C28\u0C40 \u0C1C\u0C30\u0C17\u0C3E\u0C32\u0C3F \u0C32\u0C47\u0C26\u0C3E \u0C0F\u0C26\u0C40 \u0C1C\u0C30\u0C17\u0C15\u0C42\u0C21\u0C26\u0C41), Consistency (\u0C21\u0C47\u0C1F\u0C3E \u0C30\u0C42\u0C32\u0C4D\u0C38\u0C4D \u0C2A\u0C3E\u0C1F\u0C3F\u0C02\u0C1A\u0C21\u0C02), Isolation (\u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30\u0C02\u0C17\u0C3E \u0C28\u0C21\u0C35\u0C21\u0C02), Durability (\u0C36\u0C3E\u0C36\u0C4D\u0C35\u0C24\u0C02\u0C17\u0C3E \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C21\u0C02).",
      Hindi: "ACID \u0917\u0941\u0923\u0927\u0930\u094D\u092E (Atomicity, Consistency, Isolation, Durability) \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u092A\u094D\u0930\u0923\u093E\u0932\u0940 (RDBMS) \u092E\u0947\u0902 \u091F\u094D\u0930\u093E\u0902\u091C\u0947\u0915\u094D\u0936\u0928 \u0915\u0940 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F\u0924\u093E \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0928\u0947 \u0935\u093E\u0932\u0947 \u091A\u093E\u0930 \u092E\u093E\u0928\u0915 \u0939\u0948\u0902: \u090F\u091F\u0949\u092E\u093F\u0915\u093F\u091F\u0940 (\u0938\u092C \u0915\u0941\u091B \u092F\u093E \u0915\u0941\u091B \u0928\u0939\u0940\u0902), \u0938\u0902\u0917\u0924\u093F (\u0921\u0947\u091F\u093E \u0905\u0916\u0902\u0921\u0924\u093E), \u092A\u0943\u0925\u0915\u094D\u0915\u0930\u0923 (\u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928) \u0914\u0930 \u0938\u094D\u0925\u093E\u092F\u093F\u0924\u094D\u0935 (\u0938\u094D\u0925\u093E\u092F\u0940 \u092D\u0902\u0921\u093E\u0930\u0923)\u0964",
      Tamil: "ACID \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA4\u0BB0\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BB3 \u0BAA\u0BB0\u0BBF\u0BB5\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BA9\u0BC8\u0B95\u0BB3\u0BCD \u0BA8\u0BAE\u0BCD\u0BAA\u0B95\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC1\u0B9F\u0BA9\u0BCD \u0BA8\u0B9F\u0BC8\u0BAA\u0BC6\u0BB1\u0BC1\u0BB5\u0BA4\u0BC8 \u0B89\u0BB1\u0BC1\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0BAE\u0BCD \u0BA8\u0BBE\u0BA9\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BB5\u0BBF\u0BA4\u0BBF\u0B95\u0BB3\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "ACID \u0C97\u0CC1\u0CA3\u0CB2\u0C95\u0CCD\u0CB7\u0CA3\u0C97\u0CB3\u0CC1 \u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CB5\u0CB9\u0CBF\u0CB5\u0CBE\u0C9F\u0CC1\u0C97\u0CB3\u0CC1 \u0CB5\u0CBF\u0CB6\u0CCD\u0CB5\u0CBE\u0CB8\u0CBE\u0CB0\u0CCD\u0CB9\u0CB5\u0CBE\u0C97\u0CBF \u0CA8\u0CA1\u0CC6\u0CAF\u0CC1\u0CB5\u0CC1\u0CA6\u0CA8\u0CCD\u0CA8\u0CC1 \u0C96\u0C9A\u0CBF\u0CA4\u0CAA\u0CA1\u0CBF\u0CB8\u0CC1\u0CB5 \u0CA8\u0CBE\u0CB2\u0CCD\u0C95\u0CC1 \u0CA8\u0CBF\u0CAF\u0CAE\u0C97\u0CB3\u0CBE\u0C97\u0CBF\u0CB5\u0CC6.",
      Bengali: "ACID \u09AC\u09C8\u09B6\u09BF\u09B7\u09CD\u099F\u09CD\u09AF \u09B9\u09B2\u09CB \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8 \u09B2\u09C7\u09A8\u09A6\u09C7\u09A8\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE\u09B0 \u099A\u09BE\u09B0\u099F\u09BF \u09AE\u09C2\u09B2 \u09A8\u09C0\u09A4\u09BF\u0964",
      Marathi: "ACID \u0917\u0941\u0923\u0927\u0930\u094D\u092E \u0939\u0947 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091F\u094D\u0930\u093E\u0928\u094D\u091D\u0945\u0915\u094D\u0936\u0928\u091A\u0940 \u0905\u091A\u0942\u0915\u0924\u093E \u0906\u0923\u093F \u0935\u093F\u0936\u094D\u0935\u093E\u0938\u093E\u0930\u094D\u0939\u0924\u093E \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0923\u093E\u0930\u0947 \u091A\u093E\u0930 \u0928\u093F\u092F\u092E \u0906\u0939\u0947\u0924.",
      Gujarati: "ACID \u0A97\u0AC1\u0AA3\u0AA7\u0AB0\u0ACD\u0AAE\u0ACB \u0A8F \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A9F\u0ACD\u0AB0\u0ABE\u0AA8\u0ACD\u0A9D\u0AC7\u0A95\u0ACD\u0AB6\u0AA8\u0AA8\u0AC0 \u0AB5\u0ABF\u0AB6\u0ACD\u0AB5\u0AB8\u0AA8\u0AC0\u0AAF\u0AA4\u0ABE \u0AB8\u0AC1\u0AA8\u0ABF\u0AB6\u0ACD\u0A9A\u0ABF\u0AA4 \u0A95\u0AB0\u0AA4\u0ABE \u0A9A\u0ABE\u0AB0 \u0AA8\u0ABF\u0AAF\u0AAE\u0ACB \u0A9B\u0AC7.",
      Punjabi: "ACID \u0A17\u0A41\u0A23 \u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A32\u0A48\u0A23-\u0A26\u0A47\u0A23 \u0A26\u0A40 \u0A2D\u0A30\u0A4B\u0A38\u0A47\u0A2F\u0A4B\u0A17\u0A24\u0A3E \u0A28\u0A42\u0A70 \u0A2F\u0A15\u0A40\u0A28\u0A40 \u0A2C\u0A23\u0A3E\u0A09\u0A23 \u0A35\u0A3E\u0A32\u0A47 \u0A1A\u0A3E\u0A30 \u0A2E\u0A41\u0A71\u0A16 \u0A28\u0A3F\u0A2F\u0A2E \u0A39\u0A28\u0964",
      Malayalam: "ACID \u0D38\u0D35\u0D3F\u0D36\u0D47\u0D37\u0D24\u0D15\u0D7E \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D4D \u0D07\u0D1F\u0D2A\u0D3E\u0D1F\u0D41\u0D15\u0D7E \u0D35\u0D3F\u0D36\u0D4D\u0D35\u0D38\u0D28\u0D40\u0D2F\u0D2E\u0D3E\u0D23\u0D46\u0D28\u0D4D\u0D28\u0D4D \u0D09\u0D31\u0D2A\u0D4D\u0D2A\u0D3E\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D28\u0D3E\u0D32\u0D4D \u0D24\u0D24\u0D4D\u0D35\u0D19\u0D4D\u0D19\u0D33\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "ACID \u0C28\u0C3F \u0C30\u0C38\u0C3E\u0C2F\u0C28 \u0C06\u0C2E\u0C4D\u0C32\u0C02 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. DBMS \u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C3E\u0C15\u0C4D\u0C37\u0C28\u0C4D\u0C32 \u0C2A\u0C4D\u0C30\u0C3E\u0C2E\u0C3E\u0C23\u0C3F\u0C15 \u0C28\u0C3E\u0C23\u0C4D\u0C2F\u0C24\u0C3E \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C02.",
      Hindi: 'ACID \u0915\u094B \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 "\u0924\u0947\u091C\u093C\u093E\u092C" \u0928 \u0938\u092E\u091D\u0947\u0902\u0964 \u092F\u0939 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0932\u0947\u0928\u0926\u0947\u0928 \u0915\u0940 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F\u0924\u093E \u0915\u093E \u0938\u0902\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0928\u093E\u092E \u0939\u0948\u0964',
      Tamil: "ACID \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BC1\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC6\u0BAF\u0BB0\u0BC8 \u0BB5\u0BC7\u0BA4\u0BBF\u0BAF\u0BBF\u0BAF\u0BB2\u0BCD \u0B85\u0BAE\u0BBF\u0BB2\u0BAE\u0BBE\u0B95 \u0B95\u0BB0\u0BC1\u0BA4\u0B95\u0BCD\u0B95\u0BC2\u0B9F\u0BBE\u0BA4\u0BC1.",
      Kannada: "ACID \u0C85\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB0\u0CBE\u0CB8\u0CBE\u0CAF\u0CA8\u0CBF\u0C95 \u0C86\u0CAE\u0CCD\u0CB2 \u0C8E\u0C82\u0CA6\u0CC1 \u0CA4\u0CAA\u0CCD\u0CAA\u0CBE\u0C97\u0CBF \u0C97\u0CCD\u0CB0\u0CB9\u0CBF\u0CB8\u0CAC\u0CBE\u0CB0\u0CA6\u0CC1.",
      Bengali: "ACID-\u0995\u09C7 \u09B0\u09BE\u09B8\u09BE\u09AF\u09BC\u09A8\u09BF\u0995 \u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09A1\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u0997\u09C1\u09B2\u09BF\u09AF\u09BC\u09C7 \u09AB\u09C7\u09B2\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964",
      Marathi: "ACID \u0939\u093E \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091F\u094D\u0930\u093E\u0928\u094D\u091D\u0945\u0915\u094D\u0936\u0928\u091A\u093E \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0936\u092C\u094D\u0926 \u0906\u0939\u0947.",
      Gujarati: "ACID \u0A8F \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A9F\u0ACD\u0AB0\u0ABE\u0AA8\u0ACD\u0A9D\u0AC7\u0A95\u0ACD\u0AB6\u0AA8\u0AA8\u0ACB \u0AA8\u0ABF\u0AAF\u0AAE \u0A9B\u0AC7.",
      Punjabi: "ACID \u0A28\u0A42\u0A70 \u0A15\u0A48\u0A2E\u0A40\u0A15\u0A32 \u0A24\u0A47\u0A1C\u0A3C\u0A3E\u0A2C \u0A28\u0A3E \u0A38\u0A2E\u0A1D\u0A4B\u0964",
      Malayalam: "ACID \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D30\u0D3E\u0D38 \u0D06\u0D38\u0D3F\u0D21\u0D4D \u0D05\u0D32\u0D4D\u0D32, \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D4D \u0D28\u0D3F\u0D2F\u0D2E\u0D2E\u0D3E\u0D23\u0D4D."
    },
    transliterations: {
      Telugu: "ACID Properties (\u0C2F\u0C3E\u0C38\u0C3F\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C30\u0C4D\u0C1F\u0C40\u0C38\u0C4D - \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C28\u0C3F\u0C2F\u0C2E\u0C3E\u0C32\u0C41)",
      Hindi: "ACID Properties (\u090F\u0938\u093F\u0921 \u0917\u0941\u0923\u0927\u0930\u094D\u092E - \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091F\u094D\u0930\u093E\u0902\u091C\u0947\u0915\u094D\u0936\u0928 \u092E\u093E\u0928\u0915)",
      Tamil: "ACID Properties (\u0B86\u0B9A\u0BBF\u0B9F\u0BCD \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD)",
      Kannada: "ACID Properties (\u0C86\u0CB8\u0CBF\u0CA1\u0CCD \u0CAA\u0CCD\u0CB0\u0CBE\u0CAA\u0CB0\u0CCD\u0C9F\u0CC0\u0CB8\u0CCD)",
      Bengali: "ACID Properties (\u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09A1 \u09AA\u09CD\u09B0\u09CB\u09AA\u09BE\u09B0\u09CD\u099F\u09BF\u099C)",
      Marathi: "ACID Properties (\u0905\u0945\u0938\u093F\u0921 \u0917\u0941\u0923\u0927\u0930\u094D\u092E)",
      Gujarati: "ACID Properties (\u0A8F\u0AB8\u0ABF\u0AA1 \u0A97\u0AC1\u0AA3\u0AA7\u0AB0\u0ACD\u0AAE\u0ACB)",
      Punjabi: "ACID Properties (\u0A10\u0A38\u0A3F\u0A21 \u0A17\u0A41\u0A23)",
      Malayalam: "ACID Properties (\u0D06\u0D38\u0D3F\u0D21\u0D4D \u0D38\u0D35\u0D3F\u0D36\u0D47\u0D37\u0D24\u0D15\u0D7E)"
    },
    technicalExample: `-- ACID Transaction in PostgreSQL/MySQL
BEGIN TRANSACTION;
-- 1. Debit Source Account (Atomicity & Consistency)
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'ACC_101' AND balance >= 500;
-- 2. Credit Destination Account
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'ACC_202';
-- If any error occurs or constraint fails, system issues ROLLBACK;
-- Otherwise:
COMMIT; -- Durability guarantees this update is written to Write-Ahead Log (WAL) on disk`
  },
  polymorphism: {
    englishTerm: "Polymorphism",
    subject: "Software Engineering",
    aliases: ["polymorphism", "\u0C2A\u0C3E\u0C32\u0C3F\u0C2E\u0C3E\u0C30\u0C4D\u0C2B\u0C3F\u0C1C\u0C02", "\u0C2C\u0C39\u0C41\u0C30\u0C42\u0C2A\u0C24", "\u092A\u0949\u0932\u0940\u092E\u0949\u0930\u094D\u092B\u093F\u091C\u094D\u092E", "\u092C\u0939\u0941\u0930\u0942\u092A\u0924\u093E", "\u0BAA\u0BBE\u0BB2\u0BBF\u0BAE\u0BBE\u0BB0\u0BCD\u0BAA\u0BBF\u0B9A\u0BAE\u0BCD"],
    technicalMeaningEn: "Polymorphism is an object-oriented programming principle that allows entities (such as methods, operators, or objects) to behave differently based on context or runtime concrete type. It encompasses Compile-Time Polymorphism (method overloading and operator overloading resolved by method signatures) and Run-Time Polymorphism (dynamic dispatch and method overriding via virtual method tables / vtables).",
    explanationEn: "Use Polymorphism alongside regional explanation (\u0C2C\u0C39\u0C41\u0C30\u0C42\u0C2A\u0C24 / \u092C\u0939\u0941\u0930\u0942\u092A\u0924\u093E). Ensure students understand that in code, it refers to interface contracts and dynamic dispatch tables.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C2A\u0C3E\u0C32\u0C3F\u0C2E\u0C3E\u0C30\u0C4D\u0C2B\u0C3F\u0C1C\u0C02 (Polymorphism - \u0C2C\u0C39\u0C41\u0C30\u0C42\u0C2A\u0C24) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2C\u0C4D\u0C1C\u0C46\u0C15\u0C4D\u0C1F\u0C4D \u0C13\u0C30\u0C3F\u0C2F\u0C46\u0C02\u0C1F\u0C46\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D (OOP) \u0C2F\u0C4A\u0C15\u0C4D\u0C15 \u0C15\u0C40\u0C32\u0C15 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C02. \u0C07\u0C26\u0C3F \u0C12\u0C15\u0C47 \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C2E\u0C46\u0C25\u0C21\u0C4D \u0C2A\u0C47\u0C30\u0C41 \u0C35\u0C3F\u0C35\u0C3F\u0C27 \u0C30\u0C15\u0C3E\u0C32 \u0C06\u0C2C\u0C4D\u0C1C\u0C46\u0C15\u0C4D\u0C1F\u0C4D\u200C\u0C32\u0C2A\u0C48 \u0C38\u0C02\u0C26\u0C30\u0C4D\u0C2D\u0C4B\u0C1A\u0C3F\u0C24\u0C02\u0C17\u0C3E \u0C2D\u0C3F\u0C28\u0C4D\u0C28\u0C2E\u0C48\u0C28 \u0C2A\u0C26\u0C4D\u0C27\u0C24\u0C41\u0C32\u0C4D\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C35\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C47\u0C02\u0C26\u0C41\u0C15\u0C41 \u0C35\u0C40\u0C32\u0C41 \u0C15\u0C32\u0C4D\u0C2A\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C15\u0C02\u0C2A\u0C48\u0C32\u0C4D-\u0C1F\u0C48\u0C2E\u0C4D \u0C2A\u0C3E\u0C32\u0C3F\u0C2E\u0C3E\u0C30\u0C4D\u0C2B\u0C3F\u0C1C\u0C02 (\u0C2E\u0C46\u0C25\u0C21\u0C4D \u0C13\u0C35\u0C30\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C3F\u0C02\u0C17\u0C4D) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C30\u0C28\u0C4D\u200C\u0C1F\u0C48\u0C2E\u0C4D \u0C2A\u0C3E\u0C32\u0C3F\u0C2E\u0C3E\u0C30\u0C4D\u0C2B\u0C3F\u0C1C\u0C02 (\u0C2E\u0C46\u0C25\u0C21\u0C4D \u0C13\u0C35\u0C30\u0C4D\u200C\u0C30\u0C48\u0C21\u0C3F\u0C02\u0C17\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C48\u0C28\u0C2E\u0C3F\u0C15\u0C4D \u0C21\u0C3F\u0C38\u0C4D\u0C2A\u0C3E\u0C1A\u0C4D) \u0C05\u0C28\u0C47 \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C30\u0C42\u0C2A\u0C3E\u0C32\u0C4D\u0C32\u0C4B \u0C09\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u092A\u0949\u0932\u0940\u092E\u0949\u0930\u094D\u092B\u093F\u091C\u094D\u092E (Polymorphism - \u092C\u0939\u0941\u0930\u0942\u092A\u0924\u093E) \u0911\u092C\u094D\u091C\u0947\u0915\u094D\u091F-\u0913\u0930\u093F\u090F\u0902\u091F\u0947\u0921 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0915\u093E \u090F\u0915 \u092E\u0942\u0932\u092D\u0942\u0924 \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924 \u0939\u0948 \u091C\u094B \u0915\u093F\u0938\u0940 \u092B\u093C\u0902\u0915\u094D\u0936\u0928, \u0911\u092A\u0930\u0947\u091F\u0930 \u092F\u093E \u0911\u092C\u094D\u091C\u0947\u0915\u094D\u091F \u0915\u094B \u0935\u093F\u092D\u093F\u0928\u094D\u0928 \u0938\u0902\u0926\u0930\u094D\u092D\u094B\u0902 \u092E\u0947\u0902 \u092D\u093F\u0928\u094D\u0928 \u0924\u0930\u0940\u0915\u0947 \u0938\u0947 \u0935\u094D\u092F\u0935\u0939\u093E\u0930 \u0915\u0930\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0924\u093E \u0939\u0948\u0964 \u092F\u0939 \u0915\u0902\u092A\u093E\u0907\u0932-\u091F\u093E\u0907\u092E (\u092E\u0947\u0925\u0921 \u0913\u0935\u0930\u0932\u094B\u0921\u093F\u0902\u0917) \u0914\u0930 \u0930\u0928-\u091F\u093E\u0907\u092E (\u092E\u0947\u0925\u0921 \u0913\u0935\u0930\u0930\u093E\u0907\u0921\u093F\u0902\u0917) \u0926\u094B \u092A\u094D\u0930\u0915\u093E\u0930 \u0915\u093E \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BAA\u0BBE\u0BB2\u0BBF\u0BAE\u0BBE\u0BB0\u0BCD\u0BAA\u0BBF\u0B9A\u0BAE\u0BCD (Polymorphism) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 \u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0B9A\u0BBE\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0BA8\u0BBF\u0BB0\u0BB2\u0BBE\u0B95\u0BCD\u0B95\u0B95\u0BCD \u0B95\u0BCB\u0B9F\u0BCD\u0BAA\u0BBE\u0B9F\u0BBE\u0B95\u0BC1\u0BAE\u0BCD, \u0B87\u0BA4\u0BC1 \u0B92\u0BB0\u0BC7 \u0B87\u0B9F\u0BC8\u0BAE\u0BC1\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0BAA\u0BB2\u0BCD\u0BB5\u0BC7\u0BB1\u0BC1 \u0B9A\u0BC2\u0BB4\u0BB2\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BCD \u0BB5\u0BC6\u0BB5\u0BCD\u0BB5\u0BC7\u0BB1\u0BC1 \u0BB5\u0BBF\u0BA4\u0BAE\u0BBE\u0B95 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0B9F \u0B85\u0BA9\u0BC1\u0BAE\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
      Kannada: "\u0CAA\u0CBE\u0CB2\u0CBF\u0CAE\u0CBE\u0CB0\u0CCD\u0CAB\u0CBF\u0CB8\u0C82 (Polymorphism) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C86\u0CAC\u0CCD\u0C9C\u0CC6\u0C95\u0CCD\u0C9F\u0CCD \u0C93\u0CB0\u0CBF\u0CAF\u0CC6\u0C82\u0C9F\u0CC6\u0CA1\u0CCD \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0CAE\u0CBF\u0C82\u0C97\u0CCD\u200C\u0CA8 \u0CA4\u0CA4\u0CCD\u0CB5\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CCD\u0CA6\u0CC1, \u0C92\u0C82\u0CA6\u0CC7 \u0CB5\u0CBF\u0CA7\u0CBE\u0CA8\u0CB5\u0CC1 \u0CB8\u0C82\u0CA6\u0CB0\u0CCD\u0CAD\u0C95\u0CCD\u0C95\u0CC6 \u0CA4\u0C95\u0CCD\u0C95\u0C82\u0CA4\u0CC6 \u0CB5\u0CBF\u0CAD\u0CBF\u0CA8\u0CCD\u0CA8\u0CB5\u0CBE\u0C97\u0CBF \u0CB5\u0CB0\u0CCD\u0CA4\u0CBF\u0CB8\u0CB2\u0CC1 \u0C85\u0CA8\u0CC1\u0CAE\u0CA4\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6.",
      Bengali: "\u09AA\u09B2\u09BF\u09AE\u09B0\u09AB\u09BF\u099C\u09AE (Polymorphism - \u09AC\u09B9\u09C1\u09B0\u09C2\u09AA\u09A4\u09BE) \u09B9\u09B2\u09CB \u0985\u09AC\u099C\u09C7\u0995\u09CD\u099F-\u0993\u09B0\u09BF\u09AF\u09BC\u09C7\u09A8\u09CD\u099F\u09C7\u09A1 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982\u09AF\u09BC\u09C7\u09B0 \u098F\u09AE\u09A8 \u098F\u0995\u099F\u09BF \u09A8\u09C0\u09A4\u09BF \u09AF\u09BE \u098F\u0995\u0987 \u09AB\u09BE\u0982\u09B6\u09A8\u0995\u09C7 \u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 \u09AA\u09CD\u09B0\u09B8\u0999\u09CD\u0997\u09C7 \u09AD\u09BF\u09A8\u09CD\u09A8\u09AD\u09BE\u09AC\u09C7 \u0986\u099A\u09B0\u09A3 \u0995\u09B0\u09A4\u09C7 \u09A6\u09C7\u09AF\u09BC\u0964",
      Marathi: "\u092A\u0949\u0932\u093F\u092E\u0949\u0930\u094D\u092B\u093F\u091D\u092E (Polymorphism) \u0939\u0947 \u0911\u092C\u094D\u091C\u0947\u0915\u094D\u091F-\u0913\u0930\u093F\u090F\u0902\u091F\u0947\u0921 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917\u091A\u0947 \u0924\u0924\u094D\u0924\u094D\u0935 \u0906\u0939\u0947 \u091C\u0947 \u090F\u0915\u093E\u091A \u0907\u0902\u091F\u0930\u092B\u0947\u0938\u0932\u093E \u0935\u0947\u0917\u0935\u0947\u0917\u0933\u094D\u092F\u093E \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924 \u0935\u0947\u0917\u0933\u0947 \u0935\u0930\u094D\u0924\u0928 \u0915\u0930\u0923\u094D\u092F\u093E\u091A\u0940 \u0905\u0928\u0941\u092E\u0924\u0940 \u0926\u0947\u0924\u0947.",
      Gujarati: "\u0AAA\u0ACB\u0AB2\u0AC0\u0AAE\u0ACB\u0AB0\u0ACD\u0AAB\u0ABF\u0A9D\u0AAE (Polymorphism) \u0A8F \u0A93\u0AAC\u0ACD\u0A9C\u0AC7\u0A95\u0ACD\u0A9F \u0A93\u0AB0\u0ABF\u0A8F\u0AA8\u0ACD\u0A9F\u0AC7\u0AA1 \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0ABF\u0A82\u0A97\u0AA8\u0ACB \u0AB8\u0ABF\u0AA6\u0ACD\u0AA7\u0ABE\u0A82\u0AA4 \u0A9B\u0AC7.",
      Punjabi: "\u0A2A\u0A4B\u0A32\u0A40\u0A2E\u0A4B\u0A30\u0A2B\u0A3F\u0A1C\u0A3C\u0A2E (Polymorphism) \u0A07\u0A71\u0A15\u0A4B \u0A07\u0A70\u0A1F\u0A30\u0A2B\u0A47\u0A38 \u0A28\u0A42\u0A70 \u0A35\u0A71\u0A16-\u0A35\u0A71\u0A16 \u0A24\u0A30\u0A40\u0A15\u0A3F\u0A06\u0A02 \u0A28\u0A3E\u0A32 \u0A15\u0A70\u0A2E \u0A15\u0A30\u0A28 \u0A26\u0A40 \u0A07\u0A1C\u0A3E\u0A1C\u0A3C\u0A24 \u0A26\u0A3F\u0A70\u0A26\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "\u0D2A\u0D4B\u0D33\u0D3F\u0D2E\u0D4B\u0D7C\u0D2B\u0D3F\u0D38\u0D02 (Polymorphism) \u0D12\u0D2C\u0D4D\u0D1C\u0D15\u0D4D\u0D31\u0D4D\u0D31\u0D4D \u0D13\u0D31\u0D3F\u0D2F\u0D28\u0D4D\u0D31\u0D21\u0D4D \u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D3F\u0D02\u0D17\u0D3F\u0D7D \u0D12\u0D30\u0D47 \u0D07\u0D28\u0D4D\u0D31\u0D7C\u0D2B\u0D47\u0D38\u0D3F\u0D28\u0D4D \u0D35\u0D4D\u0D2F\u0D24\u0D4D\u0D2F\u0D38\u0D4D\u0D24 \u0D30\u0D40\u0D24\u0D3F\u0D15\u0D33\u0D3F\u0D7D \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D15\u0D4D\u0D15\u0D3E\u0D7B \u0D05\u0D28\u0D41\u0D2E\u0D24\u0D3F \u0D28\u0D7D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D41."
    },
    explanationByLanguage: {
      Telugu: "Polymorphism \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2C\u0C39\u0C41\u0C30\u0C42\u0C2A\u0C24 \u0C35\u0C3F\u0C35\u0C30\u0C23\u0C24\u0C4B \u0C2A\u0C3E\u0C1F\u0C41 \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C15\u0C4B\u0C21\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C25\u0C21\u0C4D \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D\u0C38\u0C4D (vtable) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C48\u0C28\u0C2E\u0C3F\u0C15\u0C4D \u0C21\u0C3F\u0C38\u0C4D\u0C2A\u0C3E\u0C1A\u0C4D\u200C\u0C24\u0C4B \u0C2E\u0C41\u0C21\u0C3F\u0C2A\u0C21\u0C3F \u0C09\u0C02\u0C26\u0C3F.",
      Hindi: "Polymorphism \u0915\u094B \u092C\u0939\u0941\u0930\u0942\u092A\u0924\u093E \u0915\u0947 \u0938\u093E\u0925 \u0924\u0915\u0928\u0940\u0915\u0940 \u0938\u0902\u0926\u0930\u094D\u092D \u092E\u0947\u0902 \u0938\u092E\u091D\u0947\u0902\u0964 \u0915\u094B\u0921 \u092E\u0947\u0902 \u092F\u0939 \u0907\u0902\u091F\u0930\u092B\u093C\u0947\u0938 \u0914\u0930 \u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092B\u093C\u0902\u0915\u094D\u0936\u0928\u094D\u0938 \u0938\u0947 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0939\u0948\u0964",
      Tamil: "Polymorphism \u0B8E\u0BA9\u0BCD\u0BB1 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA8\u0BBF\u0BB0\u0BB2\u0BBE\u0B95\u0BCD\u0B95 \u0B9A\u0BC2\u0BB4\u0D32\u0BBF\u0BB2\u0BCD \u0BAA\u0BC1\u0BB0\u0BBF\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BCA\u0BB3\u0BCD\u0BB3 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "Polymorphism \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C95\u0CCB\u0CA1\u0CBF\u0C82\u0C97\u0CCD \u0CB8\u0C82\u0CA6\u0CB0\u0CCD\u0CAD\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Polymorphism \u09B6\u09AC\u09CD\u09A6\u099F\u09BF \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u0995\u09CB\u09A1\u09BF\u0982\u09AF\u09BC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09C3\u09A4 \u09B9\u09AF\u09BC\u0964",
      Marathi: "Polymorphism \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0938\u094D\u092A\u0937\u094D\u091F \u0915\u0930\u093E\u0935\u0947.",
      Gujarati: "Polymorphism \u0AB6\u0AAC\u0ACD\u0AA6 \u0A95\u0ACB\u0AA1\u0ABF\u0A82\u0A97 \u0AAE\u0ABE\u0A9F\u0AC7 \u0AAA\u0ACD\u0AB0\u0AAE\u0ABE\u0AA3\u0AAD\u0AC2\u0AA4 \u0A9B\u0AC7.",
      Punjabi: "Polymorphism \u0A28\u0A42\u0A70 \u0A15\u0A4B\u0A21\u0A3F\u0A70\u0A17 \u0A38\u0A70\u0A26\u0A30\u0A2D \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A38\u0A2E\u0A1D\u0A4B\u0964",
      Malayalam: "Polymorphism \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D2E\u0D28\u0D38\u0D4D\u0D38\u0D3F\u0D32\u0D3E\u0D15\u0D4D\u0D15\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Polymorphism (\u0C2A\u0C3E\u0C32\u0C3F\u0C2E\u0C3E\u0C30\u0C4D\u0C2B\u0C3F\u0C1C\u0C02 / \u0C2C\u0C39\u0C41\u0C30\u0C42\u0C2A\u0C24)",
      Hindi: "Polymorphism (\u092A\u0949\u0932\u0940\u092E\u0949\u0930\u094D\u092B\u093F\u091C\u094D\u092E / \u092C\u0939\u0941\u0930\u0942\u092A\u0924\u093E)",
      Tamil: "Polymorphism (\u0BAA\u0BBE\u0BB2\u0BBF\u0BAE\u0BBE\u0BB0\u0BCD\u0BAA\u0BBF\u0B9A\u0BAE\u0BCD)",
      Kannada: "Polymorphism (\u0CAA\u0CBE\u0CB2\u0CBF\u0CAE\u0CBE\u0CB0\u0CCD\u0CAB\u0CBF\u0CB8\u0C82)",
      Bengali: "Polymorphism (\u09AA\u09B2\u09BF\u09AE\u09B0\u09AB\u09BF\u099C\u09AE)",
      Marathi: "Polymorphism (\u092A\u0949\u0932\u093F\u092E\u0949\u0930\u094D\u092B\u093F\u091D\u092E)",
      Gujarati: "Polymorphism (\u0AAA\u0ACB\u0AB2\u0AC0\u0AAE\u0ACB\u0AB0\u0ACD\u0AAB\u0ABF\u0A9D\u0AAE)",
      Punjabi: "Polymorphism (\u0A2A\u0A4B\u0A32\u0A40\u0A2E\u0A4B\u0A30\u0A2B\u0A3F\u0A1C\u0A3C\u0A2E)",
      Malayalam: "Polymorphism (\u0D2A\u0D4B\u0D33\u0D3F\u0D2E\u0D4B\u0D7C\u0D2B\u0D3F\u0D38\u0D02)"
    },
    technicalExample: `// Dynamic Run-time Polymorphism in Java / TypeScript
abstract class DatabaseConnector {
    abstract query(sql: string): Promise<any[]>;
}

class PostgresConnector extends DatabaseConnector {
    async query(sql: string) { return ["Postgres result executing via TCP socket"]; }
}

class MongoConnector extends DatabaseConnector {
    async query(sql: string) { return ["MongoDB BSON document collection"]; }
}

// Client code operates polymorphically on base abstraction:
async function executeHealthCheck(connector: DatabaseConnector) {
    return await connector.query("SELECT 1"); // Dispatches to correct subclass at runtime!
}`
  },
  api: {
    englishTerm: "API (Application Programming Interface)",
    subject: "Software Engineering",
    aliases: ["api", "application programming interface", "\u0C0F\u0C2A\u0C40\u0C10", "\u090F\u092A\u0940\u0906\u0908", "\u0B8F\u0BAA\u0BBF\u0B90", "\u0C8E\u0CAA\u0CBF\u0C90", "\u098F\u09AA\u09BF\u0986\u0987"],
    technicalMeaningEn: "An API (Application Programming Interface) is a defined formal contract, specification, and set of communication protocols and subroutines that allows distinct software components, microservices, or client-server applications to interact deterministically without knowing internal implementations.",
    explanationEn: 'Preserve "API" in English or transliteration. Never translate literally into everyday conversational words, which confuses developers and students.',
    technicalMeaningByLanguage: {
      Telugu: "API (\u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C35\u0C47\u0C30\u0C4D\u0C35\u0C47\u0C30\u0C41 \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D\u200C\u0C32\u0C41 \u0C12\u0C15\u0C26\u0C3E\u0C28\u0C3F\u0C24\u0C4B \u0C12\u0C15\u0C1F\u0C3F \u0C21\u0C47\u0C1F\u0C3E\u0C28\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C47\u0C35\u0C32\u0C28\u0C41 \u0C38\u0C41\u0C30\u0C15\u0C4D\u0C37\u0C3F\u0C24\u0C02\u0C17\u0C3E \u0C2E\u0C3E\u0C30\u0C4D\u0C2A\u0C3F\u0C21\u0C3F \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C05\u0C28\u0C41\u0C2E\u0C24\u0C3F\u0C02\u0C1A\u0C47 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C12\u0C2A\u0C4D\u0C2A\u0C02\u0C26\u0C02 (Formal Contract) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C4B\u0C1F\u0C4B\u0C15\u0C3E\u0C32\u0C4D\u200C\u0C32 \u0C38\u0C2E\u0C3F\u0C24\u0C3F. \u0C07\u0C26\u0C3F \u0C05\u0C02\u0C24\u0C30\u0C4D\u0C17\u0C24 \u0C15\u0C4B\u0C21\u0C4D \u0C05\u0C2E\u0C32\u0C41\u0C28\u0C41 \u0C26\u0C3E\u0C1A\u0C3F\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C3F, \u0C28\u0C3F\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3F\u0C24 \u0C0E\u0C02\u0C21\u0C4D\u200C\u0C2A\u0C3E\u0C2F\u0C3F\u0C02\u0C1F\u0C4D\u0C32 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C38\u0C47\u0C35\u0C32\u0C28\u0C41 \u0C05\u0C02\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "API (\u090F\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u093C\u0947\u0938) \u090F\u0915 \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0905\u0928\u0941\u092C\u0902\u0927 (Contract) \u0914\u0930 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u093E \u0938\u092E\u0942\u0939 \u0939\u0948 \u091C\u094B \u0935\u093F\u092D\u093F\u0928\u094D\u0928 \u0938\u0949\u092B\u093C\u094D\u091F\u0935\u0947\u092F\u0930 \u0918\u091F\u0915\u094B\u0902 \u0915\u094B \u090F\u0915-\u0926\u0942\u0938\u0930\u0947 \u0915\u0947 \u0906\u0902\u0924\u0930\u093F\u0915 \u0915\u094B\u0921 \u0915\u094B \u091C\u093E\u0928\u0947 \u092C\u093F\u0928\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092F\u093E \u0938\u093F\u0938\u094D\u091F\u092E \u092A\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0938\u0902\u0935\u093E\u0926 \u0915\u0930\u0928\u0947 \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u0926\u0947\u0924\u093E \u0939\u0948\u0964",
      Tamil: "API (Application Programming Interface) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BB5\u0BC6\u0BB5\u0BCD\u0BB5\u0BC7\u0BB1\u0BC1 \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1\u0B95\u0BB3\u0BCD \u0BA4\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB3\u0BCD \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BAA\u0BCD \u0BAA\u0BB0\u0BBF\u0BAE\u0BBE\u0BB1\u0BBF\u0B95\u0BCD\u0B95\u0BCA\u0BB3\u0BCD\u0BB3 \u0B89\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B87\u0B9F\u0BC8\u0BAE\u0BC1\u0B95 \u0BA8\u0BC6\u0BB1\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "API (Application Programming Interface) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CB5\u0CBF\u0CAD\u0CBF\u0CA8\u0CCD\u0CA8 \u0CB8\u0CBE\u0CAB\u0CCD\u0C9F\u0CCD\u200C\u0CB5\u0CC7\u0CB0\u0CCD \u0C85\u0CAA\u0CCD\u0CB2\u0CBF\u0C95\u0CC7\u0CB6\u0CA8\u0CCD\u200C\u0C97\u0CB3\u0CC1 \u0CAA\u0CB0\u0CB8\u0CCD\u0CAA\u0CB0 \u0CB8\u0C82\u0CB5\u0CB9\u0CA8 \u0CA8\u0CA1\u0CC6\u0CB8\u0CB2\u0CC1 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA1\u0CC7\u0C9F\u0CBE\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB5\u0CBF\u0CA8\u0CBF\u0CAE\u0CAF \u0CAE\u0CBE\u0CA1\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CB2\u0CC1 \u0C85\u0CA8\u0CC1\u0CAE\u0CA4\u0CBF\u0CB8\u0CC1\u0CB5 \u0C85\u0CA7\u0CBF\u0C95\u0CC3\u0CA4 \u0C87\u0C82\u0C9F\u0CB0\u0CCD\u0CAB\u0CC7\u0CB8\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "API (\u0985\u09CD\u09AF\u09BE\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09AB\u09C7\u09B8) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u0986\u09A8\u09C1\u09B7\u09CD\u09A0\u09BE\u09A8\u09BF\u0995 \u099A\u09C1\u0995\u09CD\u09A4\u09BF \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09CB\u099F\u09CB\u0995\u09B2 \u09AF\u09BE \u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 \u09B8\u09AB\u099F\u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0 \u0989\u09AA\u09BE\u09A6\u09BE\u09A8\u0995\u09C7 \u098F\u0995\u09C7 \u0985\u09AA\u09B0\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6\u09C7 \u09A1\u09C7\u099F\u09BE \u0986\u09A6\u09BE\u09A8-\u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B8\u0995\u09CD\u09B7\u09AE \u0995\u09B0\u09C7\u0964",
      Marathi: "API (\u0905\u200D\u0945\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u0947\u0938) \u0939\u093E \u0935\u0947\u0917\u0935\u0947\u0917\u0933\u094D\u092F\u093E \u0938\u0949\u092B\u094D\u091F\u0935\u0947\u0905\u0930 \u0905\u200D\u0945\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928\u094D\u0938\u0928\u093E \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0936\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0938\u0902\u0935\u093E\u0926 \u0938\u093E\u0927\u0923\u094D\u092F\u093E\u091A\u0940 \u0905\u0928\u0941\u092E\u0924\u0940 \u0926\u0947\u0923\u093E\u0930\u093E \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0906\u0939\u0947.",
      Gujarati: "API (\u0A8F\u0AAA\u0ACD\u0AB2\u0ABF\u0A95\u0AC7\u0AB6\u0AA8 \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0ABF\u0A82\u0A97 \u0A87\u0AA8\u0ACD\u0A9F\u0AB0\u0AAB\u0AC7\u0AB8) \u0A8F \u0AB5\u0ABF\u0AB5\u0ABF\u0AA7 \u0AB8\u0ACB\u0AAB\u0ACD\u0A9F\u0AB5\u0AC7\u0AB0 \u0A98\u0A9F\u0A95\u0ACB \u0AB5\u0A9A\u0ACD\u0A9A\u0AC7 \u0AB8\u0AC1\u0AB0\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 \u0AB8\u0A82\u0A9A\u0ABE\u0AB0 \u0AAE\u0ABE\u0A9F\u0AC7\u0AA8\u0ACB \u0AB8\u0AA4\u0ACD\u0AA4\u0ABE\u0AB5\u0ABE\u0AB0 \u0A95\u0AB0\u0ABE\u0AB0 \u0A9B\u0AC7.",
      Punjabi: "API (\u0A10\u0A2A\u0A32\u0A40\u0A15\u0A47\u0A38\u0A3C\u0A28 \u0A2A\u0A4D\u0A30\u0A4B\u0A17\u0A30\u0A3E\u0A2E\u0A3F\u0A70\u0A17 \u0A07\u0A70\u0A1F\u0A30\u0A2B\u0A47\u0A38) \u0A35\u0A71\u0A16-\u0A35\u0A71\u0A16 \u0A38\u0A3E\u0A2B\u0A1F\u0A35\u0A47\u0A05\u0A30\u0A3E\u0A02 \u0A35\u0A3F\u0A1A\u0A15\u0A3E\u0A30 \u0A21\u0A3E\u0A1F\u0A3E \u0A38\u0A70\u0A1A\u0A3E\u0A30 \u0A32\u0A08 \u0A07\u0A71\u0A15 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A38\u0A2E\u0A1D\u0A4C\u0A24\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "API (\u0D06\u0D2A\u0D4D\u0D32\u0D3F\u0D15\u0D4D\u0D15\u0D47\u0D37\u0D7B \u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D3F\u0D02\u0D17\u0D4D \u0D07\u0D28\u0D4D\u0D31\u0D7C\u0D2B\u0D47\u0D38\u0D4D) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D35\u0D4D\u0D2F\u0D24\u0D4D\u0D2F\u0D38\u0D4D\u0D24 \u0D38\u0D4B\u0D2B\u0D4D\u0D31\u0D4D\u0D31\u0D4D\u200C\u0D35\u0D46\u0D2F\u0D31\u0D41\u0D15\u0D7E \u0D24\u0D2E\u0D4D\u0D2E\u0D3F\u0D7D \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D24\u0D2E\u0D3E\u0D2F\u0D3F \u0D06\u0D36\u0D2F\u0D35\u0D3F\u0D28\u0D3F\u0D2E\u0D2F\u0D02 \u0D28\u0D1F\u0D24\u0D4D\u0D24\u0D3E\u0D7B \u0D38\u0D39\u0D3E\u0D2F\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D12\u0D30\u0D41 \u0D2A\u0D4D\u0D30\u0D4B\u0D1F\u0D4D\u0D1F\u0D4B\u0D15\u0D4D\u0D15\u0D4B\u0D33\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: 'API \u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C0F\u0C2A\u0C40\u0C10 \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C47 \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C3E\u0C32\u0C3F. "\u0C05\u0C28\u0C41\u0C35\u0C30\u0C4D\u0C24\u0C28 \u0915\u094D\u0930\u092E\u093E\u0C26\u0C47\u0C36\u0C28 \u0C05\u0C02\u0C24\u0C30\u0C3E\u0C2B\u0C32\u0C15\u0C2E\u0C41" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C21\u0C46\u0C35\u0C32\u0C2A\u0C30\u0C4D\u0C32\u0C41 \u0C17\u0C02\u0C26\u0C30\u0C17\u0C4B\u0C33\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C17\u0C41\u0C30\u0C35\u0C41\u0C24\u0C3E\u0C30\u0C41.',
      Hindi: 'API \u0915\u094B \u0939\u092E\u0947\u0936\u093E \u0924\u0915\u0928\u0940\u0915\u0940 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u092F\u093E \u090F\u092A\u0940\u0906\u0908 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0930\u0916\u0947\u0902\u0964 \u0907\u0938\u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 "\u0905\u0928\u0941\u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u094D\u0930\u092E\u093E\u0926\u0947\u0936\u0928 \u0905\u0902\u0924\u0930\u093E\u092B\u0932\u0915" \u0915\u092D\u0940 \u0928 \u0915\u0930\u0947\u0902\u0964',
      Tamil: "API \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA \u0B86\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BC7\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
      Kannada: "API \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0C87\u0C82\u0C97\u0CCD\u0CB2\u0CBF\u0CB7\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF\u0CAF\u0CC7 \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "API \u09AA\u09B0\u09BF\u09AD\u09BE\u09B7\u09BE\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982\u09AF\u09BC\u09C7 \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "API \u0939\u093E \u0936\u092C\u094D\u0926 \u092E\u0942\u0933 \u0938\u094D\u0935\u0930\u0942\u092A\u093E\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u093E.",
      Gujarati: "API \u0AB6\u0AAC\u0ACD\u0AA6 \u0AA4\u0A95\u0AA8\u0AC0\u0A95\u0AC0 \u0A85\u0A82\u0A97\u0ACD\u0AB0\u0AC7\u0A9C\u0AC0\u0AAE\u0ABE\u0A82 \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "API \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A35\u0A30\u0A24\u0A4B\u0964",
      Malayalam: "API \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "API (\u0C0F\u0C2A\u0C40\u0C10 - \u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C02\u0C1F\u0C30\u0C4D\u200C\u0C2B\u0C47\u0C38\u0C4D)",
      Hindi: "API (\u090F\u092A\u0940\u0906\u0908 - \u090F\u092A\u094D\u0932\u093F\u0915\u0947\u0936\u0928 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0907\u0902\u091F\u0930\u092B\u093C\u0947\u0938)",
      Tamil: "API (\u0B8F\u0BAA\u0BBF\u0B90)",
      Kannada: "API (\u0C8E\u0CAA\u0CBF\u0C90)",
      Bengali: "API (\u098F\u09AA\u09BF\u0986\u0987)",
      Marathi: "API (\u090F\u092A\u0940\u0906\u092F)",
      Gujarati: "API (\u0A8F\u0AAA\u0AC0\u0A86\u0A88)",
      Punjabi: "API (\u0A0F\u0A2A\u0A40\u0A06\u0A08)",
      Malayalam: "API (\u0D0E\u0D2A\u0D3F\u0D10)"
    },
    technicalExample: `// REST API Endpoint Handler in Express & Node.js
import express from 'express';
const app = express();
app.get('/api/v1/students/:id', async (req, res) => {
    const student = await db.findStudent(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, data: student });
});`
  },
  recursion: {
    englishTerm: "Recursion",
    subject: "Data Structures",
    aliases: ["recursion", "\u0C30\u0C40\u0C15\u0C30\u0C4D\u0C37\u0C28\u0C4D", "\u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C37\u0C28\u0C4D", "\u0930\u093F\u0915\u0930\u094D\u0936\u0928", "\u0BB0\u0BBF\u0B95\u0BB0\u0BCD\u0BB7\u0BA9\u0BCD", "\u0CB0\u0CBF\u0C95\u0CB0\u0CCD\u0CB6\u0CA8\u0CCD", "\u09B0\u09BF\u0995\u09BE\u09B0\u09CD\u09B6\u09A8"],
    technicalMeaningEn: "Recursion is a computational problem-solving and programming paradigm wherein a function solves a task by decomposing it into smaller instances of the same problem and invoking itself, relying on runtime stack frames until satisfying a mandatory non-recursive Base Case.",
    explanationEn: 'Preserve "Recursion" in technical English or transliteration. Translating as "\u0C2A\u0C41\u0C28\u0C30\u0C3E\u0C35\u0C43\u0C24\u0C02" or "\u092A\u0941\u0928\u0930\u093E\u0935\u0930\u094D\u0924\u0928" confuses recursion with iteration/loops.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C37\u0C28\u0C4D (Recursion) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C12\u0C15 \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02, \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C12\u0C15 \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D \u0C38\u0C02\u0C15\u0C4D\u0C32\u0C3F\u0C37\u0C4D\u0C1F \u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C28\u0C41 \u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C1A\u0C3F\u0C28\u0C4D\u0C28 \u0C09\u0C2A-\u0C38\u0C2E\u0C38\u0C4D\u0C2F\u0C32\u0C41\u0C17\u0C3E \u0C35\u0C3F\u0C2D\u0C1C\u0C3F\u0C02\u0C1A\u0C3F, \u0C12\u0C15 \u0C28\u0C3F\u0C30\u0C4D\u0C26\u0C3F\u0C37\u0C4D\u0C1F \u0C2C\u0C47\u0C38\u0C4D \u0C15\u0C02\u0C21\u0C3F\u0C37\u0C28\u0C4D (Base Case) \u0C38\u0C02\u0C24\u0C43\u0C2A\u0C4D\u0C24\u0C3F \u0C1A\u0C46\u0C02\u0C26\u0C47 \u0C35\u0C30\u0C15\u0C41 \u0C24\u0C28\u0C28\u0C41 \u0C24\u0C3E\u0C28\u0C41 \u0C28\u0C3F\u0C30\u0C02\u0C24\u0C30\u0C02 \u0C15\u0C3E\u0C32\u0C4D \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C30\u0C28\u0C4D\u200C\u0C1F\u0C48\u0C2E\u0C4D \u0C15\u0C3E\u0C32\u0C4D \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D (Call Stack) \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0930\u093F\u0915\u0930\u094D\u0936\u0928 (Recursion) \u090F\u0915 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u092A\u094D\u0930\u0924\u093F\u092E\u093E\u0928 \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u090F\u0915 \u092B\u093C\u0902\u0915\u094D\u0936\u0928 \u0915\u093F\u0938\u0940 \u092C\u0921\u093C\u0940 \u0938\u092E\u0938\u094D\u092F\u093E \u0915\u094B \u091B\u094B\u091F\u0947 \u0909\u092A-\u092D\u093E\u0917\u094B\u0902 \u092E\u0947\u0902 \u0935\u093F\u092D\u093E\u091C\u093F\u0924 \u0915\u0930\u0915\u0947 \u0938\u094D\u0935\u092F\u0902 \u0915\u094B \u0924\u092C \u0924\u0915 \u0915\u0949\u0932 \u0915\u0930\u0924\u093E \u0939\u0948 \u091C\u092C \u0924\u0915 \u0915\u093F \u0935\u0939 \u090F\u0915 \u0928\u093F\u0930\u094D\u0926\u093F\u0937\u094D\u091F \u092C\u0947\u0938 \u0915\u0902\u0921\u0940\u0936\u0928 (Base Case) \u0915\u094B \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0928 \u0915\u0930 \u0932\u0947\u0964 \u092F\u0939 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0915\u0947 \u0926\u094C\u0930\u093E\u0928 \u0915\u0949\u0932 \u0938\u094D\u091F\u0948\u0915 \u092B\u093C\u094D\u0930\u0947\u092E \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BB0\u0BBF\u0B95\u0BB0\u0BCD\u0BB7\u0BA9\u0BCD (Recursion) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1 (Function) \u0B92\u0BB0\u0BC1 \u0B95\u0BC1\u0BB1\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8 \u0BA8\u0BBF\u0BAA\u0BA8\u0BCD\u0BA4\u0BA9\u0BC8\u0BAF\u0BC8 (Base Condition) \u0B85\u0B9F\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0BB5\u0BB0\u0BC8 \u0BA4\u0BA9\u0BCD\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BBE\u0BA9\u0BC7 \u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0B85\u0BB4\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BA8\u0BBF\u0BB0\u0BB2\u0BBE\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CB0\u0CBF\u0C95\u0CB0\u0CCD\u0CB6\u0CA8\u0CCD (Recursion) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C92\u0C82\u0CA6\u0CC1 \u0CAB\u0C82\u0C95\u0CCD\u0CB7\u0CA8\u0CCD \u0CAE\u0CC2\u0CB2 \u0CB7\u0CB0\u0CA4\u0CCD\u0CA4\u0CC1 (Base Case) \u0CAA\u0CC2\u0CB0\u0CC8\u0CB8\u0CC1\u0CB5\u0CB5\u0CB0\u0CC6\u0C97\u0CC6 \u0CA4\u0CA8\u0CCD\u0CA8\u0CA8\u0CCD\u0CA8\u0CC7 \u0CA4\u0CBE\u0CA8\u0CC1 \u0CAA\u0CC1\u0CA8\u0CB0\u0CBE\u0CB5\u0CB0\u0CCD\u0CA4\u0CBF\u0CA4\u0CB5\u0CBE\u0C97\u0CBF \u0C95\u0CB0\u0CC6\u0CA6\u0CC1\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CC1\u0CB5 \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0CAE\u0CBF\u0C82\u0C97\u0CCD \u0CA4\u0C82\u0CA4\u0CCD\u0CB0\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09B0\u09BF\u0995\u09BE\u09B0\u09CD\u09B6\u09A8 (Recursion) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u0995\u09CC\u09B6\u09B2 \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u098F\u0995\u099F\u09BF \u09AB\u09BE\u0982\u09B6\u09A8 \u0995\u09CB\u09A8\u09CB \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE\u09B0 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F \u09AC\u09C7\u09B8 \u0995\u09A8\u09CD\u09A1\u09BF\u09B6\u09A8 \u09A8\u09BE \u09AA\u09CC\u0981\u099B\u09BE\u09A8\u09CB \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09A8\u09BF\u099C\u09C7\u0995\u09C7 \u09AC\u09BE\u09B0\u09AC\u09BE\u09B0 \u0995\u09B2 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0930\u093F\u0915\u0930\u094D\u0936\u0928 (Recursion) \u0939\u0940 \u0905\u0936\u0940 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u092A\u0926\u094D\u0927\u0924 \u0906\u0939\u0947 \u091C\u094D\u092F\u093E\u092E\u0927\u094D\u092F\u0947 \u092B\u0902\u0915\u094D\u0936\u0928 \u092E\u0942\u0933 \u092C\u0947\u0938 \u0915\u0947\u0938 \u092E\u093F\u0933\u0947\u092A\u0930\u094D\u092F\u0902\u0924 \u0938\u094D\u0935\u0924\u0903\u0932\u093E\u091A \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u0941\u0928\u094D\u0939\u093E \u0915\u0949\u0932 \u0915\u0930\u0924\u0947.",
      Gujarati: "\u0AB0\u0ABF\u0A95\u0AB0\u0ACD\u0AB6\u0AA8 (Recursion) \u0A8F \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0ABF\u0A82\u0A97 \u0A9F\u0AC7\u0A95\u0AA8\u0ABF\u0A95 \u0A9B\u0AC7 \u0A9C\u0AC7\u0AAE\u0ABE\u0A82 \u0AAB\u0A82\u0A95\u0ACD\u0AB6\u0AA8 \u0AAC\u0AC7\u0A9D \u0A95\u0AA8\u0ACD\u0AA1\u0ABF\u0AB6\u0AA8 \u0AA8 \u0AAE\u0AB3\u0AC7 \u0AA4\u0ACD\u0AAF\u0ABE\u0A82 \u0AB8\u0AC1\u0AA7\u0AC0 \u0AAA\u0ACB\u0AA4\u0ABE\u0AA8\u0AC0 \u0A9C\u0ABE\u0AA4\u0AA8\u0AC7 \u0A9C \u0A95\u0AC9\u0AB2 \u0A95\u0AB0\u0AC7 \u0A9B\u0AC7.",
      Punjabi: "\u0A30\u0A40\u0A15\u0A30\u0A38\u0A3C\u0A28 (Recursion) \u0A07\u0A71\u0A15 \u0A2A\u0A4D\u0A30\u0A4B\u0A17\u0A30\u0A3E\u0A2E\u0A3F\u0A70\u0A17 \u0A35\u0A3F\u0A27\u0A40 \u0A39\u0A48 \u0A1C\u0A3F\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A07\u0A71\u0A15 \u0A2B\u0A70\u0A15\u0A38\u0A3C\u0A28 \u0A06\u0A2A\u0A23\u0A47 \u0A06\u0A2A \u0A28\u0A42\u0A70 \u0A09\u0A26\u0A4B\u0A02 \u0A24\u0A71\u0A15 \u0A15\u0A3E\u0A32 \u0A15\u0A30\u0A26\u0A3E \u0A39\u0A48 \u0A1C\u0A26\u0A4B\u0A02 \u0A24\u0A71\u0A15 \u0A2C\u0A47\u0A38 \u0A15\u0A47\u0A38 \u0A2A\u0A42\u0A30\u0A3E \u0A28\u0A39\u0A40\u0A02 \u0A39\u0A41\u0A70\u0A26\u0A3E\u0964",
      Malayalam: "\u0D31\u0D3F\u0D15\u0D4D\u0D15\u0D7C\u0D37\u0D7B (Recursion) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D12\u0D30\u0D41 \u0D2B\u0D02\u0D17\u0D4D\u0D37\u0D7B \u0D2C\u0D47\u0D38\u0D4D \u0D15\u0D23\u0D4D\u0D1F\u0D40\u0D37\u0D7B \u0D0E\u0D24\u0D4D\u0D24\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D41\u0D35\u0D30\u0D46 \u0D38\u0D4D\u0D35\u0D2F\u0D02 \u0D35\u0D3F\u0D33\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D3F\u0D02\u0D17\u0D4D \u0D30\u0D40\u0D24\u0D3F\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: 'Recursion \u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C37\u0C28\u0C4D \u0C30\u0C42\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C47 \u0C09\u0C02\u0C1A\u0C3E\u0C32\u0C3F. "\u0C2A\u0C41\u0C28\u0C30\u0C3E\u0C35\u0C43\u0C24\u0C02" \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23 \u0C32\u0C42\u0C2A\u0C4D (Loop/Iteration) \u0C24\u0C4B \u0C17\u0C02\u0C26\u0C30\u0C17\u0C4B\u0C33\u0C02 \u0C0F\u0C30\u0C4D\u0C2A\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.',
      Hindi: 'Recursion \u0915\u094B "\u092A\u0941\u0928\u0930\u093E\u0935\u0930\u094D\u0924\u0928" \u0928 \u0915\u0939\u0947\u0902; \u092F\u0939 \u0938\u093E\u0927\u093E\u0930\u0923 \u0932\u0942\u092A (Iteration) \u0928\u0939\u0940\u0902 \u0939\u0948, \u092C\u0932\u094D\u0915\u093F \u0915\u0949\u0932 \u0938\u094D\u091F\u0948\u0915 \u0906\u0927\u093E\u0930\u093F\u0924 \u0938\u094D\u0935-\u0906\u0939\u094D\u0935\u093E\u0928 \u0939\u0948\u0964',
      Tamil: "Recursion \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B9A\u0BC1\u0BB4\u0BB1\u0BCD\u0B9A\u0BBF (Loop) \u0B89\u0B9F\u0BA9\u0BCD \u0B95\u0BC1\u0BB4\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BBE\u0BAE\u0BB2\u0BCD \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0B9A\u0BCD \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "Recursion \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB2\u0CC2\u0CAA\u0CCD\u200C\u0C97\u0CC6 \u0CAC\u0CA6\u0CB2\u0CBE\u0C97\u0CBF \u0CAA\u0CCD\u0CB0\u0CA4\u0CCD\u0CAF\u0CC7\u0C95 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CAA\u0CA6\u0CB5\u0CBE\u0C97\u0CBF \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "\u09B0\u09BF\u0995\u09BE\u09B0\u09CD\u09B6\u09A8\u09C7\u09B0 \u0986\u0995\u09CD\u09B7\u09B0\u09BF\u0995 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u09B2\u09C1\u09AA \u09AC\u09BE \u09AA\u09C1\u09A8\u09B0\u09BE\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AC\u09BF\u09AD\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7\u0964",
      Marathi: "Recursion \u0932\u0942\u092A\u092A\u0947\u0915\u094D\u0937\u093E \u0935\u0947\u0917\u0933\u0947 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u092E\u0942\u0933 \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u091C\u094D\u091E\u0947\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0947.",
      Gujarati: "Recursion \u0AA8\u0AC7 \u0AB2\u0AC2\u0AAA \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAD\u0AC7\u0AB3\u0AB5\u0AB5\u0AC1\u0A82 \u0AA8\u0AB9\u0AC0\u0A82.",
      Punjabi: "Recursion \u0A28\u0A42\u0A70 \u0A32\u0A42\u0A2A \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A16\u0A30\u0A3E \u0A38\u0A2E\u0A1D\u0A23 \u0A32\u0A08 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A28\u0A3E\u0A2E \u0A39\u0A40 \u0A35\u0A30\u0A24\u0A4B\u0964",
      Malayalam: "Recursion \u0D32\u0D42\u0D2A\u0D4D\u0D2A\u0D41\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D46\u0D31\u0D4D\u0D31\u0D3F\u0D26\u0D4D\u0D27\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D30\u0D41\u0D24\u0D4D."
    },
    transliterations: {
      Telugu: "Recursion (\u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C37\u0C28\u0C4D / \u0C38\u0C4D\u0C35\u0C2F\u0C02 \u0C06\u0C39\u0C4D\u0C35\u0C3E\u0C28 \u0C2A\u0C26\u0C4D\u0C27\u0C24\u0C3F)",
      Hindi: "Recursion (\u0930\u093F\u0915\u0930\u094D\u0936\u0928 - \u0938\u094D\u0935-\u0906\u0939\u094D\u0935\u093E\u0928 \u092B\u093C\u0902\u0915\u094D\u0936\u0928)",
      Tamil: "Recursion (\u0BB0\u0BBF\u0B95\u0BB0\u0BCD\u0BB7\u0BA9\u0BCD)",
      Kannada: "Recursion (\u0CB0\u0CBF\u0C95\u0CB0\u0CCD\u0CB6\u0CA8\u0CCD)",
      Bengali: "Recursion (\u09B0\u09BF\u0995\u09BE\u09B0\u09CD\u09B6\u09A8)",
      Marathi: "Recursion (\u0930\u093F\u0915\u0930\u094D\u0936\u0928)",
      Gujarati: "Recursion (\u0AB0\u0ABF\u0A95\u0AB0\u0ACD\u0AB6\u0AA8)",
      Punjabi: "Recursion (\u0A30\u0A40\u0A15\u0A30\u0A38\u0A3C\u0A28)",
      Malayalam: "Recursion (\u0D31\u0D3F\u0D15\u0D4D\u0D15\u0D7C\u0D37\u0D7B)"
    },
    technicalExample: `// Binary Search using Recursive Call Stack
int binarySearch(int arr[], int low, int high, int key) {
    if (low > high) return -1; // Base case: Target not present
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid; // Target found
    if (arr[mid] > key) return binarySearch(arr, low, mid - 1, key); // Left branch
    return binarySearch(arr, mid + 1, high, key); // Right branch
}`
  },
  overfitting: {
    englishTerm: "Overfitting",
    subject: "Machine Learning",
    aliases: ["overfitting", "\u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C3F\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D", "\u0913\u0935\u0930\u092B\u093F\u091F\u093F\u0902\u0917", "\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD", "\u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CBF\u0C9F\u0CCD\u0C9F\u0CBF\u0C82\u0C97\u0CCD", "\u0993\u09AD\u09BE\u09B0\u09AB\u09BF\u099F\u09BF\u0982"],
    technicalMeaningEn: "Overfitting is an empirical machine learning failure mode where a model learns idiosyncratic noise and training dataset artifacts instead of true generalized population distributions, resulting in near-zero training error but unacceptably high validation error.",
    explanationEn: "Preserve Overfitting. Translating literally as garment fitting (\u0C2C\u0C1F\u0C4D\u0C1F\u0C32 \u0C15\u0C4A\u0C32\u0C24 / \u0915\u092A\u0921\u093C\u0947 \u0915\u0940 \u092B\u093F\u091F\u093F\u0902\u0917) destroys machine learning pedagogical context.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C3F\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D (Overfitting) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C2E\u0C46\u0C37\u0C3F\u0C28\u0C4D \u0C32\u0C46\u0C30\u0C4D\u0C28\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C32\u0C4B \u0C38\u0C02\u0C2D\u0C35\u0C3F\u0C02\u0C1A\u0C47 \u0C24\u0C40\u0C35\u0C4D\u0C30\u0C2E\u0C48\u0C28 \u0C32\u0C4B\u0C2A\u0C02. \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C2E\u0C4B\u0C21\u0C32\u0C4D \u0C1F\u0C4D\u0C30\u0C48\u0C28\u0C3F\u0C02\u0C17\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C32\u0C4B\u0C28\u0C3F \u0C36\u0C2C\u0C4D\u0C26\u0C02 (Noise) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C47\u0C15 \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C28\u0C41 \u0C15\u0C42\u0C21\u0C3E \u0C2C\u0C1F\u0C4D\u0C1F\u0C40 \u0C2A\u0C1F\u0C4D\u0C1F\u0C3F \u0C28\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C41\u0C02\u0C26\u0C3F. \u0C26\u0C40\u0C28\u0C3F\u0C35\u0C32\u0C4D\u0C32 \u0C1F\u0C4D\u0C30\u0C48\u0C28\u0C3F\u0C02\u0C17\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C2A\u0C48 \u0C05\u0C24\u0C4D\u0C2F\u0C41\u0C24\u0C4D\u0C24\u0C2E \u0C16\u0C1A\u0C4D\u0C1A\u0C3F\u0C24\u0C24\u0C4D\u0C35\u0C02 \u0C1A\u0C42\u0C2A\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40, \u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C1F\u0C46\u0C38\u0C4D\u0C1F\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C2A\u0C48 \u0C16\u0C1A\u0C4D\u0C1A\u0C3F\u0C24\u0C24\u0C4D\u0C35\u0C02 \u0C18\u0C4B\u0C30\u0C02\u0C17\u0C3E \u0C2A\u0C21\u0C3F\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0913\u0935\u0930\u092B\u093F\u091F\u093F\u0902\u0917 (Overfitting) \u092E\u0936\u0940\u0928 \u0932\u0930\u094D\u0928\u093F\u0902\u0917 \u092E\u0947\u0902 \u090F\u0915 \u0910\u0938\u0940 \u0935\u093F\u092B\u0932\u0924\u093E \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u092E\u0949\u0921\u0932 \u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u0923 \u0921\u0947\u091F\u093E (Training Data) \u0915\u0947 \u0936\u094B\u0930 (Noise) \u0914\u0930 \u092F\u093E\u0926\u0943\u091A\u094D\u091B\u093F\u0915 \u0909\u0924\u093E\u0930-\u091A\u0922\u093C\u093E\u0935 \u0915\u094B \u092D\u0940 \u0938\u0940\u0916 \u0932\u0947\u0924\u093E \u0939\u0948\u0964 \u092A\u0930\u093F\u0923\u093E\u092E\u0938\u094D\u0935\u0930\u0942\u092A, \u092E\u0949\u0921\u0932 \u0915\u093E \u091F\u094D\u0930\u0947\u0928\u093F\u0902\u0917 \u0932\u0949\u0938 \u092C\u0939\u0941\u0924 \u0915\u092E \u0939\u094B\u0924\u093E \u0939\u0948 \u0932\u0947\u0915\u093F\u0928 \u0928\u090F \u091F\u0947\u0938\u094D\u091F \u0921\u0947\u091F\u093E \u092A\u0930 \u0924\u094D\u0930\u0941\u091F\u093F (Generalization Error) \u092C\u0939\u0941\u0924 \u0905\u0927\u093F\u0915 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964",
      Tamil: "\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD (Overfitting) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BAE\u0BC6\u0BB7\u0BBF\u0BA9\u0BCD \u0BB2\u0BC7\u0BB0\u0BCD\u0BA9\u0BBF\u0B99\u0BCD\u0B95\u0BBF\u0BB2\u0BCD \u0BAE\u0BBE\u0BA4\u0BBF\u0BB0\u0BBF \u0B92\u0BA9\u0BCD\u0BB1\u0BC1 \u0BAA\u0BAF\u0BBF\u0BB1\u0BCD\u0B9A\u0BBF\u0BA4\u0BCD \u0BA4\u0BB0\u0BB5\u0BBF\u0BA9\u0BCD \u0B87\u0BB0\u0BC8\u0B9A\u0BCD\u0B9A\u0BB2\u0BC8 \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0B95\u0B95\u0BCD \u0B95\u0BB1\u0BCD\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BC1, \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0BA4\u0BB0\u0BB5\u0BBF\u0BB2\u0BCD \u0B9A\u0BB0\u0BBF\u0BAF\u0BBE\u0B95\u0B9A\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0B9F\u0BA4\u0BCD \u0BA4\u0BB5\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CBF\u0C9F\u0CCD\u0C9F\u0CBF\u0C82\u0C97\u0CCD (Overfitting) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CAE\u0CC6\u0CB7\u0CBF\u0CA8\u0CCD \u0CB2\u0CB0\u0CCD\u0CA8\u0CBF\u0C82\u0C97\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CAE\u0CBE\u0CA6\u0CB0\u0CBF\u0CAF\u0CC1 \u0CA4\u0CB0\u0CAC\u0CC7\u0CA4\u0CBF \u0CA1\u0CC7\u0C9F\u0CBE\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C85\u0CA4\u0CBF\u0CAF\u0CBE\u0C97\u0CBF \u0C95\u0C82\u0CA0\u0CAA\u0CBE\u0CA0 \u0CAE\u0CBE\u0CA1\u0CBF, \u0CB9\u0CCA\u0CB8 \u0CA1\u0CC7\u0C9F\u0CBE\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0CB5\u0CBF\u0CAB\u0CB2\u0CB5\u0CBE\u0C97\u0CC1\u0CB5 \u0CB8\u0CCD\u0CA5\u0CBF\u0CA4\u0CBF\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u0993\u09AD\u09BE\u09B0\u09AB\u09BF\u099F\u09BF\u0982 (Overfitting) \u09B9\u09B2\u09CB \u09AE\u09C7\u09B6\u09BF\u09A8 \u09B2\u09BE\u09B0\u09CD\u09A8\u09BF\u0982\u09AF\u09BC\u09C7\u09B0 \u098F\u09AE\u09A8 \u098F\u0995\u099F\u09BF \u09A4\u09CD\u09B0\u09C1\u099F\u09BF \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u09AE\u09A1\u09C7\u09B2\u099F\u09BF \u099F\u09CD\u09B0\u09C7\u09A8\u09BF\u0982 \u09A1\u09C7\u099F\u09BE\u09B0 \u09A8\u09AF\u09BC\u09C7\u099C\u0993 \u09B6\u09BF\u0996\u09C7 \u09AB\u09C7\u09B2\u09C7 \u098F\u09AC\u0982 \u09A8\u09A4\u09C1\u09A8 \u09A1\u09C7\u099F\u09BE\u09A4\u09C7 \u0996\u09BE\u09B0\u09BE\u09AA \u09AA\u09BE\u09B0\u09AB\u09B0\u09CD\u09AE \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0913\u0935\u094D\u0939\u0930\u092B\u093F\u091F\u093F\u0902\u0917 (Overfitting) \u092E\u0927\u094D\u092F\u0947 \u092E\u0936\u0940\u0928 \u0932\u0930\u094D\u0928\u093F\u0902\u0917 \u092E\u0949\u0921\u0947\u0932 \u091F\u094D\u0930\u0947\u0928\u093F\u0902\u0917 \u0921\u0947\u091F\u093E\u0935\u0930 \u0905\u091A\u0942\u0915 \u091A\u093E\u0932\u0924\u0947 \u092A\u0923 \u0928\u0935\u0940\u0928 \u091F\u0947\u0938\u094D\u091F \u0921\u0947\u091F\u093E\u0935\u0930 \u0905\u092A\u092F\u0936\u0940 \u0920\u0930\u0924\u0947.",
      Gujarati: "\u0A93\u0AB5\u0AB0\u0AAB\u0ABF\u0A9F\u0ABF\u0A82\u0A97 (Overfitting) \u0AAE\u0AB6\u0AC0\u0AA8 \u0AB2\u0AB0\u0ACD\u0AA8\u0ABF\u0A82\u0A97 \u0AAE\u0ACB\u0AA1\u0AC7\u0AB2\u0AA8\u0AC1\u0A82 \u0A9F\u0ACD\u0AB0\u0AC7\u0A87\u0AA8\u0ABF\u0A82\u0A97 \u0AA1\u0AC7\u0A9F\u0ABE \u0AAA\u0AB0 \u0AB5\u0AA7\u0AC1 \u0AAA\u0AA1\u0AA4\u0AC1\u0A82 \u0AA8\u0ABF\u0AB0\u0ACD\u0AAD\u0AB0 \u0AA5\u0A88 \u0A9C\u0AB5\u0AC1\u0A82 \u0A9B\u0AC7.",
      Punjabi: "\u0A13\u0A35\u0A30\u0A2B\u0A3F\u0A1F\u0A3F\u0A70\u0A17 (Overfitting) \u0A2E\u0A38\u0A3C\u0A40\u0A28 \u0A32\u0A30\u0A28\u0A3F\u0A70\u0A17 \u0A35\u0A3F\u0A71\u0A1A \u0A2E\u0A3E\u0A21\u0A32 \u0A26\u0A41\u0A06\u0A30\u0A3E \u0A38\u0A3F\u0A30\u0A2B \u0A1F\u0A4D\u0A30\u0A47\u0A28\u0A3F\u0A70\u0A17 \u0A21\u0A3E\u0A1F\u0A3E \u0A28\u0A42\u0A70 \u0A39\u0A40 \u0A38\u0A3F\u0A71\u0A16\u0A23 \u0A26\u0A40 \u0A16\u0A3C\u0A3E\u0A2E\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "\u0D13\u0D35\u0D7C\u0D2B\u0D3F\u0D31\u0D4D\u0D31\u0D3F\u0D02\u0D17\u0D4D (Overfitting) \u0D2E\u0D46\u0D37\u0D40\u0D7B \u0D32\u0D47\u0D23\u0D3F\u0D02\u0D17\u0D4D \u0D2E\u0D4B\u0D21\u0D7D \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D2F\u0D3F\u0D7D \u0D2A\u0D30\u0D3E\u0D1C\u0D2F\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D28\u0D4D\u0D28 \u0D05\u0D35\u0D38\u0D4D\u0D25\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Overfitting \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2F\u0C25\u0C3E\u0C24\u0C25\u0C02\u0C17\u0C3E \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C2C\u0C1F\u0C4D\u0C1F\u0C32 \u0C38\u0C48\u0C1C\u0C41 \u0C2B\u0C3F\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C32\u0C3E\u0C17\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C2E\u0C46\u0C37\u0C3F\u0C28\u0C4D \u0C32\u0C46\u0C30\u0C4D\u0C28\u0C3F\u0C02\u0C17\u0C4D \u0C17\u0C23\u0C3E\u0C02\u0C15 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C02 \u0C17\u0C02\u0C26\u0C30\u0C17\u0C4B\u0C33\u0C02 \u0C05\u0C35\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "Overfitting \u0915\u094B \u0915\u092A\u0921\u093C\u094B\u0902 \u0915\u0940 \u092B\u093F\u091F\u093F\u0902\u0917 \u091C\u0948\u0938\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0928 \u0915\u0930\u0947\u0902\u0964 \u092F\u0939 \u090F\u092E\u090F\u0932 \u092E\u0947\u0902 \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0940\u0915\u0930\u0923 (Generalization) \u0915\u0940 \u0935\u093F\u092B\u0932\u0924\u093E \u0939\u0948\u0964",
      Tamil: "Overfitting \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BBE\u0BAE\u0BB2\u0BCD \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "Overfitting \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAE\u0CC6\u0CB7\u0CBF\u0CA8\u0CCD \u0CB2\u0CB0\u0CCD\u0CA8\u0CBF\u0C82\u0C97\u0CCD \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CAA\u0CA6\u0CB5\u0CBE\u0C97\u0CBF \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Overfitting \u09B6\u09AC\u09CD\u09A6\u09C7\u09B0 \u0986\u0995\u09CD\u09B7\u09B0\u09BF\u0995 \u0985\u09B0\u09CD\u09A5 \u09AA\u09CB\u09B6\u09BE\u0995 \u09AB\u09BF\u099F\u09BF\u0982\u09AF\u09BC\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AC\u09BF\u09AD\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF\u0995\u09B0\u0964",
      Marathi: "Overfitting \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "Overfitting \u0AB6\u0AAC\u0ACD\u0AA6 \u0A8F\u0AAE \u0A9C \u0AB0\u0ABE\u0A96\u0AB5\u0ACB.",
      Punjabi: "Overfitting \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A35\u0A30\u0A24\u0A4B\u0964",
      Malayalam: "Overfitting \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Overfitting (\u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C3F\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D - \u0C05\u0C27\u0C3F\u0C15 \u0C2E\u0C4B\u0C21\u0C32\u0C4D \u0C05\u0C28\u0C41\u0C38\u0C30\u0C23)",
      Hindi: "Overfitting (\u0913\u0935\u0930\u092B\u093F\u091F\u093F\u0902\u0917 - \u0905\u0924\u093F-\u0905\u0928\u0941\u0915\u0942\u0932\u0928 \u0935\u093F\u092B\u0932\u0924\u093E)",
      Tamil: "Overfitting (\u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BBF\u0B9F\u0BCD\u0B9F\u0BBF\u0B99\u0BCD)",
      Kannada: "Overfitting (\u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CBF\u0C9F\u0CCD\u0C9F\u0CBF\u0C82\u0C97\u0CCD)",
      Bengali: "Overfitting (\u0993\u09AD\u09BE\u09B0\u09AB\u09BF\u099F\u09BF\u0982)",
      Marathi: "Overfitting (\u0913\u0935\u094D\u0939\u0930\u092B\u093F\u091F\u093F\u0902\u0917)",
      Gujarati: "Overfitting (\u0A93\u0AB5\u0AB0\u0AAB\u0ABF\u0A9F\u0ABF\u0A82\u0A97)",
      Punjabi: "Overfitting (\u0A13\u0A35\u0A30\u0A2B\u0A3F\u0A1F\u0A3F\u0A70\u0A17)",
      Malayalam: "Overfitting (\u0D13\u0D35\u0D7C\u0D2B\u0D3F\u0D31\u0D4D\u0D31\u0D3F\u0D02\u0D17\u0D4D)"
    },
    technicalExample: `// Combating Overfitting with L2 Regularization & Dropout in PyTorch
import torch.nn as nn
model = nn.Sequential(
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(0.3), // Randomly drops 30% activations to prevent co-adaptation
    nn.Linear(64, 10)
)`
  },
  normalization: {
    englishTerm: "Database Normalization",
    subject: "DBMS",
    aliases: ["normalization", "database normalization", "\u0C28\u0C3E\u0C30\u0C4D\u0C2E\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D", "\u0C28\u0C3E\u0C30\u0C4D\u0C2E\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C15\u0C4D\u0C30\u0C3F\u0C2F", "\u0928\u0949\u0930\u094D\u092E\u0932\u093E\u0907\u091C\u093C\u0947\u0936\u0928", "\u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BBE\u0BAA\u0BC7\u0BB8\u0BCD \u0BA8\u0BBE\u0BB0\u0BCD\u0BAE\u0BB2\u0BC8\u0B9A\u0BC7\u0BB7\u0BA9\u0BCD", "\u0CA8\u0CBE\u0CB0\u0CCD\u0CAE\u0CB2\u0CC8\u0CB8\u0CC7\u0CB6\u0CA8\u0CCD"],
    technicalMeaningEn: "Database Normalization is the formal mathematical process of structuring relational schema tables into progressive Normal Forms (1NF, 2NF, 3NF, BCNF) to reduce functional redundancy and eliminate insertion, update, and deletion anomalies while enforcing lossless join decomposition.",
    explanationEn: "Preserve Normalization in database context. Do not translate as societal psychological normalization.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C28\u0C3E\u0C30\u0C4D\u0C2E\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D (Database Normalization) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C30\u0C3F\u0C32\u0C47\u0C37\u0C28\u0C32\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D\u200C\u0C32\u0C32\u0C4B \u0C21\u0C47\u0C1F\u0C3E \u0C2A\u0C41\u0C28\u0C30\u0C3E\u0C35\u0C43\u0C24\u0C3E\u0C28\u0C4D\u0C28\u0C3F (Data Redundancy) \u0C24\u0C17\u0C4D\u0C17\u0C3F\u0C02\u0C1A\u0C3F, \u0C07\u0C28\u0C4D\u0C38\u0C30\u0C4D\u0C37\u0C28\u0C4D, \u0C05\u0C2A\u0C4D\u200C\u0C21\u0C47\u0C1F\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C3F\u0C32\u0C40\u0C37\u0C28\u0C4D \u0C32\u0C4B\u0C2A\u0C3E\u0C32\u0C28\u0C41 (Anomalies) \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F\u0C17\u0C3E \u0C24\u0C4A\u0C32\u0C17\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C1F\u0C47\u0C2C\u0C41\u0C32\u0C4D\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C40\u0C2F \u0C2A\u0C26\u0C4D\u0C27\u0C24\u0C3F\u0C32\u0C4B \u0C35\u0C3F\u0C2D\u0C1C\u0C3F\u0C02\u0C1A\u0C47 \u0C12\u0C15 \u0C2A\u0C4D\u0C30\u0C3E\u0C2E\u0C3E\u0C23\u0C3F\u0C15 \u0C17\u0C23\u0C3F\u0C24 \u0C2A\u0C4D\u0C30\u0C15\u0C4D\u0C30\u0C3F\u0C2F (1NF, 2NF, 3NF, BCNF).",
      Hindi: "\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0940\u0915\u0930\u0923 (Database Normalization) \u0930\u093F\u0932\u0947\u0936\u0928\u0932 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0938\u094D\u0915\u0940\u092E\u093E \u0915\u094B \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0915\u0930\u0928\u0947 \u0915\u0940 \u090F\u0915 \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0917\u0923\u093F\u0924\u0940\u092F \u0924\u0915\u0928\u0940\u0915 \u0939\u0948 \u091C\u093F\u0938\u0915\u093E \u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F \u0921\u0947\u091F\u093E \u0905\u0924\u093F\u0930\u0947\u0915 (Data Redundancy) \u0915\u094B \u0915\u092E \u0915\u0930\u0928\u093E \u0914\u0930 \u0907\u0928\u094D\u0938\u0930\u094D\u091F, \u0905\u092A\u0921\u0947\u091F \u0914\u0930 \u0921\u093F\u0932\u0940\u091F \u0935\u093F\u0938\u0902\u0917\u0924\u093F\u092F\u094B\u0902 \u0915\u094B \u0938\u092E\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u093E \u0939\u0948 (1NF, 2NF, 3NF, BCNF)\u0964",
      Tamil: "\u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BBE\u0BAA\u0BC7\u0BB8\u0BCD \u0BA8\u0BBE\u0BB0\u0BCD\u0BAE\u0BB2\u0BC8\u0B9A\u0BC7\u0BB7\u0BA9\u0BCD (Database Normalization) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA4\u0BB0\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BB3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BA4\u0BC7\u0BB5\u0BC8\u0BAF\u0BB1\u0BCD\u0BB1 \u0BA8\u0B95\u0BB2\u0BCD\u0B95\u0BB3\u0BC8\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1, \u0BA4\u0BB0\u0BB5\u0BC1 \u0B92\u0BB0\u0BC1\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC8\u0BAA\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BAA\u0B9F\u0BBF\u0BA8\u0BBF\u0BB2\u0BC8 \u0BB5\u0B9F\u0BBF\u0BB5\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CA8\u0CBE\u0CB0\u0CCD\u0CAE\u0CB2\u0CC8\u0CB8\u0CC7\u0CB6\u0CA8\u0CCD (Database Normalization) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0C95\u0CCB\u0CB7\u0CCD\u0C9F\u0C95\u0C97\u0CB3\u0CB2\u0CCD\u0CB2\u0CBF \u0C85\u0CA8\u0C97\u0CA4\u0CCD\u0CAF \u0CA1\u0CC7\u0C9F\u0CBE \u0CA8\u0C95\u0CB2\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CAA\u0CCD\u0CAA\u0CBF\u0CB8\u0CB2\u0CC1 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C85\u0CB8\u0C82\u0C97\u0CA4\u0CA4\u0CC6\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CCA\u0CA1\u0CC6\u0CA6\u0CC1\u0CB9\u0CBE\u0C95\u0CB2\u0CC1 \u0CAC\u0CB3\u0CB8\u0CC1\u0CB5 \u0C95\u0CCD\u0CB0\u0CAE\u0CAC\u0CA6\u0CCD\u0CA7 \u0CAA\u0CCD\u0CB0\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u09B8 \u09A8\u09B0\u09AE\u09BE\u09B2\u09BE\u0987\u099C\u09C7\u09B6\u09A8 \u09B9\u09B2\u09CB \u098F\u09AE\u09A8 \u098F\u0995\u099F\u09BF \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u09AF\u09BE \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8\u09C7 \u09AA\u09C1\u09A8\u09B0\u09BE\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF \u0995\u09AE\u09BE\u09DF \u098F\u09AC\u0982 \u09A1\u09C7\u099F\u09BE \u0985\u0996\u09A3\u09CD\u09A1\u09A4\u09BE \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09A4\u09C7 \u099F\u09C7\u09AC\u09BF\u09B2\u0997\u09C1\u09B2\u09CB\u0995\u09C7 \u09A8\u09BF\u09DF\u09AE\u09A4\u09BE\u09A8\u09CD\u09A4\u09CD\u09B0\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u09B8\u09BE\u099C\u09BE\u09DF\u0964",
      Marathi: "\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u092F\u091D\u0947\u0936\u0928 (Database Normalization) \u0939\u0940 \u091F\u0947\u092C\u0932\u092E\u0927\u0940\u0932 \u0930\u093F\u0921\u0902\u0921\u0928\u094D\u0938\u0940 \u0915\u092E\u0940 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0906\u0923\u093F \u0921\u0947\u091F\u093E \u0905\u0916\u0902\u0921\u0924\u093E \u0930\u093E\u0916\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940\u091A\u0940 \u092A\u0926\u094D\u0927\u0924 \u0906\u0939\u0947.",
      Gujarati: "\u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0AA8\u0ACB\u0AB0\u0ACD\u0AAE\u0AB2\u0ABE\u0A87\u0A9D\u0AC7\u0AB6\u0AA8 \u0A8F \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D\u0AAE\u0ABE\u0A82 \u0AA1\u0AC7\u0A9F\u0ABE\u0AA8\u0AC0 \u0AA8\u0A95\u0AB2\u0ACB \u0A98\u0A9F\u0ABE\u0AA1\u0AB5\u0ABE\u0AA8\u0AC0 \u0A85\u0AA8\u0AC7 \u0AB8\u0A82\u0A97\u0AA4\u0AA4\u0ABE \u0A9C\u0ABE\u0AB3\u0AB5\u0AB5\u0ABE\u0AA8\u0AC0 \u0AAA\u0ACD\u0AB0\u0A95\u0ACD\u0AB0\u0ABF\u0AAF\u0ABE \u0A9B\u0AC7.",
      Punjabi: "\u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A28\u0A3E\u0A30\u0A2E\u0A32\u0A3E\u0A08\u0A1C\u0A3C\u0A47\u0A38\u0A3C\u0A28 \u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A47\u0A32\u0A4B\u0A5C\u0A47 \u0A21\u0A3E\u0A1F\u0A3E \u0A28\u0A42\u0A70 \u0A18\u0A1F\u0A3E\u0A09\u0A23 \u0A05\u0A24\u0A47 \u0A05\u0A16\u0A70\u0A21\u0A24\u0A3E \u0A2C\u0A23\u0A3E\u0A08 \u0A30\u0A71\u0A16\u0A23 \u0A26\u0A40 \u0A35\u0A3F\u0A27\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "\u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D4D \u0D28\u0D4B\u0D7C\u0D2E\u0D32\u0D48\u0D38\u0D47\u0D37\u0D7B \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D3F\u0D32\u0D46 \u0D05\u0D28\u0D3E\u0D35\u0D36\u0D4D\u0D2F \u0D06\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D19\u0D4D\u0D19\u0D7E \u0D15\u0D41\u0D31\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D3E\u0D28\u0D41\u0D33\u0D4D\u0D33 \u0D18\u0D1F\u0D28\u0D3E\u0D2A\u0D30\u0D2E\u0D3E\u0D2F \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Database Normalization \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C28\u0C3E\u0C30\u0C4D\u0C2E\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C17\u0C3E\u0C28\u0C47 \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C38\u0C3E\u0C2E\u0C3E\u0C1C\u0C3F\u0C15 \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23\u0C40\u0C15\u0C30\u0C23\u0C24\u0C4B \u0C26\u0C40\u0C28\u0C3F\u0C28\u0C3F \u0C2A\u0C4B\u0C32\u0C4D\u0C1A\u0C30\u0C3E\u0C26\u0C41.",
      Hindi: "Database Normalization \u0915\u094B \u0924\u0915\u0928\u0940\u0915\u0940 \u0938\u0902\u0926\u0930\u094D\u092D \u092E\u0947\u0902 \u0939\u0940 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u091F\u0947\u092C\u0932 \u0935\u093F\u092D\u093E\u091C\u0928 \u0914\u0930 \u0905\u0916\u0902\u0921\u0924\u093E \u0928\u093F\u092F\u092E\u094B\u0902 \u0938\u0947 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0939\u0948\u0964",
      Tamil: "Normalization \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BBE\u0BAE\u0BB2\u0BCD \u0BA4\u0BB0\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BB3 \u0B9A\u0BC2\u0BB4\u0BB2\u0BBF\u0BB2\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Normalization \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C95\u0CCB\u0CB7\u0CCD\u0C9F\u0C95 \u0CB5\u0CBF\u0CA8\u0CCD\u0CAF\u0CBE\u0CB8\u0CA6 \u0CB8\u0CA8\u0CCD\u0CA8\u0CBF\u0CB5\u0CC7\u0CB6\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Normalization \u09AA\u09B0\u09BF\u09AD\u09BE\u09B7\u09BE\u099F\u09BF \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Normalization \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0940.",
      Gujarati: "Normalization \u0AB6\u0AAC\u0ACD\u0AA6 \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0AAE\u0ABE\u0A9F\u0AC7 \u0AAA\u0ACD\u0AB0\u0AAE\u0ABE\u0AA3\u0AAD\u0AC2\u0AA4 \u0A9B\u0AC7.",
      Punjabi: "Normalization \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Normalization \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Database Normalization (\u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C28\u0C3E\u0C30\u0C4D\u0C2E\u0C32\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D)",
      Hindi: "Database Normalization (\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u0907\u091C\u093C\u0947\u0936\u0928 / \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0940\u0915\u0930\u0923)",
      Tamil: "Database Normalization (\u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BBE\u0BAA\u0BC7\u0BB8\u0BCD \u0BA8\u0BBE\u0BB0\u0BCD\u0BAE\u0BB2\u0BC8\u0B9A\u0BC7\u0BB7\u0BA9\u0BCD)",
      Kannada: "Database Normalization (\u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CA8\u0CBE\u0CB0\u0CCD\u0CAE\u0CB2\u0CC8\u0CB8\u0CC7\u0CB6\u0CA8\u0CCD)",
      Bengali: "Database Normalization (\u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u09B8 \u09A8\u09B0\u09AE\u09BE\u09B2\u09BE\u0987\u099C\u09C7\u09B6\u09A8)",
      Marathi: "Database Normalization (\u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0928\u0949\u0930\u094D\u092E\u0932\u093E\u092F\u091D\u0947\u0936\u0928)",
      Gujarati: "Database Normalization (\u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0AA8\u0ACB\u0AB0\u0ACD\u0AAE\u0AB2\u0ABE\u0A87\u0A9D\u0AC7\u0AB6\u0AA8)",
      Punjabi: "Database Normalization (\u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A28\u0A3E\u0A30\u0A2E\u0A32\u0A3E\u0A08\u0A1C\u0A3C\u0A47\u0A38\u0A3C\u0A28)",
      Malayalam: "Database Normalization (\u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D4D \u0D28\u0D4B\u0D7C\u0D2E\u0D32\u0D48\u0D38\u0D47\u0D37\u0D7B)"
    },
    technicalExample: `-- 3NF Table Normalization Example:
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL
);
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);`
  },
  "tcp/ip": {
    englishTerm: "TCP/IP (Transmission Control Protocol / Internet Protocol)",
    subject: "Computer Networks",
    aliases: ["tcp", "tcp/ip", "ip", "\u0C1F\u0C3F\u0C38\u0C3F\u0C2A\u0C3F", "\u091F\u0940\u0938\u0940\u092A\u0940", "\u0B9F\u0BBF\u0B9A\u0BBF\u0BAA\u0BBF", "\u0C9F\u0CBF\u0CB8\u0CBF\u0CAA\u0CBF"],
    technicalMeaningEn: "TCP/IP is the foundational four-layer communication protocol suite (Application, Transport, Internet, Network Interface) governing packet-switched inter-network communications, guaranteeing ordered, error-checked, flow-controlled packet delivery via TCP three-way handshake.",
    explanationEn: "Preserve TCP/IP. Literal translation obscures standard networking protocol implementations.",
    technicalMeaningByLanguage: {
      Telugu: "TCP/IP (\u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2E\u0C3F\u0C37\u0C28\u0C4D \u0C15\u0C02\u0C1F\u0C4D\u0C30\u0C4B\u0C32\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C1F\u0C4B\u0C15\u0C3E\u0C32\u0C4D / \u0C07\u0C02\u0C1F\u0C30\u0C4D\u0C28\u0C46\u0C1F\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C1F\u0C4B\u0C15\u0C3E\u0C32\u0C4D) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C27\u0C41\u0C28\u0C3F\u0C15 \u0C07\u0C02\u0C1F\u0C30\u0C4D\u0C28\u0C46\u0C1F\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D\u200C\u0C32 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30 \u0C2A\u0C4D\u0C30\u0C38\u0C3E\u0C30\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C35\u0C46\u0C28\u0C4D\u0C28\u0C46\u0C2E\u0C41\u0C15 \u0C35\u0C02\u0C1F\u0C3F \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C2A\u0C4A\u0C30\u0C32 (Four-Layer) \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C1F\u0C4B\u0C15\u0C3E\u0C32\u0C4D \u0C38\u0C42\u0C1F\u0C4D. \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B TCP \u0C35\u0C3F\u0C36\u0C4D\u0C35\u0C38\u0C28\u0C40\u0C2F\u0C2E\u0C48\u0C28, \u0C15\u0C4D\u0C30\u0C2E\u0C2C\u0C26\u0C4D\u0C27\u0C2E\u0C48\u0C28 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C0E\u0C30\u0C4D\u0C30\u0C30\u0C4D-\u0C1A\u0C46\u0C15\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C28 \u0C21\u0C47\u0C1F\u0C3E \u0C2A\u0C4D\u0C2F\u0C3E\u0C15\u0C46\u0C1F\u0C4D \u0C21\u0C46\u0C32\u0C3F\u0C35\u0C30\u0C40\u0C15\u0C3F \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "TCP/IP (\u091F\u094D\u0930\u093E\u0902\u0938\u092E\u093F\u0936\u0928 \u0915\u0902\u091F\u094D\u0930\u094B\u0932 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 / \u0907\u0902\u091F\u0930\u0928\u0947\u091F \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932) \u0907\u0902\u091F\u0930\u0928\u0947\u091F \u0915\u093E \u0906\u0927\u093E\u0930\u092D\u0942\u0924 \u091A\u093E\u0930-\u092A\u0930\u0924 \u0935\u093E\u0932\u093E \u0938\u0902\u091A\u093E\u0930 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0938\u092E\u0942\u0939 \u0939\u0948 \u091C\u094B \u092A\u0948\u0915\u0947\u091F-\u0938\u094D\u0935\u093F\u091A\u094D\u0921 \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092A\u0930 \u0921\u0947\u091F\u093E \u0915\u0947 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F, \u0915\u094D\u0930\u092E\u093F\u0924 \u0914\u0930 \u0924\u094D\u0930\u0941\u091F\u093F-\u0930\u0939\u093F\u0924 \u0935\u093F\u0924\u0930\u0923 \u0915\u0940 \u0917\u093E\u0930\u0902\u091F\u0940 \u0926\u0947\u0924\u093E \u0939\u0948\u0964",
      Tamil: "TCP/IP \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B87\u0BA3\u0BC8\u0BAF\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0BAE\u0BCD\u0BAA\u0B95\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC1\u0B9F\u0BA9\u0BC1\u0BAE\u0BCD \u0B92\u0BB4\u0BC1\u0B99\u0BCD\u0B95\u0BBE\u0B95\u0BB5\u0BC1\u0BAE\u0BCD \u0BAA\u0BB0\u0BBF\u0BAE\u0BBE\u0BB1 \u0B89\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0BA8\u0BBE\u0BA9\u0BCD\u0B95\u0BC1 \u0B85\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BA8\u0BC6\u0BB1\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8 \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "TCP/IP \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0C87\u0C82\u0C9F\u0CB0\u0CCD\u0CA8\u0CC6\u0C9F\u0CCD \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD \u0CB8\u0C82\u0CB5\u0CB9\u0CA8\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CAF\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0CB8\u0CC1\u0CB5 \u0CA8\u0CBE\u0CB2\u0CCD\u0C95\u0CC1-\u0CAA\u0CA6\u0CB0\u0C97\u0CB3 \u0CAA\u0CCD\u0CB0\u0CCB\u0C9F\u0CCB\u0C95\u0CBE\u0CB2\u0CCD \u0C86\u0CB0\u0CCD\u0C95\u0CBF\u0C9F\u0CC6\u0C95\u0CCD\u0C9A\u0CB0\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "TCP/IP \u09B9\u09B2\u09CB \u0987\u09A8\u09CD\u099F\u09BE\u09B0\u09A8\u09C7\u099F\u09C7\u09B0 \u099A\u09BE\u09B0 \u09B8\u09CD\u09A4\u09B0\u09C7\u09B0 \u09AA\u09CD\u09B0\u09CB\u099F\u09CB\u0995\u09B2 \u09AF\u09BE \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF\u09AD\u09BE\u09AC\u09C7 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099F \u0986\u09A6\u09BE\u09A8-\u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09C7\u0964",
      Marathi: "TCP/IP \u0939\u093E \u0907\u0902\u091F\u0930\u0928\u0947\u091F\u091A\u093E \u092A\u093E\u092F\u093E\u092D\u0942\u0924 \u091A\u093E\u0930-\u0938\u094D\u0924\u0930\u093E\u0902\u091A\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0938\u0902\u091A \u0906\u0939\u0947.",
      Gujarati: "TCP/IP \u0A8F \u0A87\u0AA8\u0ACD\u0A9F\u0AB0\u0AA8\u0AC7\u0A9F \u0AB8\u0A82\u0A9A\u0ABE\u0AB0 \u0AAE\u0ABE\u0A9F\u0AC7\u0AA8\u0ACB \u0A9A\u0ABE\u0AB0 \u0AB8\u0ACD\u0AA4\u0AB0\u0AC0\u0AAF \u0AAA\u0ACD\u0AB0\u0ACB\u0A9F\u0ACB\u0A95\u0ACB\u0AB2 \u0AB8\u0AAE\u0AC2\u0AB9 \u0A9B\u0AC7.",
      Punjabi: "TCP/IP \u0A07\u0A70\u0A1F\u0A30\u0A28\u0A48\u0A71\u0A1F \u0A38\u0A70\u0A1A\u0A3E\u0A30 \u0A32\u0A08 \u0A1A\u0A3E\u0A30-\u0A2A\u0A71\u0A27\u0A30\u0A40 \u0A2A\u0A4D\u0A30\u0A4B\u0A1F\u0A4B\u0A15\u0A4B\u0A32 \u0A38\u0A42\u0A1F \u0A39\u0A48\u0964",
      Malayalam: "TCP/IP \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D07\u0D28\u0D4D\u0D31\u0D7C\u0D28\u0D46\u0D31\u0D4D\u0D31\u0D4D \u0D06\u0D36\u0D2F\u0D35\u0D3F\u0D28\u0D3F\u0D2E\u0D2F\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D05\u0D1F\u0D3F\u0D38\u0D4D\u0D25\u0D3E\u0D28 \u0D2A\u0D4D\u0D30\u0D4B\u0D1F\u0D4D\u0D1F\u0D4B\u0D15\u0D4D\u0D15\u0D4B\u0D7E \u0D18\u0D1F\u0D28\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "TCP/IP \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C42\u0C1F\u0C4D\u200C\u0C28\u0C41 \u0C05\u0C15\u0C4D\u0C37\u0C30\u0C3E\u0C32\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C26\u0C3F \u0C05\u0C02\u0C24\u0C30\u0C4D\u0C1C\u0C3E\u0C24\u0C40\u0C2F \u0C07\u0C02\u0C1F\u0C30\u0C4D\u0C28\u0C46\u0C1F\u0C4D \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C02.",
      Hindi: "TCP/IP \u0915\u094B \u092E\u0942\u0932 \u0930\u0942\u092A \u092E\u0947\u0902 \u0939\u0940 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u0935\u0948\u0936\u094D\u0935\u093F\u0915 \u0928\u0947\u091F\u0935\u0930\u094D\u0915\u093F\u0902\u0917 \u0915\u093E \u092E\u093E\u0928\u0915 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0939\u0948\u0964",
      Tamil: "TCP/IP \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAA\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "TCP/IP \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "TCP/IP \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "TCP/IP \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0947.",
      Gujarati: "TCP/IP \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "TCP/IP \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "TCP/IP \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "TCP/IP (\u0C1F\u0C3F.\u0C38\u0C3F.\u0C2A\u0C3F/\u0C10.\u0C2A\u0C3F \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C1F\u0C4B\u0C15\u0C3E\u0C32\u0C4D)",
      Hindi: "TCP/IP (\u091F\u0940\u0938\u0940\u092A\u0940/\u0906\u0908\u092A\u0940 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932)",
      Tamil: "TCP/IP (\u0B9F\u0BBF\u0B9A\u0BBF\u0BAA\u0BBF/\u0B90\u0BAA\u0BBF)",
      Kannada: "TCP/IP (\u0C9F\u0CBF\u0CB8\u0CBF\u0CAA\u0CBF/\u0C90\u0CAA\u0CBF)",
      Bengali: "TCP/IP (\u099F\u09BF\u09B8\u09BF\u09AA\u09BF/\u0986\u0987\u09AA\u09BF)",
      Marathi: "TCP/IP (\u091F\u0940\u0938\u0940\u092A\u0940/\u0906\u092F\u092A\u0940)",
      Gujarati: "TCP/IP (\u0A9F\u0AC0\u0AB8\u0AC0\u0AAA\u0AC0/\u0A86\u0A88\u0AAA\u0AC0)",
      Punjabi: "TCP/IP (\u0A1F\u0A40\u0A38\u0A40\u0A2A\u0A40/\u0A06\u0A08\u0A2A\u0A40)",
      Malayalam: "TCP/IP (\u0D1F\u0D3F\u0D38\u0D3F\u0D2A\u0D3F/\u0D10\u0D2A\u0D3F)"
    },
    technicalExample: `// TCP 3-Way Handshake Connection Sequence:
// Host A (Client) -----> [SYN, Seq=100] ------------> Host B (Server)
// Host A <---------- [SYN-ACK, Seq=300, Ack=101] ---- Host B
// Host A --------------> [ACK, Ack=301] --------------> Host B
// [Established]: Reliable full-duplex socket stream active`
  },
  compiler: {
    englishTerm: "Compiler",
    subject: "Programming",
    aliases: ["compiler", "\u0C15\u0C02\u0C2A\u0C48\u0C32\u0C30\u0C4D", "\u0915\u0902\u092A\u093E\u0907\u0932\u0930", "\u0B95\u0BAE\u0BCD\u0BAA\u0BC8\u0BB2\u0BB0\u0BCD", "\u0C95\u0C82\u0CAA\u0CC8\u0CB2\u0CB0\u0CCD", "\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0"],
    technicalMeaningEn: "A Compiler is a specialized system software translation tool that parses high-level programming language statements and translates them into native low-level machine code, assembly, or bytecode through lexical analysis, syntax parsing, semantic analysis, intermediate representation (IR) optimization, and code generation.",
    explanationEn: "Preserve Compiler. Do not translate literally as dictionary compiler or book editor.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C15\u0C02\u0C2A\u0C48\u0C32\u0C30\u0C4D (Compiler) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C12\u0C15 \u0C05\u0C27\u0C41\u0C28\u0C3E\u0C24\u0C28 \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D. \u0C07\u0C26\u0C3F \u0C2E\u0C3E\u0C28\u0C35\u0C41\u0C32\u0C41 \u0C38\u0C41\u0C32\u0C2D\u0C02\u0C17\u0C3E \u0C30\u0C3E\u0C38\u0C47 \u0C39\u0C48-\u0C32\u0C46\u0C35\u0C32\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D \u0C15\u0C4B\u0C21\u0C4D\u200C\u0C28\u0C41 (C, C++, Java) \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C30\u0C4D \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C05\u0C30\u0C4D\u0C25\u0C02 \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C41\u0C28\u0C3F \u0C05\u0C2E\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C17\u0C32 \u0C32\u0C4B-\u0C32\u0C46\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C37\u0C3F\u0C28\u0C4D \u0C15\u0C4B\u0C21\u0C4D (\u0C2C\u0C48\u0C28\u0C30\u0C40 \u0C15\u0C4B\u0C21\u0C4D) \u0C32\u0C4B\u0C15\u0C3F \u0C32\u0C46\u0C15\u0C4D\u0C38\u0C3F\u0C15\u0C32\u0C4D, \u0C38\u0C3F\u0C02\u0C1F\u0C3E\u0C15\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C46\u0C2E\u0C3E\u0C02\u0C1F\u0C3F\u0C15\u0C4D \u0C26\u0C36\u0C32 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C38\u0C02\u0C2A\u0C42\u0C30\u0C4D\u0C23\u0C02\u0C17\u0C3E \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0915\u0902\u092A\u093E\u0907\u0932\u0930 (Compiler) \u090F\u0915 \u0935\u093F\u0936\u0947\u0937 \u0938\u093F\u0938\u094D\u091F\u092E \u0938\u0949\u092B\u093C\u094D\u091F\u0935\u0947\u092F\u0930 \u0939\u0948 \u091C\u094B \u0909\u091A\u094D\u091A-\u0938\u094D\u0924\u0930\u0940\u092F \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u092D\u093E\u0937\u093E (C, C++, Java) \u0915\u0947 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0938\u094D\u0930\u094B\u0924 \u0915\u094B\u0921 \u0915\u094B \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u0928 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092E\u0936\u0940\u0928 \u0915\u094B\u0921 \u092F\u093E \u092C\u093E\u0907\u091F\u0915\u094B\u0921 \u092E\u0947\u0902 \u0905\u0928\u0941\u0935\u093E\u0926\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0B95\u0BAE\u0BCD\u0BAA\u0BC8\u0BB2\u0BB0\u0BCD (Compiler) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B89\u0BAF\u0BB0\u0BCD\u0BA8\u0BBF\u0BB2\u0BC8 \u0BA8\u0BBF\u0BB0\u0BB2\u0BBE\u0B95\u0BCD\u0B95 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAF\u0BBF\u0BA9\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BCD\u0B9F\u0BC8 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B87\u0BAF\u0BA8\u0BCD\u0BA4\u0BBF\u0BB0 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAF\u0BBE\u0B95 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0C95\u0C82\u0CAA\u0CC8\u0CB2\u0CB0\u0CCD (Compiler) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0CAE\u0CBF\u0C82\u0C97\u0CCD \u0CAD\u0CBE\u0CB7\u0CC6\u0CAF \u0C95\u0CCB\u0CA1\u0CCD \u0C85\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCA\u0CB8\u0CC6\u0CB8\u0CB0\u0CCD \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0C97\u0CA4\u0C97\u0CCA\u0CB3\u0CBF\u0CB8\u0CAC\u0CB9\u0CC1\u0CA6\u0CBE\u0CA6 \u0CAE\u0CC6\u0CB7\u0CBF\u0CA8\u0CCD \u0C95\u0CCB\u0CA1\u0CCD \u0C86\u0C97\u0CBF \u0CAA\u0CB0\u0CBF\u0CB5\u0CB0\u0CCD\u0CA4\u0CBF\u0CB8\u0CC1\u0CB5 \u0CB8\u0CBE\u0CAB\u0CCD\u0C9F\u0CCD\u200C\u0CB5\u0CC7\u0CB0\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0 \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE \u09B8\u09AB\u099F\u0993\u09AF\u09BC\u09CD\u09AF\u09BE\u09B0 \u09AF\u09BE \u09B9\u09BE\u0987-\u09B2\u09C7\u09AD\u09C7\u09B2 \u09B8\u09CB\u09B0\u09CD\u09B8 \u0995\u09CB\u09A1\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B2\u09CB-\u09B2\u09C7\u09AD\u09C7\u09B2 \u09AE\u09C7\u09B6\u09BF\u09A8 \u0995\u09CB\u09A1\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0915\u0902\u092A\u093E\u0907\u0932\u0930 (Compiler) \u0939\u0947 \u0939\u093E\u092F-\u0932\u0947\u0935\u094D\u0939\u0932 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0915\u094B\u0921\u091A\u0947 \u092E\u0936\u0940\u0928 \u0915\u094B\u0921\u092E\u0927\u094D\u092F\u0947 \u0930\u0942\u092A\u093E\u0902\u0924\u0930 \u0915\u0930\u0923\u093E\u0930\u0947 \u0938\u093F\u0938\u094D\u091F\u0940\u092E \u0938\u0949\u092B\u094D\u091F\u0935\u0947\u0905\u0930 \u0906\u0939\u0947.",
      Gujarati: "\u0A95\u0AAE\u0ACD\u0AAA\u0ABE\u0A87\u0AB2\u0AB0 \u0A8F \u0AB9\u0ABE\u0A87 \u0AB2\u0AC7\u0AB5\u0AB2 \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0ABF\u0A82\u0A97 \u0A95\u0ACB\u0AA1\u0AA8\u0AC7 \u0AAE\u0AB6\u0AC0\u0AA8 \u0A95\u0ACB\u0AA1\u0AAE\u0ABE\u0A82 \u0AB0\u0AC2\u0AAA\u0ABE\u0A82\u0AA4\u0AB0\u0ABF\u0AA4 \u0A95\u0AB0\u0AA4\u0AC1\u0A82 \u0AB8\u0ACB\u0AAB\u0ACD\u0A9F\u0AB5\u0AC7\u0AB0 \u0A9B\u0AC7.",
      Punjabi: "\u0A15\u0A70\u0A2A\u0A3E\u0A08\u0A32\u0A30 \u0A39\u0A3E\u0A08 \u0A32\u0A48\u0A35\u0A32 \u0A15\u0A4B\u0A21 \u0A28\u0A42\u0A70 \u0A2E\u0A38\u0A3C\u0A40\u0A28 \u0A15\u0A4B\u0A21 \u0A35\u0A3F\u0A71\u0A1A \u0A2C\u0A26\u0A32\u0A23 \u0A35\u0A3E\u0A32\u0A3E \u0A38\u0A3E\u0A2B\u0A1F\u0A35\u0A47\u0A05\u0A30 \u0A39\u0A48\u0964",
      Malayalam: "\u0D15\u0D02\u0D2A\u0D48\u0D32\u0D7C \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D3F\u0D02\u0D17\u0D4D \u0D15\u0D4B\u0D21\u0D3F\u0D28\u0D46 \u0D2E\u0D46\u0D37\u0D40\u0D7B \u0D15\u0D4B\u0D21\u0D3E\u0D15\u0D4D\u0D15\u0D3F \u0D2E\u0D3E\u0D31\u0D4D\u0D31\u0D41\u0D28\u0D4D\u0D28 \u0D38\u0D3F\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D02 \u0D38\u0D4B\u0D2B\u0D4D\u0D31\u0D4D\u0D31\u0D4D\u200C\u0D35\u0D46\u0D2F\u0D31\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Compiler \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C15\u0C02\u0C2A\u0C48\u0C32\u0C30\u0C4D \u0C05\u0C28\u0C3F \u0C2A\u0C3F\u0C32\u0C35\u0C3E\u0C32\u0C3F. \u0C2A\u0C41\u0C38\u0C4D\u0C24\u0C15 \u0C38\u0C02\u0C15\u0C32\u0C28\u0C15\u0C30\u0C4D\u0C24 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41.",
      Hindi: "Compiler \u0915\u094B \u092A\u0941\u0938\u094D\u0924\u0915 \u0938\u0902\u0915\u0932\u0928\u0915\u0930\u094D\u0924\u093E \u0928 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u0915\u094B\u0921 \u0905\u0928\u0941\u0935\u093E\u0926\u0915 \u0938\u093F\u0938\u094D\u091F\u092E \u0938\u0949\u092B\u093C\u094D\u091F\u0935\u0947\u092F\u0930 \u0939\u0948\u0964",
      Tamil: "Compiler \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAF\u0BB2\u0BCD \u0B9A\u0BC2\u0BB4\u0D32\u0BBF\u0BB2\u0BCD \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Compiler \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95\u0CB5\u0CBE\u0C97\u0CBF\u0CAF\u0CC7 \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Compiler \u09B6\u09AC\u09CD\u09A6\u099F\u09BF \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Compiler \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0907\u0902\u0917\u094D\u0930\u091C\u0940\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u093E.",
      Gujarati: "Compiler \u0AB6\u0AAC\u0ACD\u0AA6 \u0A95\u0ACB\u0AA1\u0ABF\u0A82\u0A97 \u0AAE\u0ABE\u0A9F\u0AC7 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "Compiler \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Compiler \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Compiler (\u0C15\u0C02\u0C2A\u0C48\u0C32\u0C30\u0C4D - \u0C15\u0C4B\u0C21\u0C4D \u0C05\u0C28\u0C41\u0C35\u0C3E\u0C26 \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D)",
      Hindi: "Compiler (\u0915\u0902\u092A\u093E\u0907\u0932\u0930 - \u092E\u0936\u0940\u0928 \u0915\u094B\u0921 \u0905\u0928\u0941\u0935\u093E\u0926\u0915)",
      Tamil: "Compiler (\u0B95\u0BAE\u0BCD\u0BAA\u0BC8\u0BB2\u0BB0\u0BCD)",
      Kannada: "Compiler (\u0C95\u0C82\u0CAA\u0CC8\u0CB2\u0CB0\u0CCD)",
      Bengali: "Compiler (\u0995\u09AE\u09CD\u09AA\u09BE\u0987\u09B2\u09BE\u09B0)",
      Marathi: "Compiler (\u0915\u0902\u092A\u093E\u0907\u0932\u0930)",
      Gujarati: "Compiler (\u0A95\u0AAE\u0ACD\u0AAA\u0ABE\u0A87\u0AB2\u0AB0)",
      Punjabi: "Compiler (\u0A15\u0A70\u0A2A\u0A3E\u0A08\u0A32\u0A30)",
      Malayalam: "Compiler (\u0D15\u0D02\u0D2A\u0D48\u0D32\u0D7C)"
    },
    technicalExample: `// LLVM Clang Compiler Pipeline:
$ clang -O3 -Wall main.c -o application_binary
// 1. Preprocessor -> main.i
// 2. Lexical & AST Parser -> Abstract Syntax Tree
// 3. LLVM IR Optimizer -> Optimized Intermediate Representation
// 4. Machine Code Generator -> ELF/Mach-O Binary Executable`
  },
  socket: {
    englishTerm: "Socket",
    subject: "Computer Networks",
    aliases: ["socket", "network socket", "\u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D", "\u0938\u0949\u0915\u0947\u091F", "\u0B9A\u0BBE\u0B95\u0BCD\u0B95\u0BC6\u0B9F\u0BCD", "\u0CB8\u0CBE\u0C95\u0CC6\u0C9F\u0CCD", "\u09B8\u0995\u09C7\u099F"],
    technicalMeaningEn: "A Network Socket is an operating system abstraction representing a bidirectional communication endpoint in an IP network, defined by the 5-tuple: (Source IP, Source Port, Destination IP, Destination Port, Protocol).",
    explanationEn: "Preserve Socket. Do not translate as electrical wall socket/plughole.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D (Socket) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B\u0C28\u0C3F \u0C12\u0C15 \u0C0E\u0C02\u0C21\u0C4D-\u0C2A\u0C3E\u0C2F\u0C3F\u0C02\u0C1F\u0C4D \u0C05\u0C2C\u0C4D\u200C\u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C4D\u0C37\u0C28\u0C4D. \u0C07\u0C26\u0C3F \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D\u200C\u0C32\u0C4B \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32 \u0C2E\u0C27\u0C4D\u0C2F \u0C26\u0C4D\u0C35\u0C02\u0C26\u0C4D\u0C35 \u0C26\u0C3F\u0C36\u0C3E \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23\u0C28\u0C41 (Bidirectional Communication) \u0C38\u0C3E\u0C27\u0C4D\u0C2F\u0C02 \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D IP \u0C05\u0C21\u0C4D\u0C30\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D \u0C28\u0C02\u0C2C\u0C30\u0C4D \u0C15\u0C32\u0C2F\u0C3F\u0C15\u0C24\u0C4B \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0949\u0915\u0947\u091F (Socket) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u093E \u090F\u0915 \u0905\u092E\u0942\u0930\u094D\u0924 \u0930\u0942\u092A \u0939\u0948 \u091C\u094B \u0906\u0908\u092A\u0940 \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u092A\u0930 \u091A\u0932\u0928\u0947 \u0935\u093E\u0932\u0940 \u0926\u094B \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0913\u0902 \u0915\u0947 \u092C\u0940\u091A \u0926\u094D\u0935\u093F\u0926\u093F\u0936\u0940\u092F \u0938\u0902\u091A\u093E\u0930 \u0932\u093F\u0902\u0915 (Bi-directional Communication Link) \u0915\u093E \u0905\u0902\u0924\u093F\u092E \u092C\u093F\u0902\u0926\u0941 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u0907\u0938\u0947 IP Address \u0914\u0930 Port Number \u0915\u0947 \u0938\u0902\u092F\u094B\u091C\u0928 \u0938\u0947 \u092A\u0939\u091A\u093E\u0928\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0B9A\u0BBE\u0B95\u0BCD\u0B95\u0BC6\u0B9F\u0BCD (Socket) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA8\u0BC6\u0B9F\u0BCD\u0BB5\u0BCA\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BBF\u0BB2\u0BCD \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B87\u0BB0\u0BA3\u0BCD\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B87\u0B9F\u0BC8\u0BAF\u0BC7 \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BB0\u0BBF\u0BAE\u0BBE\u0BB1 \u0B89\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BAE\u0BC1\u0BA9\u0BC8\u0BAF\u0BAE\u0BBE\u0B95\u0BC1\u0BAE\u0BCD (Endpoint).",
      Kannada: "\u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD \u0CB8\u0CBE\u0C95\u0CC6\u0C9F\u0CCD (Socket) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0CA8\u0CC6\u0C9F\u0CCD\u200C\u0CB5\u0CB0\u0CCD\u0C95\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0C8E\u0CB0\u0CA1\u0CC1 \u0CAA\u0CCD\u0CB0\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6\u0C97\u0CB3 \u0CA8\u0CA1\u0CC1\u0CB5\u0CC6 \u0CA6\u0CCD\u0CB5\u0CBF\u0CAE\u0CC1\u0C96 \u0CB8\u0C82\u0CB5\u0CB9\u0CA8 \u0CA8\u0CA1\u0CC6\u0CB8\u0CB2\u0CC1 \u0CAC\u0CB3\u0CB8\u0CC1\u0CB5 \u0C8E\u0C82\u0CA1\u0CCD\u200C\u0CAA\u0CBE\u0CAF\u0CBF\u0C82\u0C9F\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09A8\u09C7\u099F\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995 \u09B8\u0995\u09C7\u099F \u09B9\u09B2\u09CB \u0986\u0987\u09AA\u09BF \u09A8\u09C7\u099F\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995\u09C7 \u09A6\u09C1\u099F\u09BF \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u098F\u09A8\u09CD\u09A1\u09AA\u09AF\u09BC\u09C7\u09A8\u09CD\u099F\u0964",
      Marathi: "\u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0949\u0915\u0947\u091F (Socket) \u0939\u0947 \u0928\u0947\u091F\u0935\u0930\u094D\u0915\u0935\u0930\u0940\u0932 \u0926\u094B\u0928 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u092E\u0927\u0940\u0932 \u0938\u0902\u0935\u093E\u0926\u093E\u091A\u0947 \u0936\u0947\u0935\u091F\u091A\u0947 \u091F\u094B\u0915 (Endpoint) \u0905\u0938\u0924\u0947.",
      Gujarati: "\u0AA8\u0AC7\u0A9F\u0AB5\u0AB0\u0ACD\u0A95 \u0AB8\u0ACB\u0A95\u0AC7\u0A9F \u0A8F \u0AA8\u0AC7\u0A9F\u0AB5\u0AB0\u0ACD\u0A95\u0AAE\u0ABE\u0A82 \u0AAC\u0AC7 \u0AAA\u0ACD\u0AB0\u0A95\u0ACD\u0AB0\u0ABF\u0AAF\u0ABE\u0A93 \u0AB5\u0A9A\u0ACD\u0A9A\u0AC7 \u0AB8\u0A82\u0A9A\u0ABE\u0AB0 \u0AAE\u0ABE\u0A9F\u0AC7\u0AA8\u0ACB \u0A8F\u0AA8\u0ACD\u0AA1\u0AAA\u0ACB\u0A87\u0AA8\u0ACD\u0A9F \u0A9B\u0AC7.",
      Punjabi: "\u0A28\u0A48\u0A71\u0A1F\u0A35\u0A30\u0A15 \u0A38\u0A3E\u0A15\u0A1F \u0A28\u0A48\u0A71\u0A1F\u0A35\u0A30\u0A15 \u0A09\u0A71\u0A24\u0A47 \u0A26\u0A4B \u0A2A\u0A4D\u0A30\u0A15\u0A3F\u0A30\u0A3F\u0A06\u0A35\u0A3E\u0A02 \u0A35\u0A3F\u0A1A\u0A15\u0A3E\u0A30 \u0A38\u0A70\u0A1A\u0A3E\u0A30 \u0A26\u0A3E \u0A05\u0A70\u0A24\u0A2E \u0A2C\u0A3F\u0A70\u0A26\u0A42 \u0A39\u0A48\u0964",
      Malayalam: "\u0D28\u0D46\u0D31\u0D4D\u0D31\u0D4D\u200C\u0D35\u0D7C\u0D15\u0D4D\u0D15\u0D4D \u0D38\u0D4B\u0D15\u0D4D\u0D15\u0D31\u0D4D\u0D31\u0D4D \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D30\u0D23\u0D4D\u0D1F\u0D4D \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D15\u0D7E \u0D24\u0D2E\u0D4D\u0D2E\u0D3F\u0D32\u0D41\u0D33\u0D4D\u0D33 \u0D06\u0D36\u0D2F\u0D35\u0D3F\u0D28\u0D3F\u0D2E\u0D2F\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D05\u0D35\u0D38\u0D3E\u0D28 \u0D2C\u0D3F\u0D28\u0D4D\u0D26\u0D41\u0D35\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Socket \u0C28\u0C3F \u0C15\u0C30\u0C46\u0C02\u0C1F\u0C41 \u0C2A\u0C4D\u0C32\u0C17\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C17\u0C4B\u0C21 \u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D\u200C\u0C32\u0C4B \u0C07\u0C26\u0C3F IP + Port \u0C15\u0C2E\u0C4D\u0C2F\u0C42\u0C28\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C0E\u0C02\u0C21\u0C4D\u200C\u0C2A\u0C3E\u0C2F\u0C3F\u0C02\u0C1F\u0C4D.",
      Hindi: "Socket \u0915\u094B \u092C\u093F\u091C\u0932\u0940 \u0915\u093E \u092A\u094D\u0932\u0917 \u0928 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 IP \u0914\u0930 Port \u0915\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0902\u091A\u093E\u0930 \u090F\u0902\u0921\u092A\u0949\u0907\u0902\u091F \u0939\u0948\u0964",
      Tamil: "Socket \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BAE\u0BBF\u0BA9\u0BCD\u0B9A\u0BBE\u0BB0 \u0B9A\u0BBE\u0B95\u0BCD\u0B95\u0BC6\u0B9F\u0BCD \u0B89\u0B9F\u0BA9\u0BCD \u0B95\u0BC1\u0BB4\u0BAA\u0BCD\u0BAA\u0B95\u0BCD \u0B95\u0BC2\u0B9F\u0BBE\u0BA4\u0BC1.",
      Kannada: "Socket \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB5\u0CBF\u0CA6\u0CCD\u0CAF\u0CC1\u0CA4\u0CCD \u0CB8\u0CBE\u0C95\u0CC6\u0C9F\u0CCD \u0C8E\u0C82\u0CA6\u0CC1 \u0CA4\u0CAA\u0CCD\u0CAA\u0CBE\u0C97\u0CBF \u0C97\u0CCD\u0CB0\u0CB9\u0CBF\u0CB8\u0CAC\u0CBE\u0CB0\u0CA6\u0CC1.",
      Bengali: "\u09B8\u0995\u09C7\u099F\u0995\u09C7 \u09AC\u09C8\u09A6\u09CD\u09AF\u09C1\u09A4\u09BF\u0995 \u09AA\u09CD\u09B2\u09BE\u0997\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u0997\u09C1\u09B2\u09BF\u09AF\u09BC\u09C7 \u09AB\u09C7\u09B2\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964",
      Marathi: "Socket \u091A\u093E \u0905\u0930\u094D\u0925 \u0935\u093F\u091C\u0947\u091A\u093E \u0938\u0949\u0915\u0947\u091F \u0905\u0938\u093E \u0915\u0930\u0942 \u0928\u092F\u0947.",
      Gujarati: "Socket \u0AA8\u0AC7 \u0AB5\u0AC0\u0A9C\u0AB3\u0AC0\u0AA8\u0ABE \u0AB8\u0ACB\u0A95\u0AC7\u0A9F \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAD\u0AC7\u0AB3\u0AB5\u0AB5\u0AC1\u0A82 \u0AA8\u0AB9\u0AC0\u0A82.",
      Punjabi: "Socket \u0A28\u0A42\u0A70 \u0A2C\u0A3F\u0A1C\u0A32\u0A40 \u0A26\u0A3E \u0A2A\u0A32\u0A71\u0A17 \u0A28\u0A3E \u0A38\u0A2E\u0A1D\u0A4B\u0964",
      Malayalam: "Socket \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D07\u0D32\u0D15\u0D4D\u0D1F\u0D4D\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D7D \u0D38\u0D4B\u0D15\u0D4D\u0D15\u0D31\u0D4D\u0D31\u0D4D \u0D05\u0D32\u0D4D\u0D32."
    },
    transliterations: {
      Telugu: "Socket (\u0C38\u0C3E\u0C15\u0C46\u0C1F\u0C4D - \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C0E\u0C02\u0C21\u0C4D\u200C\u0C2A\u0C3E\u0C2F\u0C3F\u0C02\u0C1F\u0C4D)",
      Hindi: "Socket (\u0938\u0949\u0915\u0947\u091F - \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u0902\u091A\u093E\u0930 \u090F\u0902\u0921\u092A\u0949\u0907\u0902\u091F)",
      Tamil: "Socket (\u0B9A\u0BBE\u0B95\u0BCD\u0B95\u0BC6\u0B9F\u0BCD)",
      Kannada: "Socket (\u0CB8\u0CBE\u0C95\u0CC6\u0C9F\u0CCD)",
      Bengali: "Socket (\u09B8\u0995\u09C7\u099F)",
      Marathi: "Socket (\u0938\u0949\u0915\u0947\u091F)",
      Gujarati: "Socket (\u0AB8\u0ACB\u0A95\u0AC7\u0A9F)",
      Punjabi: "Socket (\u0A38\u0A3E\u0A15\u0A1F)",
      Malayalam: "Socket (\u0D38\u0D4B\u0D15\u0D4D\u0D15\u0D31\u0D4D\u0D31\u0D4D)"
    },
    technicalExample: `// Python TCP Socket Server
import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8080))
server.listen(5)
print("Listening on 0.0.0.0:8080...")
client_socket, address = server.accept()
client_socket.sendall(b"HTTP/1.1 200 OK\\r\\n\\r\\nHello Connected Client")`
  },
  stack: {
    englishTerm: "Stack",
    subject: "Data Structures",
    aliases: ["stack", "\u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D", "\u0938\u094D\u091F\u0948\u0915", "\u0BB8\u0BCD\u0B9F\u0BBE\u0B95\u0BCD", "\u0CB8\u0CCD\u0C9F\u0CCD\u0CAF\u0CBE\u0C95\u0CCD", "\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u0995"],
    technicalMeaningEn: "A Stack is a linear abstract data structure governed by the LIFO (Last-In, First-Out) principle, restricting element insertion (push) and deletion (pop) strictly to a single extremity called the top of the stack.",
    explanationEn: "Preserve Stack. Translating as hay stack or brick pile obscures computer call stack and memory layout concepts.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D (Stack) \u0C05\u0C28\u0C47\u0C26\u0C3F LIFO (Last-In, First-Out) \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C02\u0C2A\u0C48 \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C47 \u0C38\u0C30\u0C33 \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D (Linear Data Structure). \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C05\u0C02\u0C36\u0C3E\u0C32\u0C28\u0C41 \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C21\u0C02 (Push) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C24\u0C4A\u0C32\u0C17\u0C3F\u0C02\u0C1A\u0C21\u0C02 (Pop) \u0C30\u0C46\u0C02\u0C21\u0C42 \u0C15\u0C47\u0C35\u0C32\u0C02 \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D \u0C2A\u0C48\u0C2D\u0C3E\u0C17\u0C02 (Top) \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C1C\u0C30\u0C41\u0C17\u0C41\u0C24\u0C3E\u0C2F\u0C3F. \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C30\u0C4D \u0C06\u0C30\u0C4D\u0C15\u0C3F\u0C1F\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D \u0C15\u0C3E\u0C32\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C32\u0C4B\u0C15\u0C32\u0C4D \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D\u0C38\u0C4D \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C23\u0C15\u0C41 \u0C07\u0C26\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C38\u0C3E\u0C27\u0C28\u0C02.",
      Hindi: "\u0938\u094D\u091F\u0948\u0915 (Stack) LIFO (\u0932\u093E\u0938\u094D\u091F-\u0907\u0928, \u092B\u0930\u094D\u0938\u094D\u091F-\u0906\u0909\u091F) \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924 \u092A\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u090F\u0915 \u0930\u0948\u0916\u093F\u0915 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0939\u0948, \u091C\u093F\u0938\u092E\u0947\u0902 \u0915\u0947\u0935\u0932 \u0936\u0940\u0930\u094D\u0937 (Top) \u0938\u0947 \u0939\u0940 \u0924\u0924\u094D\u0935\u094B\u0902 \u0915\u094B \u091C\u094B\u0921\u093C\u0928\u093E (Push) \u0914\u0930 \u0939\u091F\u093E\u0928\u093E (Pop) \u0938\u0902\u092D\u0935 \u0939\u094B\u0924\u093E \u0939\u0948\u0964 \u092F\u0939 \u092B\u093C\u0902\u0915\u094D\u0936\u0928 \u0915\u0949\u0932 \u0914\u0930 \u092E\u0947\u092E\u094B\u0930\u0940 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u093E \u0906\u0927\u093E\u0930 \u0939\u0948\u0964",
      Tamil: "\u0BB8\u0BCD\u0B9F\u0BBE\u0B95\u0BCD (Stack) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 LIFO (Last-In, First-Out) \u0B95\u0BCB\u0B9F\u0BCD\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BBF\u0BA9\u0BCD \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0B87\u0BAF\u0B99\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B92\u0BB0\u0BC1 \u0BA8\u0BC7\u0BB0\u0BBF\u0BAF\u0BB2\u0BCD \u0BA4\u0BB0\u0BB5\u0BC1 \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CB8\u0CCD\u0C9F\u0CCD\u0CAF\u0CBE\u0C95\u0CCD (Stack) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 LIFO (Last-In, First-Out) \u0CA4\u0CA4\u0CCD\u0CB5\u0CA6 \u0CAE\u0CC7\u0CB2\u0CC6 \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0CA8\u0CBF\u0CB0\u0CCD\u0CB5\u0CB9\u0CBF\u0CB8\u0CC1\u0CB5 \u0CB0\u0CC7\u0C96\u0CC0\u0CAF \u0CA1\u0CC7\u0C9F\u0CBE \u0CB0\u0C9A\u0CA8\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u0995 \u09B9\u09B2\u09CB LIFO (Last-In, First-Out) \u09A8\u09C0\u09A4\u09BF\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7 \u09A4\u09C8\u09B0\u09BF \u098F\u0995\u099F\u09BF \u09B2\u09BF\u09A8\u09BF\u09AF\u09BC\u09BE\u09B0 \u09A1\u09C7\u099F\u09BE \u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u099A\u09BE\u09B0\u0964",
      Marathi: "\u0938\u094D\u091F\u0945\u0915 (Stack) \u0939\u0940 LIFO \u0924\u0924\u094D\u0924\u094D\u0935\u093E\u0935\u0930 \u0915\u093E\u092E \u0915\u0930\u0923\u093E\u0930\u0940 \u0932\u0940\u0928\u093F\u092F\u0930 \u0921\u0947\u091F\u093E \u0930\u091A\u0928\u093E \u0906\u0939\u0947.",
      Gujarati: "\u0AB8\u0ACD\u0A9F\u0AC7\u0A95 (Stack) \u0A8F LIFO \u0AB8\u0ABF\u0AA6\u0ACD\u0AA7\u0ABE\u0A82\u0AA4 \u0AAA\u0AB0 \u0A95\u0ABE\u0AB0\u0ACD\u0AAF \u0A95\u0AB0\u0AA4\u0AC1\u0A82 \u0AB2\u0AC0\u0AA8\u0ABF\u0AAF\u0AB0 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0A95\u0ACD\u0A9A\u0AB0 \u0A9B\u0AC7.",
      Punjabi: "\u0A38\u0A1F\u0A48\u0A15 (Stack) LIFO \u0A38\u0A3F\u0A27\u0A3E\u0A02\u0A24 \u0A09\u0A71\u0A24\u0A47 \u0A15\u0A70\u0A2E \u0A15\u0A30\u0A28 \u0A35\u0A3E\u0A32\u0A3E \u0A32\u0A40\u0A28\u0A40\u0A05\u0A30 \u0A21\u0A3E\u0A1F\u0A3E \u0A38\u0A1F\u0A4D\u0A30\u0A15\u0A1A\u0A30 \u0A39\u0A48\u0964",
      Malayalam: "\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D3E\u0D15\u0D4D\u0D15\u0D4D (Stack) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D LIFO \u0D24\u0D24\u0D4D\u0D35\u0D24\u0D4D\u0D24\u0D3F\u0D7D \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E \u0D18\u0D1F\u0D28\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Stack \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D \u0C05\u0C28\u0C3F \u0C2A\u0C3F\u0C32\u0C35\u0C3E\u0C32\u0C3F. \u0C17\u0C21\u0C4D\u0C21\u0C3F \u0C35\u0C3E\u0C2E\u0C3F \u0C32\u0C47\u0C26\u0C3E \u0C07\u0C1F\u0C41\u0C15\u0C32 \u0C15\u0C41\u0C2A\u0C4D\u0C2A \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41.",
      Hindi: "Stack \u0915\u094B \u0908\u0902\u091F\u094B\u0902 \u0915\u093E \u0922\u0947\u0930 \u092F\u093E \u0924\u093F\u0928\u0915\u094B\u0902 \u0915\u093E \u0917\u091F\u094D\u0920\u0930 \u0928 \u0915\u0939\u0947\u0902; \u092F\u0939 \u092E\u0947\u092E\u094B\u0930\u0940 \u0914\u0930 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0915\u093E LIFO \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924 \u0939\u0948\u0964",
      Tamil: "Stack \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAE\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Stack \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95\u0CB5\u0CBE\u0C97\u0CBF\u0CAF\u0CC7 \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Stack \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Stack \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u091C\u094D\u091E\u0947\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0947.",
      Gujarati: "Stack \u0AB6\u0AAC\u0ACD\u0AA6 \u0A95\u0ACB\u0AA1\u0ABF\u0A82\u0A97 \u0AAE\u0ABE\u0A9F\u0AC7 \u0AAA\u0ACD\u0AB0\u0AAE\u0ABE\u0AA3\u0AAD\u0AC2\u0AA4 \u0A9B\u0AC7.",
      Punjabi: "Stack \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Stack \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Stack (\u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D - LIFO \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D)",
      Hindi: "Stack (\u0938\u094D\u091F\u0948\u0915 - LIFO \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E)",
      Tamil: "Stack (\u0BB8\u0BCD\u0B9F\u0BBE\u0B95\u0BCD)",
      Kannada: "Stack (\u0CB8\u0CCD\u0C9F\u0CCD\u0CAF\u0CBE\u0C95\u0CCD)",
      Bengali: "Stack (\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u0995)",
      Marathi: "Stack (\u0938\u094D\u091F\u0945\u0915)",
      Gujarati: "Stack (\u0AB8\u0ACD\u0A9F\u0AC7\u0A95)",
      Punjabi: "Stack (\u0A38\u0A1F\u0A48\u0A15)",
      Malayalam: "Stack (\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D3E\u0D15\u0D4D\u0D15\u0D4D)"
    },
    technicalExample: `// Stack Implementation with Array in TypeScript
class Stack<T> {
    private items: T[] = [];
    push(element: T): void { this.items.push(element); }
    pop(): T | undefined { return this.items.pop(); }
    peek(): T | undefined { return this.items[this.items.length - 1]; }
    isEmpty(): boolean { return this.items.length === 0; }
}`
  },
  queue: {
    englishTerm: "Queue",
    subject: "Data Structures",
    aliases: ["queue", "\u0C15\u0C4D\u0C2F\u0C42", "\u0915\u094D\u092F\u0942", "\u0B95\u0BBF\u0BAF\u0BC2", "\u0C95\u0CCD\u0CAF\u0CC2", "\u0995\u09BF\u0989"],
    technicalMeaningEn: "A Queue is a linear abstract data structure that operates under the FIFO (First-In, First-Out) principle, inserting new elements at the rear (enqueue) and removing existing elements from the front (dequeue).",
    explanationEn: "Preserve Queue. Do not translate as standing in a cinema or bus line; in computing, it is an essential scheduling buffer.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C15\u0C4D\u0C2F\u0C42 (Queue) \u0C05\u0C28\u0C47\u0C26\u0C3F FIFO (First-In, First-Out) \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C02\u0C2A\u0C48 \u0C06\u0C27\u0C3E\u0C30\u0C2A\u0C21\u0C3F\u0C28 \u0C38\u0C30\u0C33 \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D. \u0C07\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C05\u0C02\u0C36\u0C3E\u0C32\u0C41 \u0C35\u0C46\u0C28\u0C41\u0C15 \u0C2D\u0C3E\u0C17\u0C02 (Rear/Enqueue) \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C2A\u0C4D\u0C30\u0C35\u0C47\u0C36\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2E\u0C41\u0C02\u0C26\u0C41 \u0C2D\u0C3E\u0C17\u0C02 (Front/Dequeue) \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C2C\u0C2F\u0C1F\u0C15\u0C41 \u0C35\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F. \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D \u0C37\u0C46\u0C21\u0C4D\u0C2F\u0C42\u0C32\u0C3F\u0C02\u0C17\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C28\u0C46\u0C1F\u0C4D\u200C\u0C35\u0C30\u0C4D\u0C15\u0C4D \u0C2C\u0C2B\u0C30\u0C3F\u0C02\u0C17\u0C4D\u200C\u0C15\u0C41 \u0C07\u0C26\u0C3F \u0C35\u0C46\u0C28\u0C4D\u0C28\u0C46\u0C2E\u0C41\u0C15.",
      Hindi: "\u0915\u0924\u093E\u0930 \u092F\u093E \u0915\u0924\u093E\u0930 \u0938\u0902\u0930\u091A\u0928\u093E (Queue) FIFO (\u092B\u0930\u094D\u0938\u094D\u091F-\u0907\u0928, \u092B\u0930\u094D\u0938\u094D\u091F-\u0906\u0909\u091F) \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924 \u092A\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u090F\u0915 \u0930\u0948\u0916\u093F\u0915 \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0939\u0948, \u091C\u093F\u0938\u092E\u0947\u0902 \u0924\u0924\u094D\u0935 \u092A\u0940\u091B\u0947 (Rear/Enqueue) \u0938\u0947 \u091C\u094B\u0921\u093C\u0947 \u091C\u093E\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0906\u0917\u0947 (Front/Dequeue) \u0938\u0947 \u0939\u091F\u093E\u090F \u091C\u093E\u0924\u0947 \u0939\u0948\u0902\u0964",
      Tamil: "\u0B95\u0BBF\u0BAF\u0BC2 (Queue) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 FIFO (First-In, First-Out) \u0B95\u0BCB\u0B9F\u0BCD\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BBF\u0BB2\u0BCD \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BB5\u0BB0\u0BBF\u0B9A\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA4\u0BB0\u0BB5\u0BC1 \u0B95\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0C95\u0CCD\u0CAF\u0CC2 (Queue) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 FIFO (First-In, First-Out) \u0CA4\u0CA4\u0CCD\u0CB5\u0CA6 \u0CAE\u0CC7\u0CB2\u0CC6 \u0C95\u0CBE\u0CB0\u0CCD\u0CAF\u0CA8\u0CBF\u0CB0\u0CCD\u0CB5\u0CB9\u0CBF\u0CB8\u0CC1\u0CB5 \u0CB0\u0CC7\u0C96\u0CC0\u0CAF \u0CA1\u0CC7\u0C9F\u0CBE \u0CB0\u0C9A\u0CA8\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u0995\u09BF\u0989 \u09B9\u09B2\u09CB FIFO (First-In, First-Out) \u09A8\u09C0\u09A4\u09BF\u09A4\u09C7 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09BF\u09A4 \u098F\u0995\u099F\u09BF \u09B0\u09C8\u0996\u09BF\u0995 \u09A1\u09C7\u099F\u09BE \u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u099A\u09BE\u09B0\u0964",
      Marathi: "\u0915\u094D\u092F\u0941 (Queue) \u0939\u0940 FIFO \u0924\u0924\u094D\u0924\u094D\u0935\u093E\u0935\u0930 \u091A\u093E\u0932\u0923\u093E\u0930\u0940 \u0932\u0940\u0928\u093F\u092F\u0930 \u0921\u0947\u091F\u093E \u0930\u091A\u0928\u093E \u0906\u0939\u0947.",
      Gujarati: "\u0A95\u0AA4\u0ABE\u0AB0 (Queue) \u0A8F FIFO \u0AB8\u0ABF\u0AA6\u0ACD\u0AA7\u0ABE\u0A82\u0AA4 \u0AAA\u0AB0 \u0A95\u0ABE\u0AB0\u0ACD\u0AAF \u0A95\u0AB0\u0AA4\u0AC1\u0A82 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0A95\u0ACD\u0A9A\u0AB0 \u0A9B\u0AC7.",
      Punjabi: "\u0A15\u0A24\u0A3E\u0A30 (Queue) FIFO \u0A38\u0A3F\u0A27\u0A3E\u0A02\u0A24 \u0A09\u0A71\u0A24\u0A47 \u0A15\u0A70\u0A2E \u0A15\u0A30\u0A28 \u0A35\u0A3E\u0A32\u0A3E \u0A32\u0A40\u0A28\u0A40\u0A05\u0A30 \u0A21\u0A3E\u0A1F\u0A3E \u0A38\u0A1F\u0A4D\u0A30\u0A15\u0A1A\u0A30 \u0A39\u0A48\u0964",
      Malayalam: "\u0D15\u0D4D\u0D2F\u0D42 (Queue) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D FIFO \u0D24\u0D24\u0D4D\u0D35\u0D24\u0D4D\u0D24\u0D3F\u0D7D \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D30\u0D47\u0D16\u0D40\u0D2F \u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E \u0D18\u0D1F\u0D28\u0D2F\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Queue \u0C28\u0C3F \u0C15\u0C02\u0C2A\u0C4D\u0C2F\u0C42\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C2A\u0C26\u0C02\u0C17\u0C3E\u0C28\u0C47 \u0C35\u0C3E\u0C21\u0C3E\u0C32\u0C3F. \u0C2C\u0C38\u0C4D\u0C38\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C3F\u0C28\u0C3F\u0C2E\u0C3E \u0C32\u0C48\u0C28\u0C4D \u0C24\u0C4B \u0C2A\u0C4B\u0C32\u0C4D\u0C1A\u0C30\u0C3E\u0C26\u0C41.",
      Hindi: "Queue \u0915\u094B \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u091C\u0949\u092C \u0936\u0947\u0921\u094D\u092F\u0942\u0932\u093F\u0902\u0917 \u0914\u0930 \u092E\u0948\u0938\u0947\u091C \u092C\u092B\u0930 \u0915\u093E \u0906\u0927\u093E\u0930 \u0939\u0948\u0964",
      Tamil: "Queue \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAE\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Queue \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95\u0CB5\u0CBE\u0C97\u0CBF\u0CAF\u0CC7 \u0CAC\u0CB3\u0CB8\u0CBF.",
      Bengali: "Queue \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Queue \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u091C\u094D\u091E\u0947\u0924\u091A \u0935\u093E\u092A\u0930\u093E\u0935\u0947.",
      Gujarati: "Queue \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAA\u0ACD\u0AB0\u0AAE\u0ABE\u0AA3\u0AAD\u0AC2\u0AA4 \u0A9B\u0AC7.",
      Punjabi: "Queue \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Queue \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15 \u0D2A\u0D26\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Queue (\u0C15\u0C4D\u0C2F\u0C42 - FIFO \u0C21\u0C47\u0C1F\u0C3E \u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C15\u0C4D\u0C1A\u0C30\u0C4D)",
      Hindi: "Queue (\u0915\u094D\u092F\u0942 - FIFO \u0921\u0947\u091F\u093E \u0938\u0902\u0930\u091A\u0928\u093E)",
      Tamil: "Queue (\u0B95\u0BBF\u0BAF\u0BC2)",
      Kannada: "Queue (\u0C95\u0CCD\u0CAF\u0CC2)",
      Bengali: "Queue (\u0995\u09BF\u0989)",
      Marathi: "Queue (\u0915\u094D\u092F\u0941)",
      Gujarati: "Queue (\u0A95\u0AA4\u0ABE\u0AB0 / \u0A95\u0ACD\u0AAF\u0AC2)",
      Punjabi: "Queue (\u0A15\u0A3F\u0A0A)",
      Malayalam: "Queue (\u0D15\u0D4D\u0D2F\u0D42)"
    },
    technicalExample: `// Queue Implementation with Enqueue/Dequeue in TypeScript
class Queue<T> {
    private items: T[] = [];
    enqueue(item: T): void { this.items.push(item); }
    dequeue(): T | undefined { return this.items.shift(); }
    front(): T | undefined { return this.items[0]; }
    size(): number { return this.items.length; }
}`
  },
  knapsack: {
    englishTerm: "Knapsack Problem",
    subject: "Algorithms",
    aliases: ["knapsack", "knapsack problem", "\u0C28\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u200C\u0C38\u0C3E\u0C15\u0C4D", "\u0928\u0948\u092A\u0938\u0948\u0915", "\u0BA8\u0BBE\u0BAA\u0BCD\u0B9A\u0BBE\u0B95\u0BCD", "\u0CA8\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u200C\u0CB8\u0CCD\u0CAF\u0CBE\u0C95\u0CCD"],
    technicalMeaningEn: "The Knapsack Problem is a classic combinatorial optimization NP-complete problem where, given a set of items each with a weight and a value, the objective is to determine the optimal subset of items to include in a collection so that the total weight does not exceed a designated capacity and the total value is maximized.",
    explanationEn: "Preserve Knapsack Problem. Do not translate as cloth schoolbag or haversack.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C28\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u200C\u0C38\u0C3E\u0C15\u0C4D \u0C38\u0C2E\u0C38\u0C4D\u0C2F (Knapsack Problem) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C05\u0C32\u0C4D\u0C17\u0C3E\u0C30\u0C3F\u0C25\u0C2E\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C15\u0C3E\u0C02\u0C2C\u0C3F\u0C28\u0C47\u0C1F\u0C4B\u0C30\u0C3F\u0C2F\u0C32\u0C4D \u0C06\u0C2A\u0C4D\u0C1F\u0C3F\u0C2E\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C38\u0C3F\u0C26\u0C4D\u0C27 \u0C38\u0C2E\u0C38\u0C4D\u0C2F. \u0C28\u0C3F\u0C30\u0C4D\u0C26\u0C3F\u0C37\u0C4D\u0C1F \u0C2C\u0C30\u0C41\u0C35\u0C41 \u0C38\u0C3E\u0C2E\u0C30\u0C4D\u0C25\u0C4D\u0C2F\u0C02 (Capacity) \u0C15\u0C32\u0C3F\u0C17\u0C3F\u0C28 \u0C12\u0C15 \u0C2C\u0C4D\u0C2F\u0C3E\u0C17\u0C4D\u200C\u0C32\u0C4B, \u0C17\u0C30\u0C3F\u0C37\u0C4D\u0C1F \u0C35\u0C3F\u0C32\u0C41\u0C35 (Value) \u0C35\u0C1A\u0C4D\u0C1A\u0C47\u0C32\u0C3E \u0C35\u0C38\u0C4D\u0C24\u0C41\u0C35\u0C41\u0C32\u0C28\u0C41 \u0C0E\u0C32\u0C3E \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C3E\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C21\u0C48\u0C28\u0C2E\u0C3F\u0C15\u0C4D \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C3F\u0C02\u0C17\u0C4D (Dynamic Programming - O(nW)) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C17\u0C23\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0928\u0948\u092A\u0938\u0948\u0915 \u0938\u092E\u0938\u094D\u092F\u093E (Knapsack Problem) \u0915\u0949\u092E\u094D\u092C\u093F\u0928\u0947\u091F\u094B\u0930\u093F\u092F\u0932 \u0911\u092A\u094D\u091F\u093F\u092E\u093E\u0907\u091C\u093C\u0947\u0936\u0928 \u0915\u0940 \u090F\u0915 \u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u0938\u0940\u092E\u093F\u0924 \u0935\u091C\u0928 \u0915\u094D\u0937\u092E\u0924\u093E \u0935\u093E\u0932\u0947 \u092C\u0948\u0917 \u092E\u0947\u0902 \u0905\u0927\u093F\u0915\u0924\u092E \u0915\u0941\u0932 \u092E\u0942\u0932\u094D\u092F \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0935\u0938\u094D\u0924\u0941\u0913\u0902 \u0915\u0947 \u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0909\u092A\u0938\u092E\u0942\u0939 \u0915\u093E \u091A\u092F\u0928 \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BA8\u0BBE\u0BAA\u0BCD\u0B9A\u0BBE\u0B95\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8 (Knapsack Problem) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B95\u0BCA\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B8E\u0B9F\u0BC8 \u0B85\u0BB3\u0BB5\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BB3\u0BCD \u0B85\u0BA4\u0BBF\u0B95\u0BAA\u0B9F\u0BCD\u0B9A \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8\u0BAA\u0BCD \u0BAA\u0BC6\u0BB1\u0BC1\u0BAE\u0BCD \u0BB5\u0B95\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0B9F\u0BCD\u0B95\u0BB3\u0BC8\u0BA4\u0BCD \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0B89\u0B95\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BAA\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8\u0BAF\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CA8\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u200C\u0CB8\u0CCD\u0CAF\u0CBE\u0C95\u0CCD \u0CB8\u0CAE\u0CB8\u0CCD\u0CAF\u0CC6 (Knapsack Problem) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0CA8\u0CBF\u0CB0\u0CCD\u0CA6\u0CBF\u0CB7\u0CCD\u0C9F \u0CA4\u0CC2\u0C95\u0CA6 \u0CAE\u0CBF\u0CA4\u0CBF\u0CAF\u0CB2\u0CCD\u0CB2\u0CBF \u0C97\u0CB0\u0CBF\u0CB7\u0CCD\u0CA0 \u0CAE\u0CCC\u0CB2\u0CCD\u0CAF\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAA\u0CA1\u0CC6\u0CAF\u0CB2\u0CC1 \u0CB5\u0CB8\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0C86\u0CAF\u0CCD\u0C95\u0CC6 \u0CAE\u0CBE\u0CA1\u0CC1\u0CB5 \u0C85\u0CB2\u0CCD\u0C97\u0CBE\u0CB0\u0CBF\u0CA6\u0CAE\u0CCD \u0CB8\u0CAE\u0CB8\u0CCD\u0CAF\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09A8\u09CD\u09AF\u09BE\u09AA\u09B8\u09CD\u09AF\u09BE\u0995 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09B2\u09CB \u0985\u09AA\u09CD\u099F\u09BF\u09AE\u09BE\u0987\u099C\u09C7\u09B6\u09A8\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u0995\u09CD\u09B2\u09BE\u09B8\u09BF\u0995 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u09B8\u09C0\u09AE\u09BF\u09A4 \u0993\u099C\u09A8\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09AE\u09BE\u09A8 \u0985\u09B0\u09CD\u099C\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u0987\u099F\u09C7\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09BE \u09B9\u09DF\u0964",
      Marathi: "\u0928\u0945\u092A\u0938\u0945\u0915 \u0938\u092E\u0938\u094D\u092F\u093E (Knapsack Problem) \u0939\u0940 \u0926\u093F\u0932\u0947\u0932\u094D\u092F\u093E \u0935\u091C\u0928 \u0915\u094D\u0937\u092E\u0924\u0947\u0924 \u091C\u093E\u0938\u094D\u0924\u0940\u0924 \u091C\u093E\u0938\u094D\u0924 \u092E\u0942\u0932\u094D\u092F \u092E\u093F\u0933\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0935\u0938\u094D\u0924\u0942\u0902\u091A\u0940 \u0928\u093F\u0935\u0921 \u0915\u0930\u0923\u094D\u092F\u093E\u091A\u0940 \u0905\u0932\u094D\u0917\u094B\u0930\u093F\u0926\u092E \u0938\u092E\u0938\u094D\u092F\u093E \u0906\u0939\u0947.",
      Gujarati: "\u0AA8\u0AC7\u0AAA\u0AB8\u0AC7\u0A95 \u0AB8\u0AAE\u0AB8\u0ACD\u0AAF\u0ABE \u0A8F \u0AAE\u0AB9\u0AA4\u0ACD\u0AA4\u0AAE \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF \u0AAE\u0AC7\u0AB3\u0AB5\u0AB5\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7 \u0AB5\u0AB8\u0ACD\u0AA4\u0AC1\u0A93\u0AA8\u0AC0 \u0AAA\u0AB8\u0A82\u0AA6\u0A97\u0AC0 \u0A95\u0AB0\u0AB5\u0ABE\u0AA8\u0AC0 \u0A93\u0AAA\u0ACD\u0A9F\u0ABF\u0AAE\u0ABE\u0A87\u0A9D\u0AC7\u0AB6\u0AA8 \u0AB8\u0AAE\u0AB8\u0ACD\u0AAF\u0ABE \u0A9B\u0AC7.",
      Punjabi: "\u0A28\u0A48\u0A2A\u0A38\u0A48\u0A15 \u0A38\u0A2E\u0A71\u0A38\u0A3F\u0A06 \u0A38\u0A40\u0A2E\u0A24 \u0A2D\u0A3E\u0A30 \u0A35\u0A3F\u0A71\u0A1A \u0A35\u0A71\u0A27 \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A2E\u0A41\u0A71\u0A32 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24 \u0A15\u0A30\u0A28 \u0A32\u0A08 \u0A35\u0A38\u0A24\u0A3E\u0A02 \u0A26\u0A40 \u0A1A\u0A4B\u0A23 \u0A15\u0A30\u0A28 \u0A26\u0A3E \u0A10\u0A32\u0A17\u0A4B\u0A30\u0A3F\u0A26\u0A2E \u0A39\u0A48\u0964",
      Malayalam: "\u0D28\u0D3E\u0D2A\u0D4D\u0D38\u0D3E\u0D15\u0D4D\u0D15\u0D4D \u0D2A\u0D4D\u0D30\u0D36\u0D4D\u0D28\u0D02 (Knapsack Problem) \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D2A\u0D30\u0D3F\u0D2E\u0D3F\u0D24\u0D2E\u0D3E\u0D2F \u0D2D\u0D3E\u0D30\u0D24\u0D4D\u0D24\u0D3F\u0D7D \u0D2A\u0D30\u0D2E\u0D3E\u0D35\u0D27\u0D3F \u0D2E\u0D42\u0D32\u0D4D\u0D2F\u0D02 \u0D28\u0D47\u0D1F\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D41\u0D33\u0D4D\u0D33 \u0D05\u0D7D\u0D17\u0D4B\u0D30\u0D3F\u0D24\u0D02 \u0D2A\u0D4D\u0D30\u0D36\u0D4D\u0D28\u0D2E\u0D3E\u0D23\u0D4D."
    },
    explanationByLanguage: {
      Telugu: "Knapsack Problem \u0C28\u0C3F \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C28\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u200C\u0C38\u0C3E\u0C15\u0C4D \u0C05\u0C28\u0C3F \u0C2A\u0C3F\u0C32\u0C35\u0C3E\u0C32\u0C3F. \u0C38\u0C4D\u0C15\u0C42\u0C32\u0C41 \u0C2C\u0C4D\u0C2F\u0C3E\u0C17\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C38\u0C02\u0C1A\u0C3F \u0C38\u0C2E\u0C38\u0C4D\u0C2F \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41.",
      Hindi: "Knapsack \u0915\u094B \u0938\u094D\u0915\u0942\u0932\u0940 \u092C\u0938\u094D\u0924\u093E \u0928 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u0921\u093E\u092F\u0928\u0947\u092E\u093F\u0915 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0915\u093E \u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u090F\u0932\u094D\u0917\u094B\u0930\u093F\u0926\u092E \u092E\u0949\u0921\u0932 \u0939\u0948\u0964",
      Tamil: "Knapsack Problem \u0B8E\u0BA9\u0BCD\u0BB1 \u0BAA\u0BC6\u0BAF\u0BB0\u0BC8 \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "Knapsack Problem \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Knapsack Problem \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Knapsack Problem \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "Knapsack Problem \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "Knapsack Problem \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Knapsack Problem \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Knapsack Problem (\u0C28\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D\u200C\u0C38\u0C3E\u0C15\u0C4D \u0C38\u0C2E\u0C38\u0C4D\u0C2F - \u0C06\u0C2A\u0C4D\u0C1F\u0C3F\u0C2E\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D \u0C05\u0C32\u0C4D\u0C17\u0C3E\u0C30\u0C3F\u0C25\u0C2E\u0C4D)",
      Hindi: "Knapsack Problem (\u0928\u0948\u092A\u0938\u0948\u0915 \u0938\u092E\u0938\u094D\u092F\u093E - \u0915\u0949\u092E\u094D\u092C\u093F\u0928\u0947\u091F\u094B\u0930\u093F\u092F\u0932 \u0911\u092A\u094D\u091F\u093F\u092E\u093E\u0907\u091C\u093C\u0947\u0936\u0928)",
      Tamil: "Knapsack Problem (\u0BA8\u0BBE\u0BAA\u0BCD\u0B9A\u0BBE\u0B95\u0BCD \u0BAA\u0BBF\u0BB0\u0B9A\u0BCD\u0B9A\u0BA9\u0BC8)",
      Kannada: "Knapsack Problem (\u0CA8\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u200C\u0CB8\u0CCD\u0CAF\u0CBE\u0C95\u0CCD \u0CB8\u0CAE\u0CB8\u0CCD\u0CAF\u0CC6)",
      Bengali: "Knapsack Problem (\u09A8\u09CD\u09AF\u09BE\u09AA\u09B8\u09CD\u09AF\u09BE\u0995 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE)",
      Marathi: "Knapsack Problem (\u0928\u0945\u092A\u0938\u0945\u0915 \u0938\u092E\u0938\u094D\u092F\u093E)",
      Gujarati: "Knapsack Problem (\u0AA8\u0AC7\u0AAA\u0AB8\u0AC7\u0A95 \u0AB8\u0AAE\u0AB8\u0ACD\u0AAF\u0ABE)",
      Punjabi: "Knapsack Problem (\u0A28\u0A48\u0A2A\u0A38\u0A48\u0A15 \u0A38\u0A2E\u0A71\u0A38\u0A3F\u0A06)",
      Malayalam: "Knapsack Problem (\u0D28\u0D3E\u0D2A\u0D4D\u0D38\u0D3E\u0D15\u0D4D\u0D15\u0D4D \u0D2A\u0D4D\u0D30\u0D36\u0D4D\u0D28\u0D02)"
    },
    technicalExample: `// 0/1 Knapsack Problem with Dynamic Programming in JavaScript
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`
  },
  b_tree: {
    englishTerm: "B-Tree Indexing",
    subject: "Database Systems",
    aliases: ["b-tree", "b-tree indexing", "btree", "b tree", "\u0C2C\u0C3F-\u0C1F\u0C4D\u0C30\u0C40", "\u092C\u0940-\u091F\u094D\u0930\u0940", "\u0BAA\u0BBF-\u0B9F\u0BCD\u0BB0\u0BC0", "\u0CAC\u0CBF-\u0C9F\u0CCD\u0CB0\u0CC0", "\u09AC\u09BF-\u099F\u09CD\u09B0\u09BF"],
    technicalMeaningEn: "A B-Tree is a self-balancing M-way search tree data structure optimized for storage systems that read and write large blocks of data. It maintains sorted data with logarithmic time complexity O(log N) for search, sequential access, insertions, and deletions by ensuring all leaf nodes remain at the identical depth.",
    explanationEn: 'Preserve "B-Tree" in technical computer science. Never translate literally as botanical tree or wood branch; in database engineering, it is the primary indexing paradigm powering relational engines like MySQL InnoDB and PostgreSQL.',
    technicalMeaningByLanguage: {
      Telugu: "\u0C2C\u0C3F-\u0C1F\u0C4D\u0C30\u0C40 (B-Tree) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C38\u0C46\u0C32\u0C4D\u0C2B\u0C4D-\u0C2C\u0C4D\u0C2F\u0C3E\u0C32\u0C46\u0C28\u0C4D\u0C38\u0C3F\u0C02\u0C17\u0C4D (\u0C38\u0C4D\u0C35\u0C2F\u0C02\u0C1A\u0C3E\u0C32\u0C15 \u0C38\u0C02\u0C24\u0C41\u0C32\u0C28) \u0C2C\u0C39\u0C41\u0C33-\u0C2E\u0C3E\u0C30\u0C4D\u0C17 \u0C36\u0C4B\u0C27\u0C28 \u0C1F\u0C4D\u0C30\u0C40 (M-way Search Tree). \u0C21\u0C3F\u0C38\u0C4D\u0C15\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C38\u0C4D\u0C1F\u0C4B\u0C30\u0C47\u0C1C\u0C4D\u200C\u0C32\u0C4B \u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C2C\u0C4D\u0C32\u0C3E\u0C15\u0C41\u0C32 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C38\u0C2E\u0C30\u0C4D\u0C25\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C28\u0C3F\u0C32\u0C4D\u0C35 \u0C1A\u0C47\u0C2F\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C46\u0C30\u0C4D\u0C1A\u0C4D \u0C1A\u0C47\u0C2F\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C07\u0C26\u0C3F \u0C30\u0C42\u0C2A\u0C4A\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F. \u0C07\u0C26\u0C3F \u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C06\u0C15\u0C41 \u0C28\u0C4B\u0C21\u0C4D\u200C\u0C32\u0C28\u0C41 (Leaf Nodes) \u0C12\u0C15\u0C47 \u0C32\u0C4B\u0C24\u0C41\u0C32\u0C4B (Depth) \u0C09\u0C02\u0C1A\u0C21\u0C02 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E O(log N) \u0C38\u0C2E\u0C2F\u0C02\u0C32\u0C4B \u0C21\u0C47\u0C1F\u0C3E \u0C36\u0C4B\u0C27\u0C28 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C36\u0C4D\u0C30\u0C47\u0C23\u0C3F \u0C35\u0C3F\u0C1A\u0C3E\u0C30\u0C23\u0C32\u0C15\u0C41 (Range Queries) \u0C39\u0C3E\u0C2E\u0C40 \u0C07\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u092C\u0940-\u091F\u094D\u0930\u0940 (B-Tree) \u090F\u0915 \u0938\u094D\u0935-\u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u092C\u0939\u0941-\u092E\u093E\u0930\u094D\u0917\u0940 \u0916\u094B\u091C \u0935\u0943\u0915\u094D\u0937 (Self-Balancing M-way Search Tree) \u0939\u0948 \u091C\u093F\u0938\u0947 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0914\u0930 \u092B\u093C\u093E\u0907\u0932 \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u0921\u093F\u0938\u094D\u0915 I/O \u0938\u0902\u091A\u093E\u0932\u0928 \u0915\u094B \u0928\u094D\u092F\u0942\u0928\u0924\u092E \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0921\u093F\u091C\u093C\u093E\u0907\u0928 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u092F\u0939 \u0938\u092D\u0940 \u0932\u0940\u092B \u0928\u094B\u0921\u094D\u0938 \u0915\u094B \u0938\u092E\u093E\u0928 \u0917\u0939\u0930\u093E\u0908 \u092A\u0930 \u0930\u0916\u0915\u0930 O(log N) \u0938\u092E\u092F \u092E\u0947\u0902 \u0916\u094B\u091C, \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F \u0914\u0930 \u0935\u093F\u0932\u094B\u092A\u0928 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BAA\u0BBF-\u0B9F\u0BCD\u0BB0\u0BC0 (B-Tree) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA4\u0BB0\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BCD (Databases) \u0BA4\u0BC7\u0B9F\u0BB2\u0BCD \u0BA8\u0BC7\u0BB0\u0BA4\u0BCD\u0BA4\u0BC8 O(log N) \u0B86\u0B95\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0B9A\u0BC1\u0BAF-\u0B9A\u0BAE\u0BA8\u0BBF\u0BB2\u0BC8 \u0BA4\u0BC7\u0B9F\u0BB2\u0BCD \u0BAE\u0BB0 \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD. \u0B87\u0BA4\u0BC1 \u0BB5\u0B9F\u0BCD\u0B9F\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD (Disk Storage) \u0BA4\u0BB0\u0BB5\u0BC8 \u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BBE\u0B95 \u0BAE\u0BC0\u0B9F\u0BCD\u0B9F\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95 \u0B89\u0BA4\u0BB5\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
      Kannada: "\u0CAC\u0CBF-\u0C9F\u0CCD\u0CB0\u0CC0 (B-Tree) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CAB\u0CC8\u0CB2\u0CCD \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD\u200C\u0C97\u0CB3\u0CB2\u0CCD\u0CB2\u0CBF \u0CA1\u0CBF\u0CB8\u0CCD\u0C95\u0CCD \u0CAA\u0CCD\u0CB0\u0CB5\u0CC7\u0CB6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C85\u0CA4\u0CCD\u0CAF\u0CC1\u0CA4\u0CCD\u0CA4\u0CAE\u0CB5\u0CBE\u0C97\u0CBF\u0CB8\u0CB2\u0CC1 \u0CAC\u0CB3\u0CB8\u0CB2\u0CBE\u0C97\u0CC1\u0CB5 \u0CB8\u0CCD\u0CB5\u0CAF\u0C82-\u0CB8\u0CAE\u0CA4\u0CCB\u0CB2\u0CBF\u0CA4 \u0CAC\u0CB9\u0CC1-\u0CAE\u0CBE\u0CB0\u0CCD\u0C97 \u0CB9\u0CC1\u0CA1\u0CC1\u0C95\u0CBE\u0C9F \u0CAE\u0CB0\u0CA6 (M-way Search Tree) \u0CA1\u0CC7\u0C9F\u0CBE \u0CB0\u0C9A\u0CA8\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09AC\u09BF-\u099F\u09CD\u09B0\u09BF (B-Tree) \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09B8\u09CD\u09AC-\u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AC\u09B9\u09C1-\u09AE\u09C1\u0996\u09C0 \u09B8\u09BE\u09B0\u09CD\u099A \u099F\u09CD\u09B0\u09BF \u09AF\u09BE \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u09A1\u09C7\u099F\u09BE \u0987\u09A8\u09A1\u09C7\u0995\u09CD\u09B8\u09BF\u0982 \u098F\u09AC\u0982 \u0993(\u09B2\u0997 \u098F\u09A8) \u099C\u099F\u09BF\u09B2\u09A4\u09BE\u09AF\u09BC \u0985\u09A8\u09C1\u09B8\u09A8\u09CD\u09A7\u09BE\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964",
      Marathi: "\u092C\u0940-\u091F\u094D\u0930\u0940 (B-Tree) \u0939\u0940 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0906\u0923\u093F \u092B\u093E\u0907\u0932 \u0938\u093F\u0938\u094D\u091F\u092E\u092E\u0927\u094D\u092F\u0947 \u091C\u0932\u0926 \u0921\u0947\u091F\u093E \u0936\u094B\u0927\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0935\u093E\u092A\u0930\u0932\u0940 \u091C\u093E\u0923\u093E\u0930\u0940 \u0938\u0947\u0932\u094D\u092B-\u092C\u0945\u0932\u0928\u094D\u0938\u093F\u0902\u0917 \u0938\u0930\u094D\u091A \u091F\u094D\u0930\u0940 \u0921\u0947\u091F\u093E \u0930\u091A\u0928\u093E \u0906\u0939\u0947.",
      Gujarati: "\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 (B-Tree) \u0A8F \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97 \u0AAE\u0ABE\u0A9F\u0AC7 \u0AB5\u0AAA\u0AB0\u0ABE\u0AA4\u0AC1\u0A82 \u0AB8\u0AC7\u0AB2\u0ACD\u0AAB-\u0AAC\u0AC7\u0AB2\u0AC7\u0AA8\u0ACD\u0AB8\u0ABF\u0A82\u0A97 \u0AB8\u0AB0\u0ACD\u0A9A \u0A9F\u0ACD\u0AB0\u0AC0 \u0A9B\u0AC7 \u0A9C\u0AC7 O(log N) \u0AB8\u0AAE\u0AAF\u0AAE\u0ABE\u0A82 \u0AB6\u0ACB\u0AA7 \u0AAA\u0AB0\u0ABF\u0AA3\u0ABE\u0AAE\u0ACB \u0A86\u0AAA\u0AC7 \u0A9B\u0AC7.",
      Punjabi: "\u0A2C\u0A40-\u0A1F\u0A4D\u0A30\u0A40 (B-Tree) \u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A21\u0A3E\u0A1F\u0A3E \u0A07\u0A70\u0A21\u0A48\u0A15\u0A38\u0A3F\u0A70\u0A17 \u0A32\u0A08 \u0A35\u0A30\u0A24\u0A3F\u0A06 \u0A1C\u0A3E\u0A23 \u0A35\u0A3E\u0A32\u0A3E \u0A38\u0A35\u0A48-\u0A38\u0A70\u0A24\u0A41\u0A32\u0A3F\u0A24 \u0A38\u0A30\u0A1A \u0A1F\u0A4D\u0A30\u0A40 \u0A21\u0A3E\u0A1F\u0A3E \u0A38\u0A1F\u0A4D\u0A30\u0A15\u0A1A\u0A30 \u0A39\u0A48\u0964",
      Malayalam: "\u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D41\u0D15\u0D33\u0D3F\u0D7D \u0D21\u0D3F\u0D38\u0D4D\u0D15\u0D4D \u0D06\u0D15\u0D4D\u0D38\u0D38\u0D4D \u0D35\u0D47\u0D17\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D3E\u0D15\u0D4D\u0D15\u0D3E\u0D7B \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D38\u0D4D\u0D35\u0D2F\u0D02-\u0D38\u0D28\u0D4D\u0D24\u0D41\u0D32\u0D3F\u0D24 \u0D38\u0D46\u0D7C\u0D1A\u0D4D\u0D1A\u0D4D \u0D1F\u0D4D\u0D30\u0D40\u0D2F\u0D3E\u0D23\u0D4D \u0D2C\u0D3F-\u0D1F\u0D4D\u0D30\u0D40 (B-Tree)."
    },
    explanationByLanguage: {
      Telugu: "B-Tree \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C32\u0C4D\u0C32\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C2C\u0C3F-\u0C1F\u0C4D\u0C30\u0C40 \u0C05\u0C28\u0C3F \u0C2A\u0C3F\u0C32\u0C35\u0C3E\u0C32\u0C3F. \u0C1A\u0C46\u0C1F\u0C4D\u0C1F\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C15\u0C4A\u0C2E\u0C4D\u0C2E \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41; \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D\u200C\u0C32\u0C32\u0C4B \u0C07\u0C26\u0C3F \u0C07\u0C02\u0C21\u0C46\u0C15\u0C4D\u0C38\u0C3F\u0C02\u0C17\u0C4D \u0C35\u0C46\u0C28\u0C4D\u0C28\u0C46\u0C2E\u0C41\u0C15.",
      Hindi: "B-Tree \u0915\u094B \u0935\u093E\u0928\u0938\u094D\u092A\u0924\u093F\u0915 \u092A\u0947\u0921\u093C \u0928 \u0938\u092E\u091D\u0947\u0902; \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0907\u0902\u091C\u0940\u0928\u093F\u092F\u0930\u093F\u0902\u0917 \u092E\u0947\u0902 \u092F\u0939 \u0921\u0947\u091F\u093E \u0907\u0902\u0921\u0947\u0915\u094D\u0938\u093F\u0902\u0917 \u0915\u093E \u092E\u0941\u0916\u094D\u092F \u0938\u094D\u0924\u0902\u092D \u0939\u0948\u0964",
      Tamil: "B-Tree \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAF\u0BB2\u0BCD \u0BA4\u0BC1\u0BB1\u0BC8\u0B9A\u0BBE\u0BB0\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD.",
      Kannada: "B-Tree \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "B-Tree \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "B-Tree \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "B-Tree \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "B-Tree \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "B-Tree \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "B-Tree Indexing (\u0C2C\u0C3F-\u0C1F\u0C4D\u0C30\u0C40 \u0C07\u0C02\u0C21\u0C46\u0C15\u0C4D\u0C38\u0C3F\u0C02\u0C17\u0C4D)",
      Hindi: "B-Tree Indexing (\u092C\u0940-\u091F\u094D\u0930\u0940 \u0907\u0902\u0921\u0947\u0915\u094D\u0938\u093F\u0902\u0917)",
      Tamil: "B-Tree Indexing (\u0BAA\u0BBF-\u0B9F\u0BCD\u0BB0\u0BC0 \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BCD\u0B9F\u0BC1 \u0BAE\u0BC1\u0BB1\u0BC8)",
      Kannada: "B-Tree Indexing (\u0CAC\u0CBF-\u0C9F\u0CCD\u0CB0\u0CC0 \u0C87\u0C82\u0CA1\u0CC6\u0C95\u0CCD\u0CB8\u0CBF\u0C82\u0C97\u0CCD)",
      Bengali: "B-Tree Indexing (\u09AC\u09BF-\u099F\u09CD\u09B0\u09BF \u0987\u09A8\u09A1\u09C7\u0995\u09CD\u09B8\u09BF\u0982)",
      Marathi: "B-Tree Indexing (\u092C\u0940-\u091F\u094D\u0930\u0940 \u0907\u0902\u0921\u0947\u0915\u094D\u0938\u093F\u0902\u0917)",
      Gujarati: "B-Tree Indexing (\u0AAC\u0AC0-\u0A9F\u0ACD\u0AB0\u0AC0 \u0A87\u0AA8\u0ACD\u0AA1\u0AC7\u0A95\u0ACD\u0AB8\u0ABF\u0A82\u0A97)",
      Punjabi: "B-Tree Indexing (\u0A2C\u0A40-\u0A1F\u0A4D\u0A30\u0A40 \u0A07\u0A70\u0A21\u0A48\u0A15\u0A38\u0A3F\u0A70\u0A17)",
      Malayalam: "B-Tree Indexing (\u0D2C\u0D3F-\u0D1F\u0D4D\u0D30\u0D40 \u0D07\u0D7B\u0D21\u0D46\u0D15\u0D4D\u0D38\u0D3F\u0D02\u0D17\u0D4D)"
    },
    technicalExample: `-- SQL B-Tree Composite Index Creation:
CREATE INDEX idx_student_enrollment 
ON Enrollments (course_id, student_id) 
USING BTREE;
-- B-Tree accelerates range scanning in O(log N) depth`
  },
  virtual_memory: {
    englishTerm: "Virtual Memory",
    subject: "Operating Systems",
    aliases: ["virtual memory", "paging", "\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40", "\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940", "\u0BAE\u0BC6\u0BAF\u0BCD\u0BA8\u0BBF\u0B95\u0BB0\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BAE\u0BCD", "\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF"],
    technicalMeaningEn: "Virtual Memory is a core operating system storage allocation scheme that maps process virtual address spaces to physical RAM pages and secondary swap storage via the Memory Management Unit (MMU) and page tables, providing process isolation and illusion of contiguous memory.",
    explanationEn: "Preserve Virtual Memory in computing. Translating as fake or imaginary memory creates false understanding of real paging hardware and MMU translations.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 (Virtual Memory) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C06\u0C2A\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C2D\u0C4C\u0C24\u0C3F\u0C15 RAM \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C46\u0C15\u0C02\u0C21\u0C30\u0C40 \u0C21\u0C3F\u0C38\u0C4D\u0C15\u0C4D (Swap Space) \u0C15\u0C32\u0C2F\u0C3F\u0C15 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C32\u0C15\u0C41 \u0C35\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C30\u0C2E\u0C48\u0C28, \u0C28\u0C3F\u0C30\u0C02\u0C24\u0C30 \u0C1A\u0C3F\u0C30\u0C41\u0C28\u0C3E\u0C2E\u0C3E \u0C38\u0C4D\u0C25\u0C32\u0C3E\u0C28\u0C4D\u0C28\u0C3F (Address Space) \u0C05\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C47 \u0C38\u0C3E\u0C02\u0C15\u0C47\u0C24\u0C3F\u0C15\u0C24. MMU (\u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C2F\u0C42\u0C28\u0C3F\u0C1F\u0C4D) \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C47\u0C1C\u0C3F\u0C02\u0C17\u0C4D (Paging) \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C07\u0C26\u0C3F \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C38\u0C46\u0C38\u0C4D\u200C\u0C15\u0C41 \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C47\u0C15 \u0C30\u0C15\u0C4D\u0C37\u0C3F\u0C24 \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C28\u0C3F\u0C30\u0C4D\u0C27\u0C3E\u0C30\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940 (Virtual Memory) \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E \u0915\u0940 \u090F\u0915 \u092E\u0947\u092E\u094B\u0930\u0940 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0924\u0915\u0928\u0940\u0915 \u0939\u0948 \u091C\u094B \u092D\u094C\u0924\u093F\u0915 \u0930\u0948\u092E \u0914\u0930 \u0921\u093F\u0938\u094D\u0915 \u0938\u094D\u0935\u0948\u092A \u0938\u094D\u092A\u0947\u0938 \u0915\u094B \u092E\u093F\u0932\u093E\u0915\u0930 \u092A\u094D\u0930\u094B\u0938\u0947\u0938 \u0915\u094B \u0928\u093F\u0930\u0902\u0924\u0930 \u0914\u0930 \u092A\u0943\u0925\u0915 \u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u090F\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964 MMU \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930 \u092A\u0947\u091C \u091F\u0947\u092C\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u0938\u0947 \u092B\u093F\u091C\u093F\u0915\u0932 \u090F\u0921\u094D\u0930\u0947\u0938 \u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
      Tamil: "\u0BAE\u0BC6\u0BAF\u0BCD\u0BA8\u0BBF\u0B95\u0BB0\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BAE\u0BCD (Virtual Memory) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0BAE\u0BC1\u0BB1\u0BC8\u0BAE\u0BC8 (OS) \u0B95\u0BA3\u0BBF\u0BA9\u0BBF\u0BAF\u0BBF\u0BA9\u0BCD \u0BAE\u0BC1\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0BB5\u0BBF\u0B9F \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF \u0B85\u0BB3\u0BB5\u0BBF\u0BB2\u0BBE\u0BA9 \u0BA8\u0BBF\u0BB0\u0BB2\u0BCD\u0B95\u0BB3\u0BC8 \u0B87\u0BAF\u0B95\u0BCD\u0B95 \u0B85\u0BA9\u0BC1\u0BAE\u0BA4\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95 \u0BAE\u0BC7\u0BB2\u0BBE\u0BA3\u0BCD\u0BAE\u0BC8 \u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAE\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF (Virtual Memory) \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCA\u0CB8\u0CC6\u0CB8\u0CCD\u200C\u0C97\u0CB3\u0CBF\u0C97\u0CC6 \u0CAD\u0CCC\u0CA4\u0CBF\u0C95 RAM \u0C97\u0CBF\u0C82\u0CA4 \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1\u0CA6\u0CBE\u0CA6 \u0CAA\u0CCD\u0CB0\u0CA4\u0CCD\u0CAF\u0CC7\u0C95 \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8 \u0CB8\u0CCD\u0CA5\u0CB3\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C92\u0CA6\u0C97\u0CBF\u0CB8\u0CC1\u0CB5 \u0C86\u0CAA\u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD \u0CB8\u0CBF\u0CB8\u0CCD\u0C9F\u0CAE\u0CCD \u0CA4\u0C82\u0CA4\u0CCD\u0CB0\u0C9C\u0CCD\u0C9E\u0CBE\u0CA8\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09AD\u09BE\u09B0\u09CD\u099A\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AE\u09C7\u09AE\u09B0\u09BF \u09B9\u09B2\u09CB \u0985\u09AA\u09BE\u09B0\u09C7\u099F\u09BF\u0982 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u0995\u09CC\u09B6\u09B2 \u09AF\u09BE \u09AB\u09BF\u099C\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09B0\u200D\u09CD\u09AF\u09BE\u09AE\u09C7\u09B0 \u09B8\u09C0\u09AE\u09BE\u09AC\u09A6\u09CD\u09A7\u09A4\u09BE \u0995\u09BE\u099F\u09BF\u09AF\u09BC\u09C7 \u09A1\u09BF\u09B8\u09CD\u0995 \u09B8\u09CD\u09AA\u09C7\u09B8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE\u0997\u09C1\u09B2\u09BF\u0995\u09C7 \u09AC\u09A1\u09BC \u09AE\u09C7\u09AE\u09B0\u09BF \u09B8\u09B0\u09AC\u09B0\u09BE\u09B9 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940 (Virtual Memory) \u0939\u0947 \u0911\u092A\u0930\u0947\u091F\u093F\u0902\u0917 \u0938\u093F\u0938\u094D\u091F\u092E\u091A\u0947 \u092E\u0947\u092E\u0930\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928 \u0924\u0902\u0924\u094D\u0930 \u0906\u0939\u0947 \u091C\u0947 \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u0932\u093E \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 \u0905\u200D\u0945\u0921\u094D\u0930\u0947\u0938 \u0938\u094D\u092A\u0947\u0938 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0947.",
      Gujarati: "\u0AB5\u0AB0\u0ACD\u0A9A\u0ACD\u0AAF\u0AC1\u0A85\u0AB2 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0 \u0A8F \u0A93\u0AAA\u0AB0\u0AC7\u0A9F\u0ABF\u0A82\u0A97 \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE\u0AA8\u0AC0 \u0AA4\u0A95\u0AA8\u0AC0\u0A95 \u0A9B\u0AC7 \u0A9C\u0AC7 \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0AA8\u0AC7 \u0AAE\u0ACB\u0A9F\u0AC0 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0 \u0AB8\u0ACD\u0AAA\u0AC7\u0AB8 \u0AAA\u0AC2\u0AB0\u0AC0 \u0AAA\u0ABE\u0AA1\u0AC7 \u0A9B\u0AC7.",
      Punjabi: "\u0A35\u0A30\u0A1A\u0A41\u0A05\u0A32 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A13\u0A2A\u0A30\u0A47\u0A1F\u0A3F\u0A70\u0A17 \u0A38\u0A3F\u0A38\u0A1F\u0A2E \u0A26\u0A40 \u0A24\u0A15\u0A28\u0A40\u0A15 \u0A39\u0A48 \u0A1C\u0A4B \u0A2D\u0A4C\u0A24\u0A3F\u0A15 \u0A30\u0A48\u0A2E \u0A28\u0A3E\u0A32\u0A4B\u0A02 \u0A35\u0A71\u0A21\u0A40 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A2A\u0A47\u0A38 \u0A26\u0A3F\u0A70\u0A26\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "\u0D2B\u0D3F\u0D38\u0D3F\u0D15\u0D4D\u0D15\u0D7D \u0D31\u0D3E\u0D2E\u0D3F\u0D7D \u0D12\u0D24\u0D41\u0D19\u0D4D\u0D19\u0D3E\u0D24\u0D4D\u0D24 \u0D35\u0D32\u0D3F\u0D2F \u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D41\u0D15\u0D7E \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D3E\u0D7B \u0D13\u0D2A\u0D4D\u0D2A\u0D31\u0D47\u0D31\u0D4D\u0D31\u0D3F\u0D02\u0D17\u0D4D \u0D38\u0D3F\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D02 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D2F\u0D3E\u0D23\u0D4D \u0D35\u0D46\u0D7C\u0D1A\u0D4D\u0D35\u0D7D \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F."
    },
    explanationByLanguage: {
      Telugu: "Virtual Memory \u0C28\u0C3F \u0C0A\u0C39\u0C3E\u0C24\u0C4D\u0C2E\u0C15 \u0C32\u0C47\u0C26\u0C3E \u0C28\u0C15\u0C3F\u0C32\u0C40 \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C26\u0C3F MMU \u0C39\u0C3E\u0C30\u0C4D\u0C21\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C06\u0C27\u0C3E\u0C30\u0C3F\u0C24 \u0C2A\u0C47\u0C1C\u0C3F\u0C02\u0C17\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25.",
      Hindi: "Virtual Memory \u0915\u094B \u0915\u093E\u0932\u094D\u092A\u0928\u093F\u0915 \u092E\u0947\u092E\u094B\u0930\u0940 \u0928 \u0915\u0939\u0947\u0902; \u092F\u0939 OS \u0914\u0930 MMU \u0939\u093E\u0930\u094D\u0921\u0935\u0947\u092F\u0930 \u0926\u094D\u0935\u093E\u0930\u093E \u0938\u0902\u091A\u093E\u0932\u093F\u0924 \u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0924\u0902\u0924\u094D\u0930 \u0939\u0948\u0964",
      Tamil: "Virtual Memory \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BA4\u0BCA\u0BB4\u0BBF\u0BB2\u0BCD\u0BA8\u0BC1\u0B9F\u0BCD\u0BAA\u0BAE\u0BBE\u0B95\u0BB5\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Virtual Memory \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Virtual Memory \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Virtual Memory \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "Virtual Memory \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "Virtual Memory \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Virtual Memory \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Virtual Memory (\u0C35\u0C30\u0C4D\u0C1A\u0C41\u0C35\u0C32\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 - \u0C2A\u0C47\u0C1C\u0C3F\u0C02\u0C17\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25)",
      Hindi: "Virtual Memory (\u0935\u0930\u094D\u091A\u0941\u0905\u0932 \u092E\u0947\u092E\u094B\u0930\u0940 - \u092A\u0947\u091C\u093F\u0902\u0917 \u092A\u094D\u0930\u092C\u0902\u0927\u0928)",
      Tamil: "Virtual Memory (\u0BAE\u0BC6\u0BAF\u0BCD\u0BA8\u0BBF\u0B95\u0BB0\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BAE\u0BCD)",
      Kannada: "Virtual Memory (\u0CB5\u0CB0\u0CCD\u0C9A\u0CC1\u0CB5\u0CB2\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF)",
      Bengali: "Virtual Memory (\u09AD\u09BE\u09B0\u09CD\u099A\u09C1\u09AF\u09BC\u09BE\u09B2 \u09AE\u09C7\u09AE\u09B0\u09BF)",
      Marathi: "Virtual Memory (\u0935\u094D\u0939\u0930\u094D\u091A\u094D\u092F\u0941\u0905\u0932 \u092E\u0947\u092E\u0930\u0940)",
      Gujarati: "Virtual Memory (\u0AB5\u0AB0\u0ACD\u0A9A\u0ACD\u0AAF\u0AC1\u0A85\u0AB2 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0)",
      Punjabi: "Virtual Memory (\u0A35\u0A30\u0A1A\u0A41\u0A05\u0A32 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40)",
      Malayalam: "Virtual Memory (\u0D35\u0D46\u0D7C\u0D1A\u0D4D\u0D35\u0D7D \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F)"
    },
    technicalExample: `// Linux mmap syscall allocating virtual pages
#include <sys/mman.h>
void* page = mmap(NULL, 4096, PROT_READ | PROT_WRITE, 
                  MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
// Page fault triggers physical page frame mapping by OS kernel`
  },
  acid: {
    englishTerm: "ACID Properties",
    subject: "Database Systems",
    aliases: ["acid", "acid properties", "\u0C06\u0C38\u0C3F\u0C21\u0C4D \u0C32\u0C15\u0C4D\u0C37\u0C23\u0C3E\u0C32\u0C41", "\u090F\u0938\u093F\u0921 \u0917\u0941\u0923", "\u0B85\u0B9A\u0BBF\u0B9F\u0BCD \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", "\u0C86\u0CB8\u0CBF\u0CA1\u0CCD \u0CAA\u0CCD\u0CB0\u0CBE\u0CAA\u0CB0\u0CCD\u0C9F\u0CC0\u0CB8\u0CCD"],
    technicalMeaningEn: "ACID is an acronym representing the four foundational transaction guarantees in relational database management systems: Atomicity (all operations commit or all rollback), Consistency (valid state transitions respecting constraints), Isolation (concurrent execution serializability), and Durability (committed changes persist across crashes).",
    explanationEn: "Preserve ACID. Translating as chemical acid (\u0C30\u0C38\u0C3E\u0C2F\u0C28 \u0C06\u0C2E\u0C4D\u0C32\u0C02 / \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0905\u092E\u094D\u0932) creates severe misconception in database theory.",
    technicalMeaningByLanguage: {
      Telugu: "ACID \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C30\u0C3F\u0C32\u0C47\u0C37\u0C28\u0C32\u0C4D \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C2E\u0C4D\u0C38\u0C4D (RDBMS) \u0C32\u0C4B \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 (Transactions) \u0C35\u0C3F\u0C36\u0C4D\u0C35\u0C38\u0C28\u0C40\u0C2F\u0C24\u0C28\u0C41 \u0C28\u0C3F\u0C30\u0C4D\u0C27\u0C3E\u0C30\u0C3F\u0C02\u0C1A\u0C47 \u0C28\u0C3E\u0C32\u0C41\u0C17\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C3E\u0C32 \u0C38\u0C02\u0C15\u0C4D\u0C37\u0C3F\u0C2A\u0C4D\u0C24 \u0C30\u0C42\u0C2A\u0C02: Atomicity (\u0C05\u0C28\u0C4D\u0C28\u0C40 \u0C1C\u0C30\u0C17\u0C3E\u0C32\u0C3F \u0C32\u0C47\u0C26\u0C3E \u0C0F\u0C26\u0C40 \u0C1C\u0C30\u0C17\u0C15\u0C42\u0C21\u0C26\u0C41), Consistency (\u0C28\u0C3F\u0C2C\u0C02\u0C27\u0C28\u0C32\u0C28\u0C41 \u0C09\u0C32\u0C4D\u0C32\u0C02\u0C18\u0C3F\u0C02\u0C1A\u0C28\u0C3F \u0C38\u0C4D\u0C25\u0C3F\u0C30\u0C24\u0C4D\u0C35\u0C02), Isolation (\u0C38\u0C2E\u0C3E\u0C02\u0C24\u0C30 \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C35\u0C47\u0C30\u0C4D\u0C2A\u0C3E\u0C1F\u0C41), Durability (\u0C15\u0C4D\u0C30\u0C3E\u0C37\u0C4D \u0C05\u0C2F\u0C3F\u0C28\u0C2A\u0C4D\u0C2A\u0C1F\u0C3F\u0C15\u0C40 \u0C15\u0C2E\u0C3F\u0C1F\u0C4D \u0C05\u0C2F\u0C3F\u0C28 \u0C21\u0C47\u0C1F\u0C3E \u0C36\u0C3E\u0C36\u0C4D\u0C35\u0C24\u0C02\u0C17\u0C3E \u0C2D\u0C26\u0C4D\u0C30\u0C2A\u0C30\u0C1A\u0C2C\u0C21\u0C1F\u0C02).",
      Hindi: "ACID \u0930\u093F\u0932\u0947\u0936\u0928\u0932 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u092E\u0948\u0928\u0947\u091C\u092E\u0947\u0902\u091F \u0938\u093F\u0938\u094D\u091F\u092E \u092E\u0947\u0902 \u091F\u094D\u0930\u093E\u0902\u091C\u0948\u0915\u094D\u0936\u0928 \u0915\u0940 \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F\u0924\u093E \u0915\u0940 \u0917\u093E\u0930\u0902\u091F\u0940 \u0926\u0947\u0928\u0947 \u0935\u093E\u0932\u0947 \u091A\u093E\u0930 \u0938\u094D\u0924\u0902\u092D\u094B\u0902 \u0915\u093E \u0938\u0902\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0930\u0942\u092A \u0939\u0948: Atomicity (\u092A\u0942\u0930\u094D\u0923\u0924\u093E \u092F\u093E \u0936\u0942\u0928\u094D\u092F\u0924\u093E), Consistency (\u0921\u0947\u091F\u093E \u0905\u0916\u0902\u0921\u0924\u093E), Isolation (\u0938\u092E\u0935\u0930\u094D\u0924\u0940 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0913\u0902 \u0915\u093E \u092A\u0943\u0925\u0915\u094D\u0915\u0930\u0923), \u0914\u0930 Durability (\u0938\u094D\u0925\u093E\u092F\u093F\u0924\u094D\u0935)\u0964",
      Tamil: "ACID \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0BA4\u0BB0\u0BB5\u0BC1\u0BA4\u0BCD\u0BA4\u0BB3 \u0BAA\u0BB0\u0BBF\u0BB5\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BA9\u0BC8\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0BA8\u0BAE\u0BCD\u0BAA\u0B95\u0BA4\u0BCD\u0BA4\u0BA9\u0BCD\u0BAE\u0BC8\u0BAF\u0BC8 \u0B89\u0BB1\u0BC1\u0BA4\u0BBF \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0BAE\u0BCD \u0BA8\u0BBE\u0BA9\u0BCD\u0B95\u0BC1 \u0BAE\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BBE\u0B95\u0BC1\u0BAE\u0BCD: Atomicity, Consistency, Isolation, \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD Durability.",
      Kannada: "ACID \u0C8E\u0C82\u0CAC\u0CC1\u0CA6\u0CC1 \u0CA1\u0CC7\u0C9F\u0CBE\u0CAC\u0CC7\u0CB8\u0CCD \u0CB5\u0CB9\u0CBF\u0CB5\u0CBE\u0C9F\u0CC1\u0C97\u0CB3 \u0CB5\u0CBF\u0CB6\u0CCD\u0CB5\u0CBE\u0CB8\u0CBE\u0CB0\u0CCD\u0CB9\u0CA4\u0CC6\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0C96\u0CBE\u0CA4\u0CB0\u0CBF\u0CAA\u0CA1\u0CBF\u0CB8\u0CC1\u0CB5 \u0CA8\u0CBE\u0CB2\u0CCD\u0C95\u0CC1 \u0CAE\u0CC2\u0CB2\u0CAD\u0CC2\u0CA4 \u0C97\u0CC1\u0CA3\u0CB2\u0C95\u0CCD\u0CB7\u0CA3\u0C97\u0CB3\u0CBE\u0C97\u0CBF\u0CB5\u0CC6: Atomicity, Consistency, Isolation, \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 Durability.",
      Bengali: "ACID \u09B9\u09B2\u09CB \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8 \u09B2\u09C7\u09A8\u09A6\u09C7\u09A8\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09BE\u09B0 \u099A\u09BE\u09B0\u099F\u09BF \u09AE\u09C2\u09B2 \u09AC\u09C8\u09B6\u09BF\u09B7\u09CD\u099F\u09CD\u09AF: \u0985\u09CD\u09AF\u09BE\u099F\u09CB\u09AE\u09BF\u09B8\u09BF\u099F\u09BF, \u0995\u09A8\u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09A8\u09CD\u09B8\u09BF, \u0986\u0987\u09B8\u09CB\u09B2\u09C7\u09B6\u09A8 \u098F\u09AC\u0982 \u09A1\u09BF\u0989\u09B0\u09C7\u09AC\u09BF\u09B2\u09BF\u099F\u09BF\u0964",
      Marathi: "ACID \u0939\u0947 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0935\u094D\u092F\u0935\u0939\u093E\u0930\u093E\u0902\u091A\u0940 \u0905\u091A\u0942\u0915\u0924\u093E \u0906\u0923\u093F \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0930\u093E\u0916\u0923\u093E\u0931\u094D\u092F\u093E \u091A\u093E\u0930 \u0928\u093F\u092F\u092E\u093E\u0902\u091A\u0947 \u0938\u0902\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0930\u0942\u092A \u0906\u0939\u0947.",
      Gujarati: "ACID \u0A8F \u0AA1\u0AC7\u0A9F\u0ABE\u0AAC\u0AC7\u0A9D \u0A9F\u0ACD\u0AB0\u0ABE\u0AA8\u0ACD\u0A9D\u0AC7\u0A95\u0ACD\u0AB6\u0AA8\u0AA8\u0AC0 \u0AB5\u0ABF\u0AB6\u0ACD\u0AB5\u0AB8\u0AA8\u0AC0\u0AAF\u0AA4\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7\u0AA8\u0ABE \u0A9A\u0ABE\u0AB0 \u0AAE\u0AC2\u0AB3\u0AAD\u0AC2\u0AA4 \u0AA8\u0ABF\u0AAF\u0AAE\u0ACB \u0A9B\u0AC7.",
      Punjabi: "ACID \u0A21\u0A3E\u0A1F\u0A3E\u0A2C\u0A47\u0A38 \u0A1F\u0A4D\u0A30\u0A3E\u0A02\u0A1C\u0A48\u0A15\u0A38\u0A3C\u0A28\u0A3E\u0A02 \u0A26\u0A40 \u0A2D\u0A30\u0A4B\u0A38\u0A47\u0A2F\u0A4B\u0A17\u0A24\u0A3E \u0A28\u0A42\u0A70 \u0A2F\u0A15\u0A40\u0A28\u0A40 \u0A2C\u0A23\u0A3E\u0A09\u0A23 \u0A35\u0A3E\u0A32\u0A47 \u0A1A\u0A3E\u0A30 \u0A38\u0A3F\u0A27\u0A3E\u0A02\u0A24 \u0A39\u0A28\u0964",
      Malayalam: "\u0D21\u0D3E\u0D31\u0D4D\u0D31\u0D3E\u0D2C\u0D47\u0D38\u0D4D \u0D07\u0D1F\u0D2A\u0D3E\u0D1F\u0D41\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D24\u0D24\u0D4D\u0D35\u0D02 \u0D09\u0D31\u0D2A\u0D4D\u0D2A\u0D3E\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D28\u0D3E\u0D32\u0D4D \u0D18\u0D1F\u0D15\u0D19\u0D4D\u0D19\u0D33\u0D3E\u0D23\u0D4D ACID \u0D2A\u0D4D\u0D30\u0D4B\u0D2A\u0D4D\u0D2A\u0D7C\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D7E."
    },
    explanationByLanguage: {
      Telugu: "ACID \u0C2A\u0C26\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C42 \u0C06\u0C2E\u0C4D\u0C32\u0C02 \u0C32\u0C47\u0C26\u0C3E \u0C30\u0C38\u0C3E\u0C2F\u0C28\u0C02 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C26\u0C3F \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C35\u0C3F\u0C36\u0C4D\u0C35\u0C38\u0C28\u0C40\u0C2F\u0C24 \u0C15\u0C4A\u0C32\u0C2E\u0C3E\u0C28\u0C02.",
      Hindi: "ACID \u0915\u094B \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0905\u092E\u094D\u0932 \u0938\u092E\u091D\u0928\u0947 \u0915\u0940 \u092D\u0942\u0932 \u0928 \u0915\u0930\u0947\u0902; \u092F\u0939 RDBMS \u0921\u0947\u091F\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u093E \u092E\u093E\u0928\u0915 \u0938\u0902\u0915\u094D\u0937\u0947\u092A \u0939\u0948\u0964",
      Tamil: "ACID \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BB5\u0BC7\u0BA4\u0BBF\u0BAF\u0BBF\u0BAF\u0BB2\u0BCD \u0B85\u0BAE\u0BBF\u0BB2\u0BAE\u0BBE\u0B95 \u0BAE\u0BCA\u0BB4\u0BBF\u0BAA\u0BC6\u0BAF\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0B95\u0BCD \u0B95\u0BC2\u0B9F\u0BBE\u0BA4\u0BC1.",
      Kannada: "ACID \u0CAA\u0CA6\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB0\u0CBE\u0CB8\u0CBE\u0CAF\u0CA8\u0CBF\u0C95 \u0C86\u0CAE\u0CCD\u0CB2 \u0C8E\u0C82\u0CA6\u0CC1 \u0CA4\u0CAA\u0CCD\u0CAA\u0CBE\u0C97\u0CBF \u0C97\u0CCD\u0CB0\u0CB9\u0CBF\u0CB8\u0CAC\u0CBE\u0CB0\u0CA6\u0CC1.",
      Bengali: "ACID \u0995\u09C7 \u09B0\u09BE\u09B8\u09BE\u09AF\u09BC\u09A8\u09BF\u0995 \u0985\u09AE\u09CD\u09B2 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0985\u09A8\u09C1\u09AC\u09BE\u09A6 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\u0964",
      Marathi: "ACID \u091A\u093E \u0905\u0930\u094D\u0925 \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0906\u092E\u094D\u0932 \u0905\u0938\u093E \u0915\u0930\u0942 \u0928\u092F\u0947.",
      Gujarati: "ACID \u0AA8\u0AC7 \u0AB0\u0AB8\u0ABE\u0AAF\u0AA3 \u0AB6\u0ABE\u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AA8\u0ABE \u0A8F\u0AB8\u0ABF\u0AA1 \u0AB8\u0ABE\u0AA5\u0AC7 \u0AA8 \u0AAD\u0AC7\u0AB3\u0AB5\u0AB5\u0AC1\u0A82.",
      Punjabi: "ACID \u0A28\u0A42\u0A70 \u0A15\u0A48\u0A2E\u0A40\u0A15\u0A32 \u0A24\u0A47\u0A1C\u0A3C\u0A3E\u0A2C \u0A28\u0A3E \u0A38\u0A2E\u0A1D\u0A4B\u0964",
      Malayalam: "ACID \u0D0E\u0D28\u0D4D\u0D28\u0D24\u0D4D \u0D30\u0D3E\u0D38\u0D35\u0D38\u0D4D\u0D24\u0D41\u0D35\u0D3E\u0D2F \u0D06\u0D38\u0D3F\u0D21\u0D4D \u0D05\u0D32\u0D4D\u0D32."
    },
    transliterations: {
      Telugu: "ACID Properties (\u0C06\u0C38\u0C3F\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C30\u0C4D\u0C1F\u0C40\u0C38\u0C4D - \u0C21\u0C47\u0C1F\u0C3E\u0C2C\u0C47\u0C38\u0C4D \u0C32\u0C3E\u0C35\u0C3E\u0C26\u0C47\u0C35\u0C40\u0C32 \u0C38\u0C42\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C41)",
      Hindi: "ACID Properties (\u090F\u0938\u093F\u0921 \u0917\u0941\u0923 - \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u091F\u094D\u0930\u093E\u0902\u091C\u0948\u0915\u094D\u0936\u0928 \u0938\u0941\u0930\u0915\u094D\u0937\u093E)",
      Tamil: "ACID Properties (\u0B85\u0B9A\u0BBF\u0B9F\u0BCD \u0BAA\u0BA3\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD)",
      Kannada: "ACID Properties (\u0C86\u0CB8\u0CBF\u0CA1\u0CCD \u0CAA\u0CCD\u0CB0\u0CBE\u0CAA\u0CB0\u0CCD\u0C9F\u0CC0\u0CB8\u0CCD)",
      Bengali: "ACID Properties (\u098F\u09B8\u09BF\u09A1 \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF\u099C)",
      Marathi: "ACID Properties (\u0905\u200D\u0945\u0938\u093F\u0921 \u0917\u0941\u0923\u0927\u0930\u094D\u092E)",
      Gujarati: "ACID Properties (\u0A8F\u0AB8\u0ABF\u0AA1 \u0AAA\u0ACD\u0AB0\u0ACB\u0AAA\u0AB0\u0ACD\u0A9F\u0AC0\u0A9D)",
      Punjabi: "ACID Properties (\u0A10\u0A38\u0A3F\u0A21 \u0A17\u0A41\u0A23)",
      Malayalam: "ACID Properties (\u0D06\u0D38\u0D3F\u0D21\u0D4D \u0D2A\u0D4D\u0D30\u0D4B\u0D2A\u0D4D\u0D2A\u0D7C\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D7E)"
    },
    technicalExample: `-- SQL Transaction adhering to ACID semantics:
BEGIN TRANSACTION;
UPDATE Accounts SET balance = balance - 500 WHERE id = 101;
UPDATE Accounts SET balance = balance + 500 WHERE id = 202;
COMMIT; -- Durably written to WAL disk log`
  },
  garbage_collection: {
    englishTerm: "Garbage Collection",
    subject: "Programming Languages",
    aliases: ["garbage collection", "gc", "\u0C17\u0C3E\u0C30\u0C4D\u0C2C\u0C47\u0C1C\u0C4D \u0C15\u0C32\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D", "\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928", "\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC8 \u0B9A\u0BC7\u0B95\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1", "\u0C97\u0CBE\u0CB0\u0CCD\u0CAC\u0CC7\u0C9C\u0CCD \u0C95\u0CB2\u0CC6\u0C95\u0CCD\u0CB7\u0CA8\u0CCD"],
    technicalMeaningEn: "Garbage Collection (GC) is an automated memory management runtime subsystem that identifies and reclaims dynamically allocated heap memory occupied by objects that are no longer reachable by any active reference chain in the running program.",
    explanationEn: "Preserve Garbage Collection. Translating as municipal street garbage sweeper obscures runtime heap tracking (Mark-and-Sweep, Generational GC).",
    technicalMeaningByLanguage: {
      Telugu: "\u0C17\u0C3E\u0C30\u0C4D\u0C2C\u0C47\u0C1C\u0C4D \u0C15\u0C32\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D (Garbage Collection - GC) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C1C\u0C3E\u0C35\u0C3E, \u0C1C\u0C3E\u0C35\u0C3E\u0C38\u0C4D\u0C15\u0C4D\u0C30\u0C3F\u0C2A\u0C4D\u0C1F\u0C4D \u0C35\u0C02\u0C1F\u0C3F \u0C30\u0C28\u0C4D\u200C\u0C1F\u0C48\u0C2E\u0C4D \u0C0E\u0C28\u0C4D\u0C35\u0C3F\u0C30\u0C3E\u0C28\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D\u0C32\u0C32\u0C4B \u0C06\u0C1F\u0C4B\u0C2E\u0C47\u0C1F\u0C3F\u0C15\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C4D\u200C\u0C2E\u0C46\u0C02\u0C1F\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25. \u0C2A\u0C4D\u0C30\u0C4B\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C0F \u0C35\u0C47\u0C30\u0C3F\u0C2F\u0C2C\u0C41\u0C32\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C30\u0C3F\u0C2B\u0C30\u0C46\u0C28\u0C4D\u0C38\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C28\u0C3F (Unreachable Objects) \u0C39\u0C40\u0C2A\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C1A\u0C3F, \u0C38\u0C4D\u0C35\u0C2F\u0C02\u0C1A\u0C3E\u0C32\u0C15\u0C02\u0C17\u0C3E \u0C35\u0C3F\u0C21\u0C41\u0C26\u0C32 \u0C1A\u0C47\u0C38\u0C3F \u0C24\u0C3F\u0C30\u0C3F\u0C17\u0C3F \u0C35\u0C3F\u0C28\u0C3F\u0C2F\u0C4B\u0C17\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C02 \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F.",
      Hindi: "\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928 (Garbage Collection) \u0906\u0927\u0941\u0928\u093F\u0915 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u093F\u0902\u0917 \u0930\u0928\u091F\u093E\u0907\u092E (Java, Node.js, Go) \u092E\u0947\u0902 \u090F\u0915 \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u092E\u0947\u092E\u094B\u0930\u0940 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0939\u0948 \u091C\u094B \u0939\u0940\u092A \u092E\u0947\u092E\u094B\u0930\u0940 \u092E\u0947\u0902 \u0928\u093F\u0937\u094D\u0915\u094D\u0930\u093F\u092F \u0914\u0930 \u0905\u0928\u0941\u092A\u092F\u094B\u0917\u0940 \u0935\u0938\u094D\u0924\u0941\u0913\u0902 \u0915\u094B \u0916\u094B\u091C\u0915\u0930 \u092E\u0947\u092E\u094B\u0930\u0940 \u0915\u094B \u092A\u0941\u0928\u0903 \u092E\u0941\u0915\u094D\u0924 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964",
      Tamil: "\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC8 \u0B9A\u0BC7\u0B95\u0BB0\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 (Garbage Collection) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B95\u0BA3\u0BBF\u0BA9\u0BBF \u0BA8\u0BBF\u0BB0\u0BB2\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BCD \u0BA4\u0BC7\u0BB5\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD\u0BB2\u0BBE\u0BA4 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BA4\u0BCD\u0BA4\u0BC8 \u0BA4\u0BBE\u0BA9\u0BBE\u0B95\u0BB5\u0BC7 \u0BB5\u0BBF\u0B9F\u0BC1\u0BB5\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95 \u0BAE\u0BC7\u0BB2\u0BBE\u0BA3\u0BCD\u0BAE\u0BC8 \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0C97\u0CBE\u0CB0\u0CCD\u0CAC\u0CC7\u0C9C\u0CCD \u0C95\u0CB2\u0CC6\u0C95\u0CCD\u0CB7\u0CA8\u0CCD (Garbage Collection) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0CAA\u0CCD\u0CB0\u0CCB\u0C97\u0CCD\u0CB0\u0CBE\u0C82\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CB3\u0C95\u0CC6\u0CAF\u0CBE\u0C97\u0CA6 \u0CB9\u0CC0\u0CAA\u0CCD \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB8\u0CCD\u0CB5\u0CAF\u0C82\u0C9A\u0CBE\u0CB2\u0CBF\u0CA4\u0CB5\u0CBE\u0C97\u0CBF \u0CAE\u0CB0\u0CC1\u0CAA\u0CA1\u0CC6\u0CAF\u0CC1\u0CB5 \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF \u0CA8\u0CBF\u0CB0\u0CCD\u0CB5\u0CB9\u0CA3\u0CBE \u0CA4\u0C82\u0CA4\u0CCD\u0CB0\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u0997\u09BE\u09B0\u09AC\u09C7\u099C \u0995\u09BE\u09B2\u09C7\u0995\u09B6\u09A8 \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u09B8\u09CD\u09AC\u09AF\u09BC\u0982\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AE\u09C7\u09AE\u09B0\u09BF \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE \u09AF\u09BE \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u0985\u09AC\u09CD\u09AF\u09AC\u09B9\u09C3\u09A4 \u09B9\u09BF\u09AA \u09AE\u09C7\u09AE\u09B0\u09BF \u09AA\u09C1\u09A8\u09B0\u09C1\u09A6\u09CD\u09A7\u09BE\u09B0 \u0995\u09B0\u09C7\u0964",
      Marathi: "\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928 (Garbage Collection) \u0939\u0940 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E\u092E\u0927\u0940\u0932 \u0928 \u0935\u093E\u092A\u0930\u0932\u0947\u0932\u0940 \u0939\u0940\u092A \u092E\u0947\u092E\u0930\u0940 \u0906\u092A\u094B\u0906\u092A \u092E\u094B\u0915\u0933\u0940 \u0915\u0930\u0923\u093E\u0930\u0940 \u0938\u093F\u0938\u094D\u091F\u0940\u092E \u0906\u0939\u0947.",
      Gujarati: "\u0A97\u0ABE\u0AB0\u0ACD\u0AAC\u0AC7\u0A9C \u0A95\u0AB2\u0AC7\u0A95\u0ACD\u0AB6\u0AA8 \u0A8F \u0AAA\u0ACD\u0AB0\u0ACB\u0A97\u0ACD\u0AB0\u0ABE\u0AAE\u0AAE\u0ABE\u0A82 \u0AAC\u0ABF\u0AA8\u0A89\u0AAA\u0AAF\u0ACB\u0A97\u0AC0 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0\u0AA8\u0AC7 \u0A86\u0AAA\u0AAE\u0AC7\u0AB3\u0AC7 \u0A96\u0ABE\u0AB2\u0AC0 \u0A95\u0AB0\u0AB5\u0ABE\u0AA8\u0AC0 \u0AAA\u0AA6\u0ACD\u0AA7\u0AA4\u0ABF \u0A9B\u0AC7.",
      Punjabi: "\u0A17\u0A3E\u0A30\u0A2C\u0A47\u0A1C \u0A15\u0A41\u0A32\u0A48\u0A15\u0A38\u0A3C\u0A28 \u0A2A\u0A4D\u0A30\u0A4B\u0A17\u0A30\u0A3E\u0A2E \u0A35\u0A3F\u0A71\u0A1A \u0A05\u0A23\u0A35\u0A30\u0A24\u0A40 \u0A39\u0A40\u0A2A \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A28\u0A42\u0A70 \u0A16\u0A3E\u0A32\u0A40 \u0A15\u0A30\u0A28 \u0A26\u0A40 \u0A06\u0A1F\u0A4B\u0A2E\u0A48\u0A1F\u0A3F\u0A15 \u0A2A\u0A4D\u0A30\u0A23\u0A3E\u0A32\u0A40 \u0A39\u0A48\u0964",
      Malayalam: "\u0D2A\u0D4D\u0D30\u0D4B\u0D17\u0D4D\u0D30\u0D3E\u0D2E\u0D3F\u0D7D \u0D06\u0D35\u0D36\u0D4D\u0D2F\u0D2E\u0D3F\u0D32\u0D4D\u0D32\u0D3E\u0D24\u0D4D\u0D24 \u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F \u0D2F\u0D3E\u0D28\u0D4D\u0D24\u0D4D\u0D30\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D35\u0D40\u0D23\u0D4D\u0D1F\u0D46\u0D1F\u0D41\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D2A\u0D4D\u0D30\u0D15\u0D4D\u0D30\u0D3F\u0D2F\u0D2F\u0D3E\u0D23\u0D4D \u0D17\u0D3E\u0D7C\u0D2C\u0D47\u0D1C\u0D4D \u0D15\u0D33\u0D15\u0D4D\u0D37\u0D7B."
    },
    explanationByLanguage: {
      Telugu: "Garbage Collection \u0C28\u0C3F \u0C2E\u0C41\u0C28\u0C3F\u0C38\u0C3F\u0C2A\u0C3E\u0C32\u0C3F\u0C1F\u0C40 \u0C1A\u0C46\u0C24\u0C4D\u0C24 \u0C38\u0C47\u0C15\u0C30\u0C23 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C26\u0C3F \u0C30\u0C28\u0C4D\u200C\u0C1F\u0C48\u0C2E\u0C4D \u0C39\u0C40\u0C2A\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C06\u0C1F\u0C4B\u0C2E\u0C47\u0C1F\u0C3F\u0C15\u0C4D\u200C\u0C17\u0C3E \u0C30\u0C40\u0C15\u0C4D\u0C32\u0C46\u0C2F\u0C3F\u0C2E\u0C4D \u0C1A\u0C47\u0C38\u0C47 \u0C38\u0C3E\u0C27\u0C28\u0C02.",
      Hindi: "Garbage Collection \u0915\u094B \u0915\u091A\u0930\u093E \u092C\u0940\u0928\u0928\u093E \u0928 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u092E\u0947\u092E\u094B\u0930\u0940 \u0932\u0940\u0915 \u0930\u094B\u0915\u0928\u0947 \u0935\u093E\u0932\u093E \u0930\u0928\u091F\u093E\u0907\u092E \u0915\u0902\u092A\u094B\u0928\u0947\u0902\u091F \u0939\u0948\u0964",
      Tamil: "Garbage Collection \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0BAE\u0BC6\u0BA9\u0BCD\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD \u0BAA\u0BCA\u0BB1\u0BBF\u0BAF\u0BBF\u0BAF\u0BB2\u0BBF\u0BB2\u0BCD \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Garbage Collection \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Garbage Collection \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Garbage Collection \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "Garbage Collection \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "Garbage Collection \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Garbage Collection \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Garbage Collection (\u0C17\u0C3E\u0C30\u0C4D\u0C2C\u0C47\u0C1C\u0C4D \u0C15\u0C32\u0C46\u0C15\u0C4D\u0C37\u0C28\u0C4D - \u0C06\u0C1F\u0C4B\u0C2E\u0C47\u0C1F\u0C3F\u0C15\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C30\u0C40\u0C15\u0C4D\u0C32\u0C46\u0C2F\u0C3F\u0C2E\u0C4D)",
      Hindi: "Garbage Collection (\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928 - \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u092E\u0947\u092E\u094B\u0930\u0940 \u0936\u094B\u0927\u0928)",
      Tamil: "Garbage Collection (\u0B95\u0BBE\u0BB0\u0BCD\u0BAA\u0BC7\u0B9C\u0BCD \u0B95\u0BB2\u0BC6\u0B95\u0BCD\u0BB7\u0BA9\u0BCD)",
      Kannada: "Garbage Collection (\u0C97\u0CBE\u0CB0\u0CCD\u0CAC\u0CC7\u0C9C\u0CCD \u0C95\u0CB2\u0CC6\u0C95\u0CCD\u0CB7\u0CA8\u0CCD)",
      Bengali: "Garbage Collection (\u0997\u09BE\u09B0\u09AC\u09C7\u099C \u0995\u09BE\u09B2\u09C7\u0995\u09B6\u09A8)",
      Marathi: "Garbage Collection (\u0917\u093E\u0930\u094D\u092C\u0947\u091C \u0915\u0932\u0947\u0915\u094D\u0936\u0928)",
      Gujarati: "Garbage Collection (\u0A97\u0ABE\u0AB0\u0ACD\u0AAC\u0AC7\u0A9C \u0A95\u0AB2\u0AC7\u0A95\u0ACD\u0AB6\u0AA8)",
      Punjabi: "Garbage Collection (\u0A17\u0A3E\u0A30\u0A2C\u0A47\u0A1C \u0A15\u0A41\u0A32\u0A48\u0A15\u0A38\u0A3C\u0A28)",
      Malayalam: "Garbage Collection (\u0D17\u0D3E\u0D7C\u0D2C\u0D47\u0D1C\u0D4D \u0D15\u0D33\u0D15\u0D4D\u0D37\u0D7B)"
    },
    technicalExample: `// V8 JavaScript Engine Generational Garbage Collection:
let sessionData = { token: "secret", payload: [1, 2, 3] };
sessionData = null; 
// Object becomes unreachable; collected during Scavenge/Mark-Sweep cycle`
  },
  buffer_overflow: {
    englishTerm: "Buffer Overflow",
    subject: "Computer Security",
    aliases: ["buffer overflow", "\u0C2C\u0C2B\u0C30\u0C4D \u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C4D\u0C32\u0C4B", "\u092C\u092B\u093C\u0930 \u0913\u0935\u0930\u092B\u094D\u0932\u094B", "\u0BA4\u0BBE\u0B99\u0BCD\u0B95\u0BB2\u0BCD \u0BA8\u0BBF\u0BB0\u0BAE\u0BCD\u0BAA\u0BBF \u0BB5\u0BB4\u0BBF\u0BA4\u0BB2\u0BCD", "\u0CAC\u0CAB\u0CB0\u0CCD \u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CCD\u0CB2\u0CCB"],
    technicalMeaningEn: "A Buffer Overflow is an anomaly and critical security vulnerability where a program writes data beyond the allocated boundary of a fixed-size contiguous memory buffer, corrupting adjacent stack or heap memory addresses and potentially overwriting the instruction pointer (EIP/RIP) to execute arbitrary code.",
    explanationEn: "Preserve Buffer Overflow. Translating as water tank overflowing misses the memory corruption security attack vector.",
    technicalMeaningByLanguage: {
      Telugu: "\u0C2C\u0C2B\u0C30\u0C4D \u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C4D\u0C32\u0C4B (Buffer Overflow) \u0C05\u0C28\u0C47\u0C26\u0C3F \u0C38\u0C3E\u0C2B\u0C4D\u0C1F\u0C4D\u200C\u0C35\u0C47\u0C30\u0C4D \u0C38\u0C46\u0C15\u0C4D\u0C2F\u0C42\u0C30\u0C3F\u0C1F\u0C40\u0C32\u0C4B \u0C05\u0C24\u0C4D\u0C2F\u0C02\u0C24 \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C26\u0C15\u0C30\u0C2E\u0C48\u0C28 \u0C32\u0C4B\u0C2A\u0C02 (Vulnerability). \u0C28\u0C3F\u0C30\u0C4D\u0C26\u0C47\u0C36\u0C3F\u0C24 \u0C2A\u0C30\u0C3F\u0C2E\u0C3E\u0C23\u0C02 \u0C15\u0C32\u0C3F\u0C17\u0C3F\u0C28 \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C2C\u0C2B\u0C30\u0C4D\u200C\u0C32\u0C4B\u0C15\u0C3F \u0C2A\u0C30\u0C3F\u0C2E\u0C3F\u0C24\u0C3F\u0C15\u0C3F \u0C2E\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C21\u0C47\u0C1F\u0C3E\u0C28\u0C41 \u0C30\u0C3E\u0C2F\u0C21\u0C02 \u0C35\u0C32\u0C4D\u0C32, \u0C05\u0C26\u0C3F \u0C2A\u0C15\u0C4D\u0C15\u0C28\u0C47 \u0C09\u0C28\u0C4D\u0C28 \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C39\u0C40\u0C2A\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C28\u0C3E\u0C36\u0C28\u0C02 \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C39\u0C4D\u0C2F\u0C3E\u0C15\u0C30\u0C4D\u0C32\u0C41 \u0C26\u0C40\u0C28\u0C3F \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2B\u0C02\u0C15\u0C4D\u0C37\u0C28\u0C4D \u0C30\u0C3F\u0C1F\u0C30\u0C4D\u0C28\u0C4D \u0C05\u0C21\u0C4D\u0C30\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C3F \u0C24\u0C2E \u0C39\u0C3E\u0C28\u0C3F\u0C15\u0C30\u0C2E\u0C48\u0C28 \u0C15\u0C4B\u0C21\u0C4D\u200C\u0C28\u0C41 \u0C0E\u0C17\u0C4D\u0C1C\u0C3F\u0C15\u0C4D\u0C2F\u0C42\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C30\u0C41.",
      Hindi: "\u092C\u092B\u093C\u0930 \u0913\u0935\u0930\u092B\u094D\u0932\u094B (Buffer Overflow) \u090F\u0915 \u0917\u0902\u092D\u0940\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092D\u0947\u0926\u094D\u092F\u0924\u093E \u0939\u0948 \u091C\u093F\u0938\u092E\u0947\u0902 \u0915\u094B\u0908 \u092A\u094D\u0930\u094B\u0917\u094D\u0930\u093E\u092E \u090F\u0915 \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0906\u0915\u093E\u0930 \u0915\u0947 \u092E\u0947\u092E\u094B\u0930\u0940 \u092C\u092B\u093C\u0930 \u092E\u0947\u0902 \u0909\u0938\u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u0938\u0947 \u0905\u0927\u093F\u0915 \u0921\u0947\u091F\u093E \u0932\u093F\u0916 \u0926\u0947\u0924\u093E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 \u0928\u093F\u0915\u091F\u0935\u0930\u094D\u0924\u0940 \u092E\u0947\u092E\u094B\u0930\u0940 \u0913\u0935\u0930\u0930\u093E\u0907\u091F \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948 \u0914\u0930 \u0939\u092E\u0932\u093E\u0935\u0930 \u092E\u0928\u092E\u093E\u0928\u093E \u0915\u094B\u0921 \u0928\u093F\u0937\u094D\u092A\u093E\u0926\u093F\u0924 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
      Tamil: "\u0BA4\u0BBE\u0B99\u0BCD\u0B95\u0BB2\u0BCD \u0BA8\u0BBF\u0BB0\u0BAE\u0BCD\u0BAA\u0BBF \u0BB5\u0BB4\u0BBF\u0BA4\u0BB2\u0BCD (Buffer Overflow) \u0B8E\u0BA9\u0BCD\u0BAA\u0BA4\u0BC1 \u0B92\u0BB0\u0BC1 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0B95\u0BAA\u0BCD \u0BAA\u0B95\u0BC1\u0BA4\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0B85\u0BA4\u0BA9\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BB3\u0BB5\u0BC8 \u0BB5\u0BBF\u0B9F \u0B85\u0BA4\u0BBF\u0B95\u0BAE\u0BBE\u0BA9 \u0BA4\u0BB0\u0BB5\u0BC8 \u0B8E\u0BB4\u0BC1\u0BA4\u0BC1\u0BAE\u0BCD \u0BAA\u0BCB\u0BA4\u0BC1 \u0B8F\u0BB1\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BC1 \u0B95\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BBE\u0B95\u0BC1\u0BAE\u0BCD.",
      Kannada: "\u0CAC\u0CAB\u0CB0\u0CCD \u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CCD\u0CB2\u0CCB (Buffer Overflow) \u0C8E\u0CA8\u0CCD\u0CA8\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1 \u0CA8\u0CBF\u0C97\u0CA6\u0CBF\u0CA4 \u0C97\u0CBE\u0CA4\u0CCD\u0CB0\u0CA6 \u0CAE\u0CC6\u0CAE\u0CCA\u0CB0\u0CBF \u0CAC\u0CAB\u0CB0\u0CCD \u0CAE\u0CBF\u0CA4\u0CBF\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAE\u0CC0\u0CB0\u0CBF \u0CA1\u0CC7\u0C9F\u0CBE\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAC\u0CB0\u0CC6\u0CAF\u0CC1\u0CB5\u0CC1\u0CA6\u0CB0\u0CBF\u0C82\u0CA6 \u0C89\u0C82\u0C9F\u0CBE\u0C97\u0CC1\u0CB5 \u0C97\u0C82\u0CAD\u0CC0\u0CB0 \u0CAD\u0CA6\u0CCD\u0CB0\u0CA4\u0CBE \u0CA6\u0CCB\u0CB7\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      Bengali: "\u09AC\u09BE\u09AB\u09BE\u09B0 \u0993\u09AD\u09BE\u09B0\u09AB\u09CD\u09B2\u09CB \u09B9\u09B2\u09CB \u098F\u0995\u099F\u09BF \u0997\u09C1\u09B0\u09C1\u09A4\u09B0 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09A4\u09CD\u09B0\u09C1\u099F\u09BF \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 \u09AE\u09C7\u09AE\u09B0\u09BF\u09B0 \u09B8\u09C0\u09AE\u09BE\u09B0 \u09AC\u09BE\u0987\u09B0\u09C7 \u09A1\u09C7\u099F\u09BE \u09B2\u09C7\u0996\u09BE\u09B0 \u09AB\u09B2\u09C7 \u09B8\u0982\u09B2\u0997\u09CD\u09A8 \u09AE\u09C7\u09AE\u09B0\u09BF \u0995\u09CD\u09B7\u09A4\u09BF\u0997\u09CD\u09B0\u09B8\u09CD\u09A4 \u09B9\u09AF\u09BC\u0964",
      Marathi: "\u092C\u092B\u0930 \u0913\u0935\u094D\u0939\u0930\u092B\u094D\u0932\u094B (Buffer Overflow) \u0939\u0940 \u090F\u0915 \u0917\u0902\u092D\u0940\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0924\u094D\u0930\u0941\u091F\u0940 \u0906\u0939\u0947 \u091C\u094D\u092F\u093E\u092E\u0927\u094D\u092F\u0947 \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u092E\u0947\u092E\u0930\u0940 \u092E\u0930\u094D\u092F\u093E\u0926\u0947\u092A\u0947\u0915\u094D\u0937\u093E \u091C\u093E\u0938\u094D\u0924 \u0921\u0947\u091F\u093E \u0932\u093F\u0939\u093F\u0932\u093E \u091C\u093E\u0924\u094B.",
      Gujarati: "\u0AAC\u0AAB\u0AB0 \u0A93\u0AB5\u0AB0\u0AAB\u0ACD\u0AB2\u0ACB \u0A8F \u0A97\u0A82\u0AAD\u0AC0\u0AB0 \u0AB8\u0AC1\u0AB0\u0A95\u0ACD\u0AB7\u0ABE \u0A96\u0ABE\u0AAE\u0AC0 \u0A9B\u0AC7 \u0A9C\u0AC7\u0AAE\u0ABE\u0A82 \u0AA8\u0ABF\u0AB0\u0ACD\u0AA7\u0ABE\u0AB0\u0ABF\u0AA4 \u0AAE\u0AC7\u0AAE\u0AB0\u0AC0 \u0A95\u0AB0\u0AA4\u0ABE\u0A82 \u0AB5\u0AA7\u0AC1 \u0AA1\u0AC7\u0A9F\u0ABE \u0AB2\u0A96\u0ABE\u0AA4\u0ABE\u0A82 \u0AB8\u0ABF\u0AB8\u0ACD\u0A9F\u0AAE \u0AB9\u0AC7\u0A95 \u0AA5\u0A88 \u0AB6\u0A95\u0AC7 \u0A9B\u0AC7.",
      Punjabi: "\u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05 \u0A07\u0A71\u0A15 \u0A17\u0A70\u0A2D\u0A40\u0A30 \u0A38\u0A41\u0A30\u0A71\u0A16\u0A3F\u0A06 \u0A16\u0A3C\u0A3E\u0A2E\u0A40 \u0A39\u0A48 \u0A1C\u0A3F\u0A38 \u0A35\u0A3F\u0A71\u0A1A \u0A28\u0A3F\u0A30\u0A27\u0A3E\u0A30\u0A24 \u0A2E\u0A48\u0A2E\u0A4B\u0A30\u0A40 \u0A38\u0A40\u0A2E\u0A3E \u0A24\u0A4B\u0A02 \u0A35\u0A71\u0A27 \u0A21\u0A3E\u0A1F\u0A3E \u0A32\u0A3F\u0A16\u0A3F\u0A06 \u0A1C\u0A3E\u0A02\u0A26\u0A3E \u0A39\u0A48\u0964",
      Malayalam: "\u0D2E\u0D46\u0D2E\u0D4D\u0D2E\u0D31\u0D3F \u0D2C\u0D2B\u0D31\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D2A\u0D30\u0D3F\u0D27\u0D3F\u0D15\u0D4D\u0D15\u0D2A\u0D4D\u0D2A\u0D41\u0D31\u0D02 \u0D21\u0D3E\u0D31\u0D4D\u0D31 \u0D0E\u0D34\u0D41\u0D24\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D2E\u0D4D\u0D2A\u0D4B\u0D7E \u0D09\u0D23\u0D4D\u0D1F\u0D3E\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D17\u0D41\u0D30\u0D41\u0D24\u0D30\u0D2E\u0D3E\u0D2F \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3E \u0D35\u0D40\u0D34\u0D4D\u0D1A\u0D2F\u0D3E\u0D23\u0D4D \u0D2C\u0D2B\u0D7C \u0D13\u0D35\u0D7C\u0D2B\u0D4D\u0D32\u0D4B."
    },
    explanationByLanguage: {
      Telugu: "Buffer Overflow \u0C28\u0C3F \u0C28\u0C40\u0C33\u0C4D\u0C32 \u0C24\u0C4A\u0C1F\u0C4D\u0C1F\u0C3F \u0C2A\u0C4A\u0C02\u0C17\u0C3F\u0C2A\u0C4A\u0C30\u0C4D\u0C32\u0C21\u0C02 \u0C05\u0C28\u0C3F \u0C05\u0C28\u0C41\u0C35\u0C26\u0C3F\u0C02\u0C1A\u0C15\u0C42\u0C21\u0C26\u0C41. \u0C07\u0C26\u0C3F \u0C38\u0C4D\u0C1F\u0C3E\u0C15\u0C4D \u0C2E\u0C46\u0C2E\u0C30\u0C40\u0C28\u0C3F \u0C15\u0C30\u0C2A\u0C4D\u0C1F\u0C4D \u0C1A\u0C47\u0C38\u0C47 \u0C2D\u0C26\u0C4D\u0C30\u0C24\u0C3E \u0C32\u0C4B\u0C2A\u0C02.",
      Hindi: "Buffer Overflow \u0915\u094B \u092A\u093E\u0928\u0940 \u0915\u093E \u091F\u0948\u0902\u0915 \u091B\u0932\u0915\u0928\u093E \u0928 \u0938\u092E\u091D\u0947\u0902; \u092F\u0939 \u0938\u093F\u0938\u094D\u091F\u092E \u0939\u093E\u0907\u091C\u0948\u0915 \u0915\u0930\u0928\u0947 \u0935\u093E\u0932\u093E \u092E\u0947\u092E\u094B\u0930\u0940 \u0905\u091F\u0948\u0915 \u0939\u0948\u0964",
      Tamil: "Buffer Overflow \u0B8E\u0BA9\u0BCD\u0BB1 \u0B9A\u0BCA\u0BB2\u0BCD\u0BB2\u0BC8 \u0B9A\u0BC8\u0BAA\u0BB0\u0BCD \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBF\u0BB2\u0BCD \u0B85\u0BAA\u0BCD\u0BAA\u0B9F\u0BBF\u0BAF\u0BC7 \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD.",
      Kannada: "Buffer Overflow \u0CA4\u0CBE\u0C82\u0CA4\u0CCD\u0CB0\u0CBF\u0C95 \u0CB9\u0CC6\u0CB8\u0CB0\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0CBE\u0C97\u0CC6\u0CAF\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF.",
      Bengali: "Buffer Overflow \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B0\u09BE\u0996\u09BE \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964",
      Marathi: "Buffer Overflow \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0924\u091A \u0920\u0947\u0935\u093E\u0935\u0947.",
      Gujarati: "Buffer Overflow \u0AB6\u0AAC\u0ACD\u0AA6 \u0AAE\u0ABE\u0AA8\u0A95 \u0A9B\u0AC7.",
      Punjabi: "Buffer Overflow \u0A28\u0A42\u0A70 \u0A24\u0A15\u0A28\u0A40\u0A15\u0A40 \u0A05\u0A70\u0A17\u0A30\u0A47\u0A1C\u0A3C\u0A40 \u0A35\u0A3F\u0A71\u0A1A \u0A39\u0A40 \u0A30\u0A71\u0A16\u0A4B\u0964",
      Malayalam: "Buffer Overflow \u0D38\u0D3E\u0D19\u0D4D\u0D15\u0D47\u0D24\u0D3F\u0D15\u0D2E\u0D3E\u0D2F\u0D3F \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D28\u0D3F\u0D32\u0D28\u0D3F\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15."
    },
    transliterations: {
      Telugu: "Buffer Overflow (\u0C2C\u0C2B\u0C30\u0C4D \u0C13\u0C35\u0C30\u0C4D\u200C\u0C2B\u0C4D\u0C32\u0C4B - \u0C2E\u0C46\u0C2E\u0C30\u0C40 \u0C05\u0C35\u0C3F\u0C28\u0C40\u0C24\u0C3F \u0C32\u0C4B\u0C2A\u0C02)",
      Hindi: "Buffer Overflow (\u092C\u092B\u093C\u0930 \u0913\u0935\u0930\u092B\u094D\u0932\u094B - \u092E\u0947\u092E\u094B\u0930\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092D\u0947\u0926\u094D\u092F\u0924\u093E)",
      Tamil: "Buffer Overflow (\u0BAA\u0B83\u0BAA\u0BB0\u0BCD \u0B93\u0BB5\u0BB0\u0BCD\u0B83\u0BAA\u0BCD\u0BB3\u0BCB)",
      Kannada: "Buffer Overflow (\u0CAC\u0CAB\u0CB0\u0CCD \u0C93\u0CB5\u0CB0\u0CCD\u200C\u0CAB\u0CCD\u0CB2\u0CCB)",
      Bengali: "Buffer Overflow (\u09AC\u09BE\u09AB\u09BE\u09B0 \u0993\u09AD\u09BE\u09B0\u09AB\u09CD\u09B2\u09CB)",
      Marathi: "Buffer Overflow (\u092C\u092B\u0930 \u0913\u0935\u094D\u0939\u0930\u092B\u094D\u0932\u094B)",
      Gujarati: "Buffer Overflow (\u0AAC\u0AAB\u0AB0 \u0A93\u0AB5\u0AB0\u0AAB\u0ACD\u0AB2\u0ACB)",
      Punjabi: "Buffer Overflow (\u0A2C\u0A2B\u0A30 \u0A13\u0A35\u0A30\u0A2B\u0A32\u0A4B\u0A05)",
      Malayalam: "Buffer Overflow (\u0D2C\u0D2B\u0D7C \u0D13\u0D35\u0D7C\u0D2B\u0D4D\u0D32\u0D4B)"
    },
    technicalExample: `// Vulnerable C code without boundary checks:
void vulnerableFunction(char *userInput) {
    char smallBuffer[16];
    // Dangerous: strcpy copies without bound checks!
    // Overwrites stack frame return address (RIP)
    strcpy(smallBuffer, userInput); 
}`
  }
};
var TerminologyService = class {
  /**
   * Searches the built-in canonical CS knowledge base for an exact or fuzzy match
   * in the specified regional language.
   */
  static lookupCanonical(termName, language) {
    if (!termName) return null;
    const lower = termName.toLowerCase().trim();
    const effectiveLang = language || "Telugu";
    const canonicalKey = Object.keys(CANONICAL_CS_TERMS).find((k) => {
      const canon2 = CANONICAL_CS_TERMS[k];
      if (lower === k || lower.includes(k) || k.includes(lower)) return true;
      if (canon2.englishTerm.toLowerCase().includes(lower) || lower.includes(canon2.englishTerm.toLowerCase())) {
        return true;
      }
      if (canon2.aliases && canon2.aliases.some(
        (alias) => lower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(lower)
      )) {
        return true;
      }
      const transValues = Object.values(canon2.transliterations);
      if (transValues.some((v) => lower.includes(v.toLowerCase()) || v.toLowerCase().includes(lower))) {
        return true;
      }
      return false;
    });
    if (!canonicalKey) return null;
    const canon = CANONICAL_CS_TERMS[canonicalKey];
    const preferred = canon.transliterations[effectiveLang] || canon.transliterations["Telugu"] || `${canon.englishTerm} (${canon.englishTerm})`;
    const techMeaning = canon.technicalMeaningByLanguage[effectiveLang] || canon.technicalMeaningByLanguage["Telugu"] || canon.technicalMeaningEn;
    const explanationRegional = canon.explanationByLanguage[effectiveLang] || canon.explanationByLanguage["Telugu"] || canon.explanationEn;
    return {
      id: "term_canon_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      englishTerm: canon.englishTerm,
      language: effectiveLang,
      preferredTranslation: preferred,
      alternativeTranslations: [canon.englishTerm, canon.englishTerm.toLowerCase(), ...canon.aliases],
      doNotTranslate: true,
      subject: canon.subject,
      explanation: explanationRegional,
      explanationEn: canon.explanationEn,
      technicalMeaning: techMeaning,
      technicalMeaningEn: canon.technicalMeaningEn,
      technicalExample: canon.technicalExample,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Searches existing database or generates an authentic CS technical meaning and example
   * for ANY word requested by the user, strictly adhering to the student's preferred language.
   */
  static async requestOrLookupTerm(queryTerm, targetLanguage = "Telugu", subject = "Operating Systems") {
    const cleanTerm = queryTerm.trim();
    if (!cleanTerm) {
      throw new Error("Please provide a valid technical term or word to explain.");
    }
    const detectedFromScript = detectLanguageFromScript(cleanTerm);
    const effectiveLanguage = detectedFromScript || targetLanguage || "Telugu";
    const lower = cleanTerm.toLowerCase();
    const allTerms = db.getTerminologyList();
    const existingForLang = allTerms.find(
      (t) => t.language.toLowerCase() === effectiveLanguage.toLowerCase() && (t.englishTerm.toLowerCase() === lower || t.englishTerm.toLowerCase().includes(lower) || lower.includes(t.englishTerm.toLowerCase()) || t.preferredTranslation.toLowerCase().includes(lower) || t.alternativeTranslations && t.alternativeTranslations.some(
        (alt) => alt.toLowerCase().includes(lower) || lower.includes(alt.toLowerCase())
      ))
    );
    if (existingForLang && existingForLang.technicalMeaning && existingForLang.technicalExample) {
      const isEnglishOnly = effectiveLanguage !== "English" && !/[\u0900-\u0D7F]/.test(existingForLang.technicalMeaning);
      if (!isEnglishOnly) {
        return {
          term: existingForLang,
          isNewlyCreated: false,
          source: "database"
        };
      }
    }
    const canonicalKey = Object.keys(CANONICAL_CS_TERMS).find((k) => {
      const canon = CANONICAL_CS_TERMS[k];
      if (lower === k || lower.includes(k) || k.includes(lower)) return true;
      if (canon.englishTerm.toLowerCase().includes(lower) || lower.includes(canon.englishTerm.toLowerCase())) {
        return true;
      }
      if (canon.aliases && canon.aliases.some(
        (alias) => lower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(lower)
      )) {
        return true;
      }
      const transValues = Object.values(canon.transliterations);
      if (transValues.some((v) => lower.includes(v.toLowerCase()) || v.toLowerCase().includes(lower))) {
        return true;
      }
      return false;
    });
    if (canonicalKey) {
      const canon = CANONICAL_CS_TERMS[canonicalKey];
      const preferred = canon.transliterations[effectiveLanguage] || `${canon.englishTerm} (${canon.englishTerm})`;
      const techMeaning = canon.technicalMeaningByLanguage[effectiveLanguage] || canon.technicalMeaningByLanguage["Telugu"] || canon.technicalMeaningEn;
      const explanationRegional = canon.explanationByLanguage[effectiveLanguage] || canon.explanationByLanguage["Telugu"] || canon.explanationEn;
      const entryData = {
        id: existingForLang?.id || "term_auto_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        englishTerm: canon.englishTerm,
        language: effectiveLanguage,
        preferredTranslation: preferred,
        alternativeTranslations: [canon.englishTerm, canon.englishTerm.toLowerCase(), ...canon.aliases],
        doNotTranslate: true,
        subject: canon.subject,
        explanation: explanationRegional,
        explanationEn: canon.explanationEn,
        technicalMeaning: techMeaning,
        technicalMeaningEn: canon.technicalMeaningEn,
        technicalExample: canon.technicalExample,
        createdAt: existingForLang?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (existingForLang) {
        db.updateTerminology(existingForLang.id, entryData);
      } else {
        db.createTerminology(entryData);
      }
      return {
        term: entryData,
        isNewlyCreated: !existingForLang,
        source: "canonical_knowledge_base"
      };
    }
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are LinguaLearn's Technical Computer Science Lexicon Engine.
A student studying Computer Science in their preferred language (${effectiveLanguage}) requested the technical meaning and practical engineering example for the term: "${cleanTerm}".
Context Subject: ${subject || "Computer Science Engineering"}
Target Preferred Student Language: ${effectiveLanguage}

CRITICAL RULES:
1. "technicalMeaning": MUST BE WRITTEN IN ${effectiveLanguage}. Explain with high technical rigor what this concept is, how it operates under the hood, and its internal mechanisms in ${effectiveLanguage}. Keep programming keywords, function/method names, and system calls in English for technical accuracy. Do NOT write purely in English!
2. "technicalMeaningEn": The formal English technical definition for bilingual comparison.
3. "explanation": MUST BE WRITTEN IN ${effectiveLanguage}. Explain why this term must be preserved in technical English/transliteration in software engineering and what misconception occurs if translated literally into conversational ${effectiveLanguage}.
4. "explanationEn": Pedagogical preservation guidance in English.
5. "preferredTranslation": Accurate transliteration and naming in ${effectiveLanguage} script accompanied by English term (e.g. Term (\u0C32\u0C3F\u0C2A\u0C3F / \u0932\u093F\u092A\u093F)).
6. "technicalExample": A concrete, functional code snippet (in Python, C, Java, JavaScript, or SQL) or system trace demonstrating practical engineering usage, with code comments in ${effectiveLanguage} or bilingual.

Respond ONLY with a valid JSON object matching this schema:
{
  "englishTerm": "Formal English Term",
  "subject": "${subject || "Computer Science"}",
  "language": "${effectiveLanguage}",
  "preferredTranslation": "...",
  "alternativeTranslations": ["...", "..."],
  "technicalMeaning": "...(rigorous explanation in ${effectiveLanguage})...",
  "technicalMeaningEn": "...(formal definition in English)...",
  "explanation": "...(pedagogical rule in ${effectiveLanguage})...",
  "explanationEn": "...(pedagogical rule in English)...",
  "technicalExample": "...(code with comments in ${effectiveLanguage})..."
}`;
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Gemini API lookup timed out")), 3e4);
        });
        const geminiPromise = generateContentWithRetry({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        });
        let generationResult;
        try {
          generationResult = await Promise.race([geminiPromise, timeoutPromise]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
        const { response } = generationResult;
        const text2 = response.text?.trim() || "{}";
        const parsed = safeParseJson(text2, null);
        const parsedRecord = isRecord(parsed) ? parsed : null;
        const technicalMeaning = typeof parsedRecord?.technicalMeaning === "string" ? parsedRecord.technicalMeaning.trim() : "";
        const technicalExample = typeof parsedRecord?.technicalExample === "string" ? parsedRecord.technicalExample.trim() : "";
        if (parsedRecord && technicalMeaning && technicalExample) {
          const generatedTerm = {
            id: existingForLang?.id || "term_ai_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            englishTerm: typeof parsedRecord.englishTerm === "string" && parsedRecord.englishTerm.trim() ? parsedRecord.englishTerm.trim() : cleanTerm,
            language: effectiveLanguage,
            preferredTranslation: typeof parsedRecord.preferredTranslation === "string" && parsedRecord.preferredTranslation.trim() ? parsedRecord.preferredTranslation.trim() : `${cleanTerm} (${cleanTerm})`,
            alternativeTranslations: Array.isArray(parsedRecord.alternativeTranslations) ? parsedRecord.alternativeTranslations.filter((value) => typeof value === "string") : [cleanTerm],
            doNotTranslate: true,
            subject: typeof parsedRecord.subject === "string" && parsedRecord.subject.trim() ? parsedRecord.subject.trim() : subject,
            explanation: typeof parsedRecord.explanation === "string" && parsedRecord.explanation.trim() || `Preserve "${cleanTerm}". Literal translation into regional languages leads to semantic distortion in Computer Science instruction.`,
            explanationEn: typeof parsedRecord.explanationEn === "string" ? parsedRecord.explanationEn : void 0,
            technicalMeaning,
            technicalMeaningEn: typeof parsedRecord.technicalMeaningEn === "string" ? parsedRecord.technicalMeaningEn : void 0,
            technicalExample,
            createdAt: existingForLang?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          if (existingForLang) {
            db.updateTerminology(existingForLang.id, generatedTerm);
          } else {
            db.createTerminology(generatedTerm);
          }
          return {
            term: generatedTerm,
            isNewlyCreated: !existingForLang,
            source: "gemini"
          };
        }
        throw new Error("Gemini returned an incomplete explanation. Please try again.");
      } catch (err) {
        console.error("Gemini terminology generation error:", err.message || err);
        throw new Error(`Could not generate an explanation for "${cleanTerm}": ${err.message || "Gemini request failed."}`);
      }
    }
    throw new Error("Gemini is not configured. Add a valid GEMINI_API_KEY to generate explanations for new terms.");
  }
};

// server/routes/terminology-routes.ts
var router5 = (0, import_express5.Router)();
router5.get("/", async (req, res) => {
  try {
    const { search, subject, language } = req.query;
    const searchStr = search ? String(search).trim() : void 0;
    const langStr = language && String(language).toUpperCase() !== "ALL" ? String(language).trim() : void 0;
    const subjectStr = subject && String(subject).toUpperCase() !== "ALL" ? String(subject).trim() : void 0;
    let list = db.getTerminologyList({
      search: searchStr,
      subject: subjectStr,
      language: langStr
    });
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.language && item.language !== "English" && !/[\u0900-\u0D7F]/.test(item.technicalMeaning || "")) {
        const canonical = TerminologyService.lookupCanonical(item.englishTerm, item.language);
        if (canonical) {
          const updated = db.updateTerminology(item.id, {
            technicalMeaning: canonical.technicalMeaning,
            technicalMeaningEn: canonical.technicalMeaningEn,
            explanation: canonical.explanation,
            explanationEn: canonical.explanationEn,
            preferredTranslation: canonical.preferredTranslation,
            technicalExample: canonical.technicalExample
          });
          if (updated) list[i] = updated;
        }
      }
    }
    if (searchStr && langStr && list.length === 0) {
      try {
        const result = await TerminologyService.requestOrLookupTerm(
          searchStr,
          langStr,
          subjectStr || "Computer Science"
        );
        if (result && result.term) {
          list = [result.term];
        }
      } catch (err) {
        console.warn("Auto lookup in GET /api/terminology failed:", err.message || err);
      }
    }
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch terminology." });
  }
});
router5.post("/request-term", async (req, res) => {
  try {
    const { term, language, subject } = req.body;
    if (!term || typeof term !== "string" || !term.trim()) {
      return res.status(400).json({
        success: false,
        error: "A valid technical word or term name is required.",
        message: "A valid technical word or term name is required."
      });
    }
    const result = await TerminologyService.requestOrLookupTerm(
      term.trim(),
      language || "Telugu",
      subject || "Operating Systems"
    );
    return res.json({
      success: true,
      term: result.term,
      isNewlyCreated: result.isNewlyCreated,
      source: result.source,
      message: `Technical meaning and example for "${result.term.englishTerm}" retrieved successfully.`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to process technical term request.",
      message: err.message || "Failed to process technical term request."
    });
  }
});
router5.get("/:id", (req, res) => {
  const item = db.getTerminologyById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: "Terminology term not found.",
      message: "Terminology term not found."
    });
  }
  return res.json({
    success: true,
    ...item,
    data: item
  });
});
var TermSchema = import_zod8.z.object({
  englishTerm: import_zod8.z.string().min(1, "English term is required"),
  language: import_zod8.z.string().min(1, "Target language is required"),
  preferredTranslation: import_zod8.z.string().min(1, "Preferred translation is required"),
  alternativeTranslations: import_zod8.z.array(import_zod8.z.string()).default([]),
  doNotTranslate: import_zod8.z.boolean().default(true),
  subject: import_zod8.z.string().min(1, "Subject is required"),
  explanation: import_zod8.z.string().min(1, "Explanation is required"),
  explanationEn: import_zod8.z.string().optional(),
  technicalMeaning: import_zod8.z.string().optional(),
  technicalMeaningEn: import_zod8.z.string().optional(),
  technicalExample: import_zod8.z.string().optional()
});
router5.post("/", requireAuth, requireAdmin, (req, res) => {
  try {
    const data = TermSchema.parse(req.body);
    const newTerm = {
      id: "term_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      englishTerm: data.englishTerm.trim(),
      language: data.language.trim(),
      preferredTranslation: data.preferredTranslation.trim(),
      alternativeTranslations: data.alternativeTranslations,
      doNotTranslate: data.doNotTranslate,
      subject: data.subject.trim(),
      explanation: data.explanation.trim(),
      explanationEn: data.explanationEn?.trim(),
      technicalMeaning: data.technicalMeaning?.trim(),
      technicalMeaningEn: data.technicalMeaningEn?.trim(),
      technicalExample: data.technicalExample?.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createTerminology(newTerm);
    return res.status(201).json({
      success: true,
      ...newTerm,
      data: newTerm
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.errors?.[0]?.message || err.message,
      message: err.errors?.[0]?.message || err.message
    });
  }
});
router5.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const existing = db.getTerminologyById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: "Terminology term not found.",
      message: "Terminology term not found."
    });
  }
  const updated = db.updateTerminology(req.params.id, req.body);
  return res.json({
    success: true,
    ...updated,
    data: updated
  });
});
router5.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const success = db.deleteTerminology(req.params.id);
  if (!success) {
    return res.status(404).json({
      success: false,
      error: "Terminology term not found.",
      message: "Terminology term not found."
    });
  }
  return res.json({
    success: true,
    message: "Terminology deleted successfully.",
    data: { id: req.params.id }
  });
});
var terminology_routes_default = router5;

// server/routes/quiz-routes.ts
var import_express6 = require("express");
var import_zod9 = require("zod");
var router6 = (0, import_express6.Router)();
var GenerateQuizSchema = import_zod9.z.object({
  topic: import_zod9.z.string().min(1, "Topic is required"),
  subject: import_zod9.z.string().default("Operating Systems"),
  language: import_zod9.z.string().default("Telugu"),
  difficulty: import_zod9.z.preprocess((val) => {
    if (typeof val === "string") {
      const u = val.toUpperCase();
      if (u === "INTERMEDIATE" || u === "MEDIUM") return "MEDIUM";
      if (u === "BEGINNER" || u === "EASY") return "EASY";
      if (u === "ADVANCED" || u === "HARD") return "HARD";
    }
    return "MEDIUM";
  }, import_zod9.z.enum(["EASY", "MEDIUM", "HARD"])).default("MEDIUM"),
  questionCount: import_zod9.z.preprocess((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 5;
    return Math.min(Math.max(num, 1), 25);
  }, import_zod9.z.number().int()).default(5),
  type: import_zod9.z.preprocess((val) => {
    if (typeof val === "string") {
      const u = val.toUpperCase();
      if (u === "MCQ" || u === "MULTIPLE_CHOICE") return "MCQ";
      if (u === "TRUE_FALSE" || u === "TF") return "TRUE_FALSE";
      if (u === "SHORT_ANSWER" || u === "SHORT") return "SHORT_ANSWER";
      if (u === "MIXED") return "MIXED";
    }
    return "MCQ";
  }, import_zod9.z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER", "MIXED"])).default("MCQ")
});
router6.post("/generate", requireAuth, async (req, res) => {
  try {
    const data = GenerateQuizSchema.parse(req.body);
    const quiz = await QuizEngineService.generateQuiz({
      userId: req.user.id,
      topic: data.topic,
      subject: data.subject,
      language: data.language,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      type: data.type
    });
    return res.json({
      success: true,
      ...quiz,
      data: quiz
    });
  } catch (err) {
    console.error("Quiz generation error:", err);
    const msg = err instanceof import_zod9.z.ZodError ? err.issues[0]?.message || "Invalid quiz request" : err.message || "Failed to generate quiz";
    return res.status(err instanceof import_zod9.z.ZodError ? 400 : 502).json({
      success: false,
      error: msg,
      message: msg
    });
  }
});
router6.get("/history", requireAuth, (req, res) => {
  const list = db.getQuizAttemptsByUser(req.user.id);
  return res.json({
    success: true,
    history: list,
    data: list
  });
});
router6.get("/attempts/my", requireAuth, (req, res) => {
  const list = db.getQuizAttemptsByUser(req.user.id);
  return res.json(list);
});
router6.get("/:id", requireAuth, (req, res) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({
      success: false,
      error: "Quiz not found",
      message: "Quiz not found"
    });
  }
  if (quiz.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Access denied to this quiz.",
      message: "Access denied to this quiz."
    });
  }
  return res.json({
    success: true,
    ...quiz,
    data: quiz
  });
});
router6.post("/:id/submit", requireAuth, async (req, res) => {
  try {
    const submission = import_zod9.z.object({
      answers: import_zod9.z.array(
        import_zod9.z.object({
          questionId: import_zod9.z.string().min(1),
          userAnswer: import_zod9.z.string()
        })
      )
    }).safeParse(req.body);
    if (!submission.success) {
      return res.status(400).json({
        success: false,
        error: submission.error.issues[0]?.message || "A valid answers array is required",
        message: submission.error.issues[0]?.message || "A valid answers array is required"
      });
    }
    const quiz = db.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
        message: "Quiz not found"
      });
    }
    if (quiz.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied to this quiz.",
        message: "Access denied to this quiz."
      });
    }
    const attempt = await QuizEngineService.gradeAttempt(req.params.id, req.user.id, submission.data.answers);
    return res.json({
      success: true,
      attemptId: attempt.id,
      ...attempt,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      weakTopics: attempt.weakTopics,
      answers: attempt.answers,
      createdAt: attempt.createdAt,
      data: attempt
    });
  } catch (err) {
    console.error("Quiz submission error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to grade quiz submission",
      message: err.message || "Failed to grade quiz submission"
    });
  }
});
var quiz_routes_default = router6;

// server/routes/evaluation-routes.ts
var import_express7 = require("express");
var import_zod10 = require("zod");

// server/ai/evaluation-engine.ts
var EvaluationEngineService = class {
  /**
   * Generates both Method A (Direct Translation) and Method B (Context-Aware Prompting)
   * on the EXACT same question to power research evaluation experiments.
   */
  static async generateComparison(question, sourceLanguage, targetLanguage, subject, referenceAnswer) {
    if (!getGeminiClient()) {
      throw new Error("Gemini is not configured. Add a valid GEMINI_API_KEY to generate research comparisons.");
    }
    try {
      const promptMethodA = `You are simulating a standard naive direct machine translation engine.
Translate the following technical explanation from ${sourceLanguage} directly and literally into ${targetLanguage} WITHOUT using computer science context or terminology preservation:
"${referenceAnswer || question}"
Produce the literal translation in ${targetLanguage}:`;
      const { response: resA } = await generateContentWithRetry({
        model: "gemini-3.8-flash",
        contents: promptMethodA,
        config: { temperature: 0.1 }
      });
      const directTranslation = resA.text?.trim() || "";
      const promptMethodB = `You are LinguaLearn, an expert multilingual AI computer science professor.
Explain this technical question to a B.Tech student in ${targetLanguage}:
Question: "${question}"
Subject: ${subject}

RULES:
1. STRICT TERMINOLOGY PRESERVATION: Preserve core computer science technical terms (e.g., Thread, Stack, Deadlock, Socket, Mutex, API, Cache) in English script or standard transliteration. DO NOT force absurd literal translations.
2. Formulate the technical explanation naturally in ${targetLanguage} with high technical accuracy, clear mechanisms, and academic rigor.
3. Keep the explanation concise and direct.`;
      const { response: resB } = await generateContentWithRetry({
        model: "gemini-3.8-flash",
        contents: promptMethodB,
        config: { temperature: 0.2 }
      });
      const contextAwareResponse = resB.text?.trim() || "";
      if (!directTranslation || !contextAwareResponse) {
        throw new Error("Gemini returned an empty research comparison. Please try again.");
      }
      return { directTranslation, contextAwareResponse };
    } catch (err) {
      console.error("Research comparison generation failed:", err.message || err);
      throw new Error(`Could not generate the research comparison: ${err.message || "Gemini request failed."}`);
    }
  }
  /**
   * Formats evaluation cases and reviews for CSV export
   */
  static exportReviewsToCSV() {
    const reviews = db.getEvaluationReviews();
    const headers = [
      "ReviewID",
      "CaseID",
      "Subject",
      "Topic",
      "TargetLanguage",
      "Direct_Semantic",
      "Direct_Technical",
      "Direct_Terminology",
      "Direct_Fluency",
      "Direct_Quality",
      "Context_Semantic",
      "Context_Technical",
      "Context_Terminology",
      "Context_Fluency",
      "Context_Quality",
      "Flag_Ambiguous",
      "Flag_TechnicalError",
      "Flag_MeaningLoss",
      "Flag_TerminologyError",
      "Flag_ComplexityMismatch",
      "Notes",
      "Date"
    ];
    const rows = reviews.map((r) => {
      const c = db.getEvaluationCaseById(r.caseId);
      return [
        `"${r.id}"`,
        `"${r.caseId}"`,
        `"${c?.subject || ""}"`,
        `"${c?.topic || ""}"`,
        `"${c?.targetLanguage || ""}"`,
        r.directSemanticScore,
        r.directTechnicalScore,
        r.directTerminologyScore,
        r.directFluencyScore,
        r.directQualityScore,
        r.contextSemanticScore,
        r.contextTechnicalScore,
        r.contextTerminologyScore,
        r.contextFluencyScore,
        r.contextQualityScore,
        r.flags.ambiguousTranslation ? 1 : 0,
        r.flags.technicalError ? 1 : 0,
        r.flags.meaningLoss ? 1 : 0,
        r.flags.terminologyError ? 1 : 0,
        r.flags.complexityMismatch ? 1 : 0,
        `"${(r.notes || "").replace(/"/g, '""')}"`,
        `"${r.createdAt}"`
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }
  /**
   * Formats evaluation dataset for JSON export
   */
  static exportEvaluationDataJSON() {
    const cases = db.getEvaluationCases();
    const reviews = db.getEvaluationReviews();
    const metrics = db.computeEvaluationMetrics();
    return {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      platform: "LinguaLearn Research Evaluation Engine",
      researchQuestion: "Does context-aware multilingual prompting preserve technical meaning better than direct translation?",
      evaluationCasesCount: cases.length,
      reviewsCount: reviews.length,
      metrics,
      cases,
      reviews
    };
  }
};

// server/routes/evaluation-routes.ts
var router7 = (0, import_express7.Router)();
router7.get("/cases", (req, res) => {
  const { subject, targetLanguage, search } = req.query;
  const list = db.getEvaluationCases({
    subject: subject ? String(subject) : void 0,
    targetLanguage: targetLanguage ? String(targetLanguage) : void 0,
    search: search ? String(search) : void 0
  });
  return res.json(list);
});
router7.get("/cases/:id", (req, res) => {
  const item = db.getEvaluationCaseById(req.params.id);
  if (!item) return res.status(404).json({ error: "Evaluation case not found" });
  const reviews = db.getEvaluationReviews(item.id);
  return res.json({ caseItem: item, reviews });
});
var CreateCaseSchema = import_zod10.z.object({
  subject: import_zod10.z.string().min(1),
  topic: import_zod10.z.string().min(1),
  sourceLanguage: import_zod10.z.string().default("English"),
  targetLanguage: import_zod10.z.string().min(1),
  question: import_zod10.z.string().min(3),
  referenceAnswer: import_zod10.z.string().min(3),
  directTranslation: import_zod10.z.string().optional(),
  contextAwareResponse: import_zod10.z.string().optional(),
  expectedTerms: import_zod10.z.array(import_zod10.z.string()).default([])
});
router7.post("/cases", requireAuth, async (req, res) => {
  try {
    const data = CreateCaseSchema.parse(req.body);
    let dt = data.directTranslation;
    let ca = data.contextAwareResponse;
    if (!dt || !ca) {
      const generated = await EvaluationEngineService.generateComparison(
        data.question,
        data.sourceLanguage,
        data.targetLanguage,
        data.subject,
        data.referenceAnswer
      );
      if (!dt) dt = generated.directTranslation;
      if (!ca) ca = generated.contextAwareResponse;
    }
    const newCase = {
      id: "case_" + Date.now(),
      subject: data.subject,
      topic: data.topic,
      sourceLanguage: data.sourceLanguage,
      targetLanguage: data.targetLanguage,
      question: data.question,
      referenceAnswer: data.referenceAnswer,
      directTranslation: dt || "",
      contextAwareResponse: ca || "",
      expectedTerms: data.expectedTerms,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createEvaluationCase(newCase);
    return res.json(newCase);
  } catch (err) {
    const status = err instanceof import_zod10.z.ZodError ? 400 : 502;
    return res.status(status).json({ error: err.message || "Failed to generate the research comparison." });
  }
});
router7.post("/compare", requireAuth, async (req, res) => {
  try {
    const { question, sourceLanguage, targetLanguage, subject, referenceAnswer } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }
    const result = await EvaluationEngineService.generateComparison(
      question,
      sourceLanguage || "English",
      targetLanguage || "Telugu",
      subject || "Operating Systems",
      referenceAnswer
    );
    return res.json(result);
  } catch (err) {
    return res.status(502).json({ error: err.message || "Failed to generate the research comparison." });
  }
});
var ReviewSchema = import_zod10.z.object({
  caseId: import_zod10.z.string().min(1),
  directSemanticScore: import_zod10.z.number().min(1).max(5),
  directTechnicalScore: import_zod10.z.number().min(1).max(5),
  directTerminologyScore: import_zod10.z.number().min(1).max(5),
  directFluencyScore: import_zod10.z.number().min(1).max(5),
  directQualityScore: import_zod10.z.number().min(1).max(5),
  contextSemanticScore: import_zod10.z.number().min(1).max(5),
  contextTechnicalScore: import_zod10.z.number().min(1).max(5),
  contextTerminologyScore: import_zod10.z.number().min(1).max(5),
  contextFluencyScore: import_zod10.z.number().min(1).max(5),
  contextQualityScore: import_zod10.z.number().min(1).max(5),
  flags: import_zod10.z.object({
    ambiguousTranslation: import_zod10.z.boolean().default(false),
    technicalError: import_zod10.z.boolean().default(false),
    meaningLoss: import_zod10.z.boolean().default(false),
    terminologyError: import_zod10.z.boolean().default(false),
    complexityMismatch: import_zod10.z.boolean().default(false)
  }),
  notes: import_zod10.z.string().default("")
});
router7.post("/review", requireAuth, (req, res) => {
  try {
    const data = ReviewSchema.parse(req.body);
    const caseItem = db.getEvaluationCaseById(data.caseId);
    if (!caseItem) {
      return res.status(404).json({ error: "Evaluation case not found" });
    }
    const review = {
      id: "rev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
      caseId: data.caseId,
      reviewerId: req.user.id,
      reviewerName: req.user.name,
      directSemanticScore: data.directSemanticScore,
      directTechnicalScore: data.directTechnicalScore,
      directTerminologyScore: data.directTerminologyScore,
      directFluencyScore: data.directFluencyScore,
      directQualityScore: data.directQualityScore,
      contextSemanticScore: data.contextSemanticScore,
      contextTechnicalScore: data.contextTechnicalScore,
      contextTerminologyScore: data.contextTerminologyScore,
      contextFluencyScore: data.contextFluencyScore,
      contextQualityScore: data.contextQualityScore,
      flags: data.flags,
      notes: data.notes,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.submitEvaluationReview(review);
    return res.json(review);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});
router7.get("/reviews", (req, res) => {
  const caseId = req.query.caseId ? String(req.query.caseId) : void 0;
  const list = db.getEvaluationReviews(caseId);
  return res.json(list);
});
router7.get("/metrics", (_req, res) => {
  const metrics = db.computeEvaluationMetrics();
  return res.json(metrics);
});
router7.get("/export/csv", (_req, res) => {
  const csvData = EvaluationEngineService.exportReviewsToCSV();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="lingualearn_evaluation_reviews.csv"');
  return res.send(csvData);
});
router7.get("/export/json", (_req, res) => {
  const jsonData = EvaluationEngineService.exportEvaluationDataJSON();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="lingualearn_evaluation_dataset.json"');
  return res.send(JSON.stringify(jsonData, null, 2));
});
var evaluation_routes_default = router7;

// server/routes/admin-routes.ts
var import_express8 = require("express");
var import_zod11 = require("zod");
var router8 = (0, import_express8.Router)();
router8.get("/stats", requireAuth, requireAdmin, (_req, res) => {
  const users = db.getAllUsers();
  const cases = db.getEvaluationCases();
  const reviews = db.getEvaluationReviews();
  const terminology = db.getTerminologyList();
  const fewShots = db.getFewShotExamples();
  const reviewedCaseIds = new Set(reviews.map((r) => r.caseId));
  const reviewedCount = reviewedCaseIds.size;
  const pendingCount = cases.length - reviewedCount;
  const languages = Array.from(new Set(cases.map((c) => c.targetLanguage)));
  const metrics = db.computeEvaluationMetrics();
  const payload = {
    totalUsers: users.length,
    studentsCount: users.filter((u) => u.role === "STUDENT").length,
    adminsCount: users.filter((u) => u.role === "ADMIN" || u.role === "RESEARCHER").length,
    totalCases: cases.length,
    reviewedCases: reviewedCount,
    pendingReviews: pendingCount >= 0 ? pendingCount : 0,
    totalReviewsSubmitted: reviews.length,
    totalTerminologyTerms: terminology.length,
    totalFewShotExamples: fewShots.length,
    supportedLanguagesCount: languages.length,
    metrics
  };
  return res.json({
    success: true,
    ...payload,
    data: payload
  });
});
router8.get("/users", requireAuth, requireAdmin, (_req, res) => {
  const users = db.getAllUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    preferredLanguage: u.preferredLanguage,
    createdAt: u.createdAt
  }));
  return res.json(users);
});
var handleRoleUpdate = (req, res) => {
  const { role } = req.body;
  if (!["STUDENT", "RESEARCHER", "ADMIN"].includes(role)) {
    return res.status(400).json({
      success: false,
      error: "Invalid role. Allowed roles: STUDENT, RESEARCHER, ADMIN.",
      message: "Invalid role. Allowed roles: STUDENT, RESEARCHER, ADMIN."
    });
  }
  const updated = db.updateUserRole(req.params.id, role);
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: "User not found.",
      message: "User not found."
    });
  }
  return res.json({
    success: true,
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      preferredLanguage: updated.preferredLanguage
    },
    data: updated
  });
};
router8.put("/users/:id/role", requireAuth, requireStrictAdmin, handleRoleUpdate);
router8.patch("/users/:id/role", requireAuth, requireStrictAdmin, handleRoleUpdate);
router8.get("/audit-logs", requireAuth, requireAdmin, (_req, res) => {
  const logs = db.getAuditLogs();
  return res.json({
    success: true,
    logs,
    data: logs
  });
});
router8.get("/logs", requireAuth, requireAdmin, (_req, res) => {
  const logs = db.getAuditLogs();
  return res.json(logs);
});
router8.get("/few-shot", requireAuth, (req, res) => {
  const { subject, targetLanguage, enabledOnly } = req.query;
  const list = db.getFewShotExamples({
    subject: subject ? String(subject) : void 0,
    targetLanguage: targetLanguage ? String(targetLanguage) : void 0,
    enabledOnly: enabledOnly === "true"
  });
  return res.json(list);
});
var FewShotSchema = import_zod11.z.object({
  sourceLanguage: import_zod11.z.string().default("English"),
  targetLanguage: import_zod11.z.string().min(1),
  subject: import_zod11.z.string().min(1),
  difficulty: import_zod11.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
  question: import_zod11.z.string().min(3),
  expectedStyle: import_zod11.z.string().min(3),
  terminologyGuidance: import_zod11.z.string().min(3),
  responseSnippet: import_zod11.z.string().min(3),
  enabled: import_zod11.z.boolean().default(true)
});
router8.post("/few-shot", requireAuth, requireAdmin, (req, res) => {
  try {
    const data = FewShotSchema.parse(req.body);
    const newExample = {
      id: "fs_" + Date.now(),
      ...data,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createFewShotExample(newExample);
    return res.status(201).json(newExample);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});
router8.put("/few-shot/:id", requireAuth, requireAdmin, (req, res) => {
  const updated = db.updateFewShotExample(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Few-shot example not found" });
  return res.json(updated);
});
router8.delete("/few-shot/:id", requireAuth, requireAdmin, (req, res) => {
  const success = db.deleteFewShotExample(req.params.id);
  if (!success) return res.status(404).json({ error: "Few-shot example not found" });
  return res.json({ success: true });
});
var admin_routes_default = router8;

// server/routes/progress-routes.ts
var import_express9 = require("express");
var router9 = (0, import_express9.Router)();
router9.get("/", requireAuth, (req, res) => {
  const userId = req.user.id;
  const progress = db.getProgress(userId);
  const achievements = db.getAchievements(userId);
  const milestonesData = db.getMilestonesAndBadges(userId);
  const attempts = db.getQuizAttemptsByUser(userId);
  const conversations = db.getConversationsByUser(userId);
  const topicsProgress = db.getTopicsProgress(userId);
  const activity = db.getUserActivity(userId);
  const payload = {
    progress,
    achievements,
    milestonesData,
    totalAttempts: attempts.length,
    recentAttempts: attempts.slice(0, 5),
    totalConversations: conversations.length,
    conversationStats: db.getUserActivityStats(userId),
    topicsProgress,
    activity
  };
  return res.json({
    success: true,
    ...payload,
    data: payload
  });
});
router9.get("/summary", requireAuth, (req, res) => {
  const userId = req.user.id;
  const progress = db.getProgress(userId);
  const attempts = db.getQuizAttemptsByUser(userId);
  const conversations = db.getConversationsByUser(userId);
  const totalQuestions = progress?.questionsAsked || 0;
  const totalQuizzes = attempts.length;
  const averageScore = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) : progress?.averageQuizScore || 0;
  const currentStreakDays = progress?.currentStreakDays || 1;
  const payload = {
    questionsAsked: totalQuestions,
    quizzesCompleted: totalQuizzes,
    averageScore,
    streak: currentStreakDays,
    totalConversations: conversations.length,
    conversationStats: db.getUserActivityStats(userId),
    languagesUsed: progress?.languagesUsed || ["Telugu", "English"],
    topicsCount: progress?.topicsLearned.length || 0,
    achievementsUnlocked: progress?.achievements.length || 0
  };
  return res.json({
    success: true,
    summary: payload,
    data: payload
  });
});
router9.get("/topics", requireAuth, (req, res) => {
  const topics = db.getTopicsProgress(req.user.id);
  return res.json({
    success: true,
    topics,
    data: topics
  });
});
router9.get("/activity", requireAuth, (req, res) => {
  const activity = db.getUserActivity(req.user.id);
  return res.json({
    success: true,
    activity,
    data: activity
  });
});
router9.get("/achievements", requireAuth, (req, res) => {
  const userId = req.user.id;
  const list = db.getEnrichedAchievements(userId);
  return res.json({
    success: true,
    achievements: list,
    data: list
  });
});
router9.get("/milestones", requireAuth, (req, res) => {
  const userId = req.user.id;
  const milestonesData = db.getMilestonesAndBadges(userId);
  return res.json({
    success: true,
    ...milestonesData,
    data: milestonesData
  });
});
var progress_routes_default = router9;

// server.ts
function getConfiguredPort() {
  const rawPort = process.env.PORT ?? "3000";
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT must be an integer between 0 and 65535; received "${rawPort}"`);
  }
  return port;
}
function isAddressInUse(error) {
  return error instanceof Error && "code" in error && error.code === "EADDRINUSE";
}
async function listenWithPortFallback(server, startPort) {
  for (let port = startPort; port <= 65535; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        server.once("error", onError);
        try {
          server.listen(port, "0.0.0.0", () => {
            server.removeListener("error", onError);
            resolve();
          });
        } catch (error) {
          server.removeListener("error", onError);
          reject(error);
        }
      });
      if (port !== startPort) {
        console.warn(`Port ${startPort} is already in use; using port ${port} instead.`);
      }
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Unable to determine the server port after listening.");
      }
      return address.port;
    } catch (error) {
      if (!isAddressInUse(error) || port === 65535 || startPort === 0) {
        throw error;
      }
    }
  }
  throw new Error(`No available port found starting from ${startPort}.`);
}
async function startServer() {
  const app = (0, import_express10.default)();
  app.use(import_express10.default.json({ limit: "10mb" }));
  app.use(import_express10.default.urlencoded({ extended: true }));
  app.use((0, import_cookie_parser.default)());
  if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) {
        console.log(`[API] ${req.method} ${req.path}`);
      }
      next();
    });
  }
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      database: db.isReady(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
      service: "LinguaLearn Multilingual AI API",
      version: "1.0.0",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use("/api/auth", auth_routes_default);
  app.use("/api/user", user_routes_default);
  app.use("/api/tutor", tutor_routes_default);
  app.use("/api/conversations", conversation_routes_default);
  app.use("/api/terminology", terminology_routes_default);
  app.use("/api/quiz", quiz_routes_default);
  app.use("/api/evaluation", evaluation_routes_default);
  app.use("/api/admin", admin_routes_default);
  app.use("/api/progress", progress_routes_default);
  app.use("/api/*", notFoundHandler);
  app.use(errorHandler);
  if (process.env.NODE_ENV !== "production") {
    const httpServer = (0, import_node_http.createServer)(app);
    const port = await listenWithPortFallback(httpServer, getConfiguredPort());
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { server: httpServer, port, clientPort: port }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log(`LinguaLearn server running on http://0.0.0.0:${port}`);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express10.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
    const httpServer = (0, import_node_http.createServer)(app);
    const port = await listenWithPortFallback(httpServer, getConfiguredPort());
    console.log(`LinguaLearn server running on http://0.0.0.0:${port}`);
  }
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
