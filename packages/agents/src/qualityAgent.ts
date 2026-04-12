import { Agent, AgentInput, AgentOutput } from "./types";

export const QualityAgent: Agent = {
  name: "quality-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const score = Math.floor(Math.random() * 100);

    return { ...input, quality: { score } };
  }
};
