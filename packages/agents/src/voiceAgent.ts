import { Agent, AgentInput, AgentOutput } from "./types";

export const VoiceAgent: Agent = {
  name: "voice-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const script = input.script ?? "No script provided.";

    // Placeholder: later this will call TTS tools
    const voicePath = `/tmp/voice-${Date.now()}.mp3`;

    return { ...input, voice: { path: voicePath, script } };
  }
};
