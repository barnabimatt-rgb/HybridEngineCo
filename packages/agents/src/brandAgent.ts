import { Agent, AgentInput, AgentOutput } from "./types";

export const BrandAgent: Agent = {
  name: "brand-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const brand = {
      tone: "friendly",
      style: "educational",
      formatting: "clean"
    };

    return { ...input, brand };
  }
};
