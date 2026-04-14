/**
 * NEXUS AUTOMATION ENGINE — SEO Agent
 * Keyword research, article generation, metadata optimization.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const PILLAR_KEYWORDS = {
  'AI Productivity': ['AI productivity tools', 'AI workflow automation', 'best AI tools 2025', 'AI for solopreneurs'],
  'Digital Minimalism': ['digital minimalism', 'minimal tech setup', 'digital declutter', 'less is more productivity'],
  'Automation Lifestyle': ['automation lifestyle', 'automate your business', 'passive automation', 'set and forget systems'],
  'Solopreneur Efficiency': ['solopreneur tools', 'solo business automation', 'one-person business systems', 'solopreneur productivity'],
  'Tech-Optimized Living': ['tech-optimized lifestyle', 'smart home productivity', 'technology minimalism', 'optimized tech stack'],
};

export async function init() {
  Logger.system('[SEO-AGENT] Initialized.');
}

export async function optimizeContentBatch(pieces) {
  log(`Optimizing SEO for ${pieces.length} content pieces...`);
  const optimized = [];

  for (const piece of pieces) {
    try {
      const meta = await generateMetadata(piece);
      optimized.push({ ...piece, seo: meta });
    } catch (err) {
      Logger.error('SEO_AGENT', err.message);
      optimized.push(piece);
    }
  }

  return optimized;
}

export async function runFullSeoUpdate(contentBatch) {
  log('Running full SEO update...');

  const keywords = await performKeywordResearch();
  const articles = await generateSeoArticles(keywords.slice(0, 3));
  const internalLinks = buildInternalLinkMap(contentBatch);

  const report = {
    date: new Date().toISOString(),
    keywordsResearched: keywords.length,
    articlesGenerated: articles.length,
    internalLinks,
    recommendations: generateSeoRecommendations(keywords),
    performanceTargets: {
      targetMonthlyTraffic: 10000,
      targetKeywordRankings: 50,
      targetBacklinks: 100,
    },
  };

  MemoryStore.set('seo_keywords', keywords);
  Logger.log('seo', report);
  log(`SEO update complete. ${keywords.length} keywords, ${articles.length} articles.`);
  return report;
}

async function performKeywordResearch() {
  const allKeywords = [];

  for (const [pillar, keywords] of Object.entries(PILLAR_KEYWORDS)) {
    for (const kw of keywords) {
      const expanded = await expandKeyword(kw, pillar);
      allKeywords.push(...expanded);
    }
  }

  const trending = MemoryStore.get('latest_trend_report')?.keywords || [];
  for (const { word } of trending.slice(0, 5)) {
    allKeywords.push({
      keyword: word,
      pillar: 'Trend',
      searchIntent: 'informational',
      difficulty: 'medium',
      priority: 'high',
    });
  }

  return deduplicateKeywords(allKeywords);
}

async function expandKeyword(baseKeyword, pillar) {
  const prompt = `You are an SEO specialist for an AI productivity brand.
Expand this keyword into 5 long-tail variations with search intent analysis.
Base keyword: "${baseKeyword}"
Pillar: ${pillar}

Respond as JSON array: [{"keyword":"...","searchIntent":"informational|transactional|navigational","difficulty":"low|medium|high","priority":"high|medium|low","monthlyVolume":"estimate"}]
Only return valid JSON.`;

  try {
    const r = await generateCompletion(prompt, 500);
    return JSON.parse(r.trim());
  } catch {
    return [{ keyword: baseKeyword, searchIntent: 'informational', difficulty: 'medium', priority: 'medium', pillar }];
  }
}

async function generateSeoArticles(keywords) {
  const articles = [];

  for (const kw of keywords) {
    try {
      const article = await generateArticle(kw);
      articles.push(article);
    } catch (err) {
      Logger.error('SEO_ARTICLE_GEN', err.message);
    }
  }

  return articles;
}

async function generateArticle(keyword) {
  const kw = typeof keyword === 'string' ? keyword : keyword.keyword;
  const prompt = `Write a complete SEO-optimized article for the keyword: "${kw}".
Brand: Nexus Automation Engine (faceless, minimalist AI productivity brand).
Style: direct, no fluff, data-backed, systematic.

Include:
- SEO title (max 60 chars, keyword near front)
- Meta description (max 155 chars)
- H1 heading
- Article body (800-1000 words, H2/H3 structure, keyword density 1-2%)
- Internal link anchors (3 placeholder [[LINK]] markers)
- FAQ section (3 Q&A pairs)
- Schema markup suggestion

Respond as JSON: {title, metaDescription, h1, body, faqs: [{q,a}], schemaType, internalLinkCount: 3}
Only valid JSON.`;

  const r = await generateCompletion(prompt, 1800);
  try {
    return { ...JSON.parse(r.trim()), keyword: kw, generatedAt: new Date().toISOString() };
  } catch {
    return { keyword: kw, title: `The Complete Guide to ${kw}`, generatedAt: new Date().toISOString(), fallback: true };
  }
}

async function generateMetadata(piece) {
  const prompt = `Generate SEO metadata for this content piece.
Title: ${piece.title}
Topic: ${piece.trendTopic}
Pillar: ${piece.pillar}

Respond as JSON: {metaTitle, metaDescription, canonicalSlug, ogTitle, ogDescription, twitterTitle, twitterDescription, structuredDataType, focusKeyword, secondaryKeywords: []}
Only valid JSON.`;

  try {
    const r = await generateCompletion(prompt, 400);
    return JSON.parse(r.trim());
  } catch {
    return {
      metaTitle: piece.title.slice(0, 60),
      metaDescription: piece.hook?.slice(0, 155) || '',
      canonicalSlug: slugify(piece.title),
      focusKeyword: piece.trendTopic,
      secondaryKeywords: piece.seoKeywords || [],
    };
  }
}

function buildInternalLinkMap(contentBatch) {
  const map = {};
  for (const piece of contentBatch) {
    map[piece.title] = {
      slug: slugify(piece.title),
      keywords: piece.seoKeywords || [],
      pillar: piece.pillar,
    };
  }
  return map;
}

function generateSeoRecommendations(keywords) {
  return [
    `Focus on ${keywords.filter((k) => k.priority === 'high').length} high-priority keywords this week`,
    'Publish minimum 3 long-form articles per week (1000+ words)',
    'Add internal links to every new article (3+ links each)',
    'Submit new URLs to Google Search Console within 24h of publish',
    'Build 2 backlinks per week via digital PR and guest posts',
  ];
}

function deduplicateKeywords(keywords) {
  const seen = new Set();
  return keywords.filter((k) => {
    const key = (k.keyword || '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function log(msg) {
  console.log(`[SEO-AGENT] ${msg}`);
}
