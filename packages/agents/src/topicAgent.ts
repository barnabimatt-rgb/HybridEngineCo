import { Agent, AgentInput, AgentOutput } from "./types";

export const TopicAgent: Agent = {
  name: "topic-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const topics = ["Example Topic 1", "Example Topic 2"];
    return { ...input, topics };
  }
};
