import { Agent, AgentInput, AgentOutput } from "./types";
import { synthesizeSpeech, ensureDir } from "@hec/tools";
import * as path from "path";

export const VoiceAgent: Agent = {
  name: "voice-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const script = (input.script as string) ?? "No script provided.";
    const runId = (input.runId as string) || Date.now().toString();

    const relDir = path.join("voice", runId);
    await ensureDir(relDir);

    const relPath = path.join(relDir, "voice.mp3");

    const voiceFile = await synthesizeSpeech({
      text: script,
      voiceId: (input.voiceId as string | undefined) ?? undefined,
      outputPath: relPath
    });

    return {
      ...input,
      voice: {
        path: voiceFile,
        script
      }
    };
  }
};
