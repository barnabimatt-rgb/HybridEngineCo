/**
 * NEXUS AUTOMATION ENGINE — Memory Store
 * Persistent in-memory + file-backed key-value store.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PERSIST_PATH = process.env.MEMORY_PERSIST_PATH || './memory/data';
const STORE_FILE = join(PERSIST_PATH, 'store.json');
const FLUSH_INTERVAL_MS = 30 * 1000; // Flush every 30 seconds

let store = {};
let flushTimer = null;
let initialized = false;

const MemoryStore = {
  async init() {
    if (initialized) return;

    // Ensure directory exists
    if (!existsSync(PERSIST_PATH)) {
      mkdirSync(PERSIST_PATH, { recursive: true });
    }

    // Load existing data
    if (existsSync(STORE_FILE)) {
      try {
        const raw = readFileSync(STORE_FILE, 'utf8');
        store = JSON.parse(raw);
        console.log(`[MEMORY-STORE] Loaded ${Object.keys(store).length} keys from disk.`);
      } catch (err) {
        console.warn('[MEMORY-STORE] Failed to load store from disk. Starting fresh.', err.message);
        store = {};
      }
    }

    // Start auto-flush
    flushTimer = setInterval(() => {
      MemoryStore.flush();
    }, FLUSH_INTERVAL_MS);

    initialized = true;
    console.log('[MEMORY-STORE] Initialized.');
  },

  get(key) {
    return store[key] ?? null;
  },

  set(key, value) {
    store[key] = value;
  },

  delete(key) {
    delete store[key];
  },

  has(key) {
    return key in store;
  },

  keys() {
    return Object.keys(store);
  },

  all() {
    return { ...store };
  },

  flush() {
    try {
      if (!existsSync(PERSIST_PATH)) {
        mkdirSync(PERSIST_PATH, { recursive: true });
      }
      writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
    } catch (err) {
      console.error('[MEMORY-STORE] Flush failed:', err.message);
    }
  },

  clear() {
    store = {};
    MemoryStore.flush();
  },

  stopFlush() {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
    MemoryStore.flush(); // Final flush on stop
  },
};

export default MemoryStore;
