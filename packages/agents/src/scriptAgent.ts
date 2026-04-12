import { Agent, AgentInput, AgentOutput } from "./types";

export const ScriptAgent: Agent = {
  name: "script-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const topic = input.topics?.[0] ?? "Untitled Topic";

    const script = `
      This is a placeholder script for: ${topic}.
      Later, this will call LLMs + skills + templates.
    `.trim();

    return { ...input, script };
  }
};
