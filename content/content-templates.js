/**
 * NEXUS AUTOMATION ENGINE — Content Templates
 * Reusable content frameworks for all 5 pillars.
 */

export const CONTENT_TEMPLATES = {
  'short-video-script': {
    structure: ['hook (0-3s)', 'problem (3-10s)', 'solution (10-40s)', 'proof (40-50s)', 'cta (50-60s)'],
    maxWords: 150,
    toneNotes: 'Fast pacing. Short sentences. No filler.',
  },
  'article': {
    structure: ['headline', 'hook paragraph', 'H2: The Problem', 'H2: The Framework', 'H2: The Execution', 'H2: The Result', 'CTA'],
    minWords: 800,
    maxWords: 1500,
    toneNotes: 'Direct. Data-backed. Scannable with H2/H3.',
  },
  'twitter-thread': {
    structure: ['hook tweet (standalone)', '8-12 value tweets', 'summary tweet', 'cta tweet'],
    tweetMaxChars: 280,
    toneNotes: 'Punchy. Each tweet standalone. Numbered.',
  },
  'linkedin-post': {
    structure: ['hook line (no intro)', 'value body (5-8 lines)', 'blank line spacers', 'cta'],
    maxChars: 3000,
    toneNotes: 'Professional but direct. No hollow phrases.',
  },
  'newsletter-section': {
    structure: ['section headline', 'intro (2 sentences)', 'body (list or framework)', 'takeaway', 'resource link'],
    maxWords: 400,
    toneNotes: 'Conversational but analytical.',
  },
};

export const PILLAR_CONTENT_ANGLES = {
  'AI Productivity': [
    'Tool comparison',
    'Workflow walkthrough',
    'AI prompt system',
    'Before/after transformation',
    'Stack reveal',
  ],
  'Digital Minimalism': [
    'Tool elimination',
    'Simplification framework',
    'Focus system',
    'Digital audit',
    'Intentional tech use',
  ],
  'Automation Lifestyle': [
    'Set-and-forget system',
    'Passive automation setup',
    'Time-saving calculation',
    'Automation audit',
    'Stack automation tour',
  ],
  'Solopreneur Efficiency': [
    'One-person business model',
    'Revenue-per-hour optimization',
    'Task elimination',
    'Leverage framework',
    'Operating system reveal',
  ],
  'Tech-Optimized Living': [
    'Smart home + work integration',
    'Digital environment design',
    'Tech stack minimization',
    'Optimized morning routine',
    'Device/tool curation',
  ],
};

export const HOOK_FORMULAS = [
  'Most {audience} {do wrong thing}. Here\'s what actually works.',
  'I {did thing} for {time period}. Here\'s what I learned.',
  '{Number} {things} that {audience} never talk about.',
  'Stop {wrong approach}. Do this instead.',
  'The {topic} system I wish I had when I started.',
  'How to {desired outcome} without {common obstacle}.',
  '{Counterintuitive claim}. Here\'s the proof.',
  'You don\'t need {expensive/complex thing}. You need {simple thing}.',
];

export const CTA_TEMPLATES = [
  'Save this for when you build your {topic} system.',
  'Follow for daily systems that remove the work from work.',
  'Drop a 🔁 if you want the full breakdown.',
  'What\'s your current {topic} setup? Reply below.',
  'Link in bio → free {resource}.',
  'Share this with one solopreneur who needs to see it.',
];
