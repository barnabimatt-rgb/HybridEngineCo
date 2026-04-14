/**
 * NEXUS AUTOMATION ENGINE — Main Server
 * Mega-Agent orchestrator + HTTP API + Pipeline scheduler
 */

import express from 'express';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as MegaAgent from './agents/mega-agent.js';
import * as AutomationAgent from './agents/automation-agent.js';
import * as SelfHealingAgent from './agents/self-healing-agent.js';
import * as LimitAwareAgent from './agents/limit-aware-agent.js';
import Logger from './memory/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── CORS / security headers ──────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'NexusAutomationEngine');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Nexus Automation Engine',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    agents: MegaAgent.getAgentStatus(),
    uptime: process.uptime(),
  });
});

// ── System status ─────────────────────────────────────────────────────────────
app.get('/status', async (req, res) => {
  try {
    const status = await MegaAgent.getFullStatus();
    res.json(status);
  } catch (err) {
    Logger.error('STATUS_ENDPOINT', err.message);
    res.status(500).json({ error: 'Status fetch failed', detail: err.message });
  }
});

// ── Trigger trend update manually ────────────────────────────────────────────
app.post('/pipeline/trend', async (req, res) => {
  try {
    const result = await MegaAgent.runPipeline('trend');
    res.json({ success: true, result });
  } catch (err) {
    Logger.error('TREND_ENDPOINT', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger content pipeline manually ────────────────────────────────────────
app.post('/pipeline/content', async (req, res) => {
  try {
    const result = await MegaAgent.runPipeline('content');
    res.json({ success: true, result });
  } catch (err) {
    Logger.error('CONTENT_ENDPOINT', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger product pipeline ──────────────────────────────────────────────────
app.post('/pipeline/product', async (req, res) => {
  try {
    const result = await MegaAgent.runPipeline('product');
    res.json({ success: true, result });
  } catch (err) {
    Logger.error('PRODUCT_ENDPOINT', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger SaaS pipeline ─────────────────────────────────────────────────────
app.post('/pipeline/saas', async (req, res) => {
  try {
    const result = await MegaAgent.runPipeline('saas');
    res.json({ success: true, result });
  } catch (err) {
    Logger.error('SAAS_ENDPOINT', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger SEO pipeline ──────────────────────────────────────────────────────
app.post('/pipeline/seo', async (req, res) => {
  try {
    const result = await MegaAgent.runPipeline('seo');
    res.json({ success: true, result });
  } catch (err) {
    Logger.error('SEO_ENDPOINT', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Self-healing trigger ──────────────────────────────────────────────────────
app.post('/selfheal', async (req, res) => {
  try {
    const result = await SelfHealingAgent.heal();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Log retrieval ─────────────────────────────────────────────────────────────
app.get('/logs/:type', (req, res) => {
  const { type } = req.params;
  const allowed = ['trend', 'content', 'product', 'saas', 'seo', 'error', 'deployment', 'system'];
  if (!allowed.includes(type)) {
    return res.status(400).json({ error: 'Invalid log type' });
  }
  try {
    const log = Logger.read(type);
    res.json({ type, entries: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Memory dump ───────────────────────────────────────────────────────────────
app.get('/memory/:key', (req, res) => {
  const { key } = req.params;
  const { MemoryStore } = await import('./memory/memory-store.js').catch(() => ({ MemoryStore: null }));
  if (!MemoryStore) return res.status(500).json({ error: 'Memory store unavailable' });
  const val = MemoryStore.get(key);
  res.json({ key, value: val });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  Logger.error('GLOBAL', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Boot sequence ─────────────────────────────────────────────────────────────
const server = createServer(app);

server.listen(PORT, async () => {
  Logger.system('[NEXUS] Server online', { port: PORT });
  console.log(`[NEXUS] 🚀 Server listening on port ${PORT}`);

  try {
    // Initialize Mega-Agent and all sub-agents
    await MegaAgent.initialize();

    // Start automation scheduler
    await AutomationAgent.startScheduler();

    // Start limit monitor
    LimitAwareAgent.startMonitor();

    Logger.system('[NEXUS] All agents initialized. Autonomous mode ACTIVE.');
    console.log('[NEXUS] ✅ All agents initialized. Autonomous mode ACTIVE.');
  } catch (err) {
    Logger.error('BOOT', err.message);
    console.error('[NEXUS] ❌ Boot error:', err.message);
    // Trigger self-healing on boot failure
    SelfHealingAgent.heal().catch(() => {});
  }
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  Logger.system('[NEXUS] SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    AutomationAgent.stopScheduler();
    LimitAwareAgent.stopMonitor();
    Logger.system('[NEXUS] Shutdown complete.');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  Logger.error('UNCAUGHT_EXCEPTION', err.message);
  SelfHealingAgent.heal().catch(() => {});
});

process.on('unhandledRejection', (reason) => {
  Logger.error('UNHANDLED_REJECTION', String(reason));
});

export default app;
