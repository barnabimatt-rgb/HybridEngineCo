import { createLogger } from "../logging";
import { writeTextFile } from "../storage";
import * as path from "path";
import { promises as fs } from "fs";

const log = createLogger("tools:tts:openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_TTS_URL =
  process.env.OPENAI_TTS_URL || "https://api.openai.com/v1/audio/speech";

export interface OpenAiTtsOptions {
  text: string;
  voice?: string;
  outputPath: string;
}

export async function openAiTts(
  options: OpenAiTtsOptions
): Promise<string> {
  if (!OPENAI_API_KEY) {
    log("missing_api_key", {});
    const txtPath = options.outputPath.replace(/\.mp3$/, ".txt");
    await writeTextFile(txtPath, options.text);
    return options.outputPath;
  }

  const res = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      input: options.text,
      voice: options.voice || "alloy",
      format: "mp3"
    })
  });

  if (!res.ok) {
    const body = await res.text();
    log("openai_error", { status: res.status, body });
    throw new Error(`OpenAI TTS failed with status ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const fullPath = path.join(process.env.ASSET_PATH || "/data/assets", options.outputPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return options.outputPath;
}
