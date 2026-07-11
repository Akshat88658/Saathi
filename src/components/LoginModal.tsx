import React, { useState } from 'react';
import { X, User, Phone, LogIn } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: { role: 'client' | 'saathi'; name: string; phone: string }) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess, showToast }: LoginModalProps) => {
  const [role, setRole] = useState<'client' | 'saathi'>('client');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter both your name and phone number.', 'error');
      return;
    }

    const profile = { role, name, phone };
    localStorage.setItem('saathi_profile', JSON.stringify(profile));
    onLoginSuccess(profile);
    showToast(`Logged in successfully as ${role === 'client' ? 'Client' : 'Saathi'}!`, 'success');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1001,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
        }} 
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '450px',
        boxShadow: 'var(--shadow-gold-lg)',
        animation: 'fadeInUp 0.3s ease-out forwards',
        padding: '2.5rem',
      }}>
        {/* Close */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            color: 'var(--text-grey)', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-white)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-grey)'}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.75rem', fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem', textAlign: 'center' }}>
          Welcome to <span className="text-gold">Saathi</span>
        </h3>
        <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Select your profile role and sign in to get started.
        </p>

        {/* Role Selection Tabs */}
        <div style={{
          display: 'flex', background: 'var(--bg-primary)', 
          borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '1.5rem',
          border: '1px solid var(--border)',
        }}>
          <button 
            type="button"
            onClick={() => setRole('client')}
            style={{
              flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem', fontWeight: 600,
              background: role === 'client' ? 'var(--gold-muted)' : 'transparent',
              color: role === 'client' ? 'var(--gold)' : 'var(--text-grey)',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            I Need Help (Client)
          </button>
          <button 
            type="button"
            onClick={() => setRole('saathi')}
            style={{
              flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem', fontWeight: 600,
              background: role === 'saathi' ? 'var(--gold-muted)' : 'transparent',
              color: role === 'saathi' ? 'var(--gold)' : 'var(--text-grey)',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            I Want to Help (Saathi)
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                style={{
                  width: '100%', padding: '0.7rem 1rem 0.7rem 2.25rem',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-light)' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
                style={{
                  width: '100%', padding: '0.7rem 1rem 0.7rem 2.25rem',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              padding: '0.85rem', width: '100%', marginTop: '0.5rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
