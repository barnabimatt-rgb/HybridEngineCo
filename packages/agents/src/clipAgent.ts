import { Agent, AgentInput, AgentOutput } from "./types";
import { detectClipsFromScript } from "@hec/tools/src/video/clipDetection";
import { sliceClip } from "@hec/tools/src/video/clipSlicer";
import { clipConfig } from "@hec/config";
import * as path from "path";

export const ClipAgent: Agent = {
  name: "clip-agent",
  async run(input: AgentInput): Promise<AgentOutput> {
    const script = input.script as string;
    const video = input.video as Record<string, string>;
    const runId = input.runId as string;

    if (!video?.["16x9"]) {
      return { ...input, clips: [] };
    }

    const fullVideoPath = path.join(process.env.ASSET_PATH!, video["16x9"]);

    const detected = detectClipsFromScript(script, clipConfig.maxClips);

    const clips = [];

    for (const clip of detected) {
      const relOut = path.join("video", runId, "clips", `${clip.id}.mp4`);

      const sliced = await sliceClip(
        fullVideoPath,
        clip.start,
        clip.end,
        relOut
      );

      clips.push({
        id: clip.id,
        text: clip.text,
        start: clip.start,
        end: clip.end,
        score: clip.score,
        path: sliced
      });
    }

    return {
      ...input,
      clips
    };
  }
};
