import { Agent, AgentInput, AgentOutput } from "./types";

export const ClipAgent: Agent = {
  name: "clip-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const video = input.video as { path?: string } | undefined;
    if (!video?.path) {
      return { ...input, clips: [] };
    }

    // Placeholder: later we’ll actually cut with FFmpeg
    const clips = [
      { path: video.path, start: 0, end: 15 },
      { path: video.path, start: 15, end: 30 }
    ];

    return { ...input, clips };
  }
};
