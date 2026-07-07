import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#benefits', label: 'Why Saathi' },
    { href: '#become-saathi', label: 'Join Us' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        width: '100%',
        zIndex: 100,
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        background: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1rem', color: 'var(--bg-primary)',
          }}>S</div>
          <span style={{
            fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Saathi</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} style={{
              fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-grey)',
              transition: 'color 0.3s', position: 'relative',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-grey)')}
            >{link.label}</a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '1rem' }}>
          <button style={{
            fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-grey)',
            transition: 'color 0.3s',
          }}>Log In</button>
          <button className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            Book a Saathi
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: 'var(--text-white)', display: 'block' }}
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
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ color: 'var(--text-grey)', fontSize: '1rem', padding: '0.5rem 0' }}
            >{link.label}</a>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0' }} />
          <button style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text-grey)' }}>Log In</button>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Book a Saathi</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
