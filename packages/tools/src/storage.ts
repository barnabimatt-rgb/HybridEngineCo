import { promises as fs } from "fs";
import * as path from "path";

const ASSET_ROOT = process.env.ASSET_PATH || "/data/assets";

export async function ensureDir(relPath: string): Promise<string> {
  const full = path.join(ASSET_ROOT, relPath);
  await fs.mkdir(full, { recursive: true });
  return full;
}

export async function writeTextFile(
  relPath: string,
  content: string
): Promise<string> {
  const full = path.join(ASSET_ROOT, relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf-8");
  return full;
}
