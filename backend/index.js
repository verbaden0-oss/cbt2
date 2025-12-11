const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const cbtRoutes = require('./routes/cbt');
const sobrietyRoutes = require('./routes/sobriety');
const triggersRoutes = require('./routes/triggers');
const pool = require('./db/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/cbt', cbtRoutes);
app.use('/api/sobriety', sobrietyRoutes);
app.use('/api/triggers', triggersRoutes);

async function ensureTables() {
  try {
    // PostgreSQL syntax
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        settings_json JSONB DEFAULT '{}'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS journals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        date TIMESTAMPTZ NOT NULL,
        mood_rating INTEGER,
        trigger_ids JSONB,
        note TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS CBTExercises (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        type TEXT NOT NULL,
        content_json JSONB,
        completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS SobrietyLog (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE,
        start_date TIMESTAMPTZ,
        current_streak INTEGER,
        relapses_json JSONB,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Triggers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name TEXT NOT NULL,
        category TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('DB tables ensured');
  } catch (err) {
    console.error('Error ensuring tables', err);
    throw err;
  }
}

const PORT = process.env.PORT || 4000;

ensureTables().catch((e) => console.error('table init error', e));

app.get('/', (req, res) => res.send('CBT Backend is running'));

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
