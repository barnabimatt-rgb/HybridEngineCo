/**
 * NEXUS AUTOMATION ENGINE — Self-Healing Agent
 * Detects failures, regenerates missing components, redeploys.
 */

import { existsSync, mkdirSync } from 'fs';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const CRITICAL_FILES = [
  'server.js',
  'package.json',
  'Dockerfile',
  'railway.json',
  'env.schema.json',
  'agents/mega-agent.js',
  'memory/memory-store.js',
  'memory/logger.js',
  'automation/openai-client.js',
];

const CRITICAL_DIRS = [
  'agents', 'content', 'products', 'saas', 'seo',
  'video', 'automation', 'memory', 'logs', 'db', 'docs', 'deployment',
];

export async function init() {
  Logger.system('[SELF-HEALING-AGENT] Initialized.');
}

export async function heal(context = {}) {
  log(`Self-healing triggered. Context: ${JSON.stringify(context)}`);

  const issues = [];
  const fixes = [];

  // Check critical directories
  for (const dir of CRITICAL_DIRS) {
    if (!existsSync(`./${dir}`)) {
      try {
        mkdirSync(`./${dir}`, { recursive: true });
        fixes.push(`Recreated directory: ${dir}`);
        log(`✅ Recreated missing directory: ${dir}`);
      } catch (err) {
        issues.push(`Cannot recreate dir ${dir}: ${err.message}`);
      }
    }
  }

  // Check critical files
  for (const file of CRITICAL_FILES) {
    if (!existsSync(`./${file}`)) {
      issues.push(`Missing critical file: ${file}`);
      log(`⚠️  Missing: ${file}`);
    }
  }

  // Check memory store health
  try {
    const initialized = MemoryStore.get('system_initialized');
    if (!initialized) {
      MemoryStore.set('system_initialized', true);
      MemoryStore.set('healed_at', new Date().toISOString());
      fixes.push('Reinitialized memory store');
    }
  } catch (err) {
    issues.push(`Memory store unhealthy: ${err.message}`);
  }

  // Check pipeline-specific context
  if (context.pipeline && context.error) {
    const failureHistory = MemoryStore.get('pipeline_failures') || {};
    failureHistory[context.pipeline] = failureHistory[context.pipeline] || [];
    failureHistory[context.pipeline].push({
      error: context.error,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 10 failures per pipeline
    if (failureHistory[context.pipeline].length > 10) {
      failureHistory[context.pipeline] = failureHistory[context.pipeline].slice(-10);
    }
    MemoryStore.set('pipeline_failures', failureHistory);
  }

  const report = {
    timestamp: new Date().toISOString(),
    context,
    issuesFound: issues.length,
    fixesApplied: fixes.length,
    issues,
    fixes,
    status: issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'degraded' : 'critical',
  };

  Logger.log('system', { event: 'self-heal', ...report });
  log(`Heal complete. Issues: ${issues.length}, Fixes: ${fixes.length}, Status: ${report.status}`);

  return report;
}

export function getHealthReport() {
  const failures = MemoryStore.get('pipeline_failures') || {};
  return {
    timestamp: new Date().toISOString(),
    pipelineFailures: failures,
    criticalFiles: CRITICAL_FILES.map((f) => ({ file: f, exists: existsSync(`./${f}`) })),
    criticalDirs: CRITICAL_DIRS.map((d) => ({ dir: d, exists: existsSync(`./${d}`) })),
  };
}

function log(msg) {
  console.log(`[SELF-HEALING-AGENT] ${msg}`);
}
