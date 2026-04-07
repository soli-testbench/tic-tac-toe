const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

async function initDb() {
  if (!pool) {
    console.log('No DATABASE_URL set, skipping database initialization');
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      result VARCHAR(10) NOT NULL,
      moves JSONB,
      played_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Database initialized');
}

async function saveGame(result, moves) {
  if (!pool) return { id: null, result, moves };
  const { rows } = await pool.query(
    'INSERT INTO games (result, moves) VALUES ($1, $2) RETURNING *',
    [result, JSON.stringify(moves)]
  );
  return rows[0];
}

async function getGames() {
  if (!pool) return [];
  const { rows } = await pool.query('SELECT * FROM games ORDER BY played_at DESC LIMIT 50');
  return rows;
}

module.exports = { initDb, saveGame, getGames };
