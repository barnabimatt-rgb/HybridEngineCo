import { Agent, AgentInput, AgentOutput } from "./types";

export const TrendAgent: Agent = {
  name: "trend-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const trends = ["AI Automation", "Hybrid Workflows", "Creator Tools"];

    return { ...input, trends };
  }
};
