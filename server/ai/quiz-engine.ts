import { z } from 'zod';
import { Quiz, QuizQuestion, QuizAttempt } from '../db/schema';
import { getGeminiClient, generateContentWithRetry, safeParseJson } from './gemini';
import { db } from '../db/database';

export interface GenerateQuizParams {
  userId: string;
  topic: string;
  subject: string;
  language: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionCount: number;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MIXED';
}

export interface SubmitQuizAnswerPayload {
  questionId: string;
  userAnswer: string;
}

const GeneratedQuestionSchema = z.object({
  question: z.string().trim().min(1),
  type: z.string().optional(),
  options: z.array(z.string().trim().min(1)).optional(),
  correctAnswer: z.string().trim().min(1),
  explanation: z.string().trim().optional(),
  topic: z.string().trim().optional(),
});

export function parseGeneratedQuizQuestions(
  rawText: string,
  params: Pick<GenerateQuizParams, 'topic' | 'difficulty' | 'questionCount' | 'type'>
): QuizQuestion[] {
  const parsed = safeParseJson<unknown>(rawText, null);
  const rawQuestions = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && 'questions' in parsed && Array.isArray(parsed.questions)
      ? parsed.questions
      : null;

  if (!rawQuestions) {
    throw new Error('Gemini returned quiz content in an unsupported format.');
  }

  const validated = z.array(GeneratedQuestionSchema).safeParse(rawQuestions);
  if (!validated.success) {
    throw new Error(`Gemini returned invalid quiz questions: ${validated.error.issues[0]?.message || 'check the response fields'}.`);
  }
  if (validated.data.length !== params.questionCount) {
    throw new Error(`Gemini returned ${validated.data.length} questions; ${params.questionCount} were requested.`);
  }

  return validated.data.map((item, index) => {
    const rawType = (item.type || params.type).toUpperCase().replace(/[\s-]+/g, '_');
    const questionType = rawType === 'MULTIPLE_CHOICE' ? 'MCQ' : rawType;
    if (!['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER'].includes(questionType)) {
      throw new Error(`Gemini returned an unsupported question type for question ${index + 1}.`);
    }

    const options = item.options?.map((option) => option.trim()) || [];
    if (questionType === 'MCQ' && (options.length !== 4 || new Set(options.map((option) => option.toLowerCase())).size !== 4)) {
      throw new Error(`Question ${index + 1} must contain four distinct answer options.`);
    }
    if (questionType === 'TRUE_FALSE' && options.length !== 2) {
      throw new Error(`Question ${index + 1} must contain two answer options.`);
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
    if (questionType !== 'SHORT_ANSWER' && !options.some((option) => option === correctAnswer)) {
      throw new Error(`Question ${index + 1} has a correct answer that does not match an option.`);
    }

    return {
      id: `q_${Date.now()}_${index + 1}`,
      question: item.question,
      type: questionType as QuizQuestion['type'],
      ...(questionType === 'SHORT_ANSWER' ? {} : { options }),
      correctAnswer,
      explanation: item.explanation || '',
      topic: item.topic || params.topic,
      difficulty: params.difficulty,
    };
  });
}

export class QuizEngineService {
  public static async generateQuiz(params: GenerateQuizParams): Promise<Quiz> {
    const { userId, topic, subject, language, difficulty, questionCount, type } = params;
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error('Gemini is not configured. Add a valid GEMINI_API_KEY to generate quizzes.');
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
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });
    const questions = parseGeneratedQuizQuestions(response.text || '', params);

    const quiz: Quiz = {
      id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId,
      topic,
      subject,
      language,
      difficulty,
      questionCount: questions.length,
      type,
      questions,
      createdAt: new Date().toISOString(),
    };

    return db.saveQuiz(quiz);
  }

  public static async gradeAttempt(
    quizId: string,
    userId: string,
    submissions: SubmitQuizAnswerPayload[]
  ): Promise<QuizAttempt> {
    const quiz = db.getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const ai = getGeminiClient();
    const gradedAnswers: QuizAttempt['answers'] = [];
    const weakTopicSet = new Set<string>();
    let correctCount = 0;

    const submissionsByQuestion = new Map(submissions.map((submission) => [submission.questionId, submission.userAnswer]));
    for (const q of quiz.questions) {
      const submittedAnswer = submissionsByQuestion.get(q.id) || '';
      const userAns = submittedAnswer.trim();
      let isCorrect = false;

      if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
        isCorrect =
          userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
          userAns.replace(/^[A-D]\)\s*/i, '').trim().toLowerCase() ===
            q.correctAnswer.replace(/^[A-D]\)\s*/i, '').trim().toLowerCase();
      } else {
        // Short answer semantic evaluation
        isCorrect = await QuizEngineService.evaluateShortAnswer(userAns, q.correctAnswer, q.question, ai);
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
        explanation: q.explanation,
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100);

    const attempt: QuizAttempt = {
      id: 'attempt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
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
      createdAt: new Date().toISOString(),
    };

    return db.saveQuizAttempt(attempt);
  }

  private static async evaluateShortAnswer(
    userAnswer: string,
    referenceAnswer: string,
    questionText: string,
    ai: any
  ): Promise<boolean> {
    if (!userAnswer || userAnswer.length < 2) return false;

    // Fast heuristic match
    const normUser = userAnswer.toLowerCase();
    const normRef = referenceAnswer.toLowerCase();
    if (normUser === normRef || normRef.includes(normUser) || normUser.includes(normRef)) {
      return true;
    }

    // Token overlap
    const refTokens = normRef.split(/\s+/).filter((w) => w.length > 3);
    const userTokens = normUser.split(/\s+/).filter((w) => w.length > 3);
    const matched = refTokens.filter((t) => userTokens.includes(t));
    if (refTokens.length > 0 && matched.length / refTokens.length >= 0.5) {
      return true;
    }

    // If AI is available, use semantic grading
    if (ai) {
      try {
        const prompt = `Grade this technical Computer Science student's short answer.
Question: "${questionText}"
Reference Answer: "${referenceAnswer}"
Student's Answer: "${userAnswer}"

Accept correct paraphrases, conceptual synonyms, and answers in Indian languages (Hindi, Telugu, Tamil, etc.). Reject factually incorrect answers.
Output ONLY JSON: {"isCorrect": true | false}`;

        const { response: res } = await generateContentWithRetry({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        const parsed = safeParseJson(res.text || '{}', { isCorrect: false });
        return Boolean(parsed.isCorrect);
      } catch (err: any) {
        console.warn('Short answer evaluation LLM call encountered issue:', err.message || err);
        return matched.length > 0;
      }
    }

    return matched.length > 0;
  }

}
