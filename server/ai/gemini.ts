import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface GenerateWithRetryOptions {
  model?: string;
  contents: any;
  config?: any;
  fallbackModels?: string[];
  maxRetries?: number;
}

export interface GenerateWithRetryResult {
  response: GenerateContentResponse;
  modelUsed: string;
}

/**
 * Executes generateContent with exponential backoff and fallback models
 * to seamlessly recover from transient 503 ("high demand"), 429 ("rate limits"),
 * or UNAVAILABLE conditions.
 */
export async function generateContentWithRetry(
  options: GenerateWithRetryOptions
): Promise<GenerateWithRetryResult> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('Gemini API key is not configured');
  }

  const primaryModel = options.model || 'gemini-3.8-flash';
  const defaultFallbacks = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];
  const modelsToTry = [
    primaryModel,
    ...(options.fallbackModels || defaultFallbacks),
    ...defaultFallbacks,
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError: any = null;

  for (const model of modelsToTry) {
    const attempts = 2;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });

        if (response && (response.text?.trim() || response.candidates?.length)) {
          return { response, modelUsed: model };
        }
        lastError = new Error(`Gemini model ${model} returned an empty response`);
      } catch (err: any) {
        lastError = err;
        const errMsg = (err.message || '').toLowerCase();
        const errStatus = err.status || err.code;

        const isQuotaOrRateLimit =
          errStatus === 429 ||
          errStatus === 'RESOURCE_EXHAUSTED' ||
          errMsg.includes('resource_exhausted') ||
          errMsg.includes('quota') ||
          errMsg.includes('rate limit') ||
          errMsg.includes('rate-limit') ||
          errMsg.includes('exceeded your current quota');

        if (isQuotaOrRateLimit) {
          console.warn(
            `[Gemini] Model ${model} reached quota or rate limit (${err.message}). Immediately trying next fallback model...`
          );
          // Do not retry the exact same model when quota is exhausted; try next candidate model immediately
          break;
        }

        const isTransient =
          errStatus === 503 ||
          errStatus === 500 ||
          errStatus === 'UNAVAILABLE' ||
          errMsg.includes('high demand') ||
          errMsg.includes('overloaded') ||
          errMsg.includes('unavailable') ||
          errMsg.includes('spikes in demand') ||
          errMsg.includes('temporary') ||
          errMsg.includes('try again later');

        if (isTransient) {
          console.warn(
            `[Gemini] Model ${model} (attempt ${attempt + 1}/${attempts}) returned transient issue: ${err.message}. Retrying with backoff...`
          );
          const backoffDelay = 400 * (attempt + 1) + Math.floor(Math.random() * 200);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        } else {
          console.warn(`[Gemini] Model ${model} returned non-transient error: ${err.message}. Trying next fallback model...`);
          break; // break retry loop to try the next model
        }
      }
    }
  }

  throw lastError || new Error('All candidate models failed to generate content');
}

/**
 * Safely parses JSON returned by an LLM, stripping markdown wrappers if present.
 */
export function safeParseJson<T = any>(rawText: string, fallback: T): T {
  if (!rawText) return fallback;
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const starts = [cleaned.indexOf('{'), cleaned.indexOf('[')].filter((index) => index >= 0);
    const start = starts.length ? Math.min(...starts) : -1;
    if (start >= 0) {
      const open = cleaned[start];
      const close = open === '{' ? '}' : ']';
      const end = cleaned.lastIndexOf(close);
      if (end < start) return fallback;
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}
