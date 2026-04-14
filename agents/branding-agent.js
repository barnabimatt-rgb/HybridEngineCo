/**
 * NEXUS AUTOMATION ENGINE — Branding Agent
 * Maintains brand identity, visual style, and asset templates.
 */

import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const BRAND_IDENTITY = {
  name: 'Nexus Automation Engine',
  tagline: 'Build. Automate. Scale. Silently.',
  personality: ['minimalist', 'efficient', 'analytical', 'calm', 'precise', 'anonymous', 'tech-forward'],
  voice: 'Clear, direct, no fluff, systematic, insightful',
  pillars: [
    'AI Productivity',
    'Digital Minimalism',
    'Automation Lifestyle',
    'Solopreneur Efficiency',
    'Tech-Optimized Living',
  ],
  visual: {
    base: 'monochrome',
    accentColor: process.env.BRAND_ACCENT_COLOR || '#00F0FF',
    secondaryColor: '#1A1A2E',
    backgroundColor: '#0D0D0D',
    textColor: '#E8E8E8',
    font: {
      heading: 'Space Grotesk',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    shapes: 'geometric',
    style: 'minimalist UI, no faces, clean lines',
  },
  assets: {
    logo: generateLogoSpec(),
    thumbnailTemplate: generateThumbnailTemplate(),
    videoTemplate: generateVideoTemplate(),
    productTemplate: generateProductTemplate(),
    uiComponents: generateUIComponents(),
  },
  typography: {
    h1: { size: '48px', weight: '700', letterSpacing: '-0.02em' },
    h2: { size: '32px', weight: '600', letterSpacing: '-0.01em' },
    body: { size: '16px', weight: '400', lineHeight: '1.6' },
    caption: { size: '12px', weight: '400', letterSpacing: '0.05em' },
  },
  tone: {
    dos: [
      'Use short, punchy sentences',
      'Lead with value',
      'Use data and specifics',
      'Be direct and confident',
    ],
    donts: [
      'No fluff or filler',
      'No personal opinions',
      'No faces or identifiable people',
      'No hype language',
    ],
  },
};

export async function init() {
  Logger.system('[BRANDING-AGENT] Initialized.');
}

export async function generateBrandIdentity() {
  log('Generating initial brand identity...');
  const identity = { ...BRAND_IDENTITY, generatedAt: new Date().toISOString() };
  Logger.log('branding', { action: 'generate', identity });
  return identity;
}

export async function refreshBrandIdentity() {
  log('Refreshing brand identity...');
  const existing = MemoryStore.get('brand_identity') || BRAND_IDENTITY;
  const refreshed = {
    ...existing,
    visual: {
      ...existing.visual,
      accentColor: process.env.BRAND_ACCENT_COLOR || existing.visual.accentColor,
    },
    refreshedAt: new Date().toISOString(),
  };
  Logger.log('branding', { action: 'refresh', refreshed });
  return refreshed;
}

export function getThumbnailSpec(title, topic) {
  const brand = MemoryStore.get('brand_identity') || BRAND_IDENTITY;
  return {
    dimensions: '1280x720',
    background: brand.visual.backgroundColor,
    accent: brand.visual.accentColor,
    text: {
      headline: title.toUpperCase(),
      subline: topic,
      font: brand.visual.font.heading,
    },
    layout: 'split-left-bar-accent',
    elements: ['geometric-grid-overlay', 'accent-line-left', 'minimal-icon'],
    noFaces: true,
    style: 'dark-minimalist-tech',
  };
}

function generateLogoSpec() {
  return {
    primary: {
      type: 'wordmark',
      text: 'NEXUS',
      subtext: 'AUTOMATION ENGINE',
      icon: 'hexagon-node-grid',
      colors: { primary: '#00F0FF', background: '#0D0D0D' },
      format: ['SVG', 'PNG-512', 'PNG-256', 'favicon-32'],
    },
    variations: ['dark-bg', 'light-bg', 'monochrome', 'icon-only'],
    clearSpace: '1x icon height on all sides',
  };
}

function generateThumbnailTemplate() {
  return {
    youtube: { width: 1280, height: 720, safe_zone: '960x540' },
    shorts: { width: 1080, height: 1920 },
    twitter: { width: 1200, height: 675 },
    layout: 'dark-bg + accent-bar-left + title-right + minimal-geometric-overlay',
    textRules: 'max 6 words, all caps heading, no faces',
  };
}

function generateVideoTemplate() {
  return {
    style: 'screencast + text overlay + minimal motion graphics',
    palette: ['#0D0D0D', '#1A1A2E', '#00F0FF', '#E8E8E8'],
    transitions: 'cut, fade-to-black, slide-right',
    fonts: { heading: 'Space Grotesk Bold', body: 'Inter Regular' },
    noFaces: true,
    pacing: 'fast-cut, 2-4s per scene',
    music: 'lo-fi electronic, 85-95 BPM, no lyrics',
    captions: 'auto-generated, styled in accent color',
  };
}

function generateProductTemplate() {
  return {
    cover: { width: 1600, height: 900, style: 'dark-minimal-mockup' },
    previewPages: 3,
    format: ['PDF', 'Notion', 'Markdown'],
    branding: 'footer watermark: nexus-automation-engine.com',
  };
}

function generateUIComponents() {
  return {
    button: { bg: '#00F0FF', text: '#0D0D0D', radius: '4px', font: 'Space Grotesk 600' },
    card: { bg: '#1A1A2E', border: '1px solid #00F0FF20', radius: '8px' },
    input: { bg: '#0D0D0D', border: '1px solid #00F0FF40', text: '#E8E8E8' },
    badge: { bg: '#00F0FF', text: '#0D0D0D', fontSize: '11px' },
    nav: { bg: '#0D0D0D', borderBottom: '1px solid #00F0FF20' },
  };
}

function log(msg) {
  console.log(`[BRANDING-AGENT] ${msg}`);
}
