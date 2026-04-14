/**
 * NEXUS AUTOMATION ENGINE — Deployment Configuration
 * Railway deployment manifests and environment setup instructions.
 */

export const DEPLOYMENT_CONFIG = {
  platform: 'Railway',
  region: 'us-west1',
  services: [
    {
      name: 'nexus-core',
      description: 'Nexus Automation Engine — Main API + Orchestrator',
      builder: 'DOCKERFILE',
      dockerfile: 'Dockerfile',
      port: 3000,
      healthcheck: '/health',
      envVars: [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'OPENAI_API_KEY',
        'OPENAI_MODEL',
        'TREND_SCAN_CRON',
        'CONTENT_CRON',
        'SEO_CRON',
        'PRODUCT_CRON',
        'SAAS_CRON',
        'MONETIZATION_CRON',
        'BRANDING_CRON',
        'DAILY_CONTENT_COUNT',
        'RSS_FEED_URLS',
        'BRAND_ACCENT_COLOR',
        'LOG_LEVEL',
        'RATE_LIMIT_DAILY',
        'MAX_TOKENS_PER_REQUEST',
      ],
      restartPolicy: 'ON_FAILURE',
      maxRetries: 5,
    },
    {
      name: 'nexus-db',
      description: 'PostgreSQL database for Nexus Automation Engine',
      plugin: 'postgresql',
      version: '15',
    },
  ],
  deploySteps: [
    '1. Create new Railway project',
    '2. Add PostgreSQL plugin → copy DATABASE_URL',
    '3. Create nexus-core service from GitHub repo',
    '4. Set all required environment variables from env.schema.json',
    '5. Deploy — Railway builds Dockerfile automatically',
    '6. Verify health at /health endpoint',
    '7. Check /status for full system status',
    '8. System begins autonomous operation immediately',
  ],
};
