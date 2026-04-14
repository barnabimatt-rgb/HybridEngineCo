# NEXUS AUTOMATION ENGINE
## Full System Documentation

---

## Overview

The **Nexus Automation Engine** is a fully autonomous, faceless AI business system built to generate revenue through content, digital products, micro-SaaS tools, and affiliate monetization — with zero daily human involvement.

**Architecture:** Hybrid Mode — Mega-Agent + Specialist Sub-Agents  
**Operational Mode:** Balanced (3–6 content/day, 1–2 products/week, 1 SaaS/week)  
**Deployment:** Railway  
**Brand:** Minimalist, anonymous, tech-forward AI productivity brand

---

## System Architecture

```
server.js                  ← HTTP API + Boot sequence
│
├── agents/
│   ├── mega-agent.js      ← Orchestrator / Director
│   ├── trend-agent.js     ← Daily trend scanning
│   ├── branding-agent.js  ← Brand identity + assets
│   ├── content-agent.js   ← 3-6 content pieces/day
│   ├── video-agent.js     ← Faceless video templates
│   ├── product-agent.js   ← Digital product generation
│   ├── microsaas-agent.js ← Micro-SaaS specs
│   ├── codegen-agent.js   ← Code generation for SaaS tools
│   ├── deployment-agent.js← Railway deployment
│   ├── seo-agent.js       ← SEO + keyword research
│   ├── monetization-agent.js ← Funnels + affiliates + email
│   ├── automation-agent.js   ← Cron scheduler
│   ├── self-healing-agent.js ← Failure detection + repair
│   ├── fallback-agent.js     ← Simplified fallback outputs
│   └── limit-aware-agent.js  ← Rate limit monitoring
│
├── automation/
│   ├── openai-client.js   ← Centralized AI API client
│   └── scheduler-utils.js ← Retry, queue, debounce utils
│
├── memory/
│   ├── memory-store.js    ← Key-value persistence store
│   └── logger.js          ← Structured JSON logging
│
├── db/
│   ├── db-init.sql        ← PostgreSQL schema
│   └── init.js            ← DB initialization script
│
├── content/               ← Content templates + frameworks
├── products/              ← Product templates + upsell ladder
├── saas/                  ← SaaS boilerplate + generated tools
├── seo/                   ← SEO templates + keyword frameworks
├── video/                 ← Video production templates
├── deployment/            ← Railway configs
├── logs/                  ← Runtime logs (auto-generated)
└── memory/data/           ← Persistent memory (auto-generated)
```

---

## The 5-Pillar Niche Stack

All content, products, and SaaS tools must align with one of:

| Pillar | Focus |
|--------|-------|
| AI Productivity | Tools, workflows, AI-powered systems |
| Digital Minimalism | Simplification, less-is-more, tool elimination |
| Automation Lifestyle | Set-and-forget systems, passive automation |
| Solopreneur Efficiency | One-person business optimization |
| Tech-Optimized Living | Smart tech stacks, device curation, optimized environments |

---

## Daily Operational Schedule (UTC)

| Time | Pipeline | Agent |
|------|----------|-------|
| 06:00 | Trend Update | Trend Intelligence Agent |
| 08:00 | Content Generation (4 pieces) | Content Agent |
| 09:00 | SEO Update | SEO Agent |
| 10:00 | Video Production | Video Agent |
| Mon 10:00 | SaaS Update | Micro-SaaS Agent |
| Wed 10:00 | Product Update | Product Agent |
| Mon/Fri 11:00 | Monetization Update | Monetization Agent |
| 1st of month 12:00 | Branding Refresh | Branding Agent |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | System health check |
| GET | /status | Full system status + metrics |
| POST | /pipeline/trend | Manually trigger trend pipeline |
| POST | /pipeline/content | Manually trigger content pipeline |
| POST | /pipeline/product | Manually trigger product pipeline |
| POST | /pipeline/saas | Manually trigger SaaS pipeline |
| POST | /pipeline/seo | Manually trigger SEO pipeline |
| POST | /selfheal | Manually trigger self-healing |
| GET | /logs/:type | Retrieve logs (trend, content, product, etc.) |

---

## Environment Variables

See `env.schema.json` for the complete schema.

**Required:**
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — OpenAI API key

**Optional (with defaults):**
- `OPENAI_MODEL` — `gpt-4o-mini`
- `DAILY_CONTENT_COUNT` — `4`
- `RATE_LIMIT_DAILY` — `200`
- `BRAND_ACCENT_COLOR` — `#00F0FF`
- All `*_CRON` variables — see env.schema.json

---

## Deployment (Railway)

```bash
# 1. Push codebase to GitHub
# 2. Create Railway project → connect repo
# 3. Add PostgreSQL plugin
# 4. Set environment variables
# 5. Deploy — Railway builds Dockerfile automatically
# 6. Verify: GET /health
# 7. System begins autonomous operation
```

**Railway Services Required:**
- `nexus-core` — Main API (this repo)
- `nexus-db` — PostgreSQL plugin

---

## Self-Healing System

The Self-Healing Agent automatically:
- Recreates missing directories
- Detects critical file absence
- Reinitializes memory store if corrupted
- Logs all pipeline failures with full context
- Triggers Fallback Agent when pipelines fail repeatedly

---

## Memory Persistence

All system state is persisted to `./memory/data/store.json`:
- `brand_identity` — Brand spec
- `content_calendar` — 30-day content plan
- `product_roadmap` — 8-week product pipeline
- `saas_roadmap` — 8-week SaaS pipeline
- `latest_trend_report` — Most recent trend scan
- `latest_content_batch` — Most recent content pieces
- `products` — All generated products
- `saas_tools` — All generated SaaS tools
- `usage` — API usage tracking
- `deployment_history` — Deployment records
- `pipeline_failures` — Failure history per pipeline

---

## Brand Identity

**Name:** Nexus Automation Engine  
**Tagline:** Build. Automate. Scale. Silently.  
**Colors:** `#0D0D0D` base, `#00F0FF` accent, `#E8E8E8` text  
**Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (code)  
**Style:** Dark minimalist, geometric, no faces, anonymous  
**Voice:** Direct, clear, no fluff, systematic, analytical

---

## Revenue Model

1. **Digital Products** — Gumroad / Lemon Squeezy ($7–$97)
2. **Micro-SaaS Subscriptions** — Railway-hosted tools ($9–$29/mo)
3. **Affiliate Commissions** — Notion, Beehiiv, ConvertKit, Zapier, etc.
4. **Email List** — ConvertKit list for product launches + nurture

---

*Built and maintained autonomously by the Nexus Automation Engine.*  
*Last updated: auto-generated at system initialization.*
