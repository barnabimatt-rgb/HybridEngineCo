import { Agent, AgentInput, AgentOutput } from "./types";

export const MetadataAgent: Agent = {
  name: "metadata-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const title = `How to: ${input.topics?.[0] ?? "Something Interesting"}`;
    const description = `This video covers: ${input.script ?? "a topic"}.`;
    const tags = ["education", "ai", "content"];

    return { ...input, metadata: { title, description, tags } };
  }
};
