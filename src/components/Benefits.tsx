import { Check, TrendingUp, Users, Shield, Zap } from 'lucide-react';

const customerBenefits = [
  { icon: Shield, text: 'Verified & background-checked helpers' },
  { icon: Zap, text: 'Matched in under 5 minutes' },
  { icon: Check, text: '100% satisfaction guarantee' },
];

const helperBenefits = [
  { icon: TrendingUp, text: 'Competitive pay, weekly payouts' },
  { icon: Users, text: 'Flexible hours — be your own boss' },
  { icon: Check, text: 'Training & community support' },
];

const Benefits = () => {
  return (
    <section id="benefits" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">Why Saathi</div>
          <h2 style={{ marginBottom: '1rem' }}>Built for Everyone</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            A platform that rewards both customers and helpers with trust, convenience, and fairness.
          </p>
        </div>

        {/* Two Column */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
        }}>
          {/* Customer Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            transition: 'all 0.4s ease',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-gold)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            {/* Accent corner */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 120, height: 120,
              background: 'radial-gradient(circle at top right, var(--gold-muted), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold)',
              marginBottom: '0.75rem',
            }}>For Customers</div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Save Time. Stay Worry-Free.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {customerBenefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--gold-muted)', border: '1px solid var(--border-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--gold)',
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{b.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Helper Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            transition: 'all 0.4s ease',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-gold)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 120, height: 120,
              background: 'radial-gradient(circle at top right, var(--gold-muted), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold)',
              marginBottom: '0.75rem',
            }}>For Helpers</div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Earn More. Work Flexibly.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {helperBenefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--gold-muted)', border: '1px solid var(--border-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--gold)',
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{b.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem', marginTop: '3rem',
        }}>
          {[
            { value: '4.9★', label: 'Customer Rating' },
            { value: '98%', label: 'On-time Reliability' },
            { value: '10K+', label: 'Tasks Completed' },
            { value: '100%', label: 'Background Verified' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '1.75rem 1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-gold)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{
                fontSize: '2rem', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
