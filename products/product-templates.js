/**
 * NEXUS AUTOMATION ENGINE — Product Templates
 * Reusable frameworks for digital product creation.
 */

export const PRODUCT_FRAMEWORKS = {
  'notion-template': {
    structure: ['Cover page', 'Welcome + How to use', 'Main database/system', 'Sub-pages', 'Resources section'],
    deliveryFormat: 'Notion template link',
    productionNotes: 'Duplicate-to-use setup. Minimal design. Dark mode compatible.',
    pricingRange: { low: '$7', mid: '$17', high: '$37' },
  },
  'automation-guide': {
    structure: ['Problem statement', 'Tools needed (with affiliate links)', 'Step-by-step setup', 'Troubleshooting', 'Next steps'],
    deliveryFormat: 'PDF + bonus Loom walkthrough link',
    productionNotes: '20-40 pages. Screenshots. Code snippets where relevant.',
    pricingRange: { low: '$12', mid: '$27', high: '$47' },
  },
  'swipe-file': {
    structure: ['Category index', '50+ templates/examples', 'Usage instructions', 'Customization guide'],
    deliveryFormat: 'PDF + Notion database',
    productionNotes: 'Dense with examples. Easy to skim. High perceived value.',
    pricingRange: { low: '$17', mid: '$37', high: '$67' },
  },
  'prompt-library': {
    structure: ['Category index', '100+ prompts organized by use case', 'Variable placeholders explained', 'Example outputs'],
    deliveryFormat: 'Notion database with duplicate link',
    productionNotes: 'Each prompt tested. Variables in [[brackets]]. Output examples shown.',
    pricingRange: { low: '$9', mid: '$19', high: '$37' },
  },
  'tool-stack-guide': {
    structure: ['My current stack overview', 'Tool deep-dives (10-15 tools)', 'Setup instructions', 'Pricing breakdown', 'Recommended alternatives'],
    deliveryFormat: 'PDF',
    productionNotes: 'Include affiliate links. Be specific. Show screenshots.',
    pricingRange: { low: '$7', mid: '$17', high: '$27' },
  },
  'checklist-bundle': {
    structure: ['5-10 checklists', 'Each: title + 10-20 items + notes column', 'Implementation guide'],
    deliveryFormat: 'PDF + Notion',
    productionNotes: 'Print-friendly. Each checklist one page. Clear typography.',
    pricingRange: { low: '$7', mid: '$12', high: '$17' },
  },
};

export const SALES_PAGE_STRUCTURE = [
  'Headline — transformation promise',
  'Subheadline — who it\'s for + how long it takes',
  'Problem agitation — 3-4 bullet pain points',
  'Solution intro — introduce the product',
  'What\'s inside — visual breakdown of contents',
  'Social proof — testimonials or use cases',
  'Pricing — single clear price + what you get',
  'Guarantee — risk reversal',
  'FAQ — 5 objection handlers',
  'Final CTA — buy now button',
];

export const UPSELL_LADDER = [
  { tier: 1, priceRange: '$7-17', type: 'Entry product — checklist, mini-guide' },
  { tier: 2, priceRange: '$27-47', type: 'Core product — full system, template, guide' },
  { tier: 3, priceRange: '$67-97', type: 'Premium product — bundle, course outline, toolkit' },
  { tier: 4, priceRange: '$197+', type: 'Bundle — multiple products packaged' },
];
