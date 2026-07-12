const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── CLIENT USERS ────────────────────────────────────────────────────────────
// Register / login a client (upsert by phone)
app.post('/api/clients/login', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });

  db.get('SELECT * FROM client_users WHERE phone = ?', [phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.json({ user: row, isNew: false });

    db.run('INSERT INTO client_users (name, phone) VALUES (?,?)', [name, phone], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      db.get('SELECT * FROM client_users WHERE id = ?', [this.lastID], (_e, newRow) => {
        res.json({ user: newRow, isNew: true });
      });
    });
  });
});

// ─── SAATHI USERS ────────────────────────────────────────────────────────────
// Check if saathi profile exists
app.get('/api/saathis/profile/:phone', (req, res) => {
  db.get('SELECT * FROM saathi_users WHERE phone = ?', [req.params.phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ profile: row || null });
  });
});

// Register saathi profile
app.post('/api/saathis/register', (req, res) => {
  const { name, phone, skills, hourly_rate, bio } = req.body;
  if (!name || !phone || !skills) return res.status(400).json({ error: 'name, phone, skills required' });

  db.get('SELECT id FROM saathi_users WHERE phone = ?', [phone], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) return res.status(409).json({ error: 'Profile already exists. Please login.' });

    db.run(
      'INSERT INTO saathi_users (name, phone, skills, hourly_rate, bio) VALUES (?,?,?,?,?)',
      [name, phone, typeof skills === 'string' ? JSON.stringify(skills.split(',').map(s => s.trim())) : JSON.stringify(skills), hourly_rate || 150, bio || ''],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM saathi_users WHERE id = ?', [this.lastID], (_e, row) => {
          res.json({ user: row });
        });
      }
    );
  });
});

// Alias for /api/helpers to support direct helper registration modal
app.post('/api/helpers', (req, res) => {
  const { name, phone, skills, hourly_rate, bio } = req.body;
  if (!name || !phone || !skills) return res.status(400).json({ error: 'name, phone, skills required' });

  db.get('SELECT id FROM saathi_users WHERE phone = ?', [phone], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) return res.status(409).json({ error: 'Profile already exists.' });

    db.run(
      'INSERT INTO saathi_users (name, phone, skills, hourly_rate, bio) VALUES (?,?,?,?,?)',
      [name, phone, typeof skills === 'string' ? JSON.stringify(skills.split(',').map(s => s.trim())) : JSON.stringify(skills), hourly_rate || 150, bio || ''],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM saathi_users WHERE id = ?', [this.lastID], (_e, row) => {
          res.json({ user: row });
        });
      }
    );
  });
});

// Get all available saathis (for client browse)
app.get('/api/saathis', (_req, res) => {
  db.all('SELECT * FROM saathi_users ORDER BY rating DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
// Get all bookings (admin)
app.get('/api/bookings', (_req, res) => {
  db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get bookings for a specific client
app.get('/api/bookings/client/:phone', (req, res) => {
  db.all(
    'SELECT * FROM bookings WHERE client_phone = ? ORDER BY created_at DESC',
    [req.params.phone],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get available (Pending) bookings for Saathi to browse
app.get('/api/bookings/available', (_req, res) => {
  db.all(
    "SELECT * FROM bookings WHERE status = 'Pending' ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get bookings accepted/completed by a specific saathi
app.get('/api/bookings/saathi/:phone', (req, res) => {
  db.all(
    "SELECT * FROM bookings WHERE assigned_helper_phone = ? ORDER BY created_at DESC",
    [req.params.phone],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Client creates a booking
app.post('/api/bookings', (req, res) => {
  const { client_name, client_phone, service_type, location, date_time, details, extra_tip } = req.body;
  if (!client_name || !client_phone || !service_type || !location || !date_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO bookings (client_name, client_phone, service_type, location, date_time, details, extra_tip) VALUES (?,?,?,?,?,?,?)',
    [client_name, client_phone, service_type, location, date_time, details || '', extra_tip || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM bookings WHERE id = ?', [this.lastID], (_e, row) => {
        res.json(row);
      });
    }
  );
});

// Saathi accepts / updates a booking
app.patch('/api/bookings/:id', (req, res) => {
  const { status, assigned_helper_name, assigned_helper_phone } = req.body;

  if (status === 'Assigned' && assigned_helper_name && assigned_helper_phone) {
    db.run(
      'UPDATE bookings SET status = ?, assigned_helper_name = ?, assigned_helper_phone = ? WHERE id = ?',
      [status, assigned_helper_name, assigned_helper_phone, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (_e, row) => res.json(row));
      }
    );
  } else {
    db.run(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (_e, row) => res.json(row));
      }
    );
  }
});

// ─── STATS ───────────────────────────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
  db.get('SELECT COUNT(*) as total FROM bookings', [], (err, b) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT COUNT(*) as total FROM saathi_users', [], (err2, s) => {
      if (err2) return res.status(500).json({ error: err2.message });
      db.get("SELECT COUNT(*) as total FROM bookings WHERE status='Completed'", [], (err3, c) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ totalBookings: b.total, totalSaathis: s.total, completedJobs: c.total });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Saathi backend running on http://localhost:${PORT}`);
});
