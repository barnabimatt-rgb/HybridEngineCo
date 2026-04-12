import { createLogger } from "./logging";

const log = createLogger("tools:audio");

export interface TtsOptions {
  text: string;
  voiceId?: string;
  outputPath: string;
}

export async function synthesizeSpeech(
  options: TtsOptions
): Promise<string> {
  // Placeholder: later call ElevenLabs / OpenAI TTS
  log("synthesizeSpeech:placeholder", { text: options.text });
  return options.outputPath;
}
