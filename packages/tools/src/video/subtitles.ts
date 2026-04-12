import { writeTextFile } from "../storage";
import * as path from "path";

export async function generateSrtFromScript(
  script: string,
  runId: string
): Promise<string> {
  const lines = script.split("\n").filter(Boolean);

  let srt = "";
  let index = 1;
  let time = 0;

  for (const line of lines) {
    const start = time;
    const end = time + 3;

    const format = (t: number) => {
      const h = String(Math.floor(t / 3600)).padStart(2, "0");
      const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
      const s = String(t % 60).padStart(2, "0");
      return `${h}:${m}:${s},000`;
    };

    srt += `${index}\n${format(start)} --> ${format(end)}\n${line}\n\n`;

    index++;
    time += 3;
  }

  const relPath = path.join("video", runId, "subtitles.srt");
  await writeTextFile(relPath, srt);
  return relPath;
}
