import { Agent, AgentInput, AgentOutput } from "./types";
import { runFfmpeg, ensureDir } from "@hec/tools";
import * as path from "path";

export const VideoAgent: Agent = {
  name: "video-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const runId = (input.runId as string) || Date.now().toString();
    const relDir = path.join("video", runId);
    await ensureDir(relDir);

    const relOutput = path.join(relDir, "main.mp4");
    const voice = input.voice as { path?: string } | undefined;

    const args: string[] = [];

    if (voice?.path) {
      // Very simple placeholder: black video + audio track
      args.push(
        "-y",
        "-f", "lavfi",
        "-i", "color=c=black:s=1280x720:d=60",
        "-i", path.join(process.env.ASSET_PATH || "/data/assets", voice.path),
        "-shortest",
        "-c:v", "libx264",
        "-c:a", "aac",
        path.join(process.env.ASSET_PATH || "/data/assets", relOutput)
      );
    } else {
      // No audio: just a black 10s video
      args.push(
        "-y",
        "-f", "lavfi",
        "-i", "color=c=black:s=1280x720:d=10",
        "-c:v", "libx264",
        path.join(process.env.ASSET_PATH || "/data/assets", relOutput)
      );
    }

    await runFfmpeg({ args });

    return {
      ...input,
      video: {
        path: relOutput
      }
    };
  }
};
