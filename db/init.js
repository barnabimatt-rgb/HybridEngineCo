/**
 * NEXUS AUTOMATION ENGINE — DB Init Script
 * Runs db-init.sql against the PostgreSQL database.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.error('[DB-INIT] ERROR: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('[DB-INIT] Connecting to database...');
    const client = await pool.connect();

    const sql = readFileSync(join(__dirname, 'db-init.sql'), 'utf8');

    console.log('[DB-INIT] Running schema migration...');
    await client.query(sql);

    console.log('[DB-INIT] ✅ Database initialized successfully.');
    client.release();
  } catch (err) {
    console.error('[DB-INIT] ❌ Failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
