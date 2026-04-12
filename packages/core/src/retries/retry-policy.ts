export interface RetryOptions {
  retries: number;
  delayMs: number;
  backoffFactor: number;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let attempt = 0;
  let delay = options.delayMs;

  while (attempt <= options.retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === options.retries) throw err;

      await new Promise((res) => setTimeout(res, delay));
      delay *= options.backoffFactor;
      attempt++;
    }
  }

  throw new Error("Retry failed unexpectedly");
}
