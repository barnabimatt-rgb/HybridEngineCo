import { retry } from "../retry";
import { runFfmpeg } from "./index";

export async function runFfmpegWithRetry(args: string[]) {
  return retry(
    () => runFfmpeg({ args }),
    {
      attempts: 3,
      delayMs: 500,
      backoffFactor: 2
    }
  );
}
