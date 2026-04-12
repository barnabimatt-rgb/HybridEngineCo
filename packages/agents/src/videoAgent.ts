import { Agent, AgentInput, AgentOutput } from "./types";

export const VideoAgent: Agent = {
  name: "video-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const videoPath = `/tmp/video-${Date.now()}.mp4`;

    return { ...input, video: { path: videoPath } };
  }
};
