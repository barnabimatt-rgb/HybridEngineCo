/**
 * NEXUS AUTOMATION ENGINE — CodeGen Agent
 * Builds production-ready code for micro-SaaS tools from specs.
 */

import { generateCompletion } from '../automation/openai-client.js';
import Logger from '../memory/logger.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function init() {
  Logger.system('[CODEGEN-AGENT] Initialized.');
}

export async function buildSaasTool(toolSpec) {
  log(`Building SaaS code for: ${toolSpec.name}`);

  const outputDir = join('./saas', slugify(toolSpec.name));
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const files = {};

  // Generate server entry
  files['server.js'] = await generateServerCode(toolSpec);

  // Generate DB init SQL
  files['db-init.sql'] = generateDbInit(toolSpec.dbSchema || []);

  // Generate package.json
  files['package.json'] = generatePackageJson(toolSpec);

  // Generate Dockerfile
  files['Dockerfile'] = generateDockerfile(toolSpec.name);

  // Generate railway.json
  files['railway.json'] = generateRailwayConfig(toolSpec.name);

  // Generate frontend index
  files['public/index.html'] = await generateFrontend(toolSpec);

  // Generate README
  files['README.md'] = generateReadme(toolSpec);

  // Write all files
  for (const [filename, content] of Object.entries(files)) {
    const filePath = join(outputDir, filename);
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  log(`✅ Code written to ${outputDir}`);
  Logger.log('saas', { action: 'codegen', tool: toolSpec.name, outputDir, files: Object.keys(files) });

  return { outputDir, files: Object.keys(files), toolSpec };
}

async function generateServerCode(spec) {
  const endpoints = (spec.apiEndpoints || []).map((e) => `${e.method} ${e.path} — ${e.description}`).join('\n');
  const prompt = `Generate a complete Node.js/Express server for a micro-SaaS called "${spec.name}".
Tech stack: ${JSON.stringify(spec.techStack || {})}.
API endpoints to implement:
${endpoints}

Requirements:
- Use ES modules (import/export)
- PostgreSQL with pg library
- JWT auth (if auth endpoints exist)
- Input validation
- Error handling middleware
- Health check at GET /health
- CORS enabled
- Environment variables for DB_URL, JWT_SECRET, PORT
- Production-ready structure

Respond with ONLY the complete server.js code, no explanation.`;

  try {
    return await generateCompletion(prompt, 2000);
  } catch {
    return generateFallbackServer(spec);
  }
}

async function generateFrontend(spec) {
  const screens = (spec.uiScreens || ['Dashboard']).join(', ');
  const prompt = `Generate a complete single-page HTML application for "${spec.name}".
Tagline: ${spec.tagline}
UI Screens needed: ${screens}
Style: dark minimalist, #0D0D0D background, #00F0FF accent, Space Grotesk font, no frameworks (vanilla JS).
Include Alpine.js from CDN for reactivity.
Respond with ONLY the complete index.html, no explanation.`;

  try {
    return await generateCompletion(prompt, 2000);
  } catch {
    return generateFallbackHTML(spec);
  }
}

function generateDbInit(schema) {
  const lines = ['-- Nexus Automation Engine — DB Init', 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";', ''];
  for (const table of schema) {
    const cols = (table.columns || []).map((c) => `  ${c.name} ${c.type}${c.constraints ? ' ' + c.constraints : ''}`).join(',\n');
    lines.push(`CREATE TABLE IF NOT EXISTS ${table.table} (\n${cols}\n);`);
    lines.push('');
  }
  return lines.join('\n');
}

function generatePackageJson(spec) {
  return JSON.stringify({
    name: slugify(spec.name),
    version: '1.0.0',
    type: 'module',
    main: 'server.js',
    scripts: { start: 'node server.js', 'init-db': 'node -e "import(\'./db-init.js\')"' },
    dependencies: {
      express: '^4.19.2',
      pg: '^8.12.0',
      jsonwebtoken: '^9.0.2',
      bcrypt: '^5.1.1',
      cors: '^2.8.5',
      dotenv: '^16.4.5',
    },
    engines: { node: '>=20.0.0' },
  }, null, 2);
}

function generateDockerfile(name) {
  return `FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
`;
}

function generateRailwayConfig(name) {
  return JSON.stringify({
    build: { builder: 'DOCKERFILE', dockerfilePath: 'Dockerfile' },
    deploy: { startCommand: 'node server.js', healthcheckPath: '/health', restartPolicyType: 'ON_FAILURE' },
  }, null, 2);
}

function generateReadme(spec) {
  return `# ${spec.name}

> ${spec.tagline}

## Description
${spec.description}

## Features
${(spec.features || []).map((f) => `- ${f}`).join('\n')}

## Tech Stack
- Frontend: ${spec.techStack?.frontend || 'Vanilla JS'}
- Backend: ${spec.techStack?.backend || 'Node.js + Express'}
- Database: ${spec.techStack?.database || 'PostgreSQL'}
- Hosting: Railway

## Monetization
- Model: ${spec.monetization?.model || 'freemium'}
- Price: ${spec.monetization?.price || '$9/mo'}

## Setup
\`\`\`bash
npm install
# Set DATABASE_URL, JWT_SECRET, PORT in environment
node db-init.js
npm start
\`\`\`

## API Endpoints
${(spec.apiEndpoints || []).map((e) => `- \`${e.method} ${e.path}\` — ${e.description}`).join('\n')}

---
Built by Nexus Automation Engine
`;
}

function generateFallbackServer(spec) {
  return `import express from 'express';
import { createServer } from 'http';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: '${spec.name}' }));
app.get('/api/dashboard', (req, res) => res.json({ message: '${spec.tagline}', status: 'operational' }));
createServer(app).listen(PORT, () => console.log('[${spec.name}] Running on port', PORT));
`;
}

function generateFallbackHTML(spec) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${spec.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0D0D0D; color: #E8E8E8; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .container { text-align: center; max-width: 600px; padding: 2rem; }
    h1 { font-size: 3rem; color: #00F0FF; margin-bottom: 1rem; }
    p { color: #888; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 2rem; padding: 0.75rem 2rem; background: #00F0FF; color: #0D0D0D; font-weight: 700; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${spec.name}</h1>
    <p>${spec.tagline}</p>
    <a href="/api/dashboard" class="btn">Launch App</a>
  </div>
</body>
</html>`;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function log(msg) {
  console.log(`[CODEGEN-AGENT] ${msg}`);
}
