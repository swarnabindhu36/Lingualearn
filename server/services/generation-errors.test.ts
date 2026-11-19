import { afterEach, describe, expect, it, vi } from 'vitest';
import { EvaluationEngineService } from '../ai/evaluation-engine';
import { TerminologyService } from './terminology-service';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AI generation without Gemini configuration', () => {
  it('reports a configuration error for uncatalogued glossary terms', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    await expect(
      TerminologyService.requestOrLookupTerm('Uncatalogued Quantum Allocator XJ-42', 'English')
    ).rejects.toThrow(/Gemini is not configured/);
  });

  it('does not return fabricated Research Study comparisons', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');

    await expect(
      EvaluationEngineService.generateComparison(
        'How does an allocator work?',
        'English',
        'Telugu',
        'Operating Systems'
      )
    ).rejects.toThrow(/Gemini is not configured/);
  });
});
