/**
 * NEXUS AUTOMATION ENGINE — Product Agent
 * Generates 1–2 digital products per week: guides, templates, toolkits.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';
import { format, addDays } from 'date-fns';

const PRODUCT_TYPES = [
  'notion-template',
  'automation-guide',
  'swipe-file',
  'prompt-library',
  'tool-stack-guide',
  'checklist-bundle',
  'mini-course-outline',
  'spreadsheet-system',
];

const PRICE_TIERS = ['$7', '$12', '$17', '$27', '$37', '$47'];

export async function init() {
  Logger.system('[PRODUCT-AGENT] Initialized.');
}

export function generateRoadmap() {
  const roadmap = [];
  const today = new Date();
  for (let i = 0; i < 8; i++) {
    const releaseDate = addDays(today, i * 7 + 3);
    roadmap.push({
      week: i + 1,
      releaseDate: format(releaseDate, 'yyyy-MM-dd'),
      type: PRODUCT_TYPES[i % PRODUCT_TYPES.length],
      status: 'planned',
    });
  }
  return roadmap;
}

export function updateRoadmapFromTrends(topics) {
  const roadmap = MemoryStore.get('product_roadmap') || generateRoadmap();
  if (!topics.length) return roadmap;

  return roadmap.map((item, index) => {
    if (item.status === 'planned' && topics[index % topics.length]) {
      return { ...item, trendTopic: topics[index % topics.length].topic };
    }
    return item;
  });
}

export async function generateProduct(trendTopics, brand) {
  log('Generating digital product...');
  const type = PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)];
  const topic = trendTopics[0]?.topic || 'AI automation for solopreneurs';
  const price = PRICE_TIERS[Math.floor(Math.random() * PRICE_TIERS.length)];

  const prompt = `You are a digital product creator for "Nexus Automation Engine" — a faceless AI productivity brand.
Create a complete ${type} product for solopreneurs around the topic: "${topic}".
Price point: ${price}

Generate a JSON product spec with:
- name: product name (compelling, 4-8 words)
- tagline: one-line value proposition
- description: 150-word product description for a sales page
- contents: array of what's included (list items)
- previewSection: a sample preview of the actual product content (200 words)
- salesCopy: short-form sales copy for social media (100 words)
- price: "${price}"
- upsell: optional upsell idea (next product/bundle)
- targetAudience: who this is for
- transformation: before/after result statement
- format: delivery format
- deliveryInstructions: how customer receives product

Tone: direct, minimal, value-focused. No hype.
Respond as valid JSON only.`;

  try {
    const response = await generateCompletion(prompt, 1200);
    const parsed = JSON.parse(response.trim());
    const product = {
      id: `product-${Date.now()}`,
      type,
      trendTopic: topic,
      brand: 'Nexus Automation Engine',
      ...parsed,
      generatedAt: new Date().toISOString(),
      status: 'ready',
    };
    Logger.log('product', product);
    log(`✅ Product generated: ${product.name}`);
    return product;
  } catch (err) {
    Logger.error('PRODUCT_AGENT', err.message);
    return generateFallbackProduct(type, topic, price);
  }
}

function generateFallbackProduct(type, topic, price) {
  return {
    id: `product-${Date.now()}-fallback`,
    type,
    trendTopic: topic,
    brand: 'Nexus Automation Engine',
    name: `The ${topic} Automation Kit`,
    tagline: `Save 10 hours/week automating ${topic}.`,
    description: `This ${type} gives solopreneurs a complete system for ${topic}. Built for people who want results without complexity. Every element is pre-built and ready to use immediately.`,
    contents: [
      'Complete system template',
      'Step-by-step setup guide',
      'Tool stack recommendations',
      'Automation workflow diagrams',
      '30-day implementation checklist',
    ],
    previewSection: `# Getting Started\n\nThis kit assumes you have zero automation experience. By the end of setup, you will have a working system that runs without your daily input.\n\n## Step 1: Map Your Workflow\n\nList every task you do more than once per week...`,
    salesCopy: `Stop doing manually what a system can do for you. This kit gives you the exact automation framework for ${topic}. Plug in. Run once. Collect results.`,
    price,
    upsell: 'AI Productivity OS Bundle (+$20)',
    targetAudience: 'Solopreneurs spending more than 2 hours/day on repetitive tasks',
    transformation: `Before: 3 hours daily on ${topic}. After: 20 minutes reviewing automated outputs.`,
    format: 'PDF + Notion Template',
    deliveryInstructions: 'Instant download via Gumroad/Lemon Squeezy after purchase',
    generatedAt: new Date().toISOString(),
    status: 'ready',
    fallback: true,
  };
}

function log(msg) {
  console.log(`[PRODUCT-AGENT] ${msg}`);
}
