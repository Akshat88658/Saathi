const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'saathi.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to Saathi SQLite database.');
  }
});

db.serialize(() => {
  // ── Bookings table ──────────────────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      client_phone         TEXT NOT NULL,
      client_name          TEXT NOT NULL,
      service_type         TEXT NOT NULL,
      location             TEXT NOT NULL,
      date_time            TEXT NOT NULL,
      details              TEXT,
      extra_tip            INTEGER DEFAULT 0,
      status               TEXT DEFAULT 'Pending',
      assigned_helper_name  TEXT,
      assigned_helper_phone TEXT,
      created_at           DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── Saathi (helper) profiles ─────────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS saathi_users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL UNIQUE,
      skills      TEXT NOT NULL,
      hourly_rate INTEGER NOT NULL DEFAULT 150,
      bio         TEXT,
      rating      REAL DEFAULT 5.0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── Client (user) profiles ───────────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS client_users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Silent migrations for existing databases
  const silentRun = (sql) => db.run(sql, () => {});
  silentRun('ALTER TABLE bookings ADD COLUMN client_phone TEXT');
  silentRun('ALTER TABLE bookings ADD COLUMN client_name TEXT');
  silentRun('ALTER TABLE bookings ADD COLUMN extra_tip INTEGER DEFAULT 0');
  silentRun('ALTER TABLE bookings ADD COLUMN assigned_helper_name TEXT');
  silentRun('ALTER TABLE bookings ADD COLUMN assigned_helper_phone TEXT');
});

// Keep process alive (prevents SQLite from auto-closing the event loop)
process.on('exit', () => db.close());

module.exports = db;
