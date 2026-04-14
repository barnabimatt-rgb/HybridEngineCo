# NEXUS AUTOMATION ENGINE — Agent Communication Protocol

## Overview

All agents communicate through structured message objects passed via the Mega-Agent.

---

## Message Format: Agent → Mega-Agent

```json
{
  "from": "AGENT_NAME",
  "to": "MEGA-AGENT",
  "timestamp": "ISO-8601",
  "summary": "Short description of what was done",
  "outputs": {
    "key": "value"
  },
  "issues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"],
  "nextSteps": ["step1", "step2"]
}
```

## Message Format: Mega-Agent → Agent

```json
{
  "from": "MEGA-AGENT",
  "to": "AGENT_NAME",
  "timestamp": "ISO-8601",
  "acknowledgment": "Received and validated.",
  "validation": "pass | fail | partial",
  "corrections": ["correction if any"],
  "nextTask": {
    "pipeline": "pipeline-name",
    "params": {}
  }
}
```

---

## Agent Roster & Responsibilities

| Agent | Domain | Frequency |
|-------|--------|-----------|
| Trend Intelligence Agent | RSS scanning, topic extraction, trend reports | Daily |
| Branding Agent | Brand identity, visual assets, templates | Monthly |
| Content Agent | 3-6 content pieces per pillar | Daily |
| Video Agent | Shot lists, voiceover scripts, video templates | Daily |
| Product Agent | Digital product specs + sales copy | Weekly (Wed) |
| Micro-SaaS Agent | SaaS tool specs + roadmap | Weekly (Mon) |
| CodeGen Agent | Production code for SaaS tools | On demand |
| Deployment Agent | Docker, Railway config, validation | Weekly (Fri) |
| SEO Agent | Keywords, articles, metadata | Daily |
| Monetization Agent | Funnels, email sequences, affiliate strategy | 2x/week |
| Automation Agent | Cron scheduling, workflow management | Always-on |
| Self-Healing Agent | Failure detection, recovery | On failure |
| Fallback Agent | Simplified outputs on pipeline failure | On failure |
| Limit-Aware Agent | API usage monitoring, throttling | Always-on |

---

## Pipeline Execution Flow

```
Mega-Agent
    ↓
[Check LimitAwareAgent.isThrottled()]
    ↓ (not throttled)
[Run Pipeline Function]
    ↓
[Sub-agents execute]
    ↓
[Results → MemoryStore]
    ↓
[Logger records output]
    ↓
[FallbackAgent.cachePipelineOutput()]
    ↓
[Return to caller / schedule next]
```

**On failure:**
```
Pipeline throws error
    ↓
MegaAgent catches
    ↓
SelfHealingAgent.heal({ pipeline, error })
    ↓
FallbackAgent.fallback(pipelineName, error)
    ↓
Return fallback result (never crash)
```

---

## Limit-Aware Thresholds

| Usage % | Status | Action |
|---------|--------|--------|
| 0–50% | Normal | Full operation |
| 50–85% | Moderate | Monitor only |
| 85–95% | Warning | Throttle: defer non-critical pipelines |
| 95–100% | Critical | Block all AI requests until reset |

Resets daily at 00:00 UTC.
