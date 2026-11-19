import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  clientOptions: [] as unknown[],
  generateContent: vi.fn(),
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent: mocks.generateContent };

    constructor(options: unknown) {
      mocks.clientOptions.push(options);
    }
  },
}));

import { generateContentWithRetry } from './gemini';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  mocks.clientOptions.length = 0;
});

describe('Gemini request recovery', () => {
  it('disables hidden SDK retries and moves to a fallback after a request timeout', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');
    mocks.generateContent
      .mockRejectedValueOnce(new Error('request timed out'))
      .mockResolvedValueOnce({ text: 'generated response' });

    const result = await generateContentWithRetry({
      model: 'primary-model',
      fallbackModels: ['fallback-model'],
      contents: 'test prompt',
      maxRetries: 0,
    });

    expect(result.modelUsed).toBe('fallback-model');
    expect(result.response.text).toBe('generated response');
    expect(mocks.generateContent.mock.calls.map(([request]) => request.model)).toEqual([
      'primary-model',
      'fallback-model',
    ]);
    expect(mocks.clientOptions[0]).toMatchObject({
      httpOptions: {
        timeout: 60000,
        retryOptions: { attempts: 1 },
      },
    });
  });

  it('retries a temporarily unavailable model once before using the fallback', async () => {
    vi.useFakeTimers();
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');
    const unavailable = Object.assign(
      new Error('This model is currently experiencing high demand.'),
      { status: 503 }
    );
    mocks.generateContent
      .mockRejectedValueOnce(unavailable)
      .mockRejectedValueOnce(unavailable)
      .mockResolvedValueOnce({ text: 'fallback response' });

    const resultPromise = generateContentWithRetry({
      model: 'primary-model',
      fallbackModels: ['fallback-model'],
      contents: 'test prompt',
    });

    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.modelUsed).toBe('fallback-model');
    expect(result.response.text).toBe('fallback response');
    expect(mocks.generateContent.mock.calls.map(([request]) => request.model)).toEqual([
      'primary-model',
      'primary-model',
      'fallback-model',
    ]);
  });
});
