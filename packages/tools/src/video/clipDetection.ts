export interface DetectedClip {
  id: string;
  text: string;
  start: number;
  end: number;
  score: number;
}

export function detectClipsFromScript(
  script: string,
  maxClips = 3
): DetectedClip[] {
  const sentences = script
    .split(/[\.\!\?]\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const clips: DetectedClip[] = [];

  let time = 0;

  for (let i = 0; i < sentences.length; i++) {
    const text = sentences[i];
    const duration = Math.min(6, Math.max(3, Math.floor(text.length / 20)));

    const score =
      text.length * 0.5 +
      (text.includes("how") ? 10 : 0) +
      (text.includes("why") ? 10 : 0) +
      (text.includes("secret") ? 15 : 0);

    clips.push({
      id: `clip_${i}`,
      text,
      start: time,
      end: time + duration,
      score
    });

    time += duration;
  }

  return clips
    .sort((a, b) => b.score - a.score)
    .slice(0, maxClips);
}
