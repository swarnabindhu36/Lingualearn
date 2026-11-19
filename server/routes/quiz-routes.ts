import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth-middleware';
import { QuizEngineService } from '../ai/quiz-engine';

const router = Router();

const GenerateQuizSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  subject: z.string().default('Operating Systems'),
  language: z.string().default('Telugu'),
  difficulty: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        const u = val.toUpperCase();
        if (u === 'INTERMEDIATE' || u === 'MEDIUM') return 'MEDIUM';
        if (u === 'BEGINNER' || u === 'EASY') return 'EASY';
        if (u === 'ADVANCED' || u === 'HARD') return 'HARD';
      }
      return 'MEDIUM';
    }, z.enum(['EASY', 'MEDIUM', 'HARD']))
    .default('MEDIUM'),
  questionCount: z
    .preprocess((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) return 5;
      return Math.min(Math.max(num, 1), 25);
    }, z.number().int())
    .default(5),
  type: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        const u = val.toUpperCase();
        if (u === 'MCQ' || u === 'MULTIPLE_CHOICE') return 'MCQ';
        if (u === 'TRUE_FALSE' || u === 'TF') return 'TRUE_FALSE';
        if (u === 'SHORT_ANSWER' || u === 'SHORT') return 'SHORT_ANSWER';
        if (u === 'MIXED') return 'MIXED';
      }
      return 'MCQ';
    }, z.enum(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'MIXED']))
    .default('MCQ'),
});

// POST /api/quiz/generate
router.post('/generate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = GenerateQuizSchema.parse(req.body);
    const quiz = await QuizEngineService.generateQuiz({
      userId: req.user!.id,
      topic: data.topic,
      subject: data.subject,
      language: data.language,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      type: data.type,
    });
    return res.json({
      success: true,
      ...quiz,
      data: quiz,
    });
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    const msg = err instanceof z.ZodError
      ? err.issues[0]?.message || 'Invalid quiz request'
      : err.message || 'Failed to generate quiz';
    return res.status(err instanceof z.ZodError ? 400 : 502).json({
      success: false,
      error: msg,
      message: msg,
    });
  }
});

// GET /api/quiz/history
router.get('/history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const list = db.getQuizAttemptsByUser(req.user!.id);
  return res.json({
    success: true,
    history: list,
    data: list,
  });
});

// GET /api/quiz/attempts/my
router.get('/attempts/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const list = db.getQuizAttemptsByUser(req.user!.id);
  return res.json(list);
});

// GET /api/quiz/:id
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({
      success: false,
      error: 'Quiz not found',
      message: 'Quiz not found',
    });
  }
  // Authorization check
  if (quiz.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Access denied to this quiz.',
      message: 'Access denied to this quiz.',
    });
  }
  return res.json({
    success: true,
    ...quiz,
    data: quiz,
  });
});

// POST /api/quiz/:id/submit
router.post('/:id/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const submission = z.object({
      answers: z.array(
        z.object({
          questionId: z.string().min(1),
          userAnswer: z.string(),
        })
      ),
    }).safeParse(req.body);
    if (!submission.success) {
      return res.status(400).json({
        success: false,
        error: submission.error.issues[0]?.message || 'A valid answers array is required',
        message: submission.error.issues[0]?.message || 'A valid answers array is required',
      });
    }

    const quiz = db.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        message: 'Quiz not found',
      });
    }
    if (quiz.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this quiz.',
        message: 'Access denied to this quiz.',
      });
    }

    // Grade entirely server-side against answer key
    const attempt = await QuizEngineService.gradeAttempt(req.params.id, req.user!.id, submission.data.answers);

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
      data: attempt,
    });
  } catch (err: any) {
    console.error('Quiz submission error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to grade quiz submission',
      message: err.message || 'Failed to grade quiz submission',
    });
  }
});

export default router;
