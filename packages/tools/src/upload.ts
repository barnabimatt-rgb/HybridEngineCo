import { createLogger } from "./logging";
import { uploadVideoToYouTube } from "./upload/youtubeClient";

const log = createLogger("tools:upload");

export interface UploadResult {
  platform: string;
  url: string;
  id?: string;
}

export async function uploadToYouTube(
  videoPath: string,
  title: string,
  description: string,
  tags?: string[]
): Promise<UploadResult> {
  const res = await uploadVideoToYouTube({
    videoRelPath: videoPath,
    title,
    description,
    tags
  });

  return {
    platform: "youtube",
    url: res.url,
    id: res.id
  };
}

export async function uploadToTikTok(
  videoPath: string,
  caption: string
): Promise<UploadResult> {
  log("uploadToTikTok:placeholder", { videoPath, caption });
  return {
    platform: "tiktok",
    url: `https://www.tiktok.com/@placeholder/video/${Date.now()}`
  };
}
