/**
 * db.cjs — JSON file-based database (replaces sqlite3 to avoid native module issues)
 * Data is stored in server/data.json and persisted synchronously on every write.
 */

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// ── Default empty store ────────────────────────────────────────────────────────
const DEFAULT_STORE = {
  bookings:     [],
  saathi_users: [],
  client_users: [],
  _seq: { bookings: 0, saathi_users: 0, client_users: 0 },
};

// ── Load / save helpers ────────────────────────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULT_STORE));
}

function save(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

// ── Initialise (create file if missing) ───────────────────────────────────────
let store = load();
// ensure _seq exists for older data files
store._seq = store._seq || { bookings: 0, saathi_users: 0, client_users: 0 };
// ensure all collections exist
['bookings','saathi_users','client_users'].forEach(k => { store[k] = store[k] || []; });
save(store);
console.log('Connected to Saathi JSON database.');

// ── nextId ─────────────────────────────────────────────────────────────────────
function nextId(table) {
  store._seq[table] = (store._seq[table] || 0) + 1;
  return store._seq[table];
}

// ── Public API (mirrors the subset of sqlite3 methods used in server.cjs) ─────

const db = {
  /** SELECT one row */
  get(table, predicate) {
    store = load();
    return store[table].find(predicate) || null;
  },

  /** SELECT all rows */
  all(table, predicate) {
    store = load();
    return predicate ? store[table].filter(predicate) : [...store[table]];
  },

  /** INSERT — returns the new row */
  insert(table, row) {
    store = load();
    const newRow = { id: nextId(table), created_at: new Date().toISOString(), ...row };
    store[table].push(newRow);
    save(store);
    return newRow;
  },

  /** UPDATE rows matching predicate with patch object — returns updated rows */
  update(table, predicate, patch) {
    store = load();
    const updated = [];
    store[table] = store[table].map(row => {
      if (predicate(row)) {
        const newRow = { ...row, ...patch };
        updated.push(newRow);
        return newRow;
      }
      return row;
    });
    save(store);
    return updated;
  },

  /** DELETE rows matching predicate */
  delete(table, predicate) {
    store = load();
    store[table] = store[table].filter(r => !predicate(r));
    save(store);
  },
};

module.exports = db;
