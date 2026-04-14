/**
 * NEXUS AUTOMATION ENGINE — Automation Agent
 * Schedules all daily, weekly, and monthly pipeline tasks via node-cron.
 */

import cron from 'node-cron';
import Logger from '../memory/logger.js';

let jobs = [];
let schedulerRunning = false;

export async function init() {
  Logger.system('[AUTOMATION-AGENT] Initialized.');
}

export async function startScheduler() {
  if (schedulerRunning) {
    log('Scheduler already running.');
    return;
  }

  log('Starting scheduler...');

  // Lazy import to avoid circular deps
  const { runPipeline } = await import('./mega-agent.js');

  const schedule = buildSchedule(runPipeline);

  for (const job of schedule) {
    if (!cron.validate(job.cron)) {
      Logger.error('AUTOMATION_AGENT', `Invalid cron expression for ${job.name}: ${job.cron}`);
      continue;
    }
    const task = cron.schedule(job.cron, async () => {
      log(`🕐 Running scheduled job: ${job.name}`);
      Logger.log('system', { event: 'scheduled_job', job: job.name, timestamp: new Date().toISOString() });
      try {
        await job.fn();
      } catch (err) {
        Logger.error(`SCHEDULED_JOB_${job.name.toUpperCase()}`, err.message);
      }
    }, { timezone: 'UTC' });

    jobs.push({ name: job.name, task, cron: job.cron });
    log(`✅ Scheduled: ${job.name} [${job.cron}]`);
  }

  schedulerRunning = true;
  log(`Scheduler active. ${jobs.length} jobs registered.`);
}

export function stopScheduler() {
  for (const job of jobs) {
    job.task.stop();
  }
  jobs = [];
  schedulerRunning = false;
  log('Scheduler stopped. All jobs cleared.');
}

export function getScheduledJobs() {
  return jobs.map((j) => ({ name: j.name, cron: j.cron }));
}

function buildSchedule(runPipeline) {
  return [
    // ── DAILY ──────────────────────────────────────────────────────────────────
    {
      name: 'trend-update',
      cron: process.env.TREND_SCAN_CRON || '0 6 * * *',
      fn: () => runPipeline('trend'),
    },
    {
      name: 'content-generation',
      cron: process.env.CONTENT_CRON || '0 8 * * *',
      fn: () => runPipeline('content'),
    },
    {
      name: 'seo-update',
      cron: process.env.SEO_CRON || '0 9 * * *',
      fn: () => runPipeline('seo'),
    },
    {
      name: 'video-production',
      cron: '0 10 * * *',
      fn: () => runPipeline('video'),
    },

    // ── WEEKLY ────────────────────────────────────────────────────────────────
    {
      name: 'saas-update',
      cron: process.env.SAAS_CRON || '0 10 * * 1', // Monday
      fn: () => runPipeline('saas'),
    },
    {
      name: 'product-update',
      cron: process.env.PRODUCT_CRON || '0 10 * * 3', // Wednesday
      fn: () => runPipeline('product'),
    },
    {
      name: 'monetization-update-1',
      cron: '0 11 * * 1', // Monday
      fn: () => runPipeline('monetization'),
    },
    {
      name: 'monetization-update-2',
      cron: '0 11 * * 5', // Friday
      fn: () => runPipeline('monetization'),
    },
    {
      name: 'deployment-check',
      cron: '0 18 * * 5', // Friday evening
      fn: () => runPipeline('deployment'),
    },

    // ── MONTHLY ───────────────────────────────────────────────────────────────
    {
      name: 'branding-update',
      cron: process.env.BRANDING_CRON || '0 12 1 * *', // 1st of month
      fn: () => runPipeline('branding'),
    },
  ];
}

function log(msg) {
  console.log(`[AUTOMATION-AGENT] ${msg}`);
}
