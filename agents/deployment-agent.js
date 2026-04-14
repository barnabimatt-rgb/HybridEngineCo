/**
 * NEXUS AUTOMATION ENGINE — Deployment Agent
 * Validates, packages, and deploys services to Railway.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import Logger from '../memory/logger.js';
import MemoryStore from '../memory/memory-store.js';

export async function init() {
  Logger.system('[DEPLOYMENT-AGENT] Initialized.');
}

export async function deployService(codeOutput) {
  log(`Deploying service: ${codeOutput?.toolSpec?.name || 'unknown'}`);

  const outputDir = codeOutput?.outputDir;
  if (!outputDir || !existsSync(outputDir)) {
    log('No output directory found. Skipping deployment.');
    return { status: 'skipped', reason: 'no-output-dir' };
  }

  const validation = validateCode(outputDir);
  if (!validation.valid) {
    Logger.error('DEPLOYMENT_AGENT', `Validation failed: ${validation.errors.join(', ')}`);
    return { status: 'failed', reason: 'validation', errors: validation.errors };
  }

  const deploymentRecord = {
    id: `deploy-${Date.now()}`,
    service: codeOutput.toolSpec?.name || 'unknown',
    outputDir,
    validatedAt: new Date().toISOString(),
    status: 'validated',
    railwayProjectId: process.env.RAILWAY_PROJECT_ID || null,
    files: codeOutput.files,
  };

  // Log deployment attempt
  const history = MemoryStore.get('deployment_history') || [];
  history.unshift(deploymentRecord);
  if (history.length > 50) history.pop();
  MemoryStore.set('deployment_history', history);

  Logger.log('deployment', deploymentRecord);
  log(`✅ Deployment record created: ${deploymentRecord.id}`);

  return deploymentRecord;
}

export async function validateAndDeploy() {
  log('Running full deployment validation...');

  const checks = {
    serverExists: existsSync('./server.js'),
    packageExists: existsSync('./package.json'),
    dockerfileExists: existsSync('./Dockerfile'),
    railwayConfigExists: existsSync('./railway.json'),
    envSchemaExists: existsSync('./env.schema.json'),
  };

  const allPassed = Object.values(checks).every(Boolean);

  const result = {
    timestamp: new Date().toISOString(),
    checks,
    allPassed,
    status: allPassed ? 'ready' : 'incomplete',
    recommendation: allPassed
      ? 'All deployment files present. Ready for Railway deploy.'
      : `Missing files: ${Object.entries(checks).filter(([, v]) => !v).map(([k]) => k).join(', ')}`,
  };

  Logger.log('deployment', result);
  log(result.recommendation);
  return result;
}

function validateCode(dir) {
  const errors = [];
  const requiredFiles = ['server.js', 'package.json', 'Dockerfile', 'railway.json'];

  for (const file of requiredFiles) {
    if (!existsSync(`${dir}/${file}`)) {
      errors.push(`Missing: ${file}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateDockerfileSpec(serviceName) {
  return {
    baseImage: 'node:20-alpine',
    workdir: '/app',
    exposePort: 3000,
    healthcheck: 'GET /health',
    startCommand: 'node server.js',
    envRequired: ['PORT', 'DATABASE_URL'],
  };
}

export function generateRailwaySpec(serviceName) {
  return {
    serviceName,
    region: 'us-west1',
    builder: 'DOCKERFILE',
    restartPolicy: 'ON_FAILURE',
    healthcheckPath: '/health',
    envVars: ['PORT', 'DATABASE_URL', 'NODE_ENV'],
  };
}

function log(msg) {
  console.log(`[DEPLOYMENT-AGENT] ${msg}`);
}
