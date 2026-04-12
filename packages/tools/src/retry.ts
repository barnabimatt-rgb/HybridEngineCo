import { createLogger } from "./logging";
import { HECError } from "./errors";

const log = createLogger("tools:retry");

export interface RetryOptions {
  attempts: number;
  delayMs: number;
  backoffFactor?: number;
}

export async function retry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions
): Promise<T> {
  let attempt = 0;
  let delay = opts.delayMs;

  while (attempt < opts.attempts) {
    try {
      return await fn();
    } catch (err) {
      attempt++;

      log("retry_failed", {
        attempt,
        attempts: opts.attempts,
        error: String(err)
      });

      if (attempt >= opts.attempts) {
        throw new HECError(
          "RETRY_EXHAUSTED",
          `Operation failed after ${opts.attempts} attempts`,
          { error: String(err) }
        );
      }

      await new Promise(res => setTimeout(res, delay));
      delay *= opts.backoffFactor ?? 1;
    }
  }

  throw new HECError("RETRY_LOGIC_ERROR", "Retry loop exited unexpectedly");
}
