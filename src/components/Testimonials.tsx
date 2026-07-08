import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Working Mother',
    text: 'Saathi has been a lifesaver. Between work and the kids, I rarely have time for grocery shopping. The helpers are always prompt, polite, and incredibly reliable.',
    rating: 5,
    initial: 'S',
  },
  {
    name: 'David Chen',
    role: 'Small Business Owner',
    text: 'I needed a last-minute pick up and dropping facility across town and Saathi matched me with someone in under 5 minutes. This is the future of local services.',
    rating: 5,
    initial: 'D',
  },
  {
    name: 'Priya Sharma',
    role: 'Saathi Helper',
    text: 'Working with Saathi allows me to set my own schedule and help my neighbors. The app is intuitive and payments are always on time. Highly recommended.',
    rating: 5,
    initial: 'P',
  },
];

const Testimonials = () => {
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">Testimonials</div>
          <h2 style={{ marginBottom: '1rem' }}>Loved by Our Community</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            Real stories from real people who trust Saathi every day.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 150}ms`,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex', flexDirection: 'column',
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
              {/* Quote icon */}
              <Quote size={28} style={{
                color: 'var(--gold)', opacity: 0.3, marginBottom: '1rem',
                transform: 'scaleX(-1)',
              }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    fill={j < t.rating ? 'var(--gold)' : 'none'}
                    color={j < t.rating ? 'var(--gold)' : 'var(--text-muted)'}
                  />
                ))}
              </div>

              <p style={{
                color: 'var(--text-grey)', fontSize: '0.95rem',
                lineHeight: 1.7, flex: 1, fontStyle: 'italic',
                marginBottom: '1.5rem',
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  color: 'var(--bg-primary)', fontWeight: 800, fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {t.initial}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-white)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
