/**
 * NEXUS AUTOMATION ENGINE — Fallback Agent
 * Provides simplified outputs when pipelines fail.
 */

import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const FALLBACK_TEMPLATES = {
  trend: {
    topics: [
      { topic: 'AI automation for solopreneurs', angle: 'productivity', urgency: 'high' },
      { topic: 'No-code workflow tools', angle: 'tools', urgency: 'medium' },
      { topic: 'Digital minimalism 2025', angle: 'lifestyle', urgency: 'medium' },
    ],
    keywords: [{ word: 'automation', count: 10 }, { word: 'ai productivity', count: 8 }],
    contentIdeas: [
      { title: '5 AI Tools That Replace 3 Employees', hook: 'You don\'t need a team. You need the right stack.', format: 'short-video-script', angle: 'productivity' },
      { title: 'The Minimal Tech Stack for Solo Operators', hook: 'Less tools. More output. Here\'s mine.', format: 'article', angle: 'minimalism' },
    ],
    date: new Date().toISOString(),
    fallback: true,
  },
  content: {
    pieces: [
      {
        id: 'fallback-content-1',
        title: 'The 3-Tool Automation Stack for Solopreneurs',
        hook: 'Most solopreneurs use 15 tools. You need 3.',
        body: '## The Problem\n\nTool overload kills productivity.\n\n## The Solution\n\n1. Automation layer (Zapier/Make)\n2. AI layer (OpenAI API)\n3. Output layer (Notion/Airtable)\n\n## The Result\n\n80% of your repeatable work — automated.',
        cta: 'Save this. Build it this weekend.',
        format: 'short-video-script',
        pillar: 'Automation Lifestyle',
        fallback: true,
      },
    ],
    fallback: true,
  },
  video: [
    {
      id: 'fallback-video-1',
      videoTitle: 'The 3-Tool Automation Stack for Solopreneurs',
      duration: 60,
      fallback: true,
    },
  ],
  product: {
    id: 'fallback-product-1',
    name: 'Solopreneur Automation Starter Kit',
    tagline: 'Your first automation system. Done in a weekend.',
    price: '$17',
    fallback: true,
  },
  saas: {
    id: 'fallback-saas-1',
    name: 'NexusFlow',
    tagline: 'Automation dashboard for solopreneurs.',
    fallback: true,
  },
  seo: {
    date: new Date().toISOString(),
    keywordsResearched: 0,
    articlesGenerated: 0,
    fallback: true,
    message: 'SEO pipeline fallback. Using cached data.',
  },
  monetization: {
    date: new Date().toISOString(),
    affiliatePrograms: [],
    fallback: true,
    message: 'Monetization pipeline fallback. Using cached strategy.',
  },
  branding: {
    name: 'Nexus Automation Engine',
    accentColor: '#00F0FF',
    fallback: true,
  },
  deployment: {
    status: 'skipped',
    reason: 'fallback',
    fallback: true,
  },
};

export async function init() {
  Logger.system('[FALLBACK-AGENT] Initialized.');
}

export function fallback(pipelineName, error) {
  const template = FALLBACK_TEMPLATES[pipelineName] || { fallback: true, message: `No fallback for: ${pipelineName}` };

  const result = {
    ...template,
    pipeline: pipelineName,
    fallbackTriggeredAt: new Date().toISOString(),
    originalError: error?.message || String(error),
  };

  log(`Fallback triggered for pipeline: ${pipelineName}`);
  Logger.log('system', { event: 'fallback', pipeline: pipelineName, error: error?.message });

  // Cache the last known good output
  const cachedKey = `fallback_cache_${pipelineName}`;
  const cached = MemoryStore.get(cachedKey);
  if (cached) {
    return { ...cached, fallback: true, fromCache: true };
  }

  return result;
}

export function cachePipelineOutput(pipelineName, output) {
  MemoryStore.set(`fallback_cache_${pipelineName}`, output);
}

function log(msg) {
  console.log(`[FALLBACK-AGENT] ${msg}`);
}
