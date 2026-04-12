import { createLogger } from "../logging";
import { writeTextFile } from "../storage";
import * as path from "path";
import { promises as fs } from "fs";

const log = createLogger("tools:tts:elevenlabs");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL =
  process.env.ELEVENLABS_BASE_URL || "https://api.elevenlabs.io/v1";

export interface ElevenLabsTtsOptions {
  text: string;
  voiceId?: string;
  outputPath: string;
}

export async function elevenLabsTts(
  options: ElevenLabsTtsOptions
): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    log("missing_api_key", {});
    // placeholder: just write text file so pipeline still works
    const txtPath = options.outputPath.replace(/\.mp3$/, ".txt");
    await writeTextFile(txtPath, options.text);
    return options.outputPath;
  }

  const voiceId = options.voiceId || "default";
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: options.text,
      model_id: "eleven_monolingual_v1"
    })
  });

  if (!res.ok) {
    const body = await res.text();
    log("elevenlabs_error", { status: res.status, body });
    throw new Error(`ElevenLabs TTS failed with status ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const fullPath = path.join(process.env.ASSET_PATH || "/data/assets", options.outputPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return options.outputPath;
}
