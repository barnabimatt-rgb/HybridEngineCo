import { Agent, AgentInput, AgentOutput } from "./types";

export const UploadAgent: Agent = {
  name: "upload-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const videoUrl = `https://example.com/video/${Date.now()}`;
    const clipUrls = (input.clips ?? []).map((c: any, i: number) => ({
      index: i,
      url: `https://example.com/clip/${Date.now()}-${i}`
    }));

    return { ...input, upload: { videoUrl, clipUrls } };
  }
};
