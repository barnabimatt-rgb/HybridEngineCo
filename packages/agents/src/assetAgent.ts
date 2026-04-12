import { Agent, AgentInput, AgentOutput } from "./types";

export const AssetAgent: Agent = {
  name: "asset-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const assets = {
      broll: [],
      music: [],
      templates: []
    };

    return { ...input, assets };
  }
};
