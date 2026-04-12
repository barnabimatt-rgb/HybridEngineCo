import { Agent, AgentInput, AgentOutput } from "./types";

export const RetryAgent: Agent = {
  name: "retry-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    return { ...input, retry: { attempts: 0, status: "ok" } };
  }
};
