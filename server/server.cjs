const express = require('express');
const cors    = require('cors');
const db      = require('./db.cjs');

const app  = express();
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

  const existing = db.get('client_users', r => r.phone === phone);
  if (existing) return res.json({ user: existing, isNew: false });

  const newUser = db.insert('client_users', { name, phone });
  res.json({ user: newUser, isNew: true });
});

// ─── SAATHI USERS ────────────────────────────────────────────────────────────
// Check if saathi profile exists
app.get('/api/saathis/profile/:phone', (req, res) => {
  const profile = db.get('saathi_users', r => r.phone === req.params.phone);
  res.json({ profile: profile || null });
});

// Register saathi profile
app.post('/api/saathis/register', (req, res) => {
  const { name, phone, skills, hourly_rate, bio } = req.body;
  if (!name || !phone || !skills) return res.status(400).json({ error: 'name, phone, skills required' });

  const existing = db.get('saathi_users', r => r.phone === phone);
  if (existing) return res.status(409).json({ error: 'Profile already exists. Please login.' });

  const skillsJson = typeof skills === 'string'
    ? JSON.stringify(skills.split(',').map(s => s.trim()))
    : JSON.stringify(skills);

  const newUser = db.insert('saathi_users', {
    name, phone,
    skills: skillsJson,
    hourly_rate: hourly_rate || 150,
    bio: bio || '',
    rating: 5.0,
  });
  res.json({ user: newUser });
});

// Alias for /api/helpers (supports direct helper registration modal)
app.post('/api/helpers', (req, res) => {
  const { name, phone, skills, hourly_rate, bio } = req.body;
  if (!name || !phone || !skills) return res.status(400).json({ error: 'name, phone, skills required' });

  const existing = db.get('saathi_users', r => r.phone === phone);
  if (existing) return res.status(409).json({ error: 'Profile already exists.' });

  const skillsJson = typeof skills === 'string'
    ? JSON.stringify(skills.split(',').map(s => s.trim()))
    : JSON.stringify(skills);

  const newUser = db.insert('saathi_users', {
    name, phone,
    skills: skillsJson,
    hourly_rate: hourly_rate || 150,
    bio: bio || '',
    rating: 5.0,
  });
  res.json({ user: newUser });
});

// Get all available saathis (for client browse)
app.get('/api/saathis', (_req, res) => {
  const rows = db.all('saathi_users').sort((a, b) => (b.rating || 5) - (a.rating || 5));
  res.json(rows);
});

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
// Get all bookings (admin)
app.get('/api/bookings', (_req, res) => {
  const rows = db.all('bookings').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

// Get bookings for a specific client
app.get('/api/bookings/client/:phone', (req, res) => {
  const rows = db
    .all('bookings', r => r.client_phone === req.params.phone)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

// Get available (Pending) bookings for Saathi to browse
app.get('/api/bookings/available', (_req, res) => {
  const rows = db
    .all('bookings', r => r.status === 'Pending')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

// Get bookings accepted/completed by a specific saathi
app.get('/api/bookings/saathi/:phone', (req, res) => {
  const rows = db
    .all('bookings', r => r.assigned_helper_phone === req.params.phone)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows);
});

// Client creates a booking
app.post('/api/bookings', (req, res) => {
  const { service_type, location, date_time, details, extra_tip } = req.body;
  const client_name  = req.body.client_name  || req.body.name;
  const client_phone = req.body.client_phone || req.body.phone;

  if (!client_name || !client_phone || !service_type || !location || !date_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newBooking = db.insert('bookings', {
    client_name,
    client_phone,
    service_type,
    location,
    date_time,
    details:              details   || '',
    extra_tip:            extra_tip || 0,
    status:               'Pending',
    assigned_helper_name:  null,
    assigned_helper_phone: null,
  });
  res.json(newBooking);
});

// Saathi accepts / updates a booking
app.patch('/api/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, assigned_helper_name, assigned_helper_phone } = req.body;

  const patch = { status };
  if (status === 'Assigned' && assigned_helper_name && assigned_helper_phone) {
    patch.assigned_helper_name  = assigned_helper_name;
    patch.assigned_helper_phone = assigned_helper_phone;
  }

  const updated = db.update('bookings', r => r.id === id, patch);
  if (!updated.length) return res.status(404).json({ error: 'Booking not found' });
  res.json(updated[0]);
});

// ─── STATS ───────────────────────────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
  const bookings    = db.all('bookings');
  const saathis     = db.all('saathi_users');
  const completed   = bookings.filter(b => b.status === 'Completed');
  res.json({
    totalBookings: bookings.length,
    totalSaathis:  saathis.length,
    completedJobs: completed.length,
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Saathi backend running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Stop the other process and try again.`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});
