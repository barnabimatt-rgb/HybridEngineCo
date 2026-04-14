/**
 * NEXUS AUTOMATION ENGINE — Trend Intelligence Agent
 * Daily trend scanning across RSS, keywords, and AI topic extraction.
 */

import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import axios from 'axios';
import MemoryStore from '../memory/memory-store.js';
import Logger from '../memory/logger.js';
import { generateCompletion } from '../automation/openai-client.js';

const parser = new Parser();

const DEFAULT_FEEDS = [
  'https://feeds.feedburner.com/TechCrunch',
  'https://www.theverge.com/rss/index.xml',
  'https://hnrss.org/frontpage',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://feeds.a.dj.com/rss/RSSWSJD.xml',
];

const NICHE_KEYWORDS = [
  'AI productivity',
  'automation',
  'solopreneur',
  'no-code',
  'digital minimalism',
  'passive income',
  'SaaS',
  'AI tools',
  'workflow automation',
  'tech-optimized living',
  'remote work',
  'digital nomad',
  'micro-SaaS',
];

export async function init() {
  Logger.system('[TREND-AGENT] Initialized.');
}

export async function runTrendScan() {
  log('Starting trend scan...');

  const feedUrls = getFeedUrls();
  const rawItems = await fetchAllFeeds(feedUrls);
  const filtered = filterByNiche(rawItems);
  const topics = await extractTopicsWithAI(filtered);
  const keywords = extractKeywords(filtered);
  const contentIdeas = await generateContentIdeas(topics);
  const productIdeas = await generateProductIdeas(topics);
  const saasIdeas = await generateSaasIdeas(topics);

  const report = {
    date: new Date().toISOString(),
    rawItemCount: rawItems.length,
    filteredCount: filtered.length,
    topics,
    keywords,
    contentIdeas,
    productIdeas,
    saasIdeas,
    sources: feedUrls,
  };

  log(`Trend scan complete. ${topics.length} topics, ${keywords.length} keywords.`);

  // Store history
  const history = MemoryStore.get('trend_history') || [];
  history.unshift({ date: report.date, topics: topics.slice(0, 5) });
  if (history.length > 30) history.pop();
  MemoryStore.set('trend_history', history);

  Logger.log('trend', report);

  return report;
}

async function fetchAllFeeds(feedUrls) {
  const results = [];
  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of (feed.items || []).slice(0, 10)) {
        results.push({
          title: item.title || '',
          summary: item.contentSnippet || item.content || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          source: feed.title || url,
        });
      }
    } catch (err) {
      log(`Feed error [${url}]: ${err.message}`);
    }
  }
  return results;
}

function filterByNiche(items) {
  return items.filter((item) => {
    const text = `${item.title} ${item.summary}`.toLowerCase();
    return NICHE_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
  });
}

async function extractTopicsWithAI(items) {
  if (items.length === 0) return generateFallbackTopics();

  const headlines = items.slice(0, 20).map((i) => `- ${i.title}`).join('\n');
  const prompt = `You are a trend intelligence agent for a faceless AI productivity brand.
Given these headlines, extract the top 8 trending topics relevant to: AI productivity, automation, solopreneur tools, digital minimalism, tech-optimized living.

Headlines:
${headlines}

Respond with a JSON array of objects: [{"topic": "...", "angle": "...", "urgency": "high|medium|low"}]
Only return valid JSON.`;

  try {
    const response = await generateCompletion(prompt, 800);
    const parsed = JSON.parse(response.trim());
    return Array.isArray(parsed) ? parsed : generateFallbackTopics();
  } catch {
    return generateFallbackTopics();
  }
}

function extractKeywords(items) {
  const wordCount = {};
  for (const item of items) {
    const words = `${item.title} ${item.summary}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4);
    for (const w of words) {
      wordCount[w] = (wordCount[w] || 0) + 1;
    }
  }
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

async function generateContentIdeas(topics) {
  if (!topics.length) return [];
  const topicList = topics.slice(0, 5).map((t) => t.topic).join(', ');
  const prompt = `Generate 5 content ideas for a faceless AI productivity channel based on these trends: ${topicList}.
Each idea should include a hook, angle, and format (short video, article, thread).
Respond as JSON array: [{"title":"...","hook":"...","format":"...","angle":"..."}]
Only return valid JSON.`;
  try {
    const r = await generateCompletion(prompt, 600);
    return JSON.parse(r.trim());
  } catch {
    return [];
  }
}

async function generateProductIdeas(topics) {
  if (!topics.length) return [];
  const topicList = topics.slice(0, 5).map((t) => t.topic).join(', ');
  const prompt = `Generate 3 digital product ideas (templates, guides, toolkits) for solopreneurs based on trends: ${topicList}.
Respond as JSON: [{"name":"...","type":"...","description":"...","price":"$..."}]
Only return valid JSON.`;
  try {
    const r = await generateCompletion(prompt, 400);
    return JSON.parse(r.trim());
  } catch {
    return [];
  }
}

async function generateSaasIdeas(topics) {
  if (!topics.length) return [];
  const topicList = topics.slice(0, 5).map((t) => t.topic).join(', ');
  const prompt = `Generate 2 micro-SaaS tool ideas for AI productivity based on trends: ${topicList}.
Each should solve a specific solopreneur pain point.
Respond as JSON: [{"name":"...","tagline":"...","features":["..."],"monetization":"..."}]
Only return valid JSON.`;
  try {
    const r = await generateCompletion(prompt, 400);
    return JSON.parse(r.trim());
  } catch {
    return [];
  }
}

function generateFallbackTopics() {
  return [
    { topic: 'AI automation for solopreneurs', angle: 'productivity', urgency: 'high' },
    { topic: 'No-code tool stacks 2025', angle: 'tools', urgency: 'high' },
    { topic: 'Digital minimalism principles', angle: 'lifestyle', urgency: 'medium' },
    { topic: 'Micro-SaaS revenue strategies', angle: 'monetization', urgency: 'high' },
    { topic: 'AI content workflows', angle: 'content', urgency: 'medium' },
  ];
}

function getFeedUrls() {
  const envFeeds = process.env.RSS_FEED_URLS;
  if (envFeeds) {
    return envFeeds.split(',').map((u) => u.trim()).filter(Boolean);
  }
  return DEFAULT_FEEDS;
}

function log(msg) {
  console.log(`[TREND-AGENT] ${msg}`);
}
