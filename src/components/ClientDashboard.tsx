import { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, IndianRupee, RefreshCw, Search, CheckCircle, Clock, User, Phone } from 'lucide-react';

const API = 'http://localhost:5000';

const SERVICE_TYPES = [
  'Companionship',
  'Grocery Shopping & Errands',
  'Elder Care Assistance',
  'Local City Buddy / Guide',
  'Personal Assistant Tasks',
  'Medical Appointment Help',
  'Other',
];

interface SaathiUser {
  id: number;
  name: string;
  phone: string;
  skills: string;
  hourly_rate: number;
  bio: string;
  rating: number;
}

interface Booking {
  id: number;
  service_type: string;
  location: string;
  date_time: string;
  details: string;
  extra_tip: number;
  status: string;
  assigned_helper_name: string;
  assigned_helper_phone: string;
  created_at: string;
}

interface ClientDashboardProps {
  userProfile: { name: string; phone: string };
  showToast: (message: string, type: 'success' | 'error') => void;
}

const SKILLS_COLORS: Record<string, string> = {
  Companionship: '#c8a55a',
  'Grocery Shopping': '#4ade80',
  'Elder Care': '#f472b6',
  Guide: '#60a5fa',
  'Personal Assistant': '#a78bfa',
  Medical: '#fb923c',
  Other: '#94a3b8',
};

const getSkillColor = (skill: string) => {
  const key = Object.keys(SKILLS_COLORS).find(k => skill.includes(k));
  return key ? SKILLS_COLORS[key] : '#94a3b8';
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return dateStr; }
};

export default function ClientDashboard({ userProfile, showToast }: ClientDashboardProps) {
  const [tab, setTab] = useState<'browse' | 'my-requests'>('browse');
  const [saathis, setSaathis] = useState<SaathiUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Booking form state
  const [bookingFor, setBookingFor] = useState<SaathiUser | null>(null);
  const [form, setForm] = useState({ service_type: '', location: '', date_time: '', details: '', extra_tip: 0 });
  const [submitting, setSubmitting] = useState(false);

  const fetchSaathis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/saathis`);
      const data = await res.json();
      setSaathis(Array.isArray(data) ? data : []);
    } catch { showToast('Could not load Saathis. Is the server running?', 'error'); }
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings/client/${userProfile.phone}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch { showToast('Could not load your bookings.', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetchSaathis(); }, []);
  useEffect(() => { if (tab === 'my-requests') fetchMyBookings(); }, [tab]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_type || !form.location || !form.date_time) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: userProfile.name,
          client_phone: userProfile.phone,
          ...form,
          extra_tip: Number(form.extra_tip),
        }),
      });
      if (!res.ok) throw new Error();
      showToast('🎉 Help requested! A Saathi will accept your request soon.', 'success');
      setBookingFor(null);
      setForm({ service_type: '', location: '', date_time: '', details: '', extra_tip: 0 });
    } catch { showToast('Could not send request. Please try again.', 'error'); }
    setSubmitting(false);
  };

  const filtered = saathis.filter(s => {
    const skills = (() => { try { return JSON.parse(s.skills); } catch { return [s.skills]; } })();
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || skills.some((sk: string) => sk.toLowerCase().includes(search.toLowerCase()));
    const matchService = !selectedService || skills.some((sk: string) => sk.toLowerCase().includes(selectedService.toLowerCase()));
    return matchSearch && matchService;
  });

  const statusColor = (s: string) => s === 'Completed' ? '#4ade80' : s === 'Assigned' ? '#60a5fa' : '#c8a55a';
  const statusIcon = (s: string) => s === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-light)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-label">Client Portal</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3rem)' }}>
            Welcome, <span className="text-gold">{userProfile.name}</span>
          </h1>
          <p style={{ color: 'var(--text-grey)', marginTop: '0.5rem' }}>
            Browse trusted Saathis in your area or track your help requests.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          {(['browse', 'my-requests'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              paddingBottom: '1rem', fontWeight: 600, fontSize: '1rem',
              color: tab === t ? 'var(--gold)' : 'var(--text-grey)',
              borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.3s', cursor: 'pointer',
            }}>
              {t === 'browse' ? '🔍 Browse Saathis' : '📋 My Requests'}
            </button>
          ))}
        </div>

        {/* ─── BROWSE TAB ─── */}
        {tab === 'browse' && (
          <>
            {/* Search + Filter Bar */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem',
                  }}
                />
              </div>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                style={{
                  padding: '0.7rem 1.25rem', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem',
                }}
              >
                <option value="">All Services</option>
                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={fetchSaathis} className="btn btn-outline" style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-grey)' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                <p>Loading available Saathis...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-grey)' }}>
                <p style={{ fontSize: '1.1rem' }}>No Saathis found matching your search.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Try a different skill or clear filters.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(saathi => {
                  const skills: string[] = (() => { try { return JSON.parse(saathi.skills); } catch { return [saathi.skills]; } })();
                  return (
                    <div key={saathi.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Avatar + Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '1.3rem', color: 'var(--bg-primary)', flexShrink: 0,
                        }}>
                          {saathi.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.2rem' }}>{saathi.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#facc15', fontSize: '0.8rem' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < Math.round(saathi.rating) ? '#facc15' : 'none'} />
                            ))}
                            <span style={{ color: 'var(--text-grey)', marginLeft: '0.2rem' }}>{saathi.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>₹{saathi.hourly_rate}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-grey)' }}>/ hour</div>
                        </div>
                      </div>

                      {/* Bio */}
                      {saathi.bio && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-grey)', lineHeight: 1.6 }}>{saathi.bio}</p>
                      )}

                      {/* Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {skills.map((sk, i) => (
                          <span key={i} style={{
                            fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
                            border: `1px solid ${getSkillColor(sk)}44`, color: getSkillColor(sk),
                            background: `${getSkillColor(sk)}15`,
                          }}>{sk}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => { setBookingFor(saathi); setForm(f => ({ ...f, service_type: skills[0] || '' })); }}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.9rem' }}
                      >
                        Request Help
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─── MY REQUESTS TAB ─── */}
        {tab === 'my-requests' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button onClick={fetchMyBookings} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-grey)' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              </div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-grey)' }}>
                <p style={{ fontSize: '1.1rem' }}>No requests yet.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Browse Saathis and send your first help request!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {bookings.map(b => (
                  <div key={b.id} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)' }}>{b.service_type}</h3>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.78rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)',
                        background: `${statusColor(b.status)}18`, color: statusColor(b.status),
                        border: `1px solid ${statusColor(b.status)}44`, fontWeight: 600,
                      }}>
                        {statusIcon(b.status)} {b.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', fontSize: '0.88rem', color: 'var(--text-grey)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} className="text-gold" />{b.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} className="text-gold" />{formatDate(b.date_time)}</span>
                      {b.extra_tip > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80' }}>
                          <IndianRupee size={14} />+₹{b.extra_tip} tip
                        </span>
                      )}
                    </div>
                    {b.details && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.details}</p>}
                    {b.assigned_helper_name && (
                      <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-grey)' }}><User size={14} className="text-gold" /> <strong style={{ color: 'var(--text-light)' }}>Saathi:</strong> {b.assigned_helper_name}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-grey)' }}><Phone size={14} className="text-gold" /> {b.assigned_helper_phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── BOOKING MODAL ─── */}
      {bookingFor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setBookingFor(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'relative', background: 'var(--bg-secondary)', border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '520px',
            boxShadow: 'var(--shadow-gold-lg)', padding: '2.5rem', animation: 'fadeInUp 0.3s ease-out',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <button onClick={() => setBookingFor(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-grey)', cursor: 'pointer' }}>✕</button>

            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Request Help</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', marginBottom: '0.3rem' }}>
              Book <span className="text-gold">{bookingFor.name}</span>
            </h2>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
              Base rate: ₹{bookingFor.hourly_rate}/hr · You can optionally add a tip
            </p>

            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>Service Type *</label>
                <select
                  required
                  value={form.service_type}
                  onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem' }}
                >
                  <option value="">Select a service...</option>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>Your Location *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="text" placeholder="e.g. Connaught Place, Delhi" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>Date & Time *</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="datetime-local" value={form.date_time}
                    onChange={e => setForm(f => ({ ...f, date_time: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>Description / Special Instructions</label>
                <textarea rows={3} placeholder="Any special requirements, health conditions, or specific tasks..."
                  value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', resize: 'vertical', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Extra Tip */}
              <div style={{ padding: '1.25rem', background: 'rgba(200,165,90,0.06)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--gold)' }}>
                  💛 Add Extra Tip for Saathi (Optional)
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-grey)', marginBottom: '0.75rem' }}>
                  Show extra appreciation — 100% goes to your Saathi
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {[0, 50, 100, 200, 500].map(amt => (
                    <button key={amt} type="button"
                      onClick={() => setForm(f => ({ ...f, extra_tip: amt }))}
                      style={{
                        padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                        background: form.extra_tip === amt ? 'var(--gold)' : 'var(--bg-tertiary)',
                        color: form.extra_tip === amt ? 'var(--bg-primary)' : 'var(--text-grey)',
                        border: `1px solid ${form.extra_tip === amt ? 'var(--gold)' : 'var(--border)'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      {amt === 0 ? 'No Tip' : `₹${amt}`}
                    </button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <IndianRupee size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="number" min={0} placeholder="Custom amount..." value={form.extra_tip || ''}
                    onChange={e => setForm(f => ({ ...f, extra_tip: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.25rem' }}
              >
                {submitting ? 'Sending Request...' : `Send Help Request${form.extra_tip > 0 ? ` (+₹${form.extra_tip} tip)` : ''}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
