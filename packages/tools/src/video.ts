import { spawn } from "child_process";
import { createLogger } from "./logging";

const log = createLogger("tools:video");

export interface FfmpegCommandOptions {
  args: string[];
}

export function runFfmpeg(
  options: FfmpegCommandOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", options.args, { stdio: "pipe" });

    ff.stdout.on("data", (data) => {
      log("ffmpeg:stdout", { data: data.toString() });
    });

    ff.stderr.on("data", (data) => {
      log("ffmpeg:stderr", { data: data.toString() });
    });

    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}
