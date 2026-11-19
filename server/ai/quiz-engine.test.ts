import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseGeneratedQuizQuestions, QuizEngineService } from './quiz-engine';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('quiz response parsing', () => {
  const params = {
    topic: 'Deadlocks',
    difficulty: 'MEDIUM' as const,
    questionCount: 1,
    type: 'MCQ' as const,
  };

  it('parses fenced JSON envelopes and resolves answer labels to their option text', () => {
    const raw = '```json\n{"questions":[{"question":"What prevents a race?","type":"MCQ","options":["Mutex","Queue","Cache","Stack"],"correctAnswer":"A","explanation":"A mutex serializes access."}]}\n```';

    expect(parseGeneratedQuizQuestions(raw, params)).toMatchObject([
      {
        question: 'What prevents a race?',
        type: 'MCQ',
        options: ['Mutex', 'Queue', 'Cache', 'Stack'],
        correctAnswer: 'Mutex',
        explanation: 'A mutex serializes access.',
        topic: 'Deadlocks',
        difficulty: 'MEDIUM',
      },
    ]);
  });

  it('rejects incomplete or mismatched AI output instead of inventing questions', () => {
    expect(() => parseGeneratedQuizQuestions('not json', params)).toThrow(/unsupported format/);
    expect(() => parseGeneratedQuizQuestions('[]', params)).toThrow(/1 were requested/);
    expect(() =>
      parseGeneratedQuizQuestions(
        '[{"question":"Pick one","type":"MCQ","options":["A","B"],"correctAnswer":"A"}]',
        params
      )
    ).toThrow(/four distinct answer options/);
  });

  it('reports a missing Gemini configuration instead of returning fallback content', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    await expect(
      QuizEngineService.generateQuiz({
        ...params,
        userId: 'user-test',
        subject: 'Operating Systems',
        language: 'Telugu',
      })
    ).rejects.toThrow(/Gemini is not configured/);
  });
});
