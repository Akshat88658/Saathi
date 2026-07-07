import { ArrowRight } from 'lucide-react';

const BecomeSaathi = () => {
  return (
    <section id="become-saathi" style={{
      padding: '6rem 0', position: 'relative', overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(200,165,90,0.06) 0%, transparent 50%, rgba(200,165,90,0.04) 100%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(200,165,90,0.08), rgba(200,165,90,0.02))',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(2.5rem, 5vw, 5rem)',
          textAlign: 'center', maxWidth: 900, margin: '0 auto',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Inner glow */}
          <div style={{
            position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,165,90,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="section-label" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
            Join Our Network
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1.25rem' }}>
            Become a Trusted
            <span style={{
              background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}> Saathi</span>
          </h2>
          <p style={{
            color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: 1.7,
            maxWidth: 550, margin: '0 auto 2.5rem',
          }}>
            Turn your free time into earnings. Help your neighbors, set your own
            schedule, and become part of a growing community.
          </p>

          <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Apply Now <ArrowRight size={18} style={{ marginLeft: 4 }} />
          </button>

          {/* Tags */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '1.5rem', marginTop: '2.5rem',
            fontSize: '0.85rem', color: 'var(--text-muted)',
          }}>
            {['Flexible Hours', 'Weekly Payouts', 'Free Training', 'Community Support'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--gold)',
                }} />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSaathi;
