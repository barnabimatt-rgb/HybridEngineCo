export interface YouTubeConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  channelId?: string;
}

export const youtubeConfig: YouTubeConfig = {
  clientId: process.env.YT_CLIENT_ID,
  clientSecret: process.env.YT_CLIENT_SECRET,
  refreshToken: process.env.YT_REFRESH_TOKEN,
  channelId: process.env.YT_CHANNEL_ID
};
