/**
 * NEXUS AUTOMATION ENGINE — Monetization Agent
 * Affiliate integration, funnels, email sequences, pricing optimization.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const AFFILIATE_PROGRAMS = [
  { name: 'Notion', id: 'notion-affiliate', category: 'productivity', commission: '50%', cookie: '90d', url: 'https://notion.so' },
  { name: 'Beehiiv', id: 'beehiiv-affiliate', category: 'newsletter', commission: '50%', cookie: '30d', url: 'https://beehiiv.com' },
  { name: 'ConvertKit', id: 'convertkit-affiliate', category: 'email', commission: '30%', cookie: '90d', url: 'https://convertkit.com' },
  { name: 'Lemon Squeezy', id: 'lemonsqueezy-affiliate', category: 'payments', commission: '50%', cookie: '60d', url: 'https://lemonsqueezy.com' },
  { name: 'Zapier', id: 'zapier-affiliate', category: 'automation', commission: '25%', cookie: '90d', url: 'https://zapier.com' },
  { name: 'Make.com', id: 'make-affiliate', category: 'automation', commission: '20%', cookie: '30d', url: 'https://make.com' },
  { name: 'Airtable', id: 'airtable-affiliate', category: 'database', commission: '$10/referral', cookie: '90d', url: 'https://airtable.com' },
  { name: 'Framer', id: 'framer-affiliate', category: 'website', commission: '50%', cookie: '30d', url: 'https://framer.com' },
];

const EMAIL_SEQUENCE_TYPES = ['welcome', 'nurture', 'launch', 'abandoned-cart', 'win-back', 'upsell'];

export async function init() {
  Logger.system('[MONETIZATION-AGENT] Initialized.');
}

export async function runUpdate(products, contentBatch) {
  log('Running monetization update...');

  const affiliateStrategy = buildAffiliateStrategy(contentBatch);
  const funnels = await buildFunnels(products);
  const emailSequences = await generateEmailSequences(products);
  const pricingAnalysis = optimizePricing(products);
  const revenueProjection = calculateRevenueProjection(products, funnels);

  const report = {
    date: new Date().toISOString(),
    affiliatePrograms: affiliateStrategy,
    funnels,
    emailSequences: emailSequences.map((s) => ({ type: s.type, subject: s.subject, emailCount: s.emails?.length || 0 })),
    pricingAnalysis,
    revenueProjection,
    recommendations: generateMonetizationRecommendations(products, funnels),
  };

  Logger.log('monetization', report);
  log('Monetization update complete.');
  return report;
}

function buildAffiliateStrategy(contentBatch) {
  const strategy = [];

  for (const program of AFFILIATE_PROGRAMS) {
    const relevantContent = contentBatch.filter((piece) => {
      const text = `${piece.title} ${piece.body || ''}`.toLowerCase();
      return text.includes(program.category) || text.includes(program.name.toLowerCase());
    });

    strategy.push({
      ...program,
      contentOpportunities: relevantContent.length,
      placement: ['in-article CTA', 'resource section', 'email footer'],
      estimatedClicks: relevantContent.length * 50,
      estimatedRevenue: `$${relevantContent.length * 15}/mo at 3% conversion`,
    });
  }

  return strategy.sort((a, b) => b.contentOpportunities - a.contentOpportunities);
}

async function buildFunnels(products) {
  const funnels = [];

  for (const product of products.slice(0, 2)) {
    const funnel = await generateFunnel(product);
    funnels.push(funnel);
  }

  return funnels;
}

async function generateFunnel(product) {
  const prompt = `Create a conversion funnel for this digital product:
Name: ${product.name}
Price: ${product.price}
Target audience: ${product.targetAudience}
Transformation: ${product.transformation}

Respond as JSON: {
  funnelName: "...",
  stages: [{stage: "awareness|interest|desire|action", touchpoint: "...", copy: "...", cta: "..."}],
  landingPageHeadline: "...",
  landingPageSubheadline: "...",
  socialProofStrategy: "...",
  urgencyMechanism: "...",
  thankYouPageUpsell: "...",
  conversionTarget: "X%"
}
Only valid JSON.`;

  try {
    const r = await generateCompletion(prompt, 800);
    return { ...JSON.parse(r.trim()), productId: product.id, productName: product.name };
  } catch {
    return {
      funnelName: `${product.name} Funnel`,
      productId: product.id,
      productName: product.name,
      stages: [
        { stage: 'awareness', touchpoint: 'Social content', copy: product.salesCopy, cta: 'Learn more →' },
        { stage: 'interest', touchpoint: 'Landing page', copy: product.description, cta: 'Get instant access →' },
        { stage: 'desire', touchpoint: 'Sales page', copy: product.salesCopy, cta: `Buy now — ${product.price}` },
        { stage: 'action', touchpoint: 'Checkout', copy: product.transformation, cta: 'Complete purchase' },
      ],
      landingPageHeadline: product.name,
      landingPageSubheadline: product.tagline,
      urgencyMechanism: 'Limited early-access price',
      thankYouPageUpsell: product.upsell || 'None',
      conversionTarget: '3%',
    };
  }
}

async function generateEmailSequences(products) {
  const sequences = [];

  // Welcome sequence
  sequences.push(await generateEmailSequence('welcome', null));

  // Product launch sequence for first product
  if (products.length > 0) {
    sequences.push(await generateEmailSequence('launch', products[0]));
  }

  return sequences;
}

async function generateEmailSequence(type, product) {
  const context = product ? `Product: ${product.name} — ${product.tagline}` : 'Brand: Nexus Automation Engine';
  const prompt = `Write a ${type} email sequence (4 emails) for: ${context}.
Brand voice: direct, minimal, no fluff, value-first.

Respond as JSON: {
  type: "${type}",
  subject: "sequence subject theme",
  emails: [{day: number, subject: "...", preheader: "...", body: "...", cta: "..."}]
}
Only valid JSON.`;

  try {
    const r = await generateCompletion(prompt, 1200);
    return JSON.parse(r.trim());
  } catch {
    return {
      type,
      subject: type === 'welcome' ? 'Welcome to Nexus Automation Engine' : `${product?.name} is live`,
      emails: [
        { day: 0, subject: type === 'welcome' ? 'You\'re in. Here\'s what happens next.' : `[Launch] ${product?.name} is now available`, preheader: 'Read this first.', body: 'Thanks for joining. Here\'s exactly what you get...', cta: 'Start here →' },
        { day: 2, subject: 'The system most solopreneurs skip', preheader: 'This is why it matters.', body: 'Most people build before they automate...', cta: 'See the framework →' },
        { day: 4, subject: '5 tools in my current stack', preheader: 'These are non-negotiable.', body: 'Here are the tools I use daily...', cta: 'Get the full list →' },
        { day: 7, subject: 'Last message this week', preheader: 'One thing to do this weekend.', body: 'If you only do one thing this weekend...', cta: 'Do this now →' },
      ],
    };
  }
}

function optimizePricing(products) {
  return {
    currentProducts: products.map((p) => ({ name: p.name, price: p.price })),
    pricingStrategy: 'value-based + psychological anchoring',
    recommendations: [
      'Offer 3 price points: $7 (entry), $27 (core), $67 (bundle)',
      'Use .97 endings for lower-ticket items ($6.97, $26.97)',
      'Bundle 3 products at 40% discount to increase AOV',
      'Test annual pricing: 2 months free vs. monthly',
      'Add order bumps at checkout (+$9-17)',
    ],
    revenueLevers: ['volume', 'aov', 'recurring', 'affiliate'],
    optimalPriceRange: { low: '$7', mid: '$27', high: '$97', bundle: '$197' },
  };
}

function calculateRevenueProjection(products, funnels) {
  const productCount = products.length;
  return {
    month1: { visitors: 1000, conversionRate: '2%', revenue: '$200-500', source: 'content + SEO' },
    month3: { visitors: 5000, conversionRate: '3%', revenue: '$1,500-3,000', source: 'organic + email' },
    month6: { visitors: 15000, conversionRate: '3.5%', revenue: '$5,000-10,000', source: 'compound organic' },
    month12: { visitors: 50000, conversionRate: '4%', revenue: '$15,000-30,000', source: 'brand authority + SaaS' },
    primaryRevStreams: ['digital products', 'micro-SaaS subscriptions', 'affiliate commissions', 'email list monetization'],
  };
}

function generateMonetizationRecommendations(products, funnels) {
  return [
    'Launch first product on Gumroad/Lemon Squeezy this week',
    'Set up ConvertKit email list with welcome sequence',
    'Add affiliate links to top 5 most-viewed content pieces',
    'Create a free lead magnet (checklist/mini-guide) to build email list',
    'Set up a simple landing page with email capture before full product launch',
    'A/B test 2 different price points for first product',
  ];
}

function log(msg) {
  console.log(`[MONETIZATION-AGENT] ${msg}`);
}
