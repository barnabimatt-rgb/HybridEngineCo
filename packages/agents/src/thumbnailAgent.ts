import { Agent, AgentInput, AgentOutput } from "./types";
import { generateThumbnail } from "@hec/tools";

export const ThumbnailAgent: Agent = {
  name: "thumbnail-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const metadata = input.metadata as { title?: string } | undefined;
    const runId = input.runId as string;

    const title = metadata?.title ?? "Hybrid Engine Co.";
    const thumbnails: Record<string, string> = {};

    const formats = ["16x9", "9x16"];

    for (const fmt of formats) {
      const relPath = await generateThumbnail({
        title,
        runId,
        formatId: fmt
      });
      thumbnails[fmt] = relPath;
    }

    return {
      ...input,
      thumbnails
    };
  }
};
