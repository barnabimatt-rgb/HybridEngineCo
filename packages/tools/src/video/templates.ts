export interface VideoTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  filters: string[];
}

export const videoTemplates: VideoTemplate[] = [
  {
    id: "9x16",
    name: "Vertical 9:16",
    width: 1080,
    height: 1920,
    filters: [
      "scale=1080:1920:force_original_aspect_ratio=decrease",
      "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black"
    ]
  },
  {
    id: "16x9",
    name: "Horizontal 16:9",
    width: 1920,
    height: 1080,
    filters: [
      "scale=1920:1080:force_original_aspect_ratio=decrease",
      "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"
    ]
  },
  {
    id: "1x1",
    name: "Square 1:1",
    width: 1080,
    height: 1080,
    filters: [
      "scale=1080:1080:force_original_aspect_ratio=decrease",
      "pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black"
    ]
  },
  {
    id: "4x5",
    name: "Portrait 4:5",
    width: 1080,
    height: 1350,
    filters: [
      "scale=1080:1350:force_original_aspect_ratio=decrease",
      "pad=1080:1350:(ow-iw)/2:(oh-ih)/2:black"
    ]
  }
];
