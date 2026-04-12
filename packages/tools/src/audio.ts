import { createLogger } from "./logging";
import { elevenLabsTts } from "./tts/elevenLabsClient";
import { openAiTts } from "./tts/openaiTtsClient";
import { ttsConfig } from "@hec/config";

const log = createLogger("tools:audio");

export interface TtsOptions {
  text: string;
  voiceId?: string;
  outputPath: string;
}

async function runProvider(
  provider: "elevenlabs" | "openai",
  options: TtsOptions
): Promise<string> {
  if (provider === "elevenlabs") {
    return elevenLabsTts({
      text: options.text,
      voiceId: options.voiceId,
      outputPath: options.outputPath
    });
  }

  return openAiTts({
    text: options.text,
    voice: options.voiceId,
    outputPath: options.outputPath
  });
}

export async function synthesizeSpeech(
  options: TtsOptions
): Promise<string> {
  const primary = ttsConfig.primary;
  const fallback = ttsConfig.fallback;

  try {
    return await runProvider(primary, options);
  } catch (err) {
    log("primary_tts_failed", { provider: primary, error: String(err) });

    if (!fallback) throw err;

    log("trying_fallback_tts", { provider: fallback });
    return runProvider(fallback, options);
  }
}
