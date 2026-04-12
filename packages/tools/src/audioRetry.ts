import { retry } from "./retry";
import { synthesizeSpeech } from "./audio";

export async function synthesizeSpeechWithRetry(opts: {
  text: string;
  voiceId?: string;
  outputPath: string;
}) {
  return retry(
    () => synthesizeSpeech(opts),
    {
      attempts: 3,
      delayMs: 300,
      backoffFactor: 2
    }
  );
}
