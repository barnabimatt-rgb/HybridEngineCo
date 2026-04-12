export interface ThumbnailFormat {
  id: string;
  width: number;
  height: number;
}

export interface ThumbnailConfig {
  formats: ThumbnailFormat[];
  backgroundColor: string;
  textColor: string;
}

export const thumbnailConfig: ThumbnailConfig = {
  formats: [
    { id: "16x9", width: 1920, height: 1080 },
    { id: "9x16", width: 1080, height: 1920 }
  ],
  backgroundColor: "#000000",
  textColor: "#FFFFFF"
};
