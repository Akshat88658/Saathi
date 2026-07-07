import { Search, Handshake, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Book',
    desc: 'Tell us what you need help with. Choose from a wide variety of everyday tasks and set your preferred time.',
  },
  {
    icon: Handshake,
    step: '02',
    title: 'Get Matched',
    desc: 'We instantly match you with a background-checked, trusted Saathi from your neighborhood.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Task Completed',
    desc: 'Your Saathi completes the job. Payment is released only when you\'re fully satisfied.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">How It Works</div>
          <h2 style={{ marginBottom: '1rem' }}>Simple as 1-2-3</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            Getting help has never been easier. Three simple steps and you're done.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem', position: 'relative',
        }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 150}ms`,
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  transition: 'all 0.4s ease',
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
                {/* Step number */}
                <div style={{
                  position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  color: 'var(--bg-primary)', fontWeight: 800, fontSize: '0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-gold)',
                }}>
                  {s.step}
                </div>

                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--gold-muted)', border: '1px solid var(--border-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', margin: '1rem auto 1.5rem',
                }}>
                  <Icon size={36} />
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
