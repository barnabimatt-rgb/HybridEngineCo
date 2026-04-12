export type TtsProvider = "elevenlabs" | "openai";

export interface TtsConfig {
  primary: TtsProvider;
  fallback?: TtsProvider;
  voiceId?: string;
}

export const ttsConfig: TtsConfig = {
  primary: "elevenlabs",
  fallback: "openai",
  voiceId: process.env.TTS_VOICE_ID
};
