import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth-middleware';
import { Terminology } from '../db/schema';
import { TerminologyService } from '../services/terminology-service';

const router = Router();

// GET /api/terminology
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, subject, language } = req.query;
    const searchStr = search ? String(search).trim() : undefined;
    const langStr =
      language && String(language).toUpperCase() !== 'ALL' ? String(language).trim() : undefined;
    const subjectStr =
      subject && String(subject).toUpperCase() !== 'ALL' ? String(subject).trim() : undefined;

    let list = db.getTerminologyList({
      search: searchStr,
      subject: subjectStr,
      language: langStr,
    });

    // Check if any returned term has English-only technicalMeaning while target language is non-English
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (
        item.language &&
        item.language !== 'English' &&
        !/[\u0900-\u0D7F]/.test(item.technicalMeaning || '')
      ) {
        const canonical = TerminologyService.lookupCanonical(item.englishTerm, item.language);
        if (canonical) {
          const updated = db.updateTerminology(item.id, {
            technicalMeaning: canonical.technicalMeaning,
            technicalMeaningEn: canonical.technicalMeaningEn,
            explanation: canonical.explanation,
            explanationEn: canonical.explanationEn,
            preferredTranslation: canonical.preferredTranslation,
            technicalExample: canonical.technicalExample,
          });
          if (updated) list[i] = updated;
        }
      }
    }

    // If user searched for a specific term and specified a language, and no matches were found in that language:
    if (searchStr && langStr && list.length === 0) {
      try {
        const result = await TerminologyService.requestOrLookupTerm(
          searchStr,
          langStr,
          subjectStr || 'Computer Science'
        );
        if (result && result.term) {
          list = [result.term];
        }
      } catch (err: any) {
        console.warn('Auto lookup in GET /api/terminology failed:', err.message || err);
      }
    }

    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch terminology.' });
  }
});

// POST /api/terminology/request-term
// Provides the technical meaning and practical example of every word asked or requested by the user
router.post('/request-term', async (req: Request, res: Response) => {
  try {
    const { term, language, subject } = req.body;
    if (!term || typeof term !== 'string' || !term.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A valid technical word or term name is required.',
        message: 'A valid technical word or term name is required.',
      });
    }

    const result = await TerminologyService.requestOrLookupTerm(
      term.trim(),
      language || 'Telugu',
      subject || 'Operating Systems'
    );

    return res.json({
      success: true,
      term: result.term,
      isNewlyCreated: result.isNewlyCreated,
      source: result.source,
      message: `Technical meaning and example for "${result.term.englishTerm}" retrieved successfully.`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to process technical term request.',
      message: err.message || 'Failed to process technical term request.',
    });
  }
});

// GET /api/terminology/:id
router.get('/:id', (req: Request, res: Response) => {
  const item = db.getTerminologyById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Terminology term not found.',
      message: 'Terminology term not found.',
    });
  }
  return res.json({
    success: true,
    ...item,
    data: item,
  });
});

const TermSchema = z.object({
  englishTerm: z.string().min(1, 'English term is required'),
  language: z.string().min(1, 'Target language is required'),
  preferredTranslation: z.string().min(1, 'Preferred translation is required'),
  alternativeTranslations: z.array(z.string()).default([]),
  doNotTranslate: z.boolean().default(true),
  subject: z.string().min(1, 'Subject is required'),
  explanation: z.string().min(1, 'Explanation is required'),
  explanationEn: z.string().optional(),
  technicalMeaning: z.string().optional(),
  technicalMeaningEn: z.string().optional(),
  technicalExample: z.string().optional(),
});

// POST /api/terminology (Admin/Researcher only)
router.post('/', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = TermSchema.parse(req.body);
    const newTerm: Terminology = {
      id: 'term_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.createTerminology(newTerm);
    return res.status(201).json({
      success: true,
      ...newTerm,
      data: newTerm,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.errors?.[0]?.message || err.message,
      message: err.errors?.[0]?.message || err.message,
    });
  }
});

// PUT /api/terminology/:id (Admin/Researcher only)
router.put('/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.getTerminologyById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: 'Terminology term not found.',
      message: 'Terminology term not found.',
    });
  }

  const updated = db.updateTerminology(req.params.id, req.body);
  return res.json({
    success: true,
    ...updated,
    data: updated,
  });
});

// DELETE /api/terminology/:id (Admin/Researcher only)
router.delete('/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteTerminology(req.params.id);
  if (!success) {
    return res.status(404).json({
      success: false,
      error: 'Terminology term not found.',
      message: 'Terminology term not found.',
    });
  }
  return res.json({
    success: true,
    message: 'Terminology deleted successfully.',
    data: { id: req.params.id },
  });
});

export default router;
