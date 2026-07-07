import { ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      paddingTop: '6rem', paddingBottom: '4rem',
      overflow: 'hidden',
    }}>
      {/* ========== BACKGROUND IMAGE WITH KEN BURNS ANIMATION ========== */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: '-10%',
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurns 25s ease-in-out infinite alternate',
          willChange: 'transform',
        }} />
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.75) 40%, rgba(10,10,10,0.88) 100%)',
        }} />
        {/* Gold tint overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(200,165,90,0.05) 0%, transparent 50%)',
        }} />
      </div>

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Floating particles / bokeh */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%', zIndex: 1,
        width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)',
        opacity: 0.4, animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '15%', zIndex: 1,
        width: 4, height: 4, borderRadius: '50%', background: 'var(--gold-light)',
        opacity: 0.3, animation: 'float 8s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '25%', left: '20%', zIndex: 1,
        width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)',
        opacity: 0.25, animation: 'float 7s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div className="animate-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-gold)', background: 'rgba(200,165,90,0.1)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold)',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)',
              animation: 'pulse-glow 2s infinite',
            }} />
            Now available in your neighborhood
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up delay-100" style={{ marginBottom: '1.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            When everywhere is like nope,{' '}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Saathi is your only hope.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200" style={{
            fontSize: '1.15rem', color: 'var(--text-grey)', lineHeight: 1.7,
            maxWidth: 600, margin: '0 auto 2.5rem',
            textShadow: '0 1px 8px rgba(0,0,0,0.3)',
          }}>
            Your trusted hyperlocal platform for everyday tasks. From grocery
            shopping to personal assistance — get matched with reliable helpers
            in minutes.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-300" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '1rem', marginBottom: '4rem',
          }}>
            <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              Book a Helper Now <ArrowRight size={18} style={{ marginLeft: 4 }} />
            </button>
            <button className="btn btn-outline" style={{
              padding: '1rem 2.5rem', fontSize: '1rem',
              backdropFilter: 'blur(10px)',
            }}>
              Become a Saathi
            </button>
          </div>

          {/* Stats Row */}
          <div className="animate-fade-in-up delay-400" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem', paddingTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { icon: ShieldCheck, title: 'Verified Helpers', desc: 'Background checked', color: 'var(--gold)' },
              { icon: Clock, title: 'Quick Matching', desc: 'Help within minutes', color: 'var(--gold-light)' },
              { icon: MapPin, title: 'Hyperlocal', desc: 'Helpers from your area', color: 'var(--gold)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(200,165,90,0.1)', border: '1px solid var(--border-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, backdropFilter: 'blur(8px)',
                  }}>
                    <Icon size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(transparent, var(--bg-secondary))',
        zIndex: 2, pointerEvents: 'none',
      }} />
    </section>
  );
};

export default Hero;
