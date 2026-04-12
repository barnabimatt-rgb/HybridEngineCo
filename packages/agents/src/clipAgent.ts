import { Agent, AgentInput, AgentOutput } from "./types";

export const ClipAgent: Agent = {
  name: "clip-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const clips = [
      { path: `/tmp/clip-${Date.now()}-1.mp4`, start: 0, end: 15 },
      { path: `/tmp/clip-${Date.now()}-2.mp4`, start: 15, end: 30 }
    ];

    return { ...input, clips };
  }
};
