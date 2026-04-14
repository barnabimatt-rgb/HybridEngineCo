/**
 * NEXUS AUTOMATION ENGINE — Mega-Agent
 * Director / Orchestrator of all sub-agents and pipelines.
 */

import * as TrendAgent from './trend-agent.js';
import * as BrandingAgent from './branding-agent.js';
import * as ContentAgent from './content-agent.js';
import * as VideoAgent from './video-agent.js';
import * as ProductAgent from './product-agent.js';
import * as MicroSaasAgent from './microsaas-agent.js';
import * as CodeGenAgent from './codegen-agent.js';
import * as DeploymentAgent from './deployment-agent.js';
import * as SeoAgent from './seo-agent.js';
import * as MonetizationAgent from './monetization-agent.js';
import * as AutomationAgent from './automation-agent.js';
import * as SelfHealingAgent from './self-healing-agent.js';
import * as FallbackAgent from './fallback-agent.js';
import * as LimitAwareAgent from './limit-aware-agent.js';
import MemoryStore from '../memory/memory-store.js';
import Logger from '../memory/logger.js';

// ── Agent registry ────────────────────────────────────────────────────────────
const AGENTS = {
  trend: TrendAgent,
  branding: BrandingAgent,
  content: ContentAgent,
  video: VideoAgent,
  product: ProductAgent,
  saas: MicroSaasAgent,
  codegen: CodeGenAgent,
  deployment: DeploymentAgent,
  seo: SeoAgent,
  monetization: MonetizationAgent,
  automation: AutomationAgent,
  selfhealing: SelfHealingAgent,
  fallback: FallbackAgent,
  limitaware: LimitAwareAgent,
};

const agentStatus = {};

// ── Pipeline definitions ──────────────────────────────────────────────────────
const PIPELINES = {
  trend: runTrendPipeline,
  content: runContentPipeline,
  video: runVideoPipeline,
  product: runProductPipeline,
  saas: runSaasPipeline,
  seo: runSeoPipeline,
  monetization: runMonetizationPipeline,
  branding: runBrandingPipeline,
  deployment: runDeploymentPipeline,
};

// ── Initialization ─────────────────────────────────────────────────────────────
export async function initialize() {
  Logger.system('[MEGA-AGENT] Initializing Nexus Automation Engine...');

  // Init memory
  await MemoryStore.init();

  // Load brand identity if not already set
  const brand = MemoryStore.get('brand_identity');
  if (!brand) {
    log('→ Brand identity not found. Initializing via Branding Agent...');
    const identity = await BrandingAgent.generateBrandIdentity();
    MemoryStore.set('brand_identity', identity);
    Logger.log('branding', { action: 'init', identity });
  }

  // Initialize all agents
  for (const [name, agent] of Object.entries(AGENTS)) {
    try {
      if (typeof agent.init === 'function') {
        await agent.init();
      }
      agentStatus[name] = 'online';
      log(`✅ Agent [${name}] online`);
    } catch (err) {
      agentStatus[name] = 'error';
      Logger.error(`MEGA_AGENT_INIT_${name.toUpperCase()}`, err.message);
      log(`⚠️  Agent [${name}] failed to init: ${err.message}`);
    }
  }

  // Store initial roadmaps
  if (!MemoryStore.get('content_calendar')) {
    const calendar = ContentAgent.generateCalendar();
    MemoryStore.set('content_calendar', calendar);
  }
  if (!MemoryStore.get('product_roadmap')) {
    const roadmap = ProductAgent.generateRoadmap();
    MemoryStore.set('product_roadmap', roadmap);
  }
  if (!MemoryStore.get('saas_roadmap')) {
    const roadmap = MicroSaasAgent.generateRoadmap();
    MemoryStore.set('saas_roadmap', roadmap);
  }

  MemoryStore.set('system_initialized', true);
  MemoryStore.set('initialized_at', new Date().toISOString());

  Logger.system('[MEGA-AGENT] Initialization complete. Autonomous mode ACTIVE.');
  log('[NEXUS AUTOMATION ENGINE INITIALIZED]');
  log('Systems online: ' + Object.keys(AGENTS).join(', '));
}

// ── Pipeline runner ───────────────────────────────────────────────────────────
export async function runPipeline(name) {
  log(`[MEGA-AGENT] Running pipeline: ${name}`);

  if (LimitAwareAgent.isThrottled()) {
    log('[MEGA-AGENT] System throttled by Limit-Aware Agent. Deferring pipeline.');
    return { deferred: true, reason: 'throttled' };
  }

  const pipelineFn = PIPELINES[name];
  if (!pipelineFn) {
    throw new Error(`Unknown pipeline: ${name}`);
  }

  try {
    const result = await pipelineFn();
    Logger.log(name, { pipeline: name, result, timestamp: new Date().toISOString() });
    return result;
  } catch (err) {
    Logger.error(`PIPELINE_${name.toUpperCase()}`, err.message);
    log(`[MEGA-AGENT] Pipeline [${name}] failed: ${err.message}. Triggering self-heal.`);
    await SelfHealingAgent.heal({ pipeline: name, error: err.message });
    return FallbackAgent.fallback(name, err);
  }
}

// ── Individual pipeline implementations ──────────────────────────────────────

async function runTrendPipeline() {
  log('[TREND PIPELINE] Starting...');
  const report = await TrendAgent.runTrendScan();
  MemoryStore.set('latest_trend_report', report);
  MemoryStore.set('last_trend_scan', new Date().toISOString());

  // Update content calendar with trends
  const calendar = ContentAgent.updateCalendarFromTrends(report.topics);
  MemoryStore.set('content_calendar', calendar);

  // Update product roadmap
  const roadmap = ProductAgent.updateRoadmapFromTrends(report.topics);
  MemoryStore.set('product_roadmap', roadmap);

  log('[TREND PIPELINE] Complete.');
  return report;
}

async function runContentPipeline() {
  log('[CONTENT PIPELINE] Starting...');
  const trends = MemoryStore.get('latest_trend_report') || { topics: [] };
  const brand = MemoryStore.get('brand_identity') || {};
  const count = parseInt(process.env.DAILY_CONTENT_COUNT || '4');

  const pieces = await ContentAgent.generateContentBatch(trends.topics, brand, count);
  MemoryStore.set('latest_content_batch', pieces);

  // Feed into video pipeline
  const videoAssets = await VideoAgent.processScripts(pieces);
  MemoryStore.set('latest_video_assets', videoAssets);

  // Feed into SEO
  await SeoAgent.optimizeContentBatch(pieces);

  log(`[CONTENT PIPELINE] Generated ${pieces.length} pieces.`);
  return { pieces, videoAssets };
}

async function runVideoPipeline() {
  log('[VIDEO PIPELINE] Starting...');
  const scripts = MemoryStore.get('latest_content_batch') || [];
  const assets = await VideoAgent.processScripts(scripts);
  MemoryStore.set('latest_video_assets', assets);
  log(`[VIDEO PIPELINE] Produced ${assets.length} video templates.`);
  return assets;
}

async function runProductPipeline() {
  log('[PRODUCT PIPELINE] Starting...');
  const trends = MemoryStore.get('latest_trend_report') || { topics: [] };
  const brand = MemoryStore.get('brand_identity') || {};
  const product = await ProductAgent.generateProduct(trends.topics, brand);
  const existing = MemoryStore.get('products') || [];
  existing.push(product);
  MemoryStore.set('products', existing);
  log('[PRODUCT PIPELINE] Product generated.');
  return product;
}

async function runSaasPipeline() {
  log('[SAAS PIPELINE] Starting...');
  const trends = MemoryStore.get('latest_trend_report') || { topics: [] };
  const tool = await MicroSaasAgent.generateTool(trends.topics);
  const code = await CodeGenAgent.buildSaasTool(tool);
  const deployed = await DeploymentAgent.deployService(code);
  const existing = MemoryStore.get('saas_tools') || [];
  existing.push({ tool, deployed });
  MemoryStore.set('saas_tools', existing);
  log('[SAAS PIPELINE] SaaS tool deployed.');
  return { tool, code, deployed };
}

async function runSeoPipeline() {
  log('[SEO PIPELINE] Starting...');
  const content = MemoryStore.get('latest_content_batch') || [];
  const seoReport = await SeoAgent.runFullSeoUpdate(content);
  MemoryStore.set('latest_seo_report', seoReport);
  log('[SEO PIPELINE] Complete.');
  return seoReport;
}

async function runMonetizationPipeline() {
  log('[MONETIZATION PIPELINE] Starting...');
  const products = MemoryStore.get('products') || [];
  const content = MemoryStore.get('latest_content_batch') || [];
  const result = await MonetizationAgent.runUpdate(products, content);
  MemoryStore.set('monetization_data', result);
  log('[MONETIZATION PIPELINE] Complete.');
  return result;
}

async function runBrandingPipeline() {
  log('[BRANDING PIPELINE] Starting...');
  const identity = await BrandingAgent.refreshBrandIdentity();
  MemoryStore.set('brand_identity', identity);
  log('[BRANDING PIPELINE] Brand identity refreshed.');
  return identity;
}

async function runDeploymentPipeline() {
  log('[DEPLOYMENT PIPELINE] Starting...');
  const result = await DeploymentAgent.validateAndDeploy();
  Logger.log('deployment', result);
  log('[DEPLOYMENT PIPELINE] Complete.');
  return result;
}

// ── Status reporting ──────────────────────────────────────────────────────────
export function getAgentStatus() {
  return { ...agentStatus };
}

export async function getFullStatus() {
  return {
    system: 'Nexus Automation Engine',
    version: '1.0.0',
    mode: 'Autonomous — Balanced Mode',
    agents: agentStatus,
    memory: {
      initialized: MemoryStore.get('system_initialized'),
      initializedAt: MemoryStore.get('initialized_at'),
      lastTrendScan: MemoryStore.get('last_trend_scan'),
      contentPieces: (MemoryStore.get('latest_content_batch') || []).length,
      products: (MemoryStore.get('products') || []).length,
      saasTools: (MemoryStore.get('saas_tools') || []).length,
    },
    limits: LimitAwareAgent.getUsageReport(),
    timestamp: new Date().toISOString(),
  };
}

// ── Internal logger ───────────────────────────────────────────────────────────
function log(msg) {
  console.log(`[MEGA-AGENT] ${msg}`);
  Logger.system(msg);
}
