-- ============================================================
-- NEXUS AUTOMATION ENGINE — Database Initialization
-- PostgreSQL schema for all system data persistence
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Users (for SaaS tools) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plan          TEXT NOT NULL DEFAULT 'free',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Trend Reports ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trend_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  topics        JSONB NOT NULL DEFAULT '[]',
  keywords      JSONB NOT NULL DEFAULT '[]',
  content_ideas JSONB NOT NULL DEFAULT '[]',
  product_ideas JSONB NOT NULL DEFAULT '[]',
  saas_ideas    JSONB NOT NULL DEFAULT '[]',
  raw_count     INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trend_reports_date ON trend_reports(report_date DESC);

-- ── Content Pieces ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_pieces (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id      TEXT UNIQUE,
  title            TEXT NOT NULL,
  hook             TEXT,
  body             TEXT,
  cta              TEXT,
  format           TEXT,
  pillar           TEXT,
  trend_topic      TEXT,
  hashtags         JSONB DEFAULT '[]',
  seo_keywords     JSONB DEFAULT '[]',
  thumbnail_spec   TEXT,
  seo_meta         JSONB DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_pieces_pillar ON content_pieces(pillar);
CREATE INDEX IF NOT EXISTS idx_content_pieces_status ON content_pieces(status);
CREATE INDEX IF NOT EXISTS idx_content_pieces_created ON content_pieces(created_at DESC);

-- ── Video Templates ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_templates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id       UUID REFERENCES content_pieces(id) ON DELETE SET NULL,
  video_title      TEXT NOT NULL,
  shot_list        JSONB NOT NULL DEFAULT '[]',
  voiceover_script TEXT,
  transitions      JSONB DEFAULT '[]',
  music_note       TEXT,
  thumbnail_spec   JSONB DEFAULT '{}',
  end_screen       TEXT,
  tags             JSONB DEFAULT '[]',
  description      TEXT,
  duration_seconds INTEGER,
  status           TEXT NOT NULL DEFAULT 'template',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Digital Products ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id         TEXT UNIQUE,
  name                TEXT NOT NULL,
  tagline             TEXT,
  description         TEXT,
  product_type        TEXT,
  price               TEXT,
  contents            JSONB DEFAULT '[]',
  sales_copy          TEXT,
  upsell              TEXT,
  target_audience     TEXT,
  transformation      TEXT,
  format              TEXT,
  delivery_instructions TEXT,
  trend_topic         TEXT,
  status              TEXT NOT NULL DEFAULT 'ready',
  revenue             NUMERIC(10, 2) DEFAULT 0,
  sales_count         INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- ── SaaS Tools ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saas_tools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     TEXT UNIQUE,
  name            TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  category        TEXT,
  tech_stack      JSONB DEFAULT '{}',
  monetization    JSONB DEFAULT '{}',
  db_schema       JSONB DEFAULT '[]',
  api_endpoints   JSONB DEFAULT '[]',
  ui_screens      JSONB DEFAULT '[]',
  mvp_scope       TEXT,
  status          TEXT NOT NULL DEFAULT 'spec-ready',
  deployed_at     TIMESTAMPTZ,
  monthly_revenue NUMERIC(10, 2) DEFAULT 0,
  user_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SEO Reports ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_reports (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  keywords_researched   INTEGER DEFAULT 0,
  articles_generated    INTEGER DEFAULT 0,
  recommendations       JSONB DEFAULT '[]',
  performance_targets   JSONB DEFAULT '{}',
  top_keywords          JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SEO Articles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword          TEXT NOT NULL,
  title            TEXT,
  meta_description TEXT,
  h1               TEXT,
  body             TEXT,
  faqs             JSONB DEFAULT '[]',
  schema_type      TEXT,
  status           TEXT NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_articles_keyword ON seo_articles USING gin(keyword gin_trgm_ops);

-- ── Monetization Data ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS monetization_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  affiliate_strategy  JSONB DEFAULT '[]',
  funnel_data         JSONB DEFAULT '[]',
  email_sequences     JSONB DEFAULT '[]',
  pricing_analysis    JSONB DEFAULT '{}',
  revenue_projection  JSONB DEFAULT '{}',
  recommendations     JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Deployment History ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deployments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name        TEXT NOT NULL,
  output_dir          TEXT,
  status              TEXT NOT NULL DEFAULT 'pending',
  files               JSONB DEFAULT '[]',
  railway_project_id  TEXT,
  validated_at        TIMESTAMPTZ,
  deployed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── System Logs ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type    TEXT NOT NULL,
  source      TEXT,
  message     TEXT NOT NULL,
  meta        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_logs_type ON system_logs(log_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at DESC);

-- ── Pipeline Run History ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name   TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'running',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  duration_ms     INTEGER,
  result_summary  JSONB DEFAULT '{}',
  error           TEXT
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_name ON pipeline_runs(pipeline_name);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started ON pipeline_runs(started_at DESC);

-- ── Seed: initial brand identity record ───────────────────────────────────────
INSERT INTO system_logs (log_type, source, message, meta)
VALUES ('system', 'db-init', 'Nexus Automation Engine database initialized.', '{"version": "1.0.0"}')
ON CONFLICT DO NOTHING;
