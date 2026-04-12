import { Agent, AgentInput, AgentOutput } from "./types";
import { BrandStyleSkill, ScriptExpansionSkill } from "@hec/skills";

export const ScriptAgent: Agent = {
  name: "script-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const topic = input.topics?.[0] ?? "Untitled Topic";

    let script = `
This video breaks down: ${topic}.

We'll walk through the key steps in a clear, no-fluff way.
`.trim();

    script = await ScriptExpansionSkill.apply(script);
    script = await BrandStyleSkill.apply(script, {
      tone: input.brand?.tone ?? "friendly",
      style: input.brand?.style ?? "educational"
    });

    return { ...input, script };
  }
};
