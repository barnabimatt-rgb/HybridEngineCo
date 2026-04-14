/**
 * NEXUS AUTOMATION ENGINE — Logger
 * Structured logging to console + rotating JSON log files.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const LOG_PATH = process.env.LOG_PATH || './logs';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const MAX_LOG_LINES = 5000;

const LEVEL_PRIORITY = { debug: 0, info: 1, warn: 2, error: 3 };

function ensureLogDir() {
  if (!existsSync(LOG_PATH)) {
    mkdirSync(LOG_PATH, { recursive: true });
  }
}

function writeToFile(filename, entry) {
  try {
    ensureLogDir();
    const filePath = join(LOG_PATH, `${filename}.jsonl`);
    appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('[LOGGER] Failed to write log:', err.message);
  }
}

function shouldLog(level) {
  return (LEVEL_PRIORITY[level] || 0) >= (LEVEL_PRIORITY[LOG_LEVEL] || 1);
}

const Logger = {
  log(type, data) {
    const entry = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    if (shouldLog('info')) {
      console.log(`[LOG:${type.toUpperCase()}]`, JSON.stringify(data).slice(0, 200));
    }
    writeToFile(type, entry);
  },

  system(message, meta = {}) {
    const entry = {
      type: 'system',
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
    if (shouldLog('info')) {
      console.log(`[SYSTEM] ${message}`);
    }
    writeToFile('system', entry);
  },

  error(source, message, meta = {}) {
    const entry = {
      type: 'error',
      source,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
    console.error(`[ERROR:${source}] ${message}`);
    writeToFile('error', entry);
  },

  warn(source, message, meta = {}) {
    if (!shouldLog('warn')) return;
    const entry = {
      type: 'warn',
      source,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
    console.warn(`[WARN:${source}] ${message}`);
    writeToFile('system', entry);
  },

  debug(source, message, meta = {}) {
    if (!shouldLog('debug')) return;
    const entry = { type: 'debug', source, message, meta, timestamp: new Date().toISOString() };
    console.debug(`[DEBUG:${source}] ${message}`);
    writeToFile('system', entry);
  },

  read(type) {
    try {
      ensureLogDir();
      const filePath = join(LOG_PATH, `${type}.jsonl`);
      if (!existsSync(filePath)) return [];
      const lines = readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(Boolean)
        .slice(-500); // Return last 500 entries
      return lines.map((line) => {
        try { return JSON.parse(line); } catch { return { raw: line }; }
      }).reverse();
    } catch (err) {
      return [{ error: err.message }];
    }
  },
};

export default Logger;
