import { useState, useEffect } from 'react';
import {
  Briefcase, MapPin, Calendar, CheckCircle, RefreshCw,
  IndianRupee, Award, User, Phone, Star, BadgeCheck
} from 'lucide-react';

const API = 'http://localhost:5000';

const SKILL_OPTIONS = [
  'Companionship',
  'Grocery Shopping & Errands',
  'Elder Care Assistance',
  'Local City Buddy / Guide',
  'Personal Assistant Tasks',
  'Medical Appointment Help',
  'Other',
];

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
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

interface SaathiProfile {
  id: number;
  name: string;
  phone: string;
  skills: string;
  hourly_rate: number;
  bio: string;
  rating: number;
}

interface SaathiDashboardProps {
  userProfile: { name: string; phone: string };
  showToast: (message: string, type: 'success' | 'error') => void;
}

const formatDate = (dateStr: string) => {
  try { return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return dateStr; }
};

const BASE_RATES: Record<string, number> = {
  'Companionship': 200,
  'Grocery Shopping & Errands': 150,
  'Elder Care Assistance': 300,
  'Local City Buddy / Guide': 200,
  'Personal Assistant Tasks': 250,
  'Medical Appointment Help': 250,
  'Other': 150,
};

export default function SaathiDashboard({ userProfile, showToast }: SaathiDashboardProps) {
  const [profile, setProfile] = useState<SaathiProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [tab, setTab] = useState<'jobs' | 'my-jobs' | 'earnings'>('jobs');
  const [availableJobs, setAvailableJobs] = useState<Booking[]>([]);
  const [myJobs, setMyJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Accepting job
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [accepting, setAccepting] = useState(false);

  // Registration form
  const [regForm, setRegForm] = useState({
    skills: [] as string[],
    hourly_rate: 200,
    bio: '',
  });
  const [registering, setRegistering] = useState(false);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch(`${API}/api/saathis/profile/${userProfile.phone}`);
      const data = await res.json();
      setProfile(data.profile);
    } catch { showToast('Could not fetch profile.', 'error'); }
    setProfileLoading(false);
  };

  const fetchAvailable = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings/available`);
      const data = await res.json();
      setAvailableJobs(Array.isArray(data) ? data : []);
    } catch { showToast('Could not load jobs.', 'error'); }
    setLoading(false);
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings/saathi/${userProfile.phone}`);
      const data = await res.json();
      setMyJobs(Array.isArray(data) ? data : []);
    } catch { showToast('Could not load your jobs.', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => {
    if (!profile) return;
    if (tab === 'jobs') fetchAvailable();
    if (tab === 'my-jobs' || tab === 'earnings') fetchMyJobs();
  }, [tab, profile]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.skills.length === 0) { showToast('Please select at least one skill.', 'error'); return; }
    setRegistering(true);
    try {
      const res = await fetch(`${API}/api/saathis/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userProfile.name, phone: userProfile.phone, ...regForm }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Registration failed.', 'error');
      } else {
        showToast('🎉 Profile created! Welcome to the Saathi family.', 'success');
        fetchProfile();
      }
    } catch { showToast('Network error. Make sure server is running.', 'error'); }
    setRegistering(false);
  };

  const handleAcceptJob = async (job: Booking) => {
    setAccepting(true);
    try {
      const res = await fetch(`${API}/api/bookings/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Assigned', assigned_helper_name: userProfile.name, assigned_helper_phone: userProfile.phone }),
      });
      if (!res.ok) throw new Error();
      showToast('✅ Job accepted! Contact the client to confirm details.', 'success');
      setAcceptingId(null);
      fetchAvailable();
    } catch { showToast('Could not accept job. Try again.', 'error'); }
    setAccepting(false);
  };

  const handleComplete = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      if (!res.ok) throw new Error();
      showToast('🏆 Job marked complete! Great work, Saathi!', 'success');
      fetchMyJobs();
    } catch { showToast('Could not update job.', 'error'); }
  };

  const completedJobs = myJobs.filter(j => j.status === 'Completed');
  const totalEarned = completedJobs.reduce((sum, j) => sum + (BASE_RATES[j.service_type] || 150) + (j.extra_tip || 0), 0);
  const totalTips = completedJobs.reduce((sum, j) => sum + (j.extra_tip || 0), 0);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={32} className="animate-spin text-gold" style={{ color: 'var(--gold)' }} />
      </div>
    );
  }

  // ── Registration screen ───────────────────────────────────────────────────
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-light)', paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Saathi Portal</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.75rem' }}>
              Complete Your <span className="text-gold">Saathi Profile</span>
            </h1>
            <p style={{ color: 'var(--text-grey)' }}>
              Tell us about your skills and hourly rate so clients can find and book you.
            </p>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            {/* Auto-filled info */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-grey)' }}>
                <User size={15} className="text-gold" /> <strong style={{ color: 'var(--text-light)' }}>{userProfile.name}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-grey)' }}>
                <Phone size={15} className="text-gold" /> {userProfile.phone}
              </span>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Skills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-light)' }}>
                  Select Your Skills *
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SKILL_OPTIONS.map(skill => {
                    const selected = regForm.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setRegForm(f => ({
                          ...f,
                          skills: selected ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
                        }))}
                        style={{
                          padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                          background: selected ? 'var(--gold)' : 'var(--bg-tertiary)',
                          color: selected ? 'var(--bg-primary)' : 'var(--text-grey)',
                          border: `1px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
                        }}
                      >
                        {selected ? '✓ ' : ''}{skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)' }}>
                  Your Hourly Rate (₹) *
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Suggested rates: ₹150–₹350/hr</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {[150, 200, 250, 300, 350].map(r => (
                    <button key={r} type="button" onClick={() => setRegForm(f => ({ ...f, hourly_rate: r }))}
                      style={{
                        padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        background: regForm.hourly_rate === r ? 'var(--gold)' : 'var(--bg-tertiary)',
                        color: regForm.hourly_rate === r ? 'var(--bg-primary)' : 'var(--text-grey)',
                        border: `1px solid ${regForm.hourly_rate === r ? 'var(--gold)' : 'var(--border)'}`,
                      }}
                    >₹{r}</button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <IndianRupee size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="number" min={50} max={2000} value={regForm.hourly_rate}
                    onChange={e => setRegForm(f => ({ ...f, hourly_rate: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)' }}>
                  Short Bio (Optional)
                </label>
                <textarea rows={3} placeholder="Tell clients a bit about yourself — experience, personality, languages spoken..."
                  value={regForm.bio} onChange={e => setRegForm(f => ({ ...f, bio: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none', resize: 'vertical', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={registering} style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                {registering ? 'Creating Profile...' : '🚀 Complete Registration & Start Helping'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Saathi Dashboard ─────────────────────────────────────────────────
  const skills: string[] = (() => { try { return JSON.parse(profile.skills); } catch { return [profile.skills]; } })();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-light)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.75rem', color: 'var(--bg-primary)',
          }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div className="section-label">Saathi Portal</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', marginBottom: '0.25rem' }}>
              Hey, <span className="text-gold">{profile.name}</span> 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', color: '#facc15' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(profile.rating) ? '#facc15' : 'none'} />)}
                <span style={{ color: 'var(--text-grey)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{profile.rating.toFixed(1)}</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-grey)' }}>₹{profile.hourly_rate}/hr base rate</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#4ade80' }}>
                <BadgeCheck size={14} /> Verified Saathi
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {skills.map((sk, i) => (
                <span key={i} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'var(--gold-muted)', color: 'var(--gold)', border: '1px solid var(--border-gold)' }}>{sk}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Available Jobs', value: availableJobs.length, icon: <Briefcase size={20} className="text-gold" />, color: 'var(--gold)' },
            { label: 'My Active Jobs', value: myJobs.filter(j => j.status === 'Assigned').length, icon: <CheckCircle size={20} />, color: '#60a5fa' },
            { label: 'Completed', value: completedJobs.length, icon: <Award size={20} />, color: '#4ade80' },
            { label: 'Total Earned', value: `₹${totalEarned}`, icon: <IndianRupee size={20} />, color: '#c084fc' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-grey)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          {([
            { key: 'jobs', label: '🌍 Available Jobs' },
            { key: 'my-jobs', label: '📋 My Jobs' },
            { key: 'earnings', label: '💰 Earnings' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              paddingBottom: '1rem', fontWeight: 600, fontSize: '1rem',
              color: tab === t.key ? 'var(--gold)' : 'var(--text-grey)',
              borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.3s', cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ─── AVAILABLE JOBS ─── */}
        {tab === 'jobs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button onClick={fetchAvailable} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Feed
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}><RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto', color: 'var(--gold)' }} /></div>
            ) : availableJobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-grey)' }}>
                <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontSize: '1.1rem' }}>No open jobs right now.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Refresh to check for new requests!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {availableJobs.map(job => (
                  <div key={job.id} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)', marginBottom: '0.2rem' }}>{job.service_type}</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job #{job.id} · Posted {formatDate(job.created_at)}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>₹{BASE_RATES[job.service_type] || 150}/hr</div>
                        {job.extra_tip > 0 && <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 600 }}>+₹{job.extra_tip} tip 🎁</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', fontSize: '0.88rem', color: 'var(--text-grey)', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} className="text-gold" />{job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} className="text-gold" />{formatDate(job.date_time)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} className="text-gold" />{job.client_name}</span>
                    </div>
                    {job.details && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>{job.details}</p>}

                    {acceptingId === job.id ? (
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button onClick={() => handleAcceptJob(job)} disabled={accepting} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.65rem 1.5rem' }}>
                          {accepting ? 'Accepting...' : '✅ Confirm Accept'}
                        </button>
                        <button onClick={() => setAcceptingId(null)} className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setAcceptingId(job.id)} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.65rem 1.5rem', marginTop: '0.5rem' }}>
                        <Briefcase size={16} style={{ marginRight: 4 }} /> I'll Do This Job
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── MY JOBS ─── */}
        {tab === 'my-jobs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button onClick={fetchMyJobs} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}><RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto', color: 'var(--gold)' }} /></div>
            ) : myJobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-grey)' }}>
                <p style={{ fontSize: '1.1rem' }}>No jobs yet. Accept a job from the feed to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myJobs.map(job => (
                  <div key={job.id} className="card" style={{ padding: '1.75rem', border: job.status === 'Completed' ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(96,165,250,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)' }}>{job.service_type}</h3>
                      <span style={{
                        fontSize: '0.78rem', padding: '0.25rem 0.7rem', borderRadius: 'var(--radius-full)', fontWeight: 600,
                        background: job.status === 'Completed' ? 'rgba(74,222,128,0.1)' : 'rgba(96,165,250,0.1)',
                        color: job.status === 'Completed' ? '#4ade80' : '#60a5fa',
                        border: `1px solid ${job.status === 'Completed' ? '#4ade8044' : '#60a5fa44'}`,
                      }}>
                        {job.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', fontSize: '0.88rem', color: 'var(--text-grey)', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} className="text-gold" />{job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} className="text-gold" />{formatDate(job.date_time)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} className="text-gold" />{job.client_name} · {job.client_phone}</span>
                      {job.extra_tip > 0 && <span style={{ color: '#4ade80', fontWeight: 600 }}>+₹{job.extra_tip} tip 🎁</span>}
                    </div>
                    {job.status === 'Assigned' && (
                      <button onClick={() => handleComplete(job.id)} className="btn btn-primary"
                        style={{ marginTop: '0.5rem', padding: '0.65rem 1.5rem', fontSize: '0.9rem', background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#000' }}>
                        <CheckCircle size={16} style={{ marginRight: 4 }} /> Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── EARNINGS ─── */}
        {tab === 'earnings' && (
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Jobs Completed', value: completedJobs.length, color: '#4ade80' },
                { label: 'Base Earnings', value: `₹${totalEarned - totalTips}`, color: 'var(--gold)' },
                { label: 'Tips Received', value: `₹${totalTips}`, color: '#c084fc' },
                { label: 'Total Earnings', value: `₹${totalEarned}`, color: '#4ade80' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-grey)', marginTop: '0.25rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Completed Job History</h3>
            {completedJobs.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-grey)' }}>Complete your first job to see earnings here!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {completedJobs.map(job => (
                  <div key={job.id} style={{ padding: '1rem 1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{job.service_type}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-grey)' }}>{formatDate(job.created_at)} · {job.client_name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gold)' }}>₹{BASE_RATES[job.service_type] || 150}</div>
                      {job.extra_tip > 0 && <div style={{ fontSize: '0.78rem', color: '#c084fc' }}>+₹{job.extra_tip} tip</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
