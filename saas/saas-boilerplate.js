/**
 * NEXUS AUTOMATION ENGINE — SaaS Boilerplate
 * Minimal Express + PostgreSQL boilerplate for micro-SaaS tools.
 * CodeGen Agent extends this template for each generated tool.
 */

import express from 'express';
import { createServer } from 'http';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// ── DB Pool ───────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: process.env.SERVICE_NAME || 'nexus-saas-tool', timestamp: new Date().toISOString() });
});

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, plan, created_at',
      [email.toLowerCase().trim(), hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    console.error('[AUTH] Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: { id: user.id, email: user.email, plan: user.plan }, token });
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get('/api/dashboard', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, status, last_run, created_at FROM workflows WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({
      workflows: result.rows,
      user: { id: req.user.id, email: req.user.email, plan: req.user.plan },
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
});

// ── Workflows CRUD ────────────────────────────────────────────────────────────
app.get('/api/workflows', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM workflows WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

app.post('/api/workflows', requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const result = await pool.query(
    'INSERT INTO workflows (user_id, name) VALUES ($1, $2) RETURNING *',
    [req.user.id, name]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/api/workflows/:id', requireAuth, async (req, res) => {
  const { name, status } = req.body;
  const result = await pool.query(
    'UPDATE workflows SET name = COALESCE($1, name), status = COALESCE($2, status) WHERE id = $3 AND user_id = $4 RETURNING *',
    [name, status, req.params.id, req.user.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

app.delete('/api/workflows/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM workflows WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.status(204).end();
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ── Start ─────────────────────────────────────────────────────────────────────
createServer(app).listen(PORT, () => {
  console.log(`[SAAS-BOILERPLATE] Running on port ${PORT}`);
});

export default app;
