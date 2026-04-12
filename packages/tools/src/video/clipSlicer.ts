import { runFfmpeg } from "../video";
import * as path from "path";
import { ensureDir } from "../storage";

export async function sliceClip(
  inputVideo: string,
  start: number,
  end: number,
  outputRelPath: string
): Promise<string> {
  const fullOut = path.join(process.env.ASSET_PATH!, outputRelPath);
  await ensureDir(path.dirname(outputRelPath));

  const args = [
    "-y",
    "-i", inputVideo,
    "-ss", String(start),
    "-to", String(end),
    "-c:v", "libx264",
    "-c:a", "aac",
    fullOut
  ];

  await runFfmpeg({ args });
  return outputRelPath;
}
