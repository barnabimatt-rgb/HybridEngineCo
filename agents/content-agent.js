/**
 * NEXUS AUTOMATION ENGINE — Content Agent
 * Generates 3–6 content pieces per day aligned with the 5-pillar niche stack.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';
import { format, addDays } from 'date-fns';

const CONTENT_FORMATS = ['short-video-script', 'article', 'twitter-thread', 'linkedin-post', 'newsletter-section'];
const PILLARS = ['AI Productivity', 'Digital Minimalism', 'Automation Lifestyle', 'Solopreneur Efficiency', 'Tech-Optimized Living'];

export async function init() {
  Logger.system('[CONTENT-AGENT] Initialized.');
}

export function generateCalendar() {
  const calendar = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const day = addDays(today, i);
    const pillar = PILLARS[i % PILLARS.length];
    calendar.push({
      date: format(day, 'yyyy-MM-dd'),
      pillar,
      format: CONTENT_FORMATS[i % CONTENT_FORMATS.length],
      status: 'scheduled',
    });
  }
  return calendar;
}

export function updateCalendarFromTrends(topics) {
  const existing = MemoryStore.get('content_calendar') || generateCalendar();
  const today = format(new Date(), 'yyyy-MM-dd');

  return existing.map((entry) => {
    if (entry.date === today && topics.length > 0) {
      const trend = topics[Math.floor(Math.random() * topics.length)];
      return { ...entry, trendTopic: trend.topic, trendAngle: trend.angle };
    }
    return entry;
  });
}

export async function generateContentBatch(trendTopics, brand, count = 4) {
  log(`Generating ${count} content pieces...`);
  const pieces = [];

  for (let i = 0; i < count; i++) {
    const pillar = PILLARS[i % PILLARS.length];
    const format = CONTENT_FORMATS[i % CONTENT_FORMATS.length];
    const trendTopic = trendTopics[i % Math.max(trendTopics.length, 1)]?.topic || 'AI automation tools';

    try {
      const piece = await generateSinglePiece(pillar, format, trendTopic, brand);
      pieces.push(piece);
      log(`✅ Piece ${i + 1}/${count}: ${piece.title}`);
    } catch (err) {
      Logger.error('CONTENT_AGENT_GEN', err.message);
      pieces.push(generateFallbackPiece(pillar, format, trendTopic));
    }
  }

  Logger.log('content', { date: new Date().toISOString(), count: pieces.length, pieces: pieces.map((p) => p.title) });
  return pieces;
}

async function generateSinglePiece(pillar, format, trendTopic, brand) {
  const voiceGuidelines = brand?.tone?.dos?.join(', ') || 'direct, clear, no fluff';

  const prompt = `You are a faceless content creator for "Nexus Automation Engine" — an anonymous AI productivity brand.
Pillar: ${pillar}
Format: ${format}
Trend topic: ${trendTopic}
Voice: ${voiceGuidelines}
Brand tone: minimalist, analytical, no faces, no personal stories.

Generate a complete ${format} piece. Include:
- title (compelling, keyword-rich, max 10 words)
- hook (first 1-2 sentences, attention-grabbing)
- body (full content, formatted for ${format})
- cta (clear call to action)
- hashtags (10 relevant hashtags as array)
- seoKeywords (5 keywords as array)
- thumbnailInstruction (text describing a faceless, minimalist thumbnail)

Respond as valid JSON with keys: title, hook, body, cta, hashtags, seoKeywords, thumbnailInstruction, pillar, format, trendTopic.`;

  const response = await generateCompletion(prompt, 1200);

  try {
    const parsed = JSON.parse(response.trim());
    return {
      id: generateId(),
      ...parsed,
      pillar,
      format,
      trendTopic,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return generateFallbackPiece(pillar, format, trendTopic);
  }
}

function generateFallbackPiece(pillar, format, trendTopic) {
  return {
    id: generateId(),
    title: `${trendTopic}: The Minimal Approach`,
    hook: `Most people overcomplicate ${trendTopic}. Here's what actually works.`,
    body: `## The Problem\n\nPeople spend hours on ${trendTopic} with zero systems.\n\n## The Solution\n\nAutomate the 80% that doesn't need human input. Focus only on the 20% that creates leverage.\n\n## The Framework\n\n1. Identify the repeatable task\n2. Build a one-time automation\n3. Monitor, don't operate\n\n## The Result\n\nLess time. More output. Zero stress.`,
    cta: 'Save this for when you build your automation stack.',
    hashtags: ['#AIProductivity', '#Automation', '#Solopreneur', '#DigitalMinimalism', '#NexusEngine'],
    seoKeywords: [trendTopic, 'automation', 'AI tools', 'solopreneur', 'productivity'],
    thumbnailInstruction: 'Dark background, cyan accent line left, white headline text, geometric grid overlay, no faces',
    pillar,
    format,
    trendTopic,
    generatedAt: new Date().toISOString(),
    fallback: true,
  };
}

function generateId() {
  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function log(msg) {
  console.log(`[CONTENT-AGENT] ${msg}`);
}
