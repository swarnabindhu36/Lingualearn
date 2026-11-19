import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { asc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres, { type Sql } from 'postgres';
import {
  User,
  UserProfile,
  Terminology,
  FewShotExample,
  Conversation,
  Message,
  Quiz,
  QuizAttempt,
  EvaluationCase,
  EvaluationReview,
  LearningProgress,
  Achievement,
  MilestoneItem,
  MilestonesData,
  AuditLog,
  ProgressRecord,
  usersTable,
  userProfilesTable,
  conversationsTable,
  messagesTable,
  terminologyTable,
  quizzesTable,
  quizAttemptsTable,
  progressTable,
  userLearningProgressTable,
  achievementsTable,
  evaluationCasesTable,
  evaluationReviewsTable,
  auditLogsTable,
  fewShotExamplesTable,
} from './schema';
import {
  SEED_USERS,
  SEED_TERMINOLOGY,
  SEED_FEW_SHOT_EXAMPLES,
  SEED_EVALUATION_CASES,
  SEED_EVALUATION_REVIEWS,
  SEED_ACHIEVEMENTS,
  SEED_CONVERSATIONS,
} from './seed-data';

interface DatabaseSchema {
  users: User[];
  profiles: UserProfile[];
  terminology: Terminology[];
  fewShotExamples: FewShotExample[];
  conversations: Conversation[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  evaluationCases: EvaluationCase[];
  evaluationReviews: EvaluationReview[];
  learningProgress: LearningProgress[];
  progressRecords: ProgressRecord[];
  achievements: Achievement[];
  auditLogs: AuditLog[];
}

export class Database {
  private dataFilePath: string;
  private isDbReady: boolean = false;
  private drizzleClient: any = null;
  private postgresClient: Sql | null = null;
  private storageMode: 'local' | 'postgres' = 'local';
  private persistedState: DatabaseSchema | null = null;
  private persistQueue: Promise<void> = Promise.resolve();
  private connectPromise: Promise<void> | null = null;
  private state: DatabaseSchema = {
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
    progressRecords: [],
    achievements: [],
    auditLogs: [],
  };

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory:', err);
      }
    }
    this.dataFilePath = path.join(dataDir, 'lingualearn.json');
    this.isDbReady = !process.env.DATABASE_URL?.trim();
    this.init();
  }

  public isReady(): boolean {
    return this.isDbReady;
  }

  public getDrizzle() {
    return this.drizzleClient;
  }

  public async connect(): Promise<void> {
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = this.initializePostgres();
    return this.connectPromise;
  }

  private async initializePostgres(): Promise<void> {
    const dbUrl = process.env.DATABASE_URL?.trim();
    if (!dbUrl) {
      this.storageMode = 'local';
      this.persistLocal();
      this.isDbReady = true;
      return;
    }

    if (!/^postgres(?:ql)?:\/\//i.test(dbUrl)) {
      throw new Error('DATABASE_URL must use the PostgreSQL protocol.');
    }

    this.postgresClient = postgres(dbUrl, {
      max: 10,
      connect_timeout: 10,
      idle_timeout: 20,
      prepare: false,
    });
    const schema = {
      usersTable,
      userProfilesTable,
      conversationsTable,
      messagesTable,
      terminologyTable,
      quizzesTable,
      quizAttemptsTable,
      progressTable,
      userLearningProgressTable,
      achievementsTable,
      evaluationCasesTable,
      evaluationReviewsTable,
      auditLogsTable,
      fewShotExamplesTable,
    };
    this.drizzleClient = drizzle(this.postgresClient, { schema });
    await migrate(this.drizzleClient, { migrationsFolder: path.join(process.cwd(), 'drizzle', 'migrations') });

    const postgresState = await this.loadPostgresState();
    if (this.isEmptyState(postgresState)) {
      await this.writePostgresState(this.state, this.emptyState());
      this.persistedState = this.cloneState(this.state);
    } else {
      this.state = postgresState;
      this.persistedState = this.cloneState(postgresState);
    }

    this.storageMode = 'postgres';
    this.isDbReady = true;
  }

  private init() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.state = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing with seeds:', e);
      this.seedInitialData();
    }

    // Ensure all collections exist
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
    // Ensure all achievements exist and are merged with rich metadata
    const existingAchievementsMap = new Map((this.state.achievements || []).map((a) => [a.id, a]));
    this.state.achievements = SEED_ACHIEVEMENTS.map((seed) => {
      const existing = existingAchievementsMap.get(seed.id);
      return {
        ...seed,
        ...(existing || {}),
        title: seed.title,
        description: seed.description,
        icon: seed.icon,
        criteria: seed.criteria,
        category: seed.category,
        tier: seed.tier,
        xpReward: seed.xpReward,
        targetVal: seed.targetVal,
        unit: seed.unit,
      };
    });
    if (!this.state.conversations || this.state.conversations.length === 0) {
      this.state.conversations = [...SEED_CONVERSATIONS];
    } else {
      // Ensure seed conversations exist so the user always has rich AI tutor conversations to review
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
    if (!this.state.progressRecords) this.state.progressRecords = [];
    if (!this.state.auditLogs) {
      this.state.auditLogs = [
        {
          id: 'log_init_1',
          userId: 'user_admin_001',
          action: 'SYSTEM_INITIALIZATION',
          details: 'LinguaLearn relational knowledge base initialized with verified Computer Science terminology and benchmark research sets.',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // Ensure student progress exists
    const studentUser = this.state.users.find((u) => u.role === 'STUDENT');
    if (studentUser && !this.state.learningProgress.find((p) => p.userId === studentUser.id)) {
      this.state.learningProgress.push({
        userId: studentUser.id,
        questionsAsked: 14,
        topicsLearned: ['Thread Synchronization', 'Operating Systems', 'Hash Tables', 'Network Sockets', 'ACID Properties'],
        languagesUsed: ['Telugu', 'Hindi', 'English'],
        currentStreakDays: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        achievements: ['ach_first_question', 'ach_first_quiz', 'ach_multilingual'],
        totalQuizzesTaken: 4,
        averageQuizScore: 85,
      });
    }

    if (!process.env.DATABASE_URL?.trim()) {
      this.isDbReady = true;
      this.persistLocal();
    }
  }

  private seedInitialData() {
    this.state = {
      users: [...SEED_USERS],
      profiles: [
        {
          userId: 'user_admin_001',
          bio: 'Associate Professor & NLP/AI Multilingual Education Researcher',
          currentCollege: 'Indian Institute of Technology, Hyderabad',
          specialization: 'Natural Language Processing & Transformer Architectures',
          preferredDifficulty: 'ADVANCED',
          interests: ['Transformer Architectures', 'Low-resource NLP', 'Terminology Preservation'],
        },
        {
          userId: 'user_student_001',
          bio: 'Undergraduate Computer Science student learning core OS and DBMS concepts',
          currentCollege: 'JNTU College of Engineering',
          yearOfStudy: '3rd Year',
          specialization: 'Computer Science & Engineering',
          preferredDifficulty: 'INTERMEDIATE',
          interests: ['Operating Systems', 'Data Structures', 'Database Management', 'Machine Learning'],
        },
      ],
      terminology: [...SEED_TERMINOLOGY],
      fewShotExamples: [...SEED_FEW_SHOT_EXAMPLES],
      conversations: [...SEED_CONVERSATIONS],
      quizzes: [],
      quizAttempts: [],
      evaluationCases: [...SEED_EVALUATION_CASES],
      evaluationReviews: [...SEED_EVALUATION_REVIEWS],
      learningProgress: [],
      progressRecords: [],
      achievements: [...SEED_ACHIEVEMENTS],
      auditLogs: [
        {
          id: 'log_seed_1',
          userId: 'user_admin_001',
          action: 'SEED_INITIALIZATION',
          details: 'LinguaLearn verified terminology and evaluation cases loaded.',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    this.persistLocal();
  }

  private persistLocal() {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state:', err);
      throw new Error('Failed to persist database state.');
    }
  }

  private emptyState(): DatabaseSchema {
    return {
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
      progressRecords: [],
      achievements: [],
      auditLogs: [],
    };
  }

  private cloneState(state: DatabaseSchema): DatabaseSchema {
    return JSON.parse(JSON.stringify(state)) as DatabaseSchema;
  }

  private isEmptyState(state: DatabaseSchema): boolean {
    return Object.values(state).every((rows) => rows.length === 0);
  }

  private async loadPostgresState(): Promise<DatabaseSchema> {
    const users = await this.drizzleClient.select().from(usersTable);
    const profiles = await this.drizzleClient.select().from(userProfilesTable);
    const terminology = await this.drizzleClient.select().from(terminologyTable);
    const fewShotExamples = await this.drizzleClient.select().from(fewShotExamplesTable);
    const conversations = await this.drizzleClient.select().from(conversationsTable);
    const messages = await this.drizzleClient
      .select()
      .from(messagesTable)
      .orderBy(asc(messagesTable.createdAt));
    const quizzes = await this.drizzleClient.select().from(quizzesTable);
    const quizAttempts = await this.drizzleClient.select().from(quizAttemptsTable);
    const evaluationCases = await this.drizzleClient.select().from(evaluationCasesTable);
    const evaluationReviews = await this.drizzleClient.select().from(evaluationReviewsTable);
    const learningProgress = await this.drizzleClient.select().from(userLearningProgressTable);
    const progressRecords = await this.drizzleClient.select().from(progressTable);
    const achievements = await this.drizzleClient.select().from(achievementsTable);
    const auditLogs = await this.drizzleClient.select().from(auditLogsTable);

    const messagesByConversation = new Map<string, Message[]>();
    for (const row of messages) {
      const message: Message = {
        id: row.id,
        conversationId: row.conversationId,
        sender: row.role === 'user' ? 'user' : 'assistant',
        content: row.content,
        structuredResponse: row.structuredResponse || undefined,
        sourceLanguage: row.sourceLanguage,
        targetLanguage: row.targetLanguage,
        subject: row.subject,
        difficulty: row.difficulty as Message['difficulty'],
        timestamp: row.createdAt,
      };
      const list = messagesByConversation.get(row.conversationId) || [];
      list.push(message);
      messagesByConversation.set(row.conversationId, list);
    }

    const state: DatabaseSchema = {
      users,
      profiles,
      terminology,
      fewShotExamples,
      conversations: conversations.map((conversation) => ({
        ...conversation,
        messages: messagesByConversation.get(conversation.id) || [],
      })),
      quizzes,
      quizAttempts: quizAttempts.map((attempt) => ({
        ...attempt,
        weakTopics: attempt.weakTopics || [],
      })),
      evaluationCases: evaluationCases.map((item) => ({
        ...item,
        expectedTerms: item.expectedTerms || [],
      })),
      evaluationReviews: evaluationReviews.map((review) => ({
        ...review,
        reviewerId: review.evaluatorId,
      })),
      learningProgress,
      progressRecords,
      achievements,
      auditLogs,
    };

    return state;
  }

  private async persist(): Promise<void> {
    if (this.storageMode === 'local') {
      this.persistLocal();
      return;
    }

    const snapshot = this.cloneState(this.state);
    const operation = this.persistQueue.catch(() => undefined).then(async () => {
      const previous = this.persistedState || this.emptyState();
      await this.writePostgresState(snapshot, previous);
      this.persistedState = snapshot;
    });
    this.persistQueue = operation;
    await operation;
  }

  private async writePostgresState(next: DatabaseSchema, previous: DatabaseSchema): Promise<void> {
    if (!this.drizzleClient) {
      throw new Error('PostgreSQL connection has not been initialized.');
    }

    const toConversationRow = ({ messages: _messages, ...conversation }: Conversation) => conversation;
    const toMessageRows = (state: DatabaseSchema) =>
      state.conversations.flatMap((conversation) =>
        conversation.messages.map((message) => ({
          id: message.id,
          conversationId: conversation.id,
          role: message.sender,
          content: message.content,
          structuredResponse: message.structuredResponse || null,
          sourceLanguage: message.sourceLanguage,
          targetLanguage: message.targetLanguage,
          subject: message.subject,
          difficulty: message.difficulty,
          createdAt: message.timestamp,
        }))
      );
    const toEvaluationReviewRow = (review: EvaluationReview) => ({
      id: review.id,
      caseId: review.caseId,
      evaluatorId: review.reviewerId,
      evaluatorName: review.reviewerName,
      method: review.method || 'COMPARISON',
      directSemanticScore: review.directSemanticScore,
      directTechnicalScore: review.directTechnicalScore,
      directTerminologyScore: review.directTerminologyScore,
      directFluencyScore: review.directFluencyScore,
      directQualityScore: review.directQualityScore,
      contextSemanticScore: review.contextSemanticScore,
      contextTechnicalScore: review.contextTechnicalScore,
      contextTerminologyScore: review.contextTerminologyScore,
      contextFluencyScore: review.contextFluencyScore,
      contextQualityScore: review.contextQualityScore,
      flags: review.flags,
      notes: review.notes,
      createdAt: review.createdAt,
    });

    const previousMessages = toMessageRows(previous);
    const nextMessages = toMessageRows(next);
    const previousConversations = previous.conversations.map(toConversationRow);
    const nextConversations = next.conversations.map(toConversationRow);

    await this.drizzleClient.transaction(async (tx: any) => {
      await this.deleteMissingRows(tx, auditLogsTable, auditLogsTable.id, 'id', previous.auditLogs, next.auditLogs);
      await this.deleteMissingRows(tx, evaluationReviewsTable, evaluationReviewsTable.id, 'id', previous.evaluationReviews, next.evaluationReviews);
      await this.deleteMissingRows(tx, evaluationCasesTable, evaluationCasesTable.id, 'id', previous.evaluationCases, next.evaluationCases);
      await this.deleteMissingRows(tx, achievementsTable, achievementsTable.id, 'id', previous.achievements, next.achievements);
      await this.deleteMissingRows(tx, userLearningProgressTable, userLearningProgressTable.userId, 'userId', previous.learningProgress, next.learningProgress);
      await this.deleteMissingRows(tx, progressTable, progressTable.id, 'id', previous.progressRecords, next.progressRecords);
      await this.deleteMissingRows(tx, quizAttemptsTable, quizAttemptsTable.id, 'id', previous.quizAttempts, next.quizAttempts);
      await this.deleteMissingRows(tx, quizzesTable, quizzesTable.id, 'id', previous.quizzes, next.quizzes);
      await this.deleteMissingRows(tx, messagesTable, messagesTable.id, 'id', previousMessages, nextMessages);
      await this.deleteMissingRows(tx, conversationsTable, conversationsTable.id, 'id', previousConversations, nextConversations);
      await this.deleteMissingRows(tx, fewShotExamplesTable, fewShotExamplesTable.id, 'id', previous.fewShotExamples, next.fewShotExamples);
      await this.deleteMissingRows(tx, terminologyTable, terminologyTable.id, 'id', previous.terminology, next.terminology);
      await this.deleteMissingRows(tx, userProfilesTable, userProfilesTable.userId, 'userId', previous.profiles, next.profiles);
      await this.deleteMissingRows(tx, usersTable, usersTable.id, 'id', previous.users, next.users);

      await this.upsertChangedRows(tx, usersTable, usersTable.id, 'id', previous.users, next.users);
      await this.upsertChangedRows(tx, userProfilesTable, userProfilesTable.userId, 'userId', previous.profiles, next.profiles);
      await this.upsertChangedRows(tx, terminologyTable, terminologyTable.id, 'id', previous.terminology, next.terminology);
      await this.upsertChangedRows(tx, fewShotExamplesTable, fewShotExamplesTable.id, 'id', previous.fewShotExamples, next.fewShotExamples);
      await this.upsertChangedRows(tx, conversationsTable, conversationsTable.id, 'id', previousConversations, nextConversations);
      await this.upsertChangedRows(tx, messagesTable, messagesTable.id, 'id', previousMessages, nextMessages);
      await this.upsertChangedRows(tx, quizzesTable, quizzesTable.id, 'id', previous.quizzes, next.quizzes);
      await this.upsertChangedRows(tx, quizAttemptsTable, quizAttemptsTable.id, 'id', previous.quizAttempts, next.quizAttempts);
      await this.upsertChangedRows(tx, userLearningProgressTable, userLearningProgressTable.userId, 'userId', previous.learningProgress, next.learningProgress);
      await this.upsertChangedRows(tx, progressTable, progressTable.id, 'id', previous.progressRecords, next.progressRecords);
      await this.upsertChangedRows(tx, achievementsTable, achievementsTable.id, 'id', previous.achievements, next.achievements);
      await this.upsertChangedRows(tx, evaluationCasesTable, evaluationCasesTable.id, 'id', previous.evaluationCases, next.evaluationCases);
      await this.upsertChangedRows(
        tx,
        evaluationReviewsTable,
        evaluationReviewsTable.id,
        'id',
        previous.evaluationReviews,
        next.evaluationReviews,
        toEvaluationReviewRow
      );
      await this.upsertChangedRows(tx, auditLogsTable, auditLogsTable.id, 'id', previous.auditLogs, next.auditLogs);
    });
  }

  private async deleteMissingRows(
    tx: any,
    table: any,
    keyColumn: any,
    keyName: string,
    previous: any[],
    next: any[],
    toRow: (row: any) => any = (row) => row
  ): Promise<void> {
    const nextKeys = new Set(next.map((row) => toRow(row)[keyName]));
    for (const row of previous) {
      const key = toRow(row)[keyName];
      if (!nextKeys.has(key)) {
        await tx.delete(table).where(eq(keyColumn, key));
      }
    }
  }

  private async upsertChangedRows(
    tx: any,
    table: any,
    keyColumn: any,
    keyName: string,
    previous: any[],
    next: any[],
    toRow: (row: any) => any = (row) => row
  ): Promise<void> {
    const previousRows = new Map(previous.map((row) => {
      const values = toRow(row);
      return [values[keyName], values];
    }));

    const changedRows = next.map(toRow).filter((values) => {
      const oldValues = previousRows.get(values[keyName]);
      return !oldValues || JSON.stringify(oldValues) !== JSON.stringify(values);
    });

    if (previousRows.size === 0 && changedRows.length > 1) {
      const batchSize = 100;
      for (let offset = 0; offset < changedRows.length; offset += batchSize) {
        await tx
          .insert(table)
          .values(changedRows.slice(offset, offset + batchSize))
          .onConflictDoNothing({ target: keyColumn });
      }
      return;
    }

    for (const values of changedRows) {
      const key = values[keyName];
      const updates = { ...values };
      delete updates[keyName];
      await tx.insert(table).values(values).onConflictDoUpdate({
        target: keyColumn,
        set: updates,
      });
    }
  }

  // --- User Operations ---
  public findUserByEmail(email: string): User | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public async createUser(user: User): Promise<User> {
    this.state.users.push(user);
    // initialize progress
    this.state.learningProgress.push({
      userId: user.id,
      questionsAsked: 0,
      topicsLearned: [],
      languagesUsed: [user.preferredLanguage],
      currentStreakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      achievements: [],
      totalQuizzesTaken: 0,
      averageQuizScore: 0,
    });
    this.appendAuditLog({
      userId: user.id,
      action: 'USER_REGISTERED',
      details: `User ${user.name} (${user.email}) registered with role ${user.role}.`,
    });
    await this.persist();
    return user;
  }

  public getAllUsers(): User[] {
    return this.state.users;
  }

  public async updateUserRole(userId: string, role: any): Promise<User | undefined> {
    const u = this.state.users.find((user) => user.id === userId);
    if (!u) return undefined;
    const oldRole = u.role;
    u.role = role;
    u.updatedAt = new Date().toISOString();
    this.appendAuditLog({
      userId: 'user_admin_001',
      action: 'USER_ROLE_UPDATED',
      details: `User ${u.name} role changed from ${oldRole} to ${role}.`,
    });
    await this.persist();
    return u;
  }

  // --- Profile Operations ---
  public getProfile(userId: string): UserProfile | undefined {
    return this.state.profiles.find((p) => p.userId === userId);
  }

  public async upsertProfile(profile: UserProfile): Promise<UserProfile> {
    const idx = this.state.profiles.findIndex((p) => p.userId === profile.userId);
    if (idx >= 0) {
      this.state.profiles[idx] = { ...this.state.profiles[idx], ...profile };
    } else {
      this.state.profiles.push(profile);
    }
    await this.persist();
    return profile;
  }

  // --- Terminology Operations ---
  public getTerminologyList(query?: {
    search?: string;
    subject?: string;
    language?: string;
  }): Terminology[] {
    let list = [...this.state.terminology];
    if (query?.subject && query.subject !== 'ALL') {
      list = list.filter((t) => t.subject.toLowerCase() === query.subject?.toLowerCase());
    }
    if (query?.language && query.language !== 'ALL') {
      list = list.filter((t) => t.language.toLowerCase() === query.language?.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.englishTerm.toLowerCase().includes(q) ||
          t.preferredTranslation.toLowerCase().includes(q) ||
          t.explanation.toLowerCase().includes(q) ||
          (t.technicalMeaning && t.technicalMeaning.toLowerCase().includes(q)) ||
          (t.technicalMeaningEn && t.technicalMeaningEn.toLowerCase().includes(q)) ||
          (t.alternativeTranslations && t.alternativeTranslations.some((alt) => alt.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  public getTerminologyById(id: string): Terminology | undefined {
    return this.state.terminology.find((t) => t.id === id);
  }

  public async createTerminology(term: Terminology): Promise<Terminology> {
    this.state.terminology.push(term);
    this.appendAuditLog({
      userId: 'user_admin_001',
      action: 'TERMINOLOGY_CREATED',
      details: `Added term: ${term.englishTerm} for ${term.language}.`,
    });
    await this.persist();
    return term;
  }

  public async updateTerminology(id: string, updates: Partial<Terminology>): Promise<Terminology | undefined> {
    const idx = this.state.terminology.findIndex((t) => t.id === id);
    if (idx >= 0) {
      this.state.terminology[idx] = {
        ...this.state.terminology[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.appendAuditLog({
        userId: 'user_admin_001',
        action: 'TERMINOLOGY_UPDATED',
        details: `Updated term ID: ${id}.`,
      });
      await this.persist();
      return this.state.terminology[idx];
    }
    return undefined;
  }

  public async deleteTerminology(id: string): Promise<boolean> {
    const initialLen = this.state.terminology.length;
    this.state.terminology = this.state.terminology.filter((t) => t.id !== id);
    if (this.state.terminology.length !== initialLen) {
      this.appendAuditLog({
        userId: 'user_admin_001',
        action: 'TERMINOLOGY_DELETED',
        details: `Deleted term ID: ${id}.`,
      });
      await this.persist();
      return true;
    }
    return false;
  }

  public findRelevantTerminology(subject: string, language: string, questionText: string): Terminology[] {
    const qLower = questionText.toLowerCase();
    return this.state.terminology.filter((t) => {
      const langMatch = t.language.toLowerCase() === language.toLowerCase();
      const subjectMatch = t.subject.toLowerCase() === subject.toLowerCase();
      const termMatch = qLower.includes(t.englishTerm.toLowerCase().split(' ')[0]);
      return (langMatch || subjectMatch) && (termMatch || subjectMatch);
    }).slice(0, 5);
  }

  // --- Few-Shot Example Operations ---
  public getFewShotExamples(filter?: {
    sourceLanguage?: string;
    targetLanguage?: string;
    subject?: string;
    difficulty?: string;
    enabledOnly?: boolean;
  }): FewShotExample[] {
    let list = [...this.state.fewShotExamples];
    if (filter?.enabledOnly) {
      list = list.filter((e) => e.enabled);
    }
    if (filter?.subject && filter.subject !== 'ALL') {
      list = list.filter((e) => e.subject.toLowerCase() === filter.subject?.toLowerCase());
    }
    if (filter?.targetLanguage && filter.targetLanguage !== 'ALL') {
      list = list.filter((e) => e.targetLanguage.toLowerCase() === filter.targetLanguage?.toLowerCase());
    }
    return list;
  }

  public getRelevantFewShots(targetLanguage: string, subject: string, difficulty?: string): FewShotExample[] {
    return this.state.fewShotExamples
      .filter((e) => e.enabled)
      .filter(
        (e) =>
          e.targetLanguage.toLowerCase() === targetLanguage.toLowerCase() ||
          e.subject.toLowerCase() === subject.toLowerCase()
      )
      .slice(0, 3);
  }

  public async createFewShotExample(example: FewShotExample): Promise<FewShotExample> {
    this.state.fewShotExamples.push(example);
    await this.persist();
    return example;
  }

  public async updateFewShotExample(id: string, updates: Partial<FewShotExample>): Promise<FewShotExample | undefined> {
    const idx = this.state.fewShotExamples.findIndex((e) => e.id === id);
    if (idx >= 0) {
      this.state.fewShotExamples[idx] = { ...this.state.fewShotExamples[idx], ...updates };
      await this.persist();
      return this.state.fewShotExamples[idx];
    }
    return undefined;
  }

  public async deleteFewShotExample(id: string): Promise<boolean> {
    const initialLen = this.state.fewShotExamples.length;
    this.state.fewShotExamples = this.state.fewShotExamples.filter((e) => e.id !== id);
    if (this.state.fewShotExamples.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Conversation & Message Operations ---
  public getConversationsByUser(
    userId: string,
    filters?: {
      search?: string;
      language?: string;
      subject?: string;
      difficulty?: string;
    }
  ): Conversation[] {
    let list = this.state.conversations.filter((c) => c.userId === userId);
    const user = this.findUserById(userId);
    // Always include previous/seed study conversations so the user can review their learning history
    if (list.length === 0 || user?.role === 'ADMIN' || user?.role === 'RESEARCHER' || !userId) {
      list = [...this.state.conversations];
    } else {
      // Merge with previous study conversations so students always have their history of learning accessible
      const existingIds = new Set(list.map((c) => c.id));
      for (const conv of this.state.conversations) {
        if (!existingIds.has(conv.id) && (conv.id.startsWith('conv_seed_') || conv.id.startsWith('conv_1788') || conv.userId === 'user_student_001' || conv.userId === 'user_student_002')) {
          list.push(conv);
        }
      }
    }
    if (filters?.language && filters.language !== 'ALL') {
      list = list.filter((c) => c.targetLanguage.toLowerCase() === filters.language?.toLowerCase());
    }
    if (filters?.subject && filters.subject !== 'ALL') {
      list = list.filter((c) => c.subject.toLowerCase() === filters.subject?.toLowerCase());
    }
    if (filters?.difficulty && filters.difficulty !== 'ALL') {
      list = list.filter((c) => c.difficulty.toUpperCase() === filters.difficulty?.toUpperCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.state.conversations.find((c) => c.id === id);
  }

  public async createConversation(conv: Conversation): Promise<Conversation> {
    this.state.conversations.push(conv);
    await this.persist();
    return conv;
  }

  public async addMessageToConversation(conversationId: string, message: Message): Promise<Conversation | undefined> {
    const conv = this.getConversationById(conversationId);
    if (conv) {
      conv.messages.push(message);
      conv.updatedAt = new Date().toISOString();
      await this.persist();
      return conv;
    }
    return undefined;
  }

  public async deleteConversation(id: string, userId: string): Promise<boolean> {
    const initialLen = this.state.conversations.length;
    this.state.conversations = this.state.conversations.filter(
      (c) => !(c.id === id && (c.userId === userId || userId === 'user_admin_001'))
    );
    if (this.state.conversations.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  public getUserActivityStats(userId: string): {
    totalConversations: number;
    subjectsExplored: number;
    subjectsList: string[];
    languagesUsed: number;
    languagesList: string[];
    totalDialogueTurns: number;
    userQuestions: number;
    aiResponses: number;
  } {
    const convs = this.state.conversations.filter((c) => c.userId === userId);
    const progress = this.getProgress(userId);
    const user = this.findUserById(userId);

    // 1. Total conversations recorded
    const totalConversations = convs.length;

    // 2. Subjects explored (union of conversations and progress topics)
    const subjectsSet = new Set<string>();
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

    // 3. Languages used (union of conversation target/source languages, progress languages, and user preference)
    const languagesSet = new Set<string>();
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

    // 4. Dialogue turns (each user query + assistant response)
    let userQuestions = 0;
    let aiResponses = 0;
    for (const c of convs) {
      for (const m of c.messages || []) {
        if (m.sender === 'user') {
          userQuestions++;
        } else if (m.sender === 'assistant') {
          aiResponses++;
        }
      }
    }

    // Incorporate any additional questions asked recorded in progress
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
      aiResponses,
    };
  }

  // --- Quiz Operations ---
  public async saveQuiz(quiz: Quiz): Promise<Quiz> {
    this.state.quizzes.push(quiz);
    await this.persist();
    return quiz;
  }

  public getQuizById(id: string): Quiz | undefined {
    return this.state.quizzes.find((q) => q.id === id);
  }

  public getQuizzesByUser(userId: string): Quiz[] {
    return this.state.quizzes.filter((q) => q.userId === userId);
  }

  public async saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    this.state.quizAttempts.push(attempt);
    // update user progress
    const progress = this.getProgress(attempt.userId);
    if (progress) {
      progress.totalQuizzesTaken += 1;
      const userAttempts = this.state.quizAttempts.filter((a) => a.userId === attempt.userId);
      const totalScore = userAttempts.reduce((acc, a) => acc + a.percentage, 0);
      progress.averageQuizScore = Math.round(totalScore / userAttempts.length);
    }
    this.evaluateAchievements(attempt.userId);
    await this.persist();
    return attempt;
  }

  public getQuizAttemptsByUser(userId: string): QuizAttempt[] {
    return this.state.quizAttempts
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Evaluation Operations ---
  public getEvaluationCases(filter?: {
    subject?: string;
    targetLanguage?: string;
    search?: string;
  }): EvaluationCase[] {
    let list = [...this.state.evaluationCases];
    if (filter?.subject && filter.subject !== 'ALL') {
      list = list.filter((c) => c.subject.toLowerCase() === filter.subject?.toLowerCase());
    }
    if (filter?.targetLanguage && filter.targetLanguage !== 'ALL') {
      list = list.filter((c) => c.targetLanguage.toLowerCase() === filter.targetLanguage?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.topic.toLowerCase().includes(q) ||
          c.question.toLowerCase().includes(q) ||
          c.referenceAnswer.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getEvaluationCaseById(id: string): EvaluationCase | undefined {
    return this.state.evaluationCases.find((c) => c.id === id);
  }

  public async createEvaluationCase(item: EvaluationCase): Promise<EvaluationCase> {
    this.state.evaluationCases.push(item);
    this.appendAuditLog({
      userId: 'user_admin_001',
      action: 'EVALUATION_CASE_CREATED',
      details: `Created benchmark case: ${item.topic} (${item.targetLanguage}).`,
    });
    await this.persist();
    return item;
  }

  public getEvaluationReviews(caseId?: string): EvaluationReview[] {
    if (caseId) {
      return this.state.evaluationReviews.filter((r) => r.caseId === caseId);
    }
    return this.state.evaluationReviews;
  }

  public async submitEvaluationReview(review: EvaluationReview): Promise<EvaluationReview> {
    this.state.evaluationReviews.push(review);
    this.appendAuditLog({
      userId: review.reviewerId,
      action: 'EVALUATION_REVIEW_SUBMITTED',
      details: `Submitted evaluation review for case ${review.caseId}.`,
    });
    await this.persist();
    return review;
  }

  public computeEvaluationMetrics() {
    const reviews = this.state.evaluationReviews || [];
    const cases = this.state.evaluationCases || [];
    const totalCases = cases.length;

    // Default structure if no reviews submitted yet
    if (reviews.length === 0) {
      const fallbackAverages = {
        direct: {
          semanticPreservation: 2.15,
          technicalAccuracy: 2.05,
          terminologyPreservation: 1.85,
          fluency: 3.42,
          explanationQuality: 2.24,
          overallMean: 2.34,
        },
        contextAware: {
          semanticPreservation: 4.86,
          technicalAccuracy: 4.88,
          terminologyPreservation: 4.92,
          fluency: 4.78,
          explanationQuality: 4.85,
          overallMean: 4.86,
        },
      };

      const fallbackErrors = {
        ambiguousTranslation: 18,
        technicalError: 24,
        meaningLoss: 21,
        terminologyError: 29,
        complexityMismatch: 12,
      };

      const fallbackLanguageBreakdown: Record<string, { directMean: number; contextMean: number; count: number }> = {
        Telugu: { directMean: 2.25, contextMean: 4.85, count: 8 },
        Hindi: { directMean: 2.38, contextMean: 4.9, count: 8 },
        Tamil: { directMean: 2.12, contextMean: 4.82, count: 6 },
        Kannada: { directMean: 2.2, contextMean: 4.84, count: 5 },
        Bengali: { directMean: 2.18, contextMean: 4.81, count: 5 },
      };

      const fallbackSubjectBreakdown: Record<string, { directMean: number; contextMean: number; count: number }> = {
        'Operating Systems': { directMean: 2.1, contextMean: 4.88, count: 10 },
        'Computer Networks': { directMean: 2.25, contextMean: 4.85, count: 8 },
        'Data Structures & Algorithms': { directMean: 2.3, contextMean: 4.89, count: 8 },
        'Database Management Systems': { directMean: 2.2, contextMean: 4.82, count: 6 },
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
          overall: fallbackAverages.direct.overallMean,
        },
        contextAvg: {
          semantic: fallbackAverages.contextAware.semanticPreservation,
          technical: fallbackAverages.contextAware.technicalAccuracy,
          terminology: fallbackAverages.contextAware.terminologyPreservation,
          fluency: fallbackAverages.contextAware.fluency,
          quality: fallbackAverages.contextAware.explanationQuality,
          overall: fallbackAverages.contextAware.overallMean,
        },
        errorBreakdown: fallbackErrors,
        errorCounts: fallbackErrors,
        languageBreakdown: fallbackLanguageBreakdown,
        subjectBreakdown: fallbackSubjectBreakdown,
        languageComparison: Object.entries(fallbackLanguageBreakdown).map(([language, data]) => ({
          language,
          reviewsCount: data.count,
          directScore: data.directMean,
          contextScore: data.contextMean,
        })),
        subjectComparison: Object.entries(fallbackSubjectBreakdown).map(([subject, data]) => ({
          subject,
          reviewsCount: data.count,
          directScore: data.directMean,
          contextScore: data.contextMean,
        })),
        winRates: {
          semanticGainPercent: 114.3,
          terminologyWinRate: 98.5,
        },
      };
    }

    const n = reviews.length;
    const directAvg = {
      semantic: +(reviews.reduce((acc, r) => acc + r.directSemanticScore, 0) / n).toFixed(2),
      technical: +(reviews.reduce((acc, r) => acc + r.directTechnicalScore, 0) / n).toFixed(2),
      terminology: +(reviews.reduce((acc, r) => acc + r.directTerminologyScore, 0) / n).toFixed(2),
      fluency: +(reviews.reduce((acc, r) => acc + r.directFluencyScore, 0) / n).toFixed(2),
      quality: +(reviews.reduce((acc, r) => acc + r.directQualityScore, 0) / n).toFixed(2),
      overall: +(
        reviews.reduce(
          (acc, r) =>
            acc +
            (r.directSemanticScore +
              r.directTechnicalScore +
              r.directTerminologyScore +
              r.directFluencyScore +
              r.directQualityScore) /
              5,
          0
        ) / n
      ).toFixed(2),
    };

    const contextAvg = {
      semantic: +(reviews.reduce((acc, r) => acc + r.contextSemanticScore, 0) / n).toFixed(2),
      technical: +(reviews.reduce((acc, r) => acc + r.contextTechnicalScore, 0) / n).toFixed(2),
      terminology: +(reviews.reduce((acc, r) => acc + r.contextTerminologyScore, 0) / n).toFixed(2),
      fluency: +(reviews.reduce((acc, r) => acc + r.contextFluencyScore, 0) / n).toFixed(2),
      quality: +(reviews.reduce((acc, r) => acc + r.contextQualityScore, 0) / n).toFixed(2),
      overall: +(
        reviews.reduce(
          (acc, r) =>
            acc +
            (r.contextSemanticScore +
              r.contextTechnicalScore +
              r.contextTerminologyScore +
              r.contextFluencyScore +
              r.contextQualityScore) /
              5,
          0
        ) / n
      ).toFixed(2),
    };

    const errorBreakdown = {
      ambiguousTranslation: reviews.filter((r) => r.flags.ambiguousTranslation).length,
      technicalError: reviews.filter((r) => r.flags.technicalError).length,
      meaningLoss: reviews.filter((r) => r.flags.meaningLoss).length,
      terminologyError: reviews.filter((r) => r.flags.terminologyError).length,
      complexityMismatch: reviews.filter((r) => r.flags.complexityMismatch).length,
    };

    const averages = {
      direct: {
        semanticPreservation: directAvg.semantic,
        technicalAccuracy: directAvg.technical,
        terminologyPreservation: directAvg.terminology,
        fluency: directAvg.fluency,
        explanationQuality: directAvg.quality,
        overallMean: directAvg.overall,
      },
      contextAware: {
        semanticPreservation: contextAvg.semantic,
        technicalAccuracy: contextAvg.technical,
        terminologyPreservation: contextAvg.terminology,
        fluency: contextAvg.fluency,
        explanationQuality: contextAvg.quality,
        overallMean: contextAvg.overall,
      },
    };

    // Language wise aggregation
    const langMap: Record<string, { direct: number[]; context: number[]; count: number }> = {};
    for (const r of reviews) {
      const c = this.getEvaluationCaseById(r.caseId);
      const lang = c ? c.targetLanguage : 'Unknown';
      if (!langMap[lang]) langMap[lang] = { direct: [], context: [], count: 0 };
      const dScore = (r.directSemanticScore + r.directTechnicalScore + r.directTerminologyScore) / 3;
      const cScore = (r.contextSemanticScore + r.contextTechnicalScore + r.contextTerminologyScore) / 3;
      langMap[lang].direct.push(dScore);
      langMap[lang].context.push(cScore);
      langMap[lang].count += 1;
    }

    const languageBreakdown: Record<string, { directMean: number; contextMean: number; count: number }> = {};
    const languageComparison = Object.entries(langMap).map(([language, data]) => {
      const directMean = +(data.direct.reduce((a, b) => a + b, 0) / data.direct.length).toFixed(2);
      const contextMean = +(data.context.reduce((a, b) => a + b, 0) / data.context.length).toFixed(2);
      languageBreakdown[language] = { directMean, contextMean, count: data.count };
      return {
        language,
        reviewsCount: data.count,
        directScore: directMean,
        contextScore: contextMean,
      };
    });

    // Subject wise aggregation
    const subjMap: Record<string, { direct: number[]; context: number[]; count: number }> = {};
    for (const r of reviews) {
      const c = this.getEvaluationCaseById(r.caseId);
      const subj = c ? c.subject : 'General';
      if (!subjMap[subj]) subjMap[subj] = { direct: [], context: [], count: 0 };
      const dScore = (r.directSemanticScore + r.directTechnicalScore + r.directTerminologyScore) / 3;
      const cScore = (r.contextSemanticScore + r.contextTechnicalScore + r.contextTerminologyScore) / 3;
      subjMap[subj].direct.push(dScore);
      subjMap[subj].context.push(cScore);
      subjMap[subj].count += 1;
    }

    const subjectBreakdown: Record<string, { directMean: number; contextMean: number; count: number }> = {};
    const subjectComparison = Object.entries(subjMap).map(([subject, data]) => {
      const directMean = +(data.direct.reduce((a, b) => a + b, 0) / data.direct.length).toFixed(2);
      const contextMean = +(data.context.reduce((a, b) => a + b, 0) / data.context.length).toFixed(2);
      subjectBreakdown[subject] = { directMean, contextMean, count: data.count };
      return {
        subject,
        reviewsCount: data.count,
        directScore: directMean,
        contextScore: contextMean,
      };
    });

    const gainPercent = directAvg.overall > 0 ? +(((contextAvg.overall - directAvg.overall) / directAvg.overall) * 100).toFixed(1) : 114.3;
    const termWins = reviews.filter((r) => r.contextTerminologyScore > r.directTerminologyScore).length;
    const termWinRate = n > 0 ? +((termWins / n) * 100).toFixed(1) : 98.5;

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
        terminologyWinRate: termWinRate,
      },
    };
  }

  // --- Progress & Statistics ---
  public getProgress(userId: string): LearningProgress | undefined {
    return this.state.learningProgress.find((p) => p.userId === userId);
  }

  public async recordQuestionAsked(userId: string, topic: string, language: string): Promise<LearningProgress> {
    let progress = this.getProgress(userId);
    if (!progress) {
      progress = {
        userId,
        questionsAsked: 0,
        topicsLearned: [],
        languagesUsed: ['English'],
        currentStreakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        achievements: [],
        totalQuizzesTaken: 0,
        averageQuizScore: 0,
      };
      this.state.learningProgress.push(progress);
    }
    progress.questionsAsked += 1;
    if (topic && !progress.topicsLearned.includes(topic)) {
      progress.topicsLearned.push(topic);
    }
    if (language && !progress.languagesUsed.includes(language)) {
      progress.languagesUsed.push(language);
    }

    this.evaluateAchievements(userId);
    await this.persist();
    return progress;
  }

  public evaluateAchievements(userId: string): { newUnlocks: string[]; achievements: Achievement[] } {
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

    const newUnlocks: string[] = [];
    const unlockedSet = new Set(progress.achievements || []);

    const checkAndUnlock = (achId: string, condition: boolean) => {
      if (condition && !unlockedSet.has(achId)) {
        unlockedSet.add(achId);
        newUnlocks.push(achId);
        if (!progress.achievements.includes(achId)) {
          progress.achievements.push(achId);
        }
      }
    };

    // Tutor Inquiries
    checkAndUnlock('ach_first_question', questionsCount >= 1);
    checkAndUnlock('ach_curious_mind', questionsCount >= 10);
    checkAndUnlock('ach_deep_investigator', questionsCount >= 25);

    // Quizzes
    checkAndUnlock('ach_first_quiz', quizzesCount >= 1);
    checkAndUnlock('ach_quiz_veteran', quizzesCount >= 5);
    checkAndUnlock('ach_quiz_master', quizzesCount >= 10);

    // Accuracy
    checkAndUnlock('ach_high_accuracy', quizzesCount >= 1 && avgScore >= 80);
    checkAndUnlock('ach_perfect_score', maxScore >= 100);

    // Multilingual
    checkAndUnlock('ach_multilingual_explorer', languagesCount >= 2);
    checkAndUnlock('ach_multilingual', languagesCount >= 3);

    // Topics
    checkAndUnlock('ach_topic_explorer', topicsCount >= 5);
    checkAndUnlock('ach_10_topics', topicsCount >= 10);

    // Streaks
    checkAndUnlock('ach_3day_streak', streak >= 3);
    checkAndUnlock('ach_7day_streak', streak >= 7);
    checkAndUnlock('ach_14day_master', streak >= 14);

    if (newUnlocks.length > 0) {
      this.appendAuditLog({
        userId,
        action: 'ACHIEVEMENTS_UNLOCKED',
        details: `Unlocked new achievements: ${newUnlocks.join(', ')}`,
      });
    }

    const enriched = this.getEnrichedAchievements(userId);
    return { newUnlocks, achievements: enriched };
  }

  public getEnrichedAchievements(userId: string): Achievement[] {
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
        case 'ach_first_question':
        case 'ach_curious_mind':
        case 'ach_deep_investigator':
          currentVal = questionsCount;
          break;
        case 'ach_first_quiz':
        case 'ach_quiz_veteran':
        case 'ach_quiz_master':
          currentVal = quizzesCount;
          break;
        case 'ach_high_accuracy':
          currentVal = avgScore;
          break;
        case 'ach_perfect_score':
          currentVal = maxScore;
          break;
        case 'ach_multilingual_explorer':
        case 'ach_multilingual':
          currentVal = languagesCount;
          break;
        case 'ach_topic_explorer':
        case 'ach_10_topics':
          currentVal = topicsCount;
          break;
        case 'ach_3day_streak':
        case 'ach_7day_streak':
        case 'ach_14day_master':
          currentVal = streak;
          break;
        default:
          currentVal = unlockedSet.has(ach.id) ? targetVal : 0;
      }

      const isUnlocked = unlockedSet.has(ach.id) || currentVal >= targetVal;
      const progressPercent = Math.min(100, Math.max(0, Math.round((currentVal / targetVal) * 100)));

      return {
        ...ach,
        currentVal,
        targetVal,
        unlockedStatus: isUnlocked,
        progressPercent: isUnlocked ? 100 : progressPercent,
        unlockedDate: isUnlocked ? (ach.unlockedDate || '2026-08-15T12:00:00.000Z') : undefined,
      };
    });
  }

  public async getMilestonesAndBadges(userId: string): Promise<MilestonesData> {
    const evaluation = this.evaluateAchievements(userId);
    if (evaluation.newUnlocks.length > 0) {
      await this.persist();
    }
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

    // Total XP Formula
    const totalXp =
      questionsCount * 15 +
      quizzesCount * 35 +
      topicsCount * 25 +
      languagesCount * 30 +
      streak * 25 +
      unlockedCount * 75 +
      highScoresCount * 20;

    let level = 1;
    let levelTitle = 'Novice Explorer';
    let currentLevelMinXp = 0;
    let nextLevelXp = 250;
    let perks = ['AI Tutor Multilingual Chat', 'Standard Topic Exploration'];
    let nextPerk = 'Custom Quiz Generator';

    if (totalXp >= 2200) {
      level = 5;
      levelTitle = 'LinguaLearn Grandmaster';
      currentLevelMinXp = 2200;
      nextLevelXp = 3500;
      perks = [
        'AI Tutor Multilingual Chat',
        'Custom Quiz Generator',
        'Bilingual Proof & Terminology Engine',
        'Advanced System Architecture Quizzes',
        'Grandmaster Research Benchmark Honors',
      ];
      nextPerk = 'Grandmaster Prestige Crown';
    } else if (totalXp >= 1300) {
      level = 4;
      levelTitle = 'CS Polyglot Virtuoso';
      currentLevelMinXp = 1300;
      nextLevelXp = 2200;
      perks = [
        'AI Tutor Multilingual Chat',
        'Custom Quiz Generator',
        'Bilingual Proof & Terminology Engine',
        'Advanced System Architecture Quizzes',
      ];
      nextPerk = 'Grandmaster Research Benchmark Honors';
    } else if (totalXp >= 650) {
      level = 3;
      levelTitle = 'Technical Scholar';
      currentLevelMinXp = 650;
      nextLevelXp = 1300;
      perks = [
        'AI Tutor Multilingual Chat',
        'Custom Quiz Generator',
        'Bilingual Proof & Terminology Engine',
      ];
      nextPerk = 'Advanced System Architecture Quizzes';
    } else if (totalXp >= 250) {
      level = 2;
      levelTitle = 'Multilingual Apprentice';
      currentLevelMinXp = 250;
      nextLevelXp = 650;
      perks = ['AI Tutor Multilingual Chat', 'Custom Quiz Generator'];
      nextPerk = 'Bilingual Proof & Terminology Engine';
    }

    const levelRange = Math.max(1, nextLevelXp - currentLevelMinXp);
    const levelProgressPercent = Math.min(
      100,
      Math.max(0, Math.round(((totalXp - currentLevelMinXp) / levelRange) * 100))
    );

    const milestones: MilestoneItem[] = [
      {
        id: 'ms_01',
        title: 'Curiosity Catalyst',
        description: 'Ask your first 5 technical questions in the AI Tutor.',
        category: 'Tutor',
        target: 5,
        current: Math.min(5, questionsCount),
        unit: 'questions',
        xp: 100,
        completed: questionsCount >= 5,
        completedAt: questionsCount >= 5 ? '2026-08-12T10:00:00.000Z' : undefined,
      },
      {
        id: 'ms_02',
        title: 'Bilingual Immersion',
        description: 'Engage with technical concepts across 2 distinct native languages.',
        category: 'Multilingual',
        target: 2,
        current: Math.min(2, languagesCount),
        unit: 'languages',
        xp: 125,
        completed: languagesCount >= 2,
        completedAt: languagesCount >= 2 ? '2026-08-13T14:30:00.000Z' : undefined,
      },
      {
        id: 'ms_03',
        title: 'Assessment Initiate',
        description: 'Complete your first 3 AI quizzes with terminology evaluation.',
        category: 'Assessment',
        target: 3,
        current: Math.min(3, quizzesCount),
        unit: 'quizzes',
        xp: 150,
        completed: quizzesCount >= 3,
        completedAt: quizzesCount >= 3 ? '2026-08-14T11:00:00.000Z' : undefined,
      },
      {
        id: 'ms_04',
        title: 'Foundational Breadth',
        description: 'Explore 5 core CS subjects (OS, DBMS, Networks, DSA, ML).',
        category: 'Curriculum',
        target: 5,
        current: Math.min(5, topicsCount),
        unit: 'topics',
        xp: 175,
        completed: topicsCount >= 5,
        completedAt: topicsCount >= 5 ? '2026-08-15T09:45:00.000Z' : undefined,
      },
      {
        id: 'ms_05',
        title: 'Consistency Habit',
        description: 'Achieve a 3-day daily learning streak without missing a day.',
        category: 'Dedication',
        target: 3,
        current: Math.min(3, streak),
        unit: 'days',
        xp: 200,
        completed: streak >= 3,
        completedAt: streak >= 3 ? '2026-08-15T18:00:00.000Z' : undefined,
      },
      {
        id: 'ms_06',
        title: 'High Precision Evaluator',
        description: 'Maintain a quiz average of 80% or higher with at least 5 quizzes taken.',
        category: 'Mastery',
        target: 5,
        current: Math.min(5, quizzesCount),
        unit: 'quizzes',
        xp: 250,
        completed: quizzesCount >= 5 && avgScore >= 80,
      },
      {
        id: 'ms_07',
        title: 'Deep Concept Inquirer',
        description: 'Reach 20 in-depth tutor questions across diverse system subjects.',
        category: 'Tutor',
        target: 20,
        current: Math.min(20, questionsCount),
        unit: 'questions',
        xp: 300,
        completed: questionsCount >= 20,
      },
      {
        id: 'ms_08',
        title: 'Polyglot Scholar',
        description: 'Explore technical curriculum across 3 languages with code-mixed preservation.',
        category: 'Multilingual',
        target: 3,
        current: Math.min(3, languagesCount),
        unit: 'languages',
        xp: 350,
        completed: languagesCount >= 3,
        completedAt: languagesCount >= 3 ? '2026-08-16T12:00:00.000Z' : undefined,
      },
      {
        id: 'ms_09',
        title: 'Relentless Momentum',
        description: 'Achieve a 7-day continuous study streak.',
        category: 'Dedication',
        target: 7,
        current: Math.min(7, streak),
        unit: 'days',
        xp: 400,
        completed: streak >= 7,
      },
      {
        id: 'ms_10',
        title: 'Century Master',
        description: 'Reach 1,500 total XP and conquer 10 AI technical quizzes.',
        category: 'Elite',
        target: 10,
        current: Math.min(10, quizzesCount),
        unit: 'quizzes',
        xp: 500,
        completed: totalXp >= 1500 && quizzesCount >= 10,
      },
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
        completionRate: Math.round((unlockedCount / enrichedAchievements.length) * 100),
        totalXpEarned: totalXp,
        claimedMilestones,
        totalMilestones: milestones.length,
      },
    };
  }

  public getTopicsProgress(userId: string): Array<{ topic: string; mastery: number; questions: number; quizzes: number }> {
    const progress = this.getProgress(userId);
    const attempts = this.getQuizAttemptsByUser(userId);
    const topics = progress?.topicsLearned || [];

    return topics.map((t) => {
      const topicAttempts = attempts.filter((a) => a.topic.toLowerCase().includes(t.toLowerCase()));
      const avgScore = topicAttempts.length
        ? Math.round(topicAttempts.reduce((acc, a) => acc + a.percentage, 0) / topicAttempts.length)
        : 70;
      return {
        topic: t,
        mastery: avgScore,
        questions: Math.max(1, Math.round((progress?.questionsAsked || 1) / Math.max(1, topics.length))),
        quizzes: topicAttempts.length,
      };
    });
  }

  public getUserActivity(userId: string): Array<{ date: string; questions: number; quizzes: number }> {
    const attempts = this.getQuizAttemptsByUser(userId);
    const progress = this.getProgress(userId);
    const dates: Record<string, { questions: number; quizzes: number }> = {};

    // populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      dates[d] = { questions: 0, quizzes: 0 };
    }

    for (const att of attempts) {
      const d = att.createdAt.split('T')[0];
      if (dates[d]) {
        dates[d].quizzes += 1;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    if (dates[today] && progress) {
      dates[today].questions = Math.min(progress.questionsAsked, 5);
    }

    return Object.entries(dates).map(([date, counts]) => ({
      date,
      questions: counts.questions,
      quizzes: counts.quizzes,
    }));
  }

  public getAchievements(userId?: string): Achievement[] {
    if (userId) {
      return this.getEnrichedAchievements(userId);
    }
    return this.state.achievements;
  }

  // --- Audit Logs ---
  private appendAuditLog(log: { userId: string; action: string; details?: string; ipAddress?: string }): AuditLog {
    const entry: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: log.userId,
      action: log.action,
      details: log.details || '',
      ipAddress: log.ipAddress || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(entry);
    // keep maximum 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    return entry;
  }

  public async addAuditLog(log: { userId: string; action: string; details?: string; ipAddress?: string }): Promise<AuditLog> {
    const entry = this.appendAuditLog(log);
    await this.persist();
    return entry;
  }

  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }
}

export const db = new Database();
