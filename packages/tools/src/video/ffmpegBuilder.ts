import { videoTemplates } from "./templates";
import { buildOverlayFilters } from "./overlays";
import { buildBrollFilters } from "./broll";

export function buildFfmpegArgs(
  inputAudio: string,
  inputBroll: string | null,
  subtitlesPath: string,
  outputPath: string,
  templateId: string,
  brandColor: string
): string[] {
  const template = videoTemplates.find(t => t.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const filters = [
    ...template.filters,
    ...buildOverlayFilters(brandColor),
    ...buildBrollFilters(),
    `subtitles=${subtitlesPath}:force_style='Fontsize=36,PrimaryColour=&H${brandColor.replace("#","")}&'`
  ];

  const filterComplex = filters.map(f => `[0:v]${f}[vout]`).join(";");

  return [
    "-y",
    "-f", "lavfi",
    "-i", "color=c=black:s=1920x1080:d=60",
    "-i", inputAudio,
    "-filter_complex", filterComplex,
    "-map", "[vout]",
    "-map", "1:a",
    "-c:v", "libx264",
    "-c:a", "aac",
    "-shortest",
    outputPath
  ];
}
