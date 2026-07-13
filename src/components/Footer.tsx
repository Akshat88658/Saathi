import { Globe, Mail, MessageCircle, Share2, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      paddingTop: '5rem', paddingBottom: '2rem',
    }}>
      <div className="container">
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem', marginBottom: '4rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <img 
                src="/favicon.svg" 
                alt="Saathi Emblem" 
                style={{ width: 32, height: 32, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} 
              />
              <span style={{
                fontSize: '1.35rem', 
                fontWeight: 700, 
                letterSpacing: '0.01em',
                fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))',
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                paddingRight: '6px',
              }}>
                Saathi
                {/* Small purple petal accent on top-right of the "i" */}
                <span style={{
                  position: 'absolute',
                  top: '1px',
                  right: '-4px',
                  width: '7px',
                  height: '7px',
                  background: 'radial-gradient(circle at 30% 30%, #C084FC 0%, #8237FA 50%, #4B129E 100%)',
                  borderRadius: '80% 0 80% 50%',
                  transform: 'rotate(-15deg)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </span>
            </div>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.9rem',
              lineHeight: 1.7, marginBottom: '1.5rem',
            }}>
              When everywhere is like nope, Saathi is your only hope. Your hyperlocal platform for trusted everyday helpers.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, Mail, MessageCircle, Share2].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)';
                  e.currentTarget.style.color = 'var(--gold)';
                  e.currentTarget.style.background = 'var(--gold-muted)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'Services',
              links: ['Grocery Shopping', 'Dog Walking', 'Elderly Care', 'Medicine Pickup', 'Handyman'],
            },
            {
              title: 'Company',
              links: ['About Us', 'How it Works', 'Careers', 'Press', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Trust & Safety'],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--gold)',
                marginBottom: '1.5rem',
              }}>{col.title}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      color: 'var(--text-muted)', fontSize: '0.9rem',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Saathi Technologies. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              Made with <Heart size={13} fill="var(--gold)" color="var(--gold)" /> in India
            </p>
            <button
              onClick={scrollToTop}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid var(--border-gold)',
                background: 'var(--gold-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--gold)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--gold-muted)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
