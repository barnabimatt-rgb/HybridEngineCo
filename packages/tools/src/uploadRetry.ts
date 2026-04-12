import { retry } from "./retry";
import { uploadToYouTube, uploadToTikTok } from "./upload";

export async function uploadToYouTubeWithRetry(
  videoPath: string,
  title: string,
  description: string,
  tags?: string[]
) {
  return retry(
    () => uploadToYouTube(videoPath, title, description, tags),
    {
      attempts: 2,
      delayMs: 1000,
      backoffFactor: 2
    }
  );
}

export async function uploadToTikTokWithRetry(
  videoPath: string,
  caption: string
) {
  return retry(
    () => uploadToTikTok(videoPath, caption),
    {
      attempts: 2,
      delayMs: 1000,
      backoffFactor: 2
    }
  );
}
