import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Check, RefreshCw, X, User, Phone as PhoneIcon } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  service_type: string;
  location: string;
  date_time: string;
  details: string;
  status: string;
  assigned_helper_name: string;
  assigned_helper_phone: string;
  created_at: string;
}

interface JobsConsoleProps {
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PRICE_MAP: Record<string, string> = {
  'Companionship': '₹200 / hour',
  'Grocery Shopping & Errands': '₹150 / hour',
  'Elder Care assistance': '₹300 / hour',
  'Local City Buddy / Guide': '₹200 / hour',
  'Personal Assistant tasks': '₹250 / hour',
  'Other': '₹150 / hour'
};

const JobsConsole = ({ onClose, showToast }: JobsConsoleProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'my-jobs'>('available');
  
  // Job acceptance form state
  const [acceptingJobId, setAcceptingJobId] = useState<number | null>(null);
  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      showToast('Error loading live jobs feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAcceptJob = async (id: number) => {
    if (!helperName.trim() || !helperPhone.trim()) {
      showToast('Please enter your name and phone number to accept this job.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Assigned',
          assigned_helper_name: helperName,
          assigned_helper_phone: helperPhone,
        }),
      });

      if (!res.ok) throw new Error('Failed to accept job');
      
      showToast('Job accepted! Thank you for helping out.', 'success');
      setAcceptingJobId(null);
      setHelperName('');
      setHelperPhone('');
      fetchJobs();
    } catch (error: any) {
      showToast(error.message || 'Error accepting job', 'error');
    }
  };

  const handleCompleteJob = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (!res.ok) throw new Error('Failed to update job status');
      
      showToast('Job marked as Completed! Great job!', 'success');
      fetchJobs();
    } catch (error: any) {
      showToast('Error completing job', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredJobs = bookings.filter(job => {
    if (activeTab === 'available') {
      return job.status === 'Pending';
    } else {
      return job.status === 'Assigned' || job.status === 'Completed';
    }
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-light)',
      paddingTop: '6rem',
      paddingBottom: '4rem',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div className="section-label">Helper Portal</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Playfair Display, serif' }}>
              Saathi <span className="text-gold">Jobs Feed</span>
            </h1>
            <p style={{ color: 'var(--text-grey)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Browse live task requests in your neighborhood and accept jobs to earn.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={fetchJobs}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Feed
            </button>
            <button 
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
          gap: '1.5rem',
        }}>
          <button
            onClick={() => setActiveTab('available')}
            style={{
              paddingBottom: '1rem',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'available' ? 'var(--gold)' : 'var(--text-grey)',
              borderBottom: activeTab === 'available' ? '2px solid var(--gold)' : 'none',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          >
            Live Available Jobs
          </button>
          <button
            onClick={() => setActiveTab('my-jobs')}
            style={{
              paddingBottom: '1rem',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'my-jobs' ? 'var(--gold)' : 'var(--text-grey)',
              borderBottom: activeTab === 'my-jobs' ? '2px solid var(--gold)' : 'none',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          >
            Accepted / Completed Jobs
          </button>
        </div>

        {/* Live List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-grey)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            Loading job dashboard...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 0', color: 'var(--text-grey)' }}>
            No jobs found in this catalog. Check back later or refresh!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredJobs.map(job => (
              <div 
                key={job.id} 
                className="card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: job.status === 'Assigned' ? '1px solid rgba(74,222,128,0.2)' : '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem', padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)', 
                      background: job.status === 'Pending' ? 'rgba(200,165,90,0.1)' : job.status === 'Completed' ? 'rgba(74,222,128,0.1)' : 'rgba(228,200,126,0.1)',
                      color: job.status === 'Pending' ? 'var(--gold)' : job.status === 'Completed' ? '#4ade80' : '#e4c87e', 
                      fontWeight: 600,
                      border: '1px solid currentColor',
                    }}>
                      {job.status === 'Pending' ? 'Available' : job.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Job #{job.id} • Posted {formatDate(job.created_at)}
                    </span>
                  </div>

                  {/* Pricing Tag */}
                  <div style={{
                    fontSize: '0.9rem', padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-gold)', color: 'var(--gold-light)', fontWeight: 700,
                  }}>
                    {PRICE_MAP[job.service_type] || '₹150 / hr'}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-white)' }}>
                  {job.service_type}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2.5rem', fontSize: '0.9rem', color: 'var(--text-grey)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} className="text-gold" /> <strong>Location:</strong> {job.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} className="text-gold" /> <strong>Time:</strong> {formatDate(job.date_time)}
                  </div>
                </div>

                {job.details && (
                  <p style={{
                    padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem', color: 'var(--text-grey)',
                  }}>
                    <strong>Client Description:</strong> {job.details}
                  </p>
                )}

                {/* Assignment details (For Accepted/Completed tab) */}
                {job.status !== 'Pending' && (
                  <div style={{
                    padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--border)', fontSize: '0.9rem', color: 'var(--text-grey)',
                    display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem',
                  }}>
                    <div><strong>Helper:</strong> {job.assigned_helper_name}</div>
                    <div><strong>Helper Phone:</strong> {job.assigned_helper_phone}</div>
                    <div><strong>Client Name:</strong> {job.name}</div>
                    <div><strong>Client Phone:</strong> {job.phone}</div>
                  </div>
                )}

                {/* Job Acceptance Controls */}
                {job.status === 'Pending' && (
                  <div>
                    {acceptingJobId !== job.id ? (
                      <button 
                        onClick={() => setAcceptingJobId(job.id)}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
                      >
                        <Briefcase size={16} style={{ marginRight: 4 }} /> I Will Do This Job
                      </button>
                    ) : (
                      <div style={{
                        marginTop: '1rem', padding: '1.5rem', 
                        background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex', flexDirection: 'column', gap: '1rem',
                        maxWidth: '450px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Accept Job Assignment</h4>
                          <button onClick={() => setAcceptingJobId(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={18} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <User size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                              type="text"
                              placeholder="Your Name"
                              value={helperName}
                              onChange={(e) => setHelperName(e.target.value)}
                              style={{
                                width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem',
                                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                                fontSize: '0.85rem',
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <PhoneIcon size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                              type="tel"
                              placeholder="Your Phone"
                              value={helperPhone}
                              onChange={(e) => setHelperPhone(e.target.value)}
                              style={{
                                width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem',
                                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                                fontSize: '0.85rem',
                              }}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => handleAcceptJob(job.id)}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                        >
                          Confirm Job Acceptance
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mark as Completed */}
                {job.status === 'Assigned' && (
                  <button 
                    onClick={() => handleCompleteJob(job.id)}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', alignSelf: 'flex-start', background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}
                  >
                    <Check size={16} style={{ marginRight: 4 }} /> Mark Job as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsConsole;
