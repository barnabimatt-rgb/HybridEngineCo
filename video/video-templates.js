/**
 * NEXUS AUTOMATION ENGINE — Video Production Templates
 * Shot lists, overlay frameworks, voiceover patterns for faceless video.
 */

export const VIDEO_FORMATS = {
  'youtube-long': {
    duration: '8-12 minutes',
    structure: [
      { segment: 'hook', duration: '0-30s', type: 'text-overlay + motion-graphic' },
      { segment: 'intro-promise', duration: '30s-2m', type: 'screencast + voiceover' },
      { segment: 'main-content', duration: '2m-10m', type: 'screencast + text-overlay + b-roll' },
      { segment: 'recap', duration: '10m-11m', type: 'text-overlay + bullet list' },
      { segment: 'cta', duration: '11m-12m', type: 'end-screen' },
    ],
  },
  'youtube-short': {
    duration: '45-60 seconds',
    structure: [
      { segment: 'hook', duration: '0-3s', type: 'bold-text-overlay' },
      { segment: 'problem', duration: '3-10s', type: 'text + motion' },
      { segment: 'solution', duration: '10-45s', type: 'screencast + text' },
      { segment: 'cta', duration: '45-60s', type: 'text-overlay' },
    ],
  },
  'tiktok': {
    duration: '30-60 seconds',
    structure: [
      { segment: 'hook', duration: '0-2s', type: 'bold-text + sound-effect' },
      { segment: 'content', duration: '2-50s', type: 'fast-cut-screencast' },
      { segment: 'cta', duration: '50-60s', type: 'text-overlay' },
    ],
  },
};

export const SHOT_TYPES = {
  'text-overlay': 'Static or animated text on dark background. Minimal. Max 8 words.',
  'screencast': 'Screen recording of tool/dashboard. Clean desktop. No personal info visible.',
  'motion-graphic': 'Animated icons, data visualizations, geometric transitions.',
  'b-roll': 'Abstract tech footage: code scrolling, data streams, minimalist environments.',
  'end-screen': 'Brand logo + subscribe prompt + recommended video thumbnail.',
};

export const OVERLAY_STYLES = {
  headline: {
    font: 'Space Grotesk Bold',
    size: '64-80px',
    color: '#FFFFFF',
    background: 'none or #0D0D0D80',
    position: 'center or left-third',
  },
  caption: {
    font: 'Inter Regular',
    size: '24px',
    color: '#00F0FF',
    background: '#0D0D0D90',
    position: 'bottom-center',
  },
  bullet: {
    font: 'Inter SemiBold',
    size: '28px',
    color: '#E8E8E8',
    animatedIn: 'slide-right 0.3s',
    bulletIcon: '→',
  },
};

export const VOICEOVER_GUIDELINES = {
  voice: 'AI text-to-speech (ElevenLabs, Murf, or similar)',
  tone: 'Calm, authoritative, slightly fast paced',
  wpm: '160-180 words per minute',
  pauses: 'Short pause between sections (0.5s), longer between major points (1s)',
  fillerWords: 'None — clean script only',
  scriptFormat: 'Write for speech, not reading. Short sentences. Active voice.',
};

export const MUSIC_GUIDELINES = {
  style: 'Lo-fi electronic, minimal ambient, or dark synth',
  bpm: '80-100 BPM',
  volume: 'Background only — 15-20% of voiceover level',
  sources: ['Epidemic Sound', 'Artlist', 'YouTube Audio Library'],
  noCopyright: true,
  noVocals: true,
};

export const THUMBNAIL_PRODUCTION_RULES = {
  dimensions: { youtube: '1280x720', shorts: '1080x1920' },
  safeZone: '960x540 (center)',
  textMax: '6 words',
  textSize: 'Min 60px for readability on mobile',
  noFaces: true,
  contrastRatio: 'Min 4.5:1 (WCAG AA)',
  elements: [
    'Dark background (#0D0D0D or #1A1A2E)',
    'Accent color element (#00F0FF)',
    'Bold headline text',
    'Optional: geometric shape or abstract icon',
    'Brand watermark (bottom right, small)',
  ],
  textureOverlays: ['noise-grain-subtle', 'grid-dots', 'diagonal-lines'],
};
