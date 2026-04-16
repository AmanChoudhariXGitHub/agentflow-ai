export class AppError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = 'AppError';
    this.status = options?.status;
    this.code = options?.code;
  }
}

/**
 * Wrap an async function with retry and exponential backoff.
 * Designed for freemium API limits (e.g., 15 RPM for Gemini).
 */
export async function withRetry<T>(fn: () => Promise<T>, options?: {
  retries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}): Promise<T> {
  const retries = options?.retries ?? 3;
  const initialDelay = options?.initialDelayMs ?? 500;
  const maxDelay = options?.maxDelayMs ?? 5000;

  let attempt = 0;
  let delay = initialDelay;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt += 1;
      const status = err?.status ?? err?.response?.status;
      // Retry only on transient errors and rate limits
      const isRateLimit = status === 429 || /rate limit/i.test(err?.message ?? '');
      const isTransient = status && status >= 500;
      if (attempt > retries || !(isRateLimit || isTransient)) {
        throw err;
      }
      options?.onRetry?.(attempt, err);
      await new Promise((r) => setTimeout(r, Math.min(delay, maxDelay)));
      delay = Math.min(delay * 2, maxDelay);
    }
  }
}

/**
 * Simple in-memory token bucket for RPM rate limiting in a single instance.
 * Not suitable for multi-instance prod, but fine for this workshop and Stackblitz.
 */
export function createRateLimiter(tokensPerMinute: number) {
  let tokens = tokensPerMinute;
  let lastRefill = Date.now();

  function refill() {
    const now = Date.now();
    const minutes = (now - lastRefill) / 60000;
    const refillAmount = Math.floor(minutes * tokensPerMinute);
    if (refillAmount > 0) {
      tokens = Math.min(tokensPerMinute, tokens + refillAmount);
      lastRefill = now;
    }
  }

  return {
    async removeToken(): Promise<void> {
      refill();
      if (tokens > 0) {
        tokens -= 1;
        return;
      }
      // Wait until next token is available
      const waitMs = 60000 / tokensPerMinute;
      await new Promise((r) => setTimeout(r, waitMs));
      return this.removeToken();
    },
  };
}


