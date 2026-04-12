import { Agent, AgentInput, AgentOutput } from "./types";
import { brandProfiles } from "@hec/config";

export const BrandAgent: Agent = {
  name: "brand-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const brandId = (input.brandId as string) || "default";
    const profile = brandProfiles[brandId] ?? brandProfiles.default;

    return { ...input, brand: profile };
  }
};
