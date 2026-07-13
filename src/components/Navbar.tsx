import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

type AppView = 'home' | 'services' | 'how-it-works' | 'why-saathi' | 'join-us' | 'faq' | 'jobs' | 'client-dashboard' | 'saathi-dashboard';

interface UserProfile {
  role: 'client' | 'saathi';
  name: string;
  phone: string;
}

interface NavbarProps {
  onBookClick: () => void;
  onJobsClick: () => void;
  onNavigate: (view: AppView) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  currentView: AppView;
  userProfile: UserProfile | null;
}

const Navbar = ({ onBookClick, onJobsClick, onNavigate, onLoginClick, onLogout, currentView, userProfile }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { view: 'services', label: 'Services' },
    { view: 'how-it-works', label: 'How it Works' },
    { view: 'why-saathi', label: 'Why Saathi' },
    { view: 'join-us', label: 'Join Us' },
    { view: 'faq', label: 'FAQ' },
  ] as const;

  const isDashboardView = currentView === 'client-dashboard' || currentView === 'saathi-dashboard';
  const dashboardView = userProfile?.role === 'saathi' ? 'saathi-dashboard' : 'client-dashboard';

  return (
    <nav
      style={{
        position: 'fixed',
        width: '100%',
        zIndex: 100,
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        background: isScrolled || currentView !== 'home' ? 'rgba(10, 10, 10, 0.92)' : 'transparent',
        backdropFilter: isScrolled || currentView !== 'home' ? 'blur(20px)' : 'none',
        borderBottom: isScrolled || currentView !== 'home' ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Saathi Emblem" 
            style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }} 
          />
          <span style={{
            fontSize: '1.45rem', 
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
              top: '2px',
              right: '-4px',
              width: '8px',
              height: '8px',
              background: 'radial-gradient(circle at 30% 30%, #C084FC 0%, #8237FA 50%, #4B129E 100%)',
              borderRadius: '80% 0 80% 50%',
              transform: 'rotate(-15deg)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(link => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--gold)' : 'var(--text-grey)',
                  transition: 'color 0.3s',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-grey)'; }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                    width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)',
                  }} />
                )}
              </button>
            );
          })}
          {!userProfile && (
            <button
              onClick={onJobsClick}
              style={{
                fontSize: '0.9rem', fontWeight: currentView === 'jobs' ? 600 : 500,
                color: currentView === 'jobs' ? 'var(--gold)' : 'var(--gold-light)',
                transition: 'color 0.3s', position: 'relative', cursor: 'pointer',
              }}
            >
              Find Work
            </button>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
          {userProfile ? (
            <>
              {/* Logged-in user pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)',
                background: 'var(--gold-muted)', border: '1px solid var(--border-gold)',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: 'var(--bg-primary)',
                }}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold)' }}>
                  {userProfile.name.split(' ')[0]}
                </span>
                <span style={{
                  fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)',
                  background: userProfile.role === 'saathi' ? 'rgba(74,222,128,0.15)' : 'rgba(96,165,250,0.15)',
                  color: userProfile.role === 'saathi' ? '#4ade80' : '#60a5fa',
                  fontWeight: 600, textTransform: 'capitalize',
                }}>
                  {userProfile.role}
                </span>
              </div>

              {/* My Dashboard */}
              <button
                onClick={() => onNavigate(dashboardView)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LayoutDashboard size={15} />
                {isDashboardView ? 'Dashboard' : 'My Dashboard'}
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.85rem', color: 'var(--text-grey)', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-grey)'}
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogIn size={16} /> Login
              </button>
              <button
                onClick={onBookClick}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
              >
                Book a Saathi
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: 'var(--text-white)', display: 'block', cursor: 'pointer' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, width: '100%',
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {navLinks.map(link => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => { setIsMobileMenuOpen(false); onNavigate(link.view); }}
                style={{
                  color: isActive ? 'var(--gold)' : 'var(--text-grey)',
                  fontSize: '1rem',
                  padding: '0.5rem 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            );
          })}
          <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0' }} />
          {userProfile ? (
            <>
              <button onClick={() => { setIsMobileMenuOpen(false); onNavigate(dashboardView); }}
                className="btn btn-outline" style={{ width: '100%' }}>
                <LayoutDashboard size={16} /> My Dashboard
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                style={{ color: '#f87171', textAlign: 'left', padding: '0.5rem 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }}
                className="btn btn-outline" style={{ width: '100%' }}>
                <LogIn size={16} /> Login
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); onBookClick(); }}
                className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Book a Saathi
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
