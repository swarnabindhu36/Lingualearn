import { describe, expect, it } from 'vitest';
import { buildQueryString } from './api';

describe('API query parameters', () => {
  it('omits unset filters instead of sending the string "undefined"', () => {
    expect(
      buildQueryString({
        subject: undefined,
        targetLanguage: undefined,
        search: undefined,
        language: 'Telugu',
      })
    ).toBe('language=Telugu');
  });

  it('preserves explicit false values and encodes filter values', () => {
    expect(buildQueryString({ enabledOnly: false, search: 'B-Tree Indexing' })).toBe(
      'enabledOnly=false&search=B-Tree+Indexing'
    );
  });
});
