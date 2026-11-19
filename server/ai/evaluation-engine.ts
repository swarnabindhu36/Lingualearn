import { db } from '../db/database';
import { EvaluationCase, EvaluationReview } from '../db/schema';
import { getGeminiClient, generateContentWithRetry } from './gemini';

export interface ComparisonGenerationResult {
  directTranslation: string;
  contextAwareResponse: string;
}

export class EvaluationEngineService {
  /**
   * Generates both Method A (Direct Translation) and Method B (Context-Aware Prompting)
   * on the EXACT same question to power research evaluation experiments.
   */
  public static async generateComparison(
    question: string,
    sourceLanguage: string,
    targetLanguage: string,
    subject: string,
    referenceAnswer?: string
  ): Promise<ComparisonGenerationResult> {
    if (!getGeminiClient()) {
      throw new Error('Gemini is not configured. Add a valid GEMINI_API_KEY to generate research comparisons.');
    }

    try {
      // METHOD A: Direct Machine Translation
      // Translates literally word-for-word without CS domain awareness
      const promptMethodA = `You are simulating a standard naive direct machine translation engine.
Translate the following technical explanation from ${sourceLanguage} directly and literally into ${targetLanguage} WITHOUT using computer science context or terminology preservation:
"${referenceAnswer || question}"
Produce the literal translation in ${targetLanguage}:`;

      const promptMethodB = `You are LinguaLearn, an expert multilingual AI computer science professor.
Explain this technical question to a B.Tech student in ${targetLanguage}:
Question: "${question}"
Subject: ${subject}

RULES:
1. STRICT TERMINOLOGY PRESERVATION: Preserve core computer science technical terms (e.g., Thread, Stack, Deadlock, Socket, Mutex, API, Cache) in English script or standard transliteration. DO NOT force absurd literal translations.
2. Formulate the technical explanation naturally in ${targetLanguage} with high technical accuracy, clear mechanisms, and academic rigor.
3. Keep the explanation concise and direct.`;

      const [{ response: resA }, { response: resB }] = await Promise.all([
        generateContentWithRetry({
          model: 'gemini-3.8-flash',
          contents: promptMethodA,
          config: { temperature: 0.1 },
        }),
        generateContentWithRetry({
          model: 'gemini-3.8-flash',
          contents: promptMethodB,
          config: { temperature: 0.2 },
        }),
      ]);
      const directTranslation = resA.text?.trim() || '';
      const contextAwareResponse = resB.text?.trim() || '';

      if (!directTranslation || !contextAwareResponse) {
        throw new Error('Gemini returned an empty research comparison. Please try again.');
      }

      return { directTranslation, contextAwareResponse };
    } catch (err: any) {
      console.error('Research comparison generation failed:', err.message || err);
      throw new Error(`Could not generate the research comparison: ${err.message || 'Gemini request failed.'}`);
    }
  }

  /**
   * Formats evaluation cases and reviews for CSV export
   */
  public static exportReviewsToCSV(): string {
    const reviews = db.getEvaluationReviews();
    const headers = [
      'ReviewID',
      'CaseID',
      'Subject',
      'Topic',
      'TargetLanguage',
      'Direct_Semantic',
      'Direct_Technical',
      'Direct_Terminology',
      'Direct_Fluency',
      'Direct_Quality',
      'Context_Semantic',
      'Context_Technical',
      'Context_Terminology',
      'Context_Fluency',
      'Context_Quality',
      'Flag_Ambiguous',
      'Flag_TechnicalError',
      'Flag_MeaningLoss',
      'Flag_TerminologyError',
      'Flag_ComplexityMismatch',
      'Notes',
      'Date',
    ];

    const rows = reviews.map((r) => {
      const c = db.getEvaluationCaseById(r.caseId);
      return [
        `"${r.id}"`,
        `"${r.caseId}"`,
        `"${c?.subject || ''}"`,
        `"${c?.topic || ''}"`,
        `"${c?.targetLanguage || ''}"`,
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
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        `"${r.createdAt}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Formats evaluation dataset for JSON export
   */
  public static exportEvaluationDataJSON() {
    const cases = db.getEvaluationCases();
    const reviews = db.getEvaluationReviews();
    const metrics = db.computeEvaluationMetrics();

    return {
      exportedAt: new Date().toISOString(),
      platform: 'LinguaLearn Research Evaluation Engine',
      researchQuestion: 'Does context-aware multilingual prompting preserve technical meaning better than direct translation?',
      evaluationCasesCount: cases.length,
      reviewsCount: reviews.length,
      metrics,
      cases,
      reviews,
    };
  }
}
