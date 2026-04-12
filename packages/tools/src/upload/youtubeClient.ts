import { createLogger } from "../logging";
import { youtubeConfig } from "@hec/config";
import * as fs from "fs";
import * as path from "path";

const log = createLogger("tools:upload:youtube");

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const YT_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos";

async function getAccessToken(): Promise<string | null> {
  const { clientId, clientSecret, refreshToken } = youtubeConfig;
  if (!clientId || !clientSecret || !refreshToken) {
    log("missing_oauth_env", {});
    return null;
  }

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!res.ok) {
    const body = await res.text();
    log("token_error", { status: res.status, body });
    return null;
  }

  const json = await res.json() as { access_token: string };
  return json.access_token;
}

export interface YouTubeUploadOptions {
  videoRelPath: string;
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: "public" | "unlisted" | "private";
}

export async function uploadVideoToYouTube(
  options: YouTubeUploadOptions
): Promise<{ url: string; id?: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    log("no_access_token_placeholder", { videoRelPath: options.videoRelPath });
    return {
      url: `https://youtube.com/watch?v=placeholder-${Date.now()}`
    };
  }

  const fullVideoPath = path.join(process.env.ASSET_PATH || "/data/assets", options.videoRelPath);
  const stat = await fs.promises.stat(fullVideoPath);
  const fileSize = stat.size;

  const initRes = await fetch(
    `${YT_UPLOAD_URL}?uploadType=resumable&part=snippet,status`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": String(fileSize),
        "X-Upload-Content-Type": "video/mp4"
      },
      body: JSON.stringify({
        snippet: {
          title: options.title,
          description: options.description,
          tags: options.tags || []
        },
        status: {
          privacyStatus: options.privacyStatus || "unlisted"
        }
      })
    }
  );

  if (!initRes.ok) {
    const body = await initRes.text();
    log("init_upload_error", { status: initRes.status, body });
    return {
      url: `https://youtube.com/watch?v=placeholder-${Date.now()}`
    };
  }

  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) {
    log("missing_upload_url", {});
    return {
      url: `https://youtube.com/watch?v=placeholder-${Date.now()}`
    };
  }

  const fileStream = fs.createReadStream(fullVideoPath);

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Length": String(fileSize),
      "Content-Type": "video/mp4"
    },
    body: fileStream as any
  });

  if (!uploadRes.ok) {
    const body = await uploadRes.text();
    log("upload_error", { status: uploadRes.status, body });
    return {
      url: `https://youtube.com/watch?v=placeholder-${Date.now()}`
    };
  }

  const json = await uploadRes.json() as { id?: string };
  const id = json.id;
  const url = id ? `https://youtube.com/watch?v=${id}` : `https://youtube.com/watch?v=placeholder-${Date.now()}`;

  return { url, id };
}
