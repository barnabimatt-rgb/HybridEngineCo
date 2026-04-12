import { Agent, AgentInput, AgentOutput } from "./types";
import { ensureDir } from "@hec/tools";
import { buildFfmpegArgs } from "@hec/tools/src/video/ffmpegBuilder";
import { generateSrtFromScript } from "@hec/tools/src/video/subtitles";
import { runFfmpegWithRetry } from "@hec/tools/src/video/ffmpegRetry";
import * as path from "path";

const BRAND_COLOR = "#8B5CF6";

export const VideoAgent: Agent = {
  name: "video-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const runId = input.runId as string;
    const script = input.script as string;
    const voice = input.voice as { path: string };

    const relDir = path.join("video", runId);
    await ensureDir(relDir);

    const subtitles = await generateSrtFromScript(script, runId);

    const formats = ["9x16", "16x9", "1x1", "4x5"];
    const outputs: Record<string, string> = {};

    for (const fmt of formats) {
      const relOut = path.join(relDir, `main_${fmt}.mp4`);
      const fullOut = path.join(process.env.ASSET_PATH!, relOut);

      const args = buildFfmpegArgs(
        path.join(process.env.ASSET_PATH!, voice.path),
        null,
        path.join(process.env.ASSET_PATH!, subtitles),
        fullOut,
        fmt,
        BRAND_COLOR
      );

      await runFfmpegWithRetry(args);
      outputs[fmt] = relOut;
    }

    return {
      ...input,
      video: outputs
    };
  }
};
