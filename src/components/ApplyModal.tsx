import React, { useState } from 'react';
import { X, MapPin, Phone, User, Mail, MessageSquare } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AVAILABLE_SKILLS = [
  'Companionship',
  'Grocery & Errands',
  'Elder Care Assist',
  'Local Tour & Buddy',
  'Personal Admin Assist',
  'Light Housework',
  'Pet Care',
  'Tech Support'
];

const ApplyModal = ({ isOpen, onClose, showToast }: ApplyModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    location: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      showToast('Please select at least one skill/offering.', 'error');
      return;
    }
    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/helpers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: selectedSkills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application. Please try again.');
      }

      showToast('Application submitted successfully! Our team will verify and get back to you.', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        bio: '',
        location: '',
      });
      setSelectedSkills([]);
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Error submitting application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
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

      {/* Modal Content */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-gold-lg)',
        animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '2.5rem',
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            color: 'var(--text-grey)', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-white)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-grey)'}
        >
          <X size={24} />
        </button>

        <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>
          Become a <span className="text-gold">Saathi</span> Helper
        </h3>
        <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Set your schedule, help your neighbors, and start earning today.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Email & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Your City / Neighborhood
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Downtown / Sector 4"
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
              Skills & Services You Offer
            </label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem 1rem',
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '1rem',
            }}>
              {AVAILABLE_SKILLS.map(skill => (
                <label key={skill} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-grey)',
                }}>
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    style={{ accentColor: 'var(--gold)' }}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          {/* Bio / Experience */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
              Bio / Past Experience
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself. Why do you want to join Saathi? Any relevant experience?"
                rows={3}
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  fontFamily: 'inherit', resize: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '1rem', width: '100%', marginTop: '1rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
          >
            {loading ? 'Submitting Application...' : 'Apply Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
