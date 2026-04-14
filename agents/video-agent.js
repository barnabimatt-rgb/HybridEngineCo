/**
 * NEXUS AUTOMATION ENGINE — Video Agent
 * Converts content scripts into faceless video production templates.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import * as BrandingAgent from './branding-agent.js';

export async function init() {
  Logger.system('[VIDEO-AGENT] Initialized.');
}

export async function processScripts(contentPieces) {
  log(`Processing ${contentPieces.length} scripts into video templates...`);
  const assets = [];

  for (const piece of contentPieces) {
    if (piece.format === 'short-video-script' || piece.format === 'article') {
      try {
        const asset = await buildVideoTemplate(piece);
        assets.push(asset);
      } catch (err) {
        Logger.error('VIDEO_AGENT', err.message);
        assets.push(buildFallbackTemplate(piece));
      }
    }
  }

  log(`Produced ${assets.length} video templates.`);
  return assets;
}

async function buildVideoTemplate(piece) {
  const prompt = `You are a video production agent for a faceless, minimalist YouTube/TikTok channel called "Nexus Automation Engine".
Convert this content into a production-ready video template.

Title: ${piece.title}
Body: ${piece.body}
Hook: ${piece.hook}

Produce a JSON video template with:
- videoTitle: optimized YouTube title (max 60 chars)
- duration: estimated duration in seconds
- shotList: array of shots [{scene: number, type: "text-overlay|screencast|motion-graphic|b-roll", duration: seconds, content: "...description", overlay: "...text overlay if any"}]
- voiceoverScript: full narration script for text-to-speech
- transitions: array of transition instructions
- musicNote: music style recommendation (no copyrighted tracks)
- thumbnailSpec: {background, headline, subtext, style}
- endScreen: call to action for end screen
- tags: YouTube tags array
- description: YouTube description (500 chars)

Style rules: dark background, no faces, minimal text overlays, geometric visuals, cyan accent color #00F0FF.
Respond as valid JSON only.`;

  const response = await generateCompletion(prompt, 1500);

  try {
    const parsed = JSON.parse(response.trim());
    return {
      id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      contentId: piece.id,
      ...parsed,
      thumbnail: BrandingAgent.getThumbnailSpec(piece.title, piece.trendTopic),
      hashtags: piece.hashtags,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return buildFallbackTemplate(piece);
  }
}

function buildFallbackTemplate(piece) {
  return {
    id: `video-${Date.now()}-fallback`,
    contentId: piece.id,
    videoTitle: piece.title.slice(0, 60),
    duration: 60,
    shotList: [
      { scene: 1, type: 'text-overlay', duration: 5, content: 'Hook screen', overlay: piece.hook },
      { scene: 2, type: 'motion-graphic', duration: 10, content: 'Problem visualization', overlay: '' },
      { scene: 3, type: 'screencast', duration: 30, content: 'Solution walkthrough', overlay: '' },
      { scene: 4, type: 'text-overlay', duration: 10, content: 'Key takeaway', overlay: piece.cta },
      { scene: 5, type: 'text-overlay', duration: 5, content: 'End screen CTA', overlay: 'Follow for daily AI systems' },
    ],
    voiceoverScript: `${piece.hook}\n\n${piece.body}\n\n${piece.cta}`,
    transitions: ['cut', 'fade-to-black', 'slide-right', 'cut', 'fade-in'],
    musicNote: 'Lo-fi electronic, 90 BPM, no vocals, minimal and focused',
    thumbnailSpec: BrandingAgent.getThumbnailSpec(piece.title, piece.trendTopic || ''),
    endScreen: piece.cta,
    tags: piece.hashtags || [],
    description: `${piece.hook}\n\n${piece.cta}\n\n#Automation #AIProductivity #Solopreneur`,
    hashtags: piece.hashtags,
    generatedAt: new Date().toISOString(),
    fallback: true,
  };
}

function log(msg) {
  console.log(`[VIDEO-AGENT] ${msg}`);
}
