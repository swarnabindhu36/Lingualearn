import { describe, it, expect } from 'vitest';
import { TerminologyService, detectLanguageFromScript } from './terminology-service';

describe('TerminologyService and Language Detection', () => {
  it('correctly detects Indian languages from Unicode scripts', () => {
    expect(detectLanguageFromScript('సెమాఫోర్')).toBe('Telugu');
    expect(detectLanguageFromScript('सेमाफोर')).toBe('Hindi');
    expect(detectLanguageFromScript('செமஃபோர்')).toBe('Tamil');
    expect(detectLanguageFromScript('ಸೆಮಾಫೋರ್')).toBe('Kannada');
    expect(detectLanguageFromScript('সেমাফোর')).toBe('Bengali');
    expect(detectLanguageFromScript('Semaphore')).toBe(null);
  });

  it('returns canonical technical meaning in the preferred language', async () => {
    const result = await TerminologyService.requestOrLookupTerm('Semaphore', 'Telugu');
    expect(result).toBeDefined();
    expect(result.term).toBeDefined();
    expect(result.term.language).toBe('Telugu');
    expect(result.term.technicalMeaning).toContain('సెమాఫోర్');
    expect(result.term.technicalMeaning).toContain('కౌంటర్');
  });

  it('automatically detects script language if query is in Telugu script', async () => {
    const result = await TerminologyService.requestOrLookupTerm('డెడ్‌లాక్');
    expect(result).toBeDefined();
    expect(result.term.language).toBe('Telugu');
    expect(result.term.technicalMeaning).toContain('డెడ్‌లాక్');
  });

  it('returns canonical technical meaning for B-Tree Indexing in Kannada', async () => {
    const result = await TerminologyService.requestOrLookupTerm('B-Tree Indexing', 'Kannada');
    expect(result).toBeDefined();
    expect(result.term.language).toBe('Kannada');
    expect(result.term.technicalMeaning).toContain('ಸ್ವಯಂ-ಸಮತೋಲಿತ');
  });

  it('returns canonical technical meaning for ACID Properties in Hindi', async () => {
    const result = await TerminologyService.requestOrLookupTerm('ACID Properties', 'Hindi');
    expect(result).toBeDefined();
    expect(result.term.language).toBe('Hindi');
    expect(result.term.technicalMeaning).toContain('ACID');
  });
});
