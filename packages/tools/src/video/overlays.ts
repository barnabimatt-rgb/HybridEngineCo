export function buildOverlayFilters(brandColor: string): string[] {
  return [
    // Title card fade-in
    `drawtext=text='Hybrid Engine Co.':fontcolor=${brandColor}:fontsize=64:x=(w-text_w)/2:y=200:alpha='if(lt(t,1),t,1)'`,

    // Watermark bottom-right
    `drawtext=text='@HybridEngineCo':fontcolor=${brandColor}:fontsize=32:x=w-text_w-40:y=h-text_h-40:alpha=0.6`
  ];
}
