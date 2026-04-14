/**
 * NEXUS AUTOMATION ENGINE — SEO Templates & Keyword Framework
 */

export const SEO_ARTICLE_TEMPLATE = {
  structure: [
    { tag: 'title', maxChars: 60, format: 'Keyword-first, emotional hook' },
    { tag: 'meta-description', maxChars: 155, format: 'Keyword + value prop + CTA verb' },
    { tag: 'h1', note: 'Same intent as title, can differ in wording' },
    { tag: 'intro', words: 100, note: 'Hook, problem, promise. No fluff.' },
    { tag: 'h2-sections', count: '4-6', wordsPerSection: '150-200' },
    { tag: 'faq-section', questions: 3, note: 'Target PAA (People Also Ask) queries' },
    { tag: 'conclusion', words: 80, note: 'Summary + CTA' },
  ],
  technicalSEO: [
    'One H1 per page',
    'H2s include secondary keywords',
    'Images: alt text with keywords',
    'Internal links: 3+ per article',
    'External links: 1-2 authoritative sources',
    'URL slug: lowercase, hyphens, keyword-first',
    'Schema: Article or HowTo',
  ],
};

export const KEYWORD_RESEARCH_FRAMEWORK = {
  intentCategories: {
    informational: 'how to, what is, guide, tutorial, best way',
    transactional: 'buy, download, get, tool, software, template',
    navigational: 'brand name, product name, tool name',
    commercial: 'best, top, review, comparison, alternatives',
  },
  difficultyTargeting: {
    phase1: 'low difficulty (KD < 20) — build authority',
    phase2: 'medium difficulty (KD 20-50) — scale traffic',
    phase3: 'high difficulty (KD 50+) — compete at scale',
  },
  contentCluster: {
    pillarPage: '2000+ words, broad topic, high competition keyword',
    clusterPages: '800-1200 words, long-tail, internal link to pillar',
    ratio: '1 pillar : 5-10 cluster pages',
  },
};

export const META_TEMPLATES = {
  title: [
    '{Keyword}: The Complete Guide ({Year})',
    '{Number} Best {Keyword} Tools for Solopreneurs',
    'How to {Action} with {Keyword} — Step-by-Step',
    '{Keyword} for Beginners: Everything You Need',
    'The {Adjective} Guide to {Keyword}',
  ],
  description: [
    'Learn {keyword} with our step-by-step guide. {Value prop}. {CTA}.',
    'Discover the {adjective} {keyword} tools and strategies. {Outcome}.',
    '{Number} proven {keyword} techniques that {audience} use. Free guide.',
  ],
};

export const INTERNAL_LINKING_STRATEGY = {
  rules: [
    'Every article links to the pillar page of its cluster',
    'Every pillar page links to all cluster pages',
    'Anchor text uses target keywords (no "click here")',
    'Minimum 3 internal links per article',
    'Maximum 10 internal links per article',
  ],
  anchors: ['exact match', 'partial match', 'semantic variation', 'branded'],
};
