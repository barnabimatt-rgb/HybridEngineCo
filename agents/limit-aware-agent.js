/**
 * NEXUS AUTOMATION ENGINE — Limit-Aware Agent
 * Monitors resource usage and throttles output when limits approach.
 */

import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

const DAILY_REQUEST_LIMIT = parseInt(process.env.RATE_LIMIT_DAILY || '200');
const THROTTLE_THRESHOLD = 0.85; // Throttle at 85% of limit
const CRITICAL_THRESHOLD = 0.95; // Critical at 95%

let monitorInterval = null;
let throttled = false;

const usage = {
  openaiRequests: 0,
  tokensUsed: 0,
  pipelineRuns: 0,
  lastReset: new Date().toISOString(),
};

export async function init() {
  resetDailyUsage();
  Logger.system('[LIMIT-AWARE-AGENT] Initialized.');
}

export function startMonitor() {
  if (monitorInterval) return;

  // Check every 5 minutes
  monitorInterval = setInterval(() => {
    checkLimits();
  }, 5 * 60 * 1000);

  // Auto-reset at midnight UTC
  scheduleReset();

  log('Monitor started.');
}

export function stopMonitor() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }
  log('Monitor stopped.');
}

export function isThrottled() {
  return throttled;
}

export function trackRequest(tokens = 0) {
  usage.openaiRequests++;
  usage.tokensUsed += tokens;
  MemoryStore.set('usage', { ...usage });
  checkLimits();
}

export function trackPipelineRun(pipeline) {
  usage.pipelineRuns++;
  MemoryStore.set('usage', { ...usage });
}

export function getUsageReport() {
  const requestPercent = usage.openaiRequests / DAILY_REQUEST_LIMIT;
  return {
    openaiRequests: usage.openaiRequests,
    requestLimit: DAILY_REQUEST_LIMIT,
    requestUsagePercent: Math.round(requestPercent * 100),
    tokensUsed: usage.tokensUsed,
    pipelineRuns: usage.pipelineRuns,
    throttled,
    lastReset: usage.lastReset,
    status: getStatus(requestPercent),
  };
}

function checkLimits() {
  const requestPercent = usage.openaiRequests / DAILY_REQUEST_LIMIT;

  if (requestPercent >= CRITICAL_THRESHOLD) {
    if (!throttled) {
      throttled = true;
      log(`⚠️  CRITICAL: ${Math.round(requestPercent * 100)}% of daily limit used. Throttling ALL pipelines.`);
      Logger.log('system', { event: 'throttle', level: 'critical', usage: getUsageReport() });
    }
  } else if (requestPercent >= THROTTLE_THRESHOLD) {
    if (!throttled) {
      throttled = true;
      log(`⚠️  WARNING: ${Math.round(requestPercent * 100)}% of daily limit used. Entering throttle mode.`);
      Logger.log('system', { event: 'throttle', level: 'warning', usage: getUsageReport() });
    }
  } else {
    if (throttled) {
      throttled = false;
      log('✅ Usage back within limits. Throttle released.');
      Logger.log('system', { event: 'throttle_released', usage: getUsageReport() });
    }
  }
}

function getStatus(percent) {
  if (percent >= CRITICAL_THRESHOLD) return 'critical';
  if (percent >= THROTTLE_THRESHOLD) return 'warning';
  if (percent >= 0.5) return 'moderate';
  return 'normal';
}

function resetDailyUsage() {
  usage.openaiRequests = 0;
  usage.tokensUsed = 0;
  usage.pipelineRuns = 0;
  usage.lastReset = new Date().toISOString();
  throttled = false;
  MemoryStore.set('usage', { ...usage });
  log('Daily usage counters reset.');
}

function scheduleReset() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    resetDailyUsage();
    // Then reset every 24h
    setInterval(resetDailyUsage, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}

function log(msg) {
  console.log(`[LIMIT-AWARE-AGENT] ${msg}`);
}
