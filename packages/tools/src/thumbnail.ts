import { createLogger } from "./logging";
import { runFfmpeg } from "./video";
import { ensureDir } from "./storage";
import { thumbnailConfig } from "@hec/config";
import * as path from "path";

const log = createLogger("tools:thumbnail");
const BRAND_COLOR = "#8B5CF6";

export interface GenerateThumbnailOptions {
  title: string;
  runId: string;
  formatId: string; // "16x9" | "9x16"
}

export async function generateThumbnail(
  options: GenerateThumbnailOptions
): Promise<string> {
  const fmt = thumbnailConfig.formats.find(f => f.id === options.formatId);
  if (!fmt) throw new Error(`Unknown thumbnail format: ${options.formatId}`);

  const relDir = path.join("thumbnails", options.runId);
  await ensureDir(relDir);

  const relPath = path.join(relDir, `thumb_${fmt.id}.jpg`);
  const fullOut = path.join(process.env.ASSET_PATH || "/data/assets", relPath);

  const bg = thumbnailConfig.backgroundColor;
  const textColor = thumbnailConfig.textColor;

  const args = [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=${bg}:s=${fmt.width}x${fmt.height}:d=1`,
    "-vf",
    `drawbox=x=0:y=${Math.floor(fmt.height * 0.65)}:w=${fmt.width}:h=${Math.floor(
      fmt.height * 0.35
    )}:color=${BRAND_COLOR}@0.8:t=fill,` +
      `drawtext=text='${escapeText(options.title)}':fontcolor=${textColor}:fontsize=72:` +
      `x=(w-text_w)/2:y=(h-text_h)/2`,
    "-frames:v",
    "1",
    fullOut
  ];

  log("generate_thumbnail", { relPath, formatId: options.formatId });
  await runFfmpeg({ args });

  return relPath;
}

function escapeText(text: string): string {
  return text.replace(/:/g, "\\:").replace(/'/g, "\\'");
}
