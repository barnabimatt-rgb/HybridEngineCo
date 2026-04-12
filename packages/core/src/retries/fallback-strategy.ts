export async function fallback<T>(
  fns: Array<() => Promise<T>>
): Promise<T> {
  let lastError: unknown = null;

  for (const fn of fns) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("All fallbacks failed");
}
