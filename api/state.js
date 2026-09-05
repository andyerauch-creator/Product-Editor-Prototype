// Single shared app-state blob, persisted in Neon Postgres so it's available
// from any device that opens the deployed app — not just whichever browser's
// localStorage happens to hold it. One row, one document: this mirrors the
// existing localStorage shape exactly (see index.html's saveStateToStorage/
// loadStateFromStorage), just stored server-side instead of client-side.
//
// GET  -> returns the saved state JSON (or `null` if nothing's been saved yet)
// POST -> upserts the given JSON as the new saved state
//
// No auth, no per-user rows: this is a single shared workspace, matching how
// the app already behaves today (everyone who opens it sees the same data).
const { neon } = require('@neondatabase/serverless');

// The Neon Vercel integration names this env var differently depending on
// which environment it's deployed to (plain DATABASE_URL in Development,
// STORAGE_DATABASE_URL in Production/Preview, in this project's case) — check
// both rather than assuming one.
const connectionString = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;

let ensureTablePromise = null;
function ensureTable(sql) {
  if (!ensureTablePromise) {
    ensureTablePromise = sql`
      CREATE TABLE IF NOT EXISTS app_state (
        id INTEGER PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  }
  return ensureTablePromise;
}

module.exports = async function handler(req, res) {
  if (!connectionString) {
    res.status(500).json({ error: 'DATABASE_URL is not configured' });
    return;
  }
  const sql = neon(connectionString);

  try {
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM app_state WHERE id = 1`;
      res.status(200).json({ data: rows.length ? rows[0].data : null });
      return;
    }

    if (req.method === 'POST') {
      // Vercel parses a JSON request body into req.body automatically when
      // Content-Type: application/json is set (fetch's JSON.stringify body
      // does this by default).
      const body = req.body;
      if (body == null || typeof body !== 'object') {
        res.status(400).json({ error: 'Request body must be a JSON object' });
        return;
      }
      await sql`
        INSERT INTO app_state (id, data, updated_at)
        VALUES (1, ${JSON.stringify(body)}::jsonb, now())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      `;
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown server error' });
  }
};
