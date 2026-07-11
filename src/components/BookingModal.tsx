import React, { useState } from 'react';
import { X, Calendar, MapPin, Phone, User, Mail, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const PRICE_MAP: Record<string, string> = {
  'Companionship': '₹200 / hour',
  'Grocery Shopping & Errands': '₹150 / hour',
  'Elder Care assistance': '₹300 / hour',
  'Local City Buddy / Guide': '₹200 / hour',
  'Personal Assistant tasks': '₹250 / hour',
  'Other': 'Estimates starting at ₹150'
};

const BookingModal = ({ isOpen, onClose, showToast }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_type: 'Companionship',
    location: '',
    date_time: '',
    details: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking. Please try again.');
      }

      showToast('Booking submitted successfully! A helper will contact you shortly.', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service_type: 'Companionship',
        location: '',
        date_time: '',
        details: '',
      });
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Error creating booking', 'error');
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
        maxWidth: '560px',
        maxHeight: '90vh',
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
          Book a <span className="text-gold">Saathi</span> Helper
        </h3>
        <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Fill in details below and get connected to a helper in your area.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Service Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
              Service Required
            </label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-light)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            >
              <option value="Companionship">Companionship</option>
              <option value="Grocery Shopping & Errands">Grocery Shopping & Errands</option>
              <option value="Elder Care assistance">Elder Care assistance</option>
              <option value="Local City Buddy / Guide">Local City Buddy / Guide</option>
              <option value="Personal Assistant tasks">Personal Assistant tasks</option>
              <option value="Other">Other Helper Task</option>
            </select>
            <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--gold-light)' }}>
              <strong>Estimated Rate:</strong> {PRICE_MAP[formData.service_type] || '₹150 / hour'}
            </div>
          </div>

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
                  placeholder="John Doe"
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

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
              Email Address (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Location & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Your Area/Location
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                Preferred Date & Time
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="datetime-local"
                  name="date_time"
                  required
                  value={formData.date_time}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-light)', outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-light)' }}>
              Additional Details / Requirements
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Describe what help you need (e.g. need companion for a doctor visit, grocery shopping list, etc.)"
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
            {loading ? 'Submitting request...' : 'Book Your Helper'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
