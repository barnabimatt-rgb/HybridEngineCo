# ── NEXUS AUTOMATION ENGINE — Dockerfile ──────────────────────────────────────
FROM node:20-alpine AS base

LABEL maintainer="Nexus Automation Engine"
LABEL description="Fully autonomous AI business system"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    tzdata \
    postgresql-client

# Set timezone
ENV TZ=UTC

# ── Dependencies stage ────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nexus && \
    adduser -S nexus -u 1001 -G nexus

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --chown=nexus:nexus . .

# Create writable runtime directories
RUN mkdir -p logs memory/data && \
    chown -R nexus:nexus logs memory/data

# Switch to non-root user
USER nexus

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start command
CMD ["node", "server.js"]
