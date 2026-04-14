/**
 * NEXUS AUTOMATION ENGINE — Automation Scheduler Utilities
 */

import Logger from '../memory/logger.js';

/**
 * Retry a function with exponential backoff.
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelayMs - Base delay in milliseconds
 */
export async function withRetry(fn, maxRetries = 3, baseDelayMs = 1000) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        Logger.warn('RETRY', `Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

/**
 * Rate limiter — ensures a function is not called more than N times per interval.
 */
export function createRateLimiter(maxCalls, intervalMs) {
  const calls = [];
  return async function rateLimited(fn) {
    const now = Date.now();
    // Clean up old calls outside the window
    while (calls.length > 0 && calls[0] < now - intervalMs) {
      calls.shift();
    }
    if (calls.length >= maxCalls) {
      const waitMs = intervalMs - (now - calls[0]);
      await sleep(waitMs);
    }
    calls.push(Date.now());
    return fn();
  };
}

/**
 * Queue processor — processes items sequentially with error isolation.
 */
export async function processQueue(items, processor, { onError = null, concurrency = 1 } = {}) {
  const results = [];
  const errors = [];

  if (concurrency === 1) {
    for (const item of items) {
      try {
        results.push(await processor(item));
      } catch (err) {
        errors.push({ item, error: err.message });
        if (onError) onError(item, err);
      }
    }
  } else {
    // Batch processing for concurrency > 1
    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(batch.map(processor));
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          errors.push({ item: batch[j], error: result.reason?.message });
          if (onError) onError(batch[j], result.reason);
        }
      }
    }
  }

  return { results, errors, total: items.length, success: results.length, failed: errors.length };
}

/**
 * Debounce — prevents a function from being called more than once in a period.
 */
export function debounce(fn, delayMs) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array into batches.
 */
export function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Format a cron expression description for logging.
 */
export function describeCron(expression) {
  const parts = expression.split(' ');
  if (parts.length !== 5) return expression;
  const [min, hour, dom, month, dow] = parts;
  if (min === '0' && dom === '*' && month === '*' && dow === '*') {
    return `Daily at ${hour.padStart(2, '0')}:00 UTC`;
  }
  if (dow !== '*') {
    const days = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
    return `Weekly on ${dow.split(',').map((d) => days[d]).join('/')} at ${hour.padStart(2, '0')}:${min.padStart(2, '0')} UTC`;
  }
  return expression;
}
